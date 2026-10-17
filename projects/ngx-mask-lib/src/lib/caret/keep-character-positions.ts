import { MaskExpression } from '../ngx-mask-expression.enum';
import type { NgxMaskService } from '../ngx-mask.service';

/** The mask service state the resolution reads; plain property reads, nothing is written back. */
export type KeepCharacterPositionsState = Pick<
    NgxMaskService,
    | 'prefix'
    | 'suffix'
    | 'showMaskTyped'
    | 'maskExpression'
    | 'maskIsShown'
    | 'placeHolderCharacter'
    | 'specialCharacters'
    | 'selStart'
    | 'selEnd'
    | 'actualValue'
    | '_checkSymbolMask'
>;

/** The edit being resolved. */
export type KeepCharacterPositionsEdit = {
    /** The value of the element after the edit. */
    elValue: string;
    /** The caret of the element after the edit, already shifted by the prefix for a first character. */
    position: number;
    /** The key code of the edit. */
    code: string;
};

export type KeepCharacterPositionsResult = {
    /** The resolved display value, or null when the current actualValue stays as it is. */
    actualValue: string | null;
    position: number;
    /**
     * Whether the edit was fully resolved into `actualValue`: applyMask then renders it as-is.
     * When false it flows through regular masking (e.g. appending at the end, clearing it all).
     */
    handled: boolean;
};

/** The first index at or after `index` whose mask character is not a special character. */
function nextFillableIndex(
    maskExpression: string,
    specialCharacters: readonly string[],
    index: number
): number {
    let maskIdx = index;
    while (
        maskIdx < maskExpression.length &&
        specialCharacters.includes(maskExpression[maskIdx] ?? MaskExpression.EMPTY_STRING)
    ) {
        maskIdx += 1;
    }
    return maskIdx;
}

/**
 * Resolves one edit of a `keepCharacterPositions` mask: the layout of the mask is kept, so a
 * deleted character leaves a placeholder behind and a typed one overwrites the next fillable slot.
 */
