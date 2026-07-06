import { MaskExpression } from '../ngx-mask-expression.enum';
import type { MaskHandlerFn } from './mask-handler.types';

/**
 * Generic character-by-character pattern loop (moved verbatim from applyMask,
 * original lines 581-968). This is the default/fallback handler — always runs when
 * no exact/startsWith handler matched. IP and CPF_CNPJ pre-processors rewrite
 * `state.maskExpression` and then fall through into this loop.
 *
 * The inline HOURS/HOUR/MINUTE/SECOND/DAY/MONTH sub-branches (including the day-window
 * anchor flow-gating of #1611/#1513, CODEBASE_NOTES.md #20) are preserved unmodified —
 * they are explicitly out of scope for the phase-1 extraction boundary.
 *
 * Note: several branches read `this.maskExpression` (the instance field) rather than
 * the local `maskExpression` — this distinction is preserved exactly as in the
 * original source.
 */
export const genericPatternHandler: MaskHandlerFn = function (state, params) {
    const { inputArray } = params;
    const maskExpression = state.maskExpression;
    const processedValue = state.processedValue;
    let { cursor, result, multi, processedPosition, stepBack } = state;

    for (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let i = 0, inputSymbol: string = inputArray[0]!;
        i < inputArray.length;
        i++, inputSymbol = inputArray[i] ?? MaskExpression.EMPTY_STRING
    ) {
        if (cursor === maskExpression.length) {
            break;
        }

        const symbolStarInPattern: boolean = MaskExpression.SYMBOL_STAR in this.patterns;
        if (
            this._checkSymbolMask(
                inputSymbol,
                maskExpression[cursor] ?? MaskExpression.EMPTY_STRING
            ) &&
            maskExpression[cursor + 1] === MaskExpression.SYMBOL_QUESTION
        ) {
            result += inputSymbol;
            cursor += 2;
        } else if (
            maskExpression[cursor + 1] === MaskExpression.SYMBOL_STAR &&
            multi &&
            this._checkSymbolMask(
                inputSymbol,
                maskExpression[cursor + 2] ?? MaskExpression.EMPTY_STRING
            )
        ) {
            result += inputSymbol;
            cursor += 3;
            multi = false;
        } else if (
            this._checkSymbolMask(
                inputSymbol,
                maskExpression[cursor] ?? MaskExpression.EMPTY_STRING
            ) &&
            maskExpression[cursor + 1] === MaskExpression.SYMBOL_STAR &&
            !symbolStarInPattern
        ) {
            result += inputSymbol;
            multi = true;
        } else if (
            maskExpression[cursor + 1] === MaskExpression.SYMBOL_QUESTION &&
            this._checkSymbolMask(
                inputSymbol,
                maskExpression[cursor + 2] ?? MaskExpression.EMPTY_STRING
            )
        ) {
            result += inputSymbol;
            cursor += 3;
        } else if (
            this._checkSymbolMask(
                inputSymbol,
                maskExpression[cursor] ?? MaskExpression.EMPTY_STRING
            )
        ) {
            if (maskExpression[cursor] === MaskExpression.HOURS) {
                if (this.apm ? Number(inputSymbol) > 9 : Number(inputSymbol) > 2) {
                    processedPosition = !this.leadZeroDateTime
                        ? processedPosition + 1
                        : processedPosition;
                    cursor += 1;
                    this._shiftStep(cursor);
                    i--;
                    if (this.leadZeroDateTime) {
                        result += '0';
                    }
                    continue;
                }
            }
            if (maskExpression[cursor] === MaskExpression.HOUR) {
                if (
                    this.apm
                        ? (result.length === 1 && Number(result) > 1) ||
                          (result === '1' && Number(inputSymbol) > 2) ||
                          (processedValue.slice(cursor - 1, cursor).length === 1 &&
                              Number(processedValue.slice(cursor - 1, cursor)) > 2) ||
                          (processedValue.slice(cursor - 1, cursor) === '1' &&
                              Number(inputSymbol) > 2)
                        : (result === '2' && Number(inputSymbol) > 3) ||
                          ((result.slice(cursor - 2, cursor) === '2' ||
                              result.slice(cursor - 3, cursor) === '2' ||
                              result.slice(cursor - 4, cursor) === '2' ||
                              result.slice(cursor - 1, cursor) === '2') &&
                              Number(inputSymbol) > 3 &&
                              cursor > 10)
                ) {
                    processedPosition = processedPosition + 1;
                    cursor += 1;
                    i--;
                    continue;
                }
            }
            if (
                maskExpression[cursor] === MaskExpression.MINUTE ||
                maskExpression[cursor] === MaskExpression.SECOND
            ) {
                if (Number(inputSymbol) > 5) {
                    processedPosition = !this.leadZeroDateTime
                        ? processedPosition + 1
                        : processedPosition;
                    cursor += 1;
                    this._shiftStep(cursor);
                    i--;
                    if (this.leadZeroDateTime) {
                        result += '0';
                    }
                    continue;
                }
            }
            const daysCount = 31;
            const inputValueCursor = processedValue[cursor] as string;
            const inputValueCursorPlusOne = processedValue[cursor + 1] as string;
            const inputValueCursorPlusTwo = processedValue[cursor + 2] as string;
            const inputValueCursorMinusOne = processedValue[cursor - 1] as string;
            const inputValueCursorMinusTwo = processedValue[cursor - 2] as string;
            const inputValueSliceMinusThreeMinusOne = processedValue.slice(cursor - 3, cursor - 1);
            const inputValueSliceMinusOnePlusOne = processedValue.slice(cursor - 1, cursor + 1);
            const inputValueSliceCursorPlusTwo = processedValue.slice(cursor, cursor + 2);
            const inputValueSliceMinusTwoCursor = processedValue.slice(cursor - 2, cursor);
            // Issue #1523: when the date token directly abuts a plain digit
            // token (year-first masks without separators like 00M0d0 or
            // 0000M0d0), the backward-looking windows below read the previous
            // field's digits (year) as day/month digits and skip valid input.
            // Disable only those backward heuristics in that layout.
            const tokenAbutsDigitField = maskExpression[cursor - 1] === MaskExpression.NUMBER_ZERO;
            if (maskExpression[cursor] === MaskExpression.DAY) {
                const maskStartWithMonth = maskExpression.slice(0, 2) === MaskExpression.MONTHS;
                const startWithMonthInput: boolean =
                    maskExpression.slice(0, 2) === MaskExpression.MONTHS &&
                    this.specialCharacters.includes(inputValueCursorMinusTwo);
                // Issue #1611: `cursor` indexes the mask, `i` indexes the input.
                // On paste/writeValue of a bare digit string the cursor runs
                // ahead of the input by every emitted separator, so cursor-based
                // slices read year digits instead of the day — anchor the day
                // window on the input index in those flows. Keystroke flows keep
                // the historical cursor anchor (with showMaskTyped the value also
                // carries placeholder chars, where the input anchor misreads).
                const dayWindowStart = params.justPasted || this.writingValue ? i : cursor;
                const dayWindowSlice = processedValue.slice(dayWindowStart, dayWindowStart + 2);
                const dayWindowNext = processedValue[dayWindowStart + 1] as string;
                if (
                    (Number(inputSymbol) > 3 && this.leadZeroDateTime) ||
                    (!maskStartWithMonth &&
                        (Number(inputValueSliceCursorPlusTwo) > daysCount ||
                            (!tokenAbutsDigitField &&
                                Number(inputValueSliceMinusOnePlusOne) > daysCount) ||
                            this.specialCharacters.includes(inputValueCursorPlusOne))) ||
                    (startWithMonthInput
                        ? Number(inputValueSliceMinusOnePlusOne) > daysCount ||
                          (!this.specialCharacters.includes(inputValueCursor) &&
                              this.specialCharacters.includes(inputValueCursorPlusTwo)) ||
                          this.specialCharacters.includes(inputValueCursor)
                        : Number(dayWindowSlice) > daysCount ||
                          (this.specialCharacters.includes(dayWindowNext) && !params.backspaced))
                ) {
                    processedPosition = !this.leadZeroDateTime
                        ? processedPosition + 1
                        : processedPosition;
                    cursor += 1;
                    this._shiftStep(cursor);
                    i--;

                    if (this.leadZeroDateTime) {
                        result += '0';
                    }
                    continue;
                }
            }
            if (maskExpression[cursor] === MaskExpression.MONTH) {
                const monthsCount = 12;
                // Issue #1513: the backward-looking day/month windows below
                // assume the digits before the MONTH token belong to a DAY
                // field. In year-first masks with separators (e.g. 0000-M0-d0)
                // they read YEAR digits through the separator and shove a
                // spurious leading zero into the month. tokenAbutsDigitField
                // (#1523) only covers separator-less layouts, so derive field
                // ownership from the mask itself: locate the field (maximal
                // run of non-special tokens) immediately preceding this MONTH
                // token — a plain digit run of 3+ characters is a year, not a
                // day, and the day-based heuristics must not fire.
                let precedingFieldEnd = cursor - 1;
                while (
                    precedingFieldEnd >= 0 &&
                    this.specialCharacters.includes(maskExpression[precedingFieldEnd] as string)
                ) {
                    precedingFieldEnd--;
                }
                let precedingFieldStart = precedingFieldEnd;
                while (
                    precedingFieldStart >= 0 &&
                    !this.specialCharacters.includes(maskExpression[precedingFieldStart] as string)
                ) {
                    precedingFieldStart--;
                }
                const precedingField = maskExpression.slice(
                    precedingFieldStart + 1,
                    precedingFieldEnd + 1
                );
                const yearFieldPrecedesMonth =
                    precedingField.length > 2 &&
                    precedingField
                        .split(MaskExpression.EMPTY_STRING)
                        .every((token) => token === MaskExpression.NUMBER_ZERO);
                // mask without day
                const withoutDays: boolean =
                    cursor === 0 &&
                    (Number(inputSymbol) > 2 ||
                        Number(inputValueSliceCursorPlusTwo) > monthsCount ||
                        (this.specialCharacters.includes(inputValueCursorPlusOne) &&
                            !params.backspaced));
                // day<10 && month<12 for input
                const specialChart = maskExpression.slice(cursor + 2, cursor + 3);
                const day1monthInput: boolean =
                    inputValueSliceMinusThreeMinusOne.includes(specialChart) &&
                    maskExpression.includes('d0') &&
                    ((this.specialCharacters.includes(inputValueCursorMinusTwo) &&
                        Number(inputValueSliceMinusOnePlusOne) > monthsCount &&
                        !this.specialCharacters.includes(inputValueCursor)) ||
                        this.specialCharacters.includes(inputValueCursor));
                //  month<12 && day<10 for input
                const day2monthInput: boolean =
                    !tokenAbutsDigitField &&
                    !yearFieldPrecedesMonth &&
                    Number(inputValueSliceMinusThreeMinusOne) <= daysCount &&
                    !this.specialCharacters.includes(inputValueSliceMinusThreeMinusOne as string) &&
                    this.specialCharacters.includes(inputValueCursorMinusOne) &&
                    (Number(inputValueSliceCursorPlusTwo) > monthsCount ||
                        this.specialCharacters.includes(inputValueCursorPlusOne));
                // cursor === 5 && without days
                const day2monthInputDot: boolean =
                    (Number(inputValueSliceCursorPlusTwo) > monthsCount && cursor === 5) ||
                    (this.specialCharacters.includes(inputValueCursorPlusOne) && cursor === 5);
                // // day<10 && month<12 for paste whole data
                const day1monthPaste: boolean =
                    !tokenAbutsDigitField &&
                    !yearFieldPrecedesMonth &&
                    Number(inputValueSliceMinusThreeMinusOne) > daysCount &&
                    !this.specialCharacters.includes(inputValueSliceMinusThreeMinusOne as string) &&
                    !this.specialCharacters.includes(inputValueSliceMinusTwoCursor as string) &&
                    Number(inputValueSliceMinusTwoCursor) > monthsCount &&
                    maskExpression.includes('d0');
                // 10<day<31 && month<12 for paste whole data
                const day2monthPaste: boolean =
                    !tokenAbutsDigitField &&
                    !yearFieldPrecedesMonth &&
                    Number(inputValueSliceMinusThreeMinusOne) <= daysCount &&
                    !this.specialCharacters.includes(inputValueSliceMinusThreeMinusOne as string) &&
                    !this.specialCharacters.includes(inputValueCursorMinusOne) &&
                    Number(inputValueSliceMinusOnePlusOne) > monthsCount;
                if (
                    (Number(inputSymbol) > 1 && this.leadZeroDateTime) ||
                    withoutDays ||
                    day1monthInput ||
                    day2monthPaste ||
                    day1monthPaste ||
                    day2monthInput ||
                    (day2monthInputDot && !this.leadZeroDateTime)
                ) {
                    processedPosition = !this.leadZeroDateTime
                        ? processedPosition + 1
                        : processedPosition;
                    cursor += 1;
                    this._shiftStep(cursor);
                    i--;
                    if (this.leadZeroDateTime) {
                        result += '0';
                    }
                    continue;
                }
            }
            result += inputSymbol;
            cursor++;
        } else if (
            this.specialCharacters.includes(inputSymbol) &&
            maskExpression[cursor] === inputSymbol
        ) {
            result += inputSymbol;
            cursor++;
        } else if (
            this.specialCharacters.indexOf(
                maskExpression[cursor] ?? MaskExpression.EMPTY_STRING
            ) !== -1
        ) {
            result += maskExpression[cursor];
            cursor++;
            this._shiftStep(cursor);
            i--;
        } else if (maskExpression[cursor] === MaskExpression.NUMBER_NINE && this.showMaskTyped) {
            this._shiftStep(cursor);
        } else if (
            this.patterns[maskExpression[cursor] ?? MaskExpression.EMPTY_STRING] &&
            this.patterns[maskExpression[cursor] ?? MaskExpression.EMPTY_STRING]?.optional
        ) {
            // If the input symbol is whitespace or doesn't match the pattern,
            // skip it without consuming the mask position
            if (inputSymbol.trim() === MaskExpression.EMPTY_STRING) {
                // Skip whitespace input, don't advance mask cursor
                continue;
            }
            if (
                !!inputArray[cursor] &&
                maskExpression !== '099.099.099.099' &&
                maskExpression !== '000.000.000-00' &&
                maskExpression !== '00.000.000/0000-00' &&
                !maskExpression.match(/^9+\.0+$/) &&
                !this.patterns[maskExpression[cursor] ?? MaskExpression.EMPTY_STRING]?.optional
            ) {
                result += inputArray[cursor];
            }
            if (
                maskExpression.includes(MaskExpression.NUMBER_NINE + MaskExpression.SYMBOL_STAR) &&
                maskExpression.includes(MaskExpression.NUMBER_ZERO + MaskExpression.SYMBOL_STAR)
            ) {
                cursor++;
            }

            cursor++;
            i--;
        } else if (
            this.maskExpression[cursor + 1] === MaskExpression.SYMBOL_STAR &&
            // A typed char that exactly matches the mask's literal char at cursor+2
            // (e.g. the '@' in 'A*@A*.A*') always terminates the 'A*' run, regardless
            // of whether that literal is registered in `specialCharacters` — an
            // explicitly empty `specialCharacters` list must not make mask literals
            // unmatchable (#1512).
            (this._findSpecialChar(this.maskExpression[cursor + 2] ?? MaskExpression.EMPTY_STRING)
                ? this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2]
                : inputSymbol === this.maskExpression[cursor + 2]) &&
            multi
        ) {
            cursor += 3;
            result += inputSymbol;
        } else if (
            this.maskExpression[cursor + 1] === MaskExpression.SYMBOL_QUESTION &&
            (this._findSpecialChar(this.maskExpression[cursor + 2] ?? MaskExpression.EMPTY_STRING)
                ? this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2]
                : inputSymbol === this.maskExpression[cursor + 2]) &&
            multi
        ) {
            cursor += 3;
            result += inputSymbol;
        } else if (
            this.showMaskTyped &&
            this.specialCharacters.indexOf(inputSymbol) < 0 &&
            inputSymbol !== this.placeHolderCharacter &&
            this.placeHolderCharacter.length === 1
        ) {
            stepBack = true;
        }
    }

    state.cursor = cursor;
    state.result = result;
    state.multi = multi;
    state.processedPosition = processedPosition;
    state.stepBack = stepBack;
    return state;
};
