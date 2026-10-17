import type { NgxMaskApplierService } from '../ngx-mask-applier.service';
import { MaskExpression } from '../ngx-mask-expression.enum';

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
 * edit does not meet that shape and the value stays.
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

/** The span of `value` that the user's last edit (keystroke, deletion, paste) changed. */
export type UserEdit = { value: string; start: number; end: number };

// Kept outside the service so the published API carries no field for it.
const userEdits = new WeakMap<NgxMaskApplierService, UserEdit>();

/**
 * Records the edit the directive is about to mask, `null` for an edit that changed no field. Only an
 * edit may turn a typed `00` day, month or 12-hour hour into `01` (leadZeroDateTime): a render of any
 * other value, e.g. a write or a re-render, has none.
 */
export function setUserEdit(service: NgxMaskApplierService, edit: UserEdit | null): void {
    if (edit) {
        userEdits.set(service, edit);
    } else {
        userEdits.delete(service);
    }
}

/** The recorded edit when `inputValue` is the value it produced, else null. */
export function userEditFor(service: NgxMaskApplierService, inputValue: string): UserEdit | null {
    const edit = userEdits.get(service);
    return edit?.value === inputValue ? edit : null;
}
