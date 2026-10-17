import { MaskExpression } from '../ngx-mask-expression.enum';
import { nextFillableIndex } from '../ngx-mask.utils';

// #1488: a date/time field located within `maskExpression` for the generalized
// caret-shift-past-separator fix (see `findDateTimeFieldAt`/`isFieldOverflowing`).
export type DateTimeField = {
    token: 'd' | 'M' | 'H' | 'h' | 'm' | 's';
    start: number; // index of the field's first char in maskExpression
    end: number; // index one past the field's digit run (start of separator/next field)
};

/**
 * #1488: locates the date/time field (DAY/MONTH/HOURS/HOUR/MINUTE/SECOND) that
 * `position` falls within, scanning `maskExpression` left-to-right. A field spans
 * its token plus its digit-pair companion — `0` for DAY/MONTH/MINUTE/SECOND (e.g.
 * `d0`, `M0`, `m0`, `s0`), or `HOUR` for the combined `Hh` hour field. Matches any
 * position from the field's first char up to and including its end (separator index),
 * so both a still-mid-typing caret and the just-completed field are covered — the
 * precise overflow decision (single first digit vs. completed 2-digit value) happens
 * in `isFieldOverflowing`. Returns null for non-date/time masks, a no-op for the caller.
 */
export function findDateTimeFieldAt(
    maskExpression: string,
    position: number
): DateTimeField | null {
    const dateTimeTokens: readonly string[] = [
        MaskExpression.DAY,
        MaskExpression.MONTH,
        MaskExpression.HOURS,
        MaskExpression.HOUR,
        MaskExpression.MINUTE,
        MaskExpression.SECOND,
    ];
    let index = 0;
    while (index < maskExpression.length) {
        const token = maskExpression[index] ?? MaskExpression.EMPTY_STRING;
        if (dateTimeTokens.includes(token)) {
            const next = maskExpression[index + 1];
            const isCombinedHour =
                (token === MaskExpression.HOURS || token === MaskExpression.HOUR) &&
                next === MaskExpression.HOUR;
            const end =
                next === MaskExpression.NUMBER_ZERO || isCombinedHour ? index + 2 : index + 1;
            if (position >= index && position <= end) {
                return {
                    token: token as DateTimeField['token'],
                    start: index,
                    end,
                };
            }
            index = end;
            continue;
        }
        index++;
    }
    return null;
}

/**
 * Per-token overflow thresholds, mirroring the ones `generic-pattern.handler.ts`
 * already establishes (day 31, month 12, hour 23/12 w/ apm, minute/second 59) — kept
 * as a small local table rather than importing from the handler (see design's
 * Rejected Alternatives: the directive and the handler stay on separate sides of the
 * display/parse boundary).
 *
 * Two overflow shapes are checked, mirroring how the handler itself decides mid-type:
 * - `firstDigitValue`: when `position` is exactly one char past the field's start (the
 *   just-typed char is the field's first digit), an out-of-range first digit alone
 *   (e.g. month digit `3`, day digit `4`) already triggers the handler's own leadZero
 *   pad within this same keystroke — `el.value` hasn't caught up yet at this point in
 *   the pipeline, so the raw typed digit (`inputValue`) must be read instead.
 * - `fieldValue`: once both digits of the field are present in `el.value`, an
 *   out-of-range 2-digit value (e.g. day `33`, month `13`) triggers the shift directly.
 */
export function isFieldOverflowing(
    field: DateTimeField,
    position: number,
    elValue: string,
    inputValue: string,
    apm: boolean
): boolean {
    const fieldValue = Number(elValue.slice(field.start, field.end));
    const isFirstDigitOfField = position === field.start + 1;
    const firstDigitValue = isFirstDigitOfField
        ? Number(inputValue.slice(position - 1, position))
        : NaN;
    switch (field.token) {
        case MaskExpression.DAY:
            return (fieldValue > 31 && fieldValue < 40) || firstDigitValue > 3;
        case MaskExpression.MONTH:
            return fieldValue > 12 || firstDigitValue > 1;
        case MaskExpression.HOURS:
            return apm
                ? fieldValue > 12 || firstDigitValue > 9
                : fieldValue > 23 || firstDigitValue > 2;
        case MaskExpression.HOUR:
            return apm ? fieldValue > 12 : fieldValue > 23;
        case MaskExpression.MINUTE:
        case MaskExpression.SECOND:
            return fieldValue > 59 || firstDigitValue > 5;
        default:
            return false;
    }
}

/**
 * The caret of a leadZeroDateTime mask: moved two chars on when the field at `position`
 * overflows, as the handler pads a zero in front of it and adds the separator.
 */
export function leadZeroDateTimeCaret(
    maskExpression: string,
    position: number,
    elValue: string,
    inputValue: string,
    apm: boolean
): number {
    const field = findDateTimeFieldAt(maskExpression, position);
    return field && isFieldOverflowing(field, position, elValue, inputValue, apm)
        ? position + 2
        : position;
}

/**
 * The element value of a `d0/M0/0000` mask whose raw value already has its full length: the
 * character after the caret is dropped, so the typed one overwrites it. Returns null when the
 * edit does not meet that shape and the value stays. Kept for the edits `overwriteDateSlot` does
 * not take: a paste, and prefix, suffix and keepCharacterPositions masks.
 */