export function resolveKeepCharacterPositions(
    svc: KeepCharacterPositionsState,
    edit: KeepCharacterPositionsEdit
): KeepCharacterPositionsResult {
    const {
        prefix,
        suffix,
        showMaskTyped,
        maskExpression,
        placeHolderCharacter,
        specialCharacters,
        selStart: selStartRaw,
        selEnd: selEndRaw,
    } = svc;
    const { elValue } = edit;
    let position = edit.position;
    let actualValue: string | null = null;
    const inputSymbol = elValue.slice(position - 1, position);
    const prefixLength = prefix.length;
    // Placeholder skeleton of the mask (special chars kept, fillable slots
    // replaced by the placeholder character). With showMaskTyped the service
    // renders it as maskIsShown; without showMaskTyped it is derived locally so
    // keepCharacterPositions works on its own (#1545, #1543).
    const maskSkeleton: string = svc.maskIsShown.length
        ? svc.maskIsShown
        : maskExpression.replace(/\w/g, placeHolderCharacter);

    const hasSelection: boolean = selStartRaw !== selEndRaw;
    const selStartAbs = Number(selStartRaw);
    const selEndAbs = Number(selEndRaw);
    const selStart = selStartAbs - prefixLength;
    const selEnd = selEndAbs - prefixLength;

    const backspaceOrDelete =
        edit.code === MaskExpression.BACKSPACE || edit.code === MaskExpression.DELETE;

    let handled = true;

    if (backspaceOrDelete) {
        if (hasSelection) {
            const preEditLength = elValue.length + (selEndAbs - selStartAbs);
            if (!showMaskTyped && selStartAbs <= prefixLength && selEndAbs >= preEditLength) {
                // The whole value was selected and deleted: clear through the
                // regular path instead of showing a placeholder skeleton.
                handled = false;
            } else if (selStartRaw === prefixLength) {
                actualValue = `${prefix}${maskSkeleton.slice(0, selEnd)}${elValue.split(prefix).join('')}`;
            } else if (selStartRaw === maskSkeleton.length + prefixLength) {
                actualValue = `${elValue}${maskSkeleton.slice(selStart, selEnd)}`;
            } else {
                actualValue = `${prefix}${elValue
                    .split(prefix)
                    .join('')
                    .slice(
                        0,
                        selStart
                    )}${maskSkeleton.slice(selStart, selEnd)}${svc.actualValue.slice(
                    selEnd + prefixLength,
                    maskSkeleton.length + prefixLength
                )}${suffix}`;
            }
        } else if (
            !specialCharacters.includes(
                maskExpression.slice(position - prefixLength, position + 1 - prefixLength)
            )
        ) {
            if (!showMaskTyped && position >= elValue.length) {
                // Deleting the last character: no gap needs to be kept.
                handled = false;
            } else if (selStart === 1 && prefix) {
                actualValue = `${prefix}${placeHolderCharacter}${elValue
                    .split(prefix)
                    .join('')
                    .split(suffix)
                    .join('')}${suffix}`;

                position = position - 1;
            } else {
                const part1 = elValue.substring(0, position);
                const part2 = elValue.substring(position);
                actualValue = `${part1}${placeHolderCharacter}${part2}`;
            }
        }
        position = edit.code === MaskExpression.DELETE ? position + 1 : position;
    } else if (hasSelection) {
        // A selected range was replaced by the typed symbol. Keep the layout:
        // blank the selection to the mask skeleton and put the typed symbol
        // into the first fillable slot of the selection (#1527, #1489).
        const preEditLength = elValue.length - 1 + (selEndAbs - selStartAbs);
        if (!showMaskTyped && selStartAbs <= prefixLength && selEndAbs >= preEditLength) {
            // The whole value was replaced: mask it through the regular path.
            handled = false;
        } else {
            const maskIdx = nextFillableIndex(
                maskExpression,
                specialCharacters,
                Math.max(selStart, 0)
            );
            const blanked = `${elValue.slice(0, selStartAbs)}${maskSkeleton.slice(
                Math.max(selStart, 0),
                selEnd
            )}${elValue.slice(selStartAbs + 1)}`;
            const targetAbs = maskIdx + prefixLength;
            if (
                targetAbs < blanked.length - suffix.length &&
                svc._checkSymbolMask(
                    inputSymbol,
                    maskExpression[maskIdx] ?? MaskExpression.EMPTY_STRING
                )
            ) {
                actualValue = `${blanked.slice(0, targetAbs)}${inputSymbol}${blanked.slice(targetAbs + 1)}`;
                position = targetAbs + 1;
            } else {
                actualValue = blanked;
                position = selStartAbs;
            }
        }
    } else {
        // Single-caret insert (overwrite mode): the typed symbol lands in the
        // first fillable mask slot at or after the caret, skipping any number
        // of special characters (#1544, #1489).
        const oldDisplay = `${elValue.slice(0, position - 1)}${elValue.slice(position)}`;
        const oldDisplayNoSuffix = suffix ? oldDisplay.split(suffix).join('') : oldDisplay;
        if (position - 1 - prefixLength < 0) {
            // Typed inside the prefix: reject the symbol.
            position = position - 1;
        } else {
            const maskIdx = nextFillableIndex(
                maskExpression,
                specialCharacters,
                position - 1 - prefixLength
            );
            const targetAbs = maskIdx + prefixLength;
            if (targetAbs >= oldDisplayNoSuffix.length) {
                if (oldDisplayNoSuffix.length <= prefixLength || !showMaskTyped) {
                    // First symbol, or appending at the end without
                    // showMaskTyped: regular masking handles it (including
                    // leadZeroDateTime insertions).
                    handled = false;
                } else {
                    // All slots of the rendered mask are already consumed.
                    position = position - 1;
                }
            } else if (
                svc._checkSymbolMask(
                    inputSymbol,
                    maskExpression[maskIdx] ?? MaskExpression.EMPTY_STRING
                )
            ) {
                actualValue = `${oldDisplayNoSuffix.slice(0, targetAbs)}${inputSymbol}${oldDisplayNoSuffix.slice(targetAbs + 1)}${suffix}`;
                position = targetAbs + 1;
            } else {
                // Rejected symbol: keep the current display.
                position = position - 1;
            }
        }
    }
    return { actualValue, position, handled };
}