export function overwriteFullDateValue(
    maskExpression: string,
    inputValue: string,
    position: number,
    code: string
): string | null {
    if (
        inputValue.length >= maskExpression.length - 1 &&
        code !== MaskExpression.BACKSPACE &&
        maskExpression === MaskExpression.DAYS_MONTHS_YEARS &&
        position < 10
    ) {
        const inputSymbol = inputValue.slice(position - 1, position);
        return inputValue.slice(0, position - 1) + inputSymbol + inputValue.slice(position + 1);
    }
    return null;
}

/** The edit `overwriteDateSlot` made: the value, the caret after it and the last index it touches. */
export type DateOverwrite = { value: string; position: number; end: number };

/**
 * What `overwriteDateSlot` reads from the mask service. Structural, not a `Pick` of the service:
 * importing the service type here reorders unions in the emitted d.ts (see `userEdits`).
 */
export type DateSlotMask = {
    maskExpression: string;
    specialCharacters: string[] | readonly string[];
    leadZeroDateTime: boolean;
    apm: boolean;
    _checkSymbolMask: (inputSymbol: string, maskSymbol: string) => boolean;
};

const FIELD_MAX: Readonly<Record<DateTimeField['token'], number>> = {
    d: 31,
    M: 12,
    H: 23,
    h: 23,
    m: 59,
    s: 59,
};

/**
 * A character typed into a date mask whose display (`before`) is already full length overwrites the
 * next digit slot, skipping separators, so the digits that follow never shift. With leadZeroDateTime
 * a field the digit would push out of range, or a whole selected field the digit replaces, is
 * repaired: the digit keeps its slot and zero-fills (`3` over `15` is `30`) or, when it cannot be a
 * tens digit, is the whole field (`4` over `15` is `04`). A key the slot rejects leaves the display
 * as it was. Null keeps regular masking: not one character typed into a full date, a selection
 * beyond one field, or an out-of-range field without leadZeroDateTime. The caller keeps deletions,
 * pastes and prefix, suffix and keepCharacterPositions masks away from it.
 */
export function overwriteDateSlot(
    svc: DateSlotMask,
    before: string,
    elValue: string,
    position: number
): DateOverwrite | null {
    const mask = svc.maskExpression;
    const start = position - 1;
    // The end of the span the typed character replaced in `before` (a caret replaces nothing).
    const selEnd = before.length - elValue.length + position;
    const typed = elValue.charAt(start);
    const target = nextFillableIndex(mask, svc.specialCharacters, start);
    const slot = findDateTimeFieldAt(mask, target);
    // At a field boundary of a separator-less mask (`0000M0d0`) the slot belongs to the next field.
    const field = slot?.end === target ? findDateTimeFieldAt(mask, target + 1) : slot;
    if (
        !/[dM]/.test(mask) ||
        before.length !== mask.length ||
        // under showMaskTyped a placeholder slot takes the digit in sequence, not in place
        !/\d/.test(before.charAt(target)) ||
        // not one character typed over `before`
        selEnd < start ||
        elValue !== before.slice(0, start) + typed + before.slice(selEnd) ||
        // a selection stays within one field, and only leadZeroDateTime pads what it replaces
        selEnd > (field?.end ?? target + 1) ||
        (selEnd - start > 1 && !svc.leadZeroDateTime)
    ) {
        return null;
    }
    if (!svc._checkSymbolMask(typed, mask.charAt(target))) {
        // A key the slot rejects changes nothing, a selection included: `end` -1 touches no index.
        return { value: before, position: start, end: -1 };
    }
    let value = before.slice(0, target) + typed + before.slice(target + 1);
    let caret = target + 1;
    if (field) {
        const max = svc.apm && /[Hh]/.test(field.token) ? 12 : FIELD_MAX[field.token];
        // A one-digit field, or one still holding a placeholder (`4_` is NaN), is never out of range.
        const over = Number(value.slice(field.start, field.end)) > max;
        // A selection past the slot is a whole field.
        if (svc.leadZeroDateTime && (over || selEnd > caret)) {
            // The digit keeps its tens slot and zero-fills (`3` over `15` is `30`) when it can be
            // a tens digit; otherwise it is the whole field (`4` over `15` is `04`).
            const tens = target === field.start && Number(typed) * 10 <= max;
            value =
                before.slice(0, field.start) +
                (tens ? typed + '0' : '0' + typed) +
                before.slice(field.end);
            caret = tens ? caret : field.end;
        } else if (over) {
            return null;
        }
    }
    return { value, position: caret, end: caret };
}

/** The span of `value` that the user's last edit (keystroke, deletion, paste) changed. */
export type UserEdit = { value: string; start: number; end: number };

// Keyed by the mask service, kept outside it so the published API carries no field for it. The key
// is typed `object`: importing the service type here reorders unions in the emitted d.ts.
const userEdits = new WeakMap<object, UserEdit>();

/**
 * Records the edit the directive is about to mask, `null` for an edit that changed no field. Only an
 * edit may turn a typed `00` day, month or 12-hour hour into `01` (leadZeroDateTime): a render of any
 * other value, e.g. a write or a re-render, has none.
 */
export function setUserEdit(service: object, edit: UserEdit | null): void {
    if (edit) {
        userEdits.set(service, edit);
    } else {
        userEdits.delete(service);
    }
}

/** The recorded edit when `inputValue` is the value it produced, else null. */
export function userEditFor(service: object, inputValue: string): UserEdit | null {
    const edit = userEdits.get(service);
    return edit?.value === inputValue ? edit : null;
}
