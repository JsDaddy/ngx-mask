import { inject, Injectable } from '@angular/core';
import type { NgxMaskConfig } from './ngx-mask.config';
import { NGX_MASK_CONFIG } from './ngx-mask.config';
import { MaskExpression } from './ngx-mask-expression.enum';

@Injectable()
export class NgxMaskApplierService {
    protected _config = inject<NgxMaskConfig>(NGX_MASK_CONFIG);

    public dropSpecialCharacters: NgxMaskConfig['dropSpecialCharacters'] =
        this._config.dropSpecialCharacters;

    public hiddenInput: NgxMaskConfig['hiddenInput'] = this._config.hiddenInput;

    public clearIfNotMatch: NgxMaskConfig['clearIfNotMatch'] = this._config.clearIfNotMatch;

    public specialCharacters: NgxMaskConfig['specialCharacters'] = this._config.specialCharacters;

    public patterns: NgxMaskConfig['patterns'] = this._config.patterns;

    public prefix: NgxMaskConfig['prefix'] = this._config.prefix;

    public suffix: NgxMaskConfig['suffix'] = this._config.suffix;

    public thousandSeparator: NgxMaskConfig['thousandSeparator'] = this._config.thousandSeparator;

    public decimalMarker: NgxMaskConfig['decimalMarker'] = this._config.decimalMarker;

    public customPattern!: NgxMaskConfig['patterns'];

    public showMaskTyped: NgxMaskConfig['showMaskTyped'] = this._config.showMaskTyped;

    public placeHolderCharacter: NgxMaskConfig['placeHolderCharacter'] =
        this._config.placeHolderCharacter;

    public validation: NgxMaskConfig['validation'] = this._config.validation;

    public separatorLimit: NgxMaskConfig['separatorLimit'] = this._config.separatorLimit;

    public allowNegativeNumbers: NgxMaskConfig['allowNegativeNumbers'] =
        this._config.allowNegativeNumbers;

    public leadZeroDateTime: NgxMaskConfig['leadZeroDateTime'] = this._config.leadZeroDateTime;

    public leadZero: NgxMaskConfig['leadZero'] = this._config.leadZero;

    public apm: NgxMaskConfig['apm'] = this._config.apm;

    public inputTransformFn: NgxMaskConfig['inputTransformFn'] | null =
        this._config.inputTransformFn;

    public outputTransformFn: NgxMaskConfig['outputTransformFn'] | null =
        this._config.outputTransformFn;

    public keepCharacterPositions: NgxMaskConfig['keepCharacterPositions'] =
        this._config.keepCharacterPositions;

    public instantPrefix: NgxMaskConfig['instantPrefix'] = this._config.instantPrefix;

    public triggerOnMaskChange: NgxMaskConfig['triggerOnMaskChange'] =
        this._config.triggerOnMaskChange;

    private _shift = new Set<number>();

    public plusOnePosition = false;

    public maskExpression = '';

    public actualValue = '';

    public showKeepCharacterExp = '';

    public shownMaskExpression: NgxMaskConfig['shownMaskExpression'] =
        this._config.shownMaskExpression;

    public deletedSpecialCharacter = false;

    public ipError?: boolean;

    public cpfCnpjError?: boolean;

    public applyMask(
        inputValue: string | object | boolean | null | undefined,
        maskExpression: string,
        position = 0,
        justPasted = false,
        backspaced = false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        cb: (...args: any[]) => any = () => {}
    ): string {
        if (!maskExpression || typeof inputValue !== 'string') {
            return MaskExpression.EMPTY_STRING;
        }
        let cursor = 0;
        let result = '';
        let multi = false;
        let backspaceShift = false;
        let shift = 1;
        let stepBack = false;
        let processedValue = inputValue;
        let processedPosition = position;

        if (processedValue.slice(0, this.prefix.length) === this.prefix) {
            processedValue = processedValue.slice(this.prefix.length, processedValue.length);
        }
        if (!!this.suffix && processedValue.length > 0) {
            processedValue = this.checkAndRemoveSuffix(processedValue);
        }
        if (processedValue === '(' && this.prefix) {
            processedValue = '';
        }
        const inputArray: string[] = processedValue.toString().split(MaskExpression.EMPTY_STRING);
        if (
            this.allowNegativeNumbers &&
            processedValue.slice(cursor, cursor + 1) === MaskExpression.MINUS
        ) {
            result += processedValue.slice(cursor, cursor + 1);
        }
        if (maskExpression === MaskExpression.IP) {
            const valuesIP = processedValue.split(MaskExpression.DOT);
            this.ipError = this._validIP(valuesIP);

            // eslint-disable-next-line no-param-reassign
            maskExpression = '099.099.099.099';
        }
        const arr: string[] = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < processedValue.length; i++) {
            if (processedValue[i]?.match('\\d')) {
                arr.push(processedValue[i] ?? MaskExpression.EMPTY_STRING);
            }
        }
        if (maskExpression === MaskExpression.CPF_CNPJ) {
            this.cpfCnpjError = arr.length !== 11 && arr.length !== 14;
            if (arr.length > 11) {
                // eslint-disable-next-line no-param-reassign
                maskExpression = '00.000.000/0000-00';
            } else {
                // eslint-disable-next-line no-param-reassign
                maskExpression = '000.000.000-00';
            }
        }
        if (maskExpression.startsWith(MaskExpression.PERCENT)) {
            if (
                processedValue.match('[a-z]|[A-Z]') ||
                // eslint-disable-next-line no-useless-escape
                (processedValue.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/.]/) && !backspaced)
            ) {
                processedValue = this._stripToDecimal(processedValue);
                const precision: number = this.getPrecision(maskExpression);

                processedValue = this.checkInputPrecision(
                    processedValue,
                    precision,
                    this.decimalMarker
                );
            }
            const decimalMarker =
                typeof this.decimalMarker === 'string' ? this.decimalMarker : MaskExpression.DOT;
            if (
                processedValue.indexOf(decimalMarker) > 0 &&
                !this.percentage(processedValue.substring(0, processedValue.indexOf(decimalMarker)))
            ) {
                let base: string = processedValue.substring(
                    0,
                    processedValue.indexOf(decimalMarker) - 1
                );
                if (
                    this.allowNegativeNumbers &&
                    processedValue.slice(cursor, cursor + 1) === MaskExpression.MINUS &&
                    !backspaced
                ) {
                    base = processedValue.substring(0, processedValue.indexOf(decimalMarker));
                }

                processedValue = `${base}${processedValue.substring(
                    processedValue.indexOf(decimalMarker),
                    processedValue.length
                )}`;
            }
            let value = '';
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.allowNegativeNumbers &&
            processedValue.slice(cursor, cursor + 1) === MaskExpression.MINUS
                ? (value = `${MaskExpression.MINUS}${processedValue.slice(cursor + 1, cursor + processedValue.length)}`)
                : (value = processedValue);
            if (this.percentage(value)) {
                result = this._splitPercentZero(processedValue);
            } else {
                result = this._splitPercentZero(
                    processedValue.substring(0, processedValue.length - 1)
                );
            }
        } else if (maskExpression.startsWith(MaskExpression.SEPARATOR)) {
            if (
                processedValue.match('[wа-яА-Я]') ||
                processedValue.match('[ЁёА-я]') ||
                processedValue.match('[a-z]|[A-Z]') ||
                processedValue.match(/[-@#!$%\\^&*()_£¬'+|~=`{}\]:";<>.?/]/) ||
                processedValue.match('[^A-Za-z0-9,]')
            ) {
                processedValue = this._stripToDecimal(processedValue);
            }

            const precision: number = this.getPrecision(maskExpression);
            let decimalMarker = this.decimalMarker;

            if (Array.isArray(this.decimalMarker)) {
                if (
                    this.actualValue.includes(this.decimalMarker[0]) ||
                    this.actualValue.includes(this.decimalMarker[1])
                ) {
                    decimalMarker = this.actualValue.includes(this.decimalMarker[0])
                        ? this.decimalMarker[0]
                        : this.decimalMarker[1];
                } else {
                    decimalMarker = this.decimalMarker.find(
                        (dm) => dm !== this.thousandSeparator
                    ) as '.' | ',';
                }
            }

            if (backspaced) {
                const { decimalMarkerIndex, nonZeroIndex } = this._findFirstNonZeroAndDecimalIndex(
                    processedValue,
                    decimalMarker as '.' | ','
                );
                const zeroIndexMinus = processedValue[0] === MaskExpression.MINUS;
                const zeroIndexNumberZero = processedValue[0] === MaskExpression.NUMBER_ZERO;
                const zeroIndexDecimalMarker = processedValue[0] === decimalMarker;
                const firstIndexDecimalMarker = processedValue[1] === decimalMarker;

                if (
                    (zeroIndexDecimalMarker && !nonZeroIndex) ||
                    (zeroIndexMinus && firstIndexDecimalMarker && !nonZeroIndex) ||
                    (zeroIndexNumberZero && !decimalMarkerIndex && !nonZeroIndex)
                ) {
                    processedValue = MaskExpression.NUMBER_ZERO;
                }

                if (
                    decimalMarkerIndex &&
                    nonZeroIndex &&
                    zeroIndexMinus &&
                    processedPosition === 1
                ) {
                    if (decimalMarkerIndex < nonZeroIndex || decimalMarkerIndex > nonZeroIndex) {
                        processedValue = MaskExpression.MINUS + processedValue.slice(nonZeroIndex);
                    }
                }

                if (!decimalMarkerIndex && nonZeroIndex && processedValue.length > nonZeroIndex) {
                    processedValue = zeroIndexMinus
                        ? MaskExpression.MINUS + processedValue.slice(nonZeroIndex)
                        : processedValue.slice(nonZeroIndex);
                }

                if (decimalMarkerIndex && nonZeroIndex && processedPosition === 0) {
                    if (decimalMarkerIndex < nonZeroIndex) {
                        processedValue = processedValue.slice(decimalMarkerIndex - 1);
                    }
                    if (decimalMarkerIndex > nonZeroIndex) {
                        processedValue = processedValue.slice(nonZeroIndex);
                    }
                }
            }

            if (precision === 0) {
                processedValue = this.allowNegativeNumbers
                    ? processedValue.length > 2 &&
                      processedValue[0] === MaskExpression.MINUS &&
                      processedValue[1] === MaskExpression.NUMBER_ZERO &&
                      processedValue[2] !== this.thousandSeparator &&
                      processedValue[2] !== MaskExpression.COMMA &&
                      processedValue[2] !== MaskExpression.DOT
                        ? '-' + processedValue.slice(2, processedValue.length)
                        : processedValue[0] === MaskExpression.NUMBER_ZERO &&
                            processedValue.length > 1 &&
                            processedValue[1] !== this.thousandSeparator &&
                            processedValue[1] !== MaskExpression.COMMA &&
                            processedValue[1] !== MaskExpression.DOT
                          ? processedValue.slice(1, processedValue.length)
                          : processedValue
                    : processedValue.length > 1 &&
                        processedValue[0] === MaskExpression.NUMBER_ZERO &&
                        processedValue[1] !== this.thousandSeparator &&
                        processedValue[1] !== MaskExpression.COMMA &&
                        processedValue[1] !== MaskExpression.DOT
                      ? processedValue.slice(1, processedValue.length)
                      : processedValue;
            } else {
                if (
                    processedValue[0] === decimalMarker &&
                    processedValue.length > 1 &&
                    !backspaced
                ) {
                    processedValue =
                        MaskExpression.NUMBER_ZERO +
                        processedValue.slice(0, processedValue.length + 1);
                    this.plusOnePosition = true;
                }
                if (
                    processedValue[0] === MaskExpression.NUMBER_ZERO &&
                    processedValue[1] !== decimalMarker &&
                    processedValue[1] !== this.thousandSeparator &&
                    !backspaced
                ) {
                    processedValue =
                        processedValue.length > 1
                            ? processedValue.slice(0, 1) +
                              decimalMarker +
                              processedValue.slice(1, processedValue.length + 1)
                            : processedValue;
                    this.plusOnePosition = true;
                }
                if (
                    this.allowNegativeNumbers &&
                    !backspaced &&
                    processedValue[0] === MaskExpression.MINUS &&
                    (processedValue[1] === decimalMarker ||
                        processedValue[1] === MaskExpression.NUMBER_ZERO)
                ) {
                    processedValue =
                        processedValue[1] === decimalMarker && processedValue.length > 2
                            ? processedValue.slice(0, 1) +
                              MaskExpression.NUMBER_ZERO +
                              processedValue.slice(1, processedValue.length)
                            : processedValue[1] === MaskExpression.NUMBER_ZERO &&
                                processedValue.length > 2 &&
                                processedValue[2] !== decimalMarker
                              ? processedValue.slice(0, 2) +
                                decimalMarker +
                                processedValue.slice(2, processedValue.length)
                              : processedValue;
                    this.plusOnePosition = true;
                }
            }

            // TODO: we had different rexexps here for the different cases... but tests dont seam to bother - check this
            //  separator: no COMMA, dot-sep: no SPACE, COMMA OK, comma-sep: no SPACE, COMMA OK

            const thousandSeparatorCharEscaped: string = this._charToRegExpExpression(
                this.thousandSeparator
            );
            let invalidChars: string = '@#!$%^&*()_+|~=`{}\\[\\]:\\s,\\.";<>?\\/'.replace(
                thousandSeparatorCharEscaped,
                ''
            );
            //.replace(decimalMarkerEscaped, '');
            if (Array.isArray(this.decimalMarker)) {
                for (const marker of this.decimalMarker) {
                    invalidChars = invalidChars.replace(
                        this._charToRegExpExpression(marker),
                        MaskExpression.EMPTY_STRING
                    );
                }
            } else {
                invalidChars = invalidChars.replace(
                    this._charToRegExpExpression(this.decimalMarker),
                    ''
                );
            }

            const invalidCharRegexp = new RegExp('[' + invalidChars + ']');
            if (processedValue.match(invalidCharRegexp)) {
                processedValue = processedValue.substring(0, processedValue.length - 1);
            }

            processedValue = this.checkInputPrecision(
                processedValue,
                precision,
                this.decimalMarker
            );
            const strForSep: string = processedValue.replace(
                new RegExp(thousandSeparatorCharEscaped, 'g'),
                ''
            );

            result = this._formatWithSeparators(
                strForSep,
                this.thousandSeparator,
                this.decimalMarker,
                precision
            );

            const commaShift: number =
                result.indexOf(MaskExpression.COMMA) - processedValue.indexOf(MaskExpression.COMMA);
            const shiftStep: number = result.length - processedValue.length;
            const backspacedDecimalMarkerWithSeparatorLimit =
                backspaced && result.length < inputValue.length && this.separatorLimit;

            if (
                (result[processedPosition - 1] === this.thousandSeparator ||
                    result[processedPosition - this.prefix.length]) &&
                this.prefix &&
                backspaced
            ) {
                processedPosition = processedPosition - 1;
            } else if (
                (shiftStep > 0 && result[processedPosition] !== this.thousandSeparator) ||
                backspacedDecimalMarkerWithSeparatorLimit
            ) {
                backspaceShift = true;
                let _shift = 0;
                do {
                    this._shift.add(processedPosition + _shift);
                    _shift++;
                } while (_shift < shiftStep);
            } else if (
                result[processedPosition - 1] === this.thousandSeparator ||
                shiftStep === -4 ||
                shiftStep === -3 ||
                result[processedPosition] === this.thousandSeparator
            ) {
                this._shift.clear();
                this._shift.add(processedPosition - 1);
            } else if (
                (commaShift !== 0 &&
                    processedPosition > 0 &&
                    !(
                        result.indexOf(MaskExpression.COMMA) >= processedPosition &&
                        processedPosition > 3
                    )) ||
                (!(
                    result.indexOf(MaskExpression.DOT) >= processedPosition && processedPosition > 3
                ) &&
                    shiftStep <= 0)
            ) {
                this._shift.clear();
                backspaceShift = true;
                shift = shiftStep;

                processedPosition += shiftStep;
                this._shift.add(processedPosition);
            } else {
                this._shift.clear();
            }
        } else {
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
                    const inputValueSliceMinusThreeMinusOne = processedValue.slice(
                        cursor - 3,
                        cursor - 1
                    );
                    const inputValueSliceMinusOnePlusOne = processedValue.slice(
                        cursor - 1,
                        cursor + 1
                    );
                    const inputValueSliceCursorPlusTwo = processedValue.slice(cursor, cursor + 2);
                    const inputValueSliceMinusTwoCursor = processedValue.slice(cursor - 2, cursor);
                    if (maskExpression[cursor] === MaskExpression.DAY) {
                        const maskStartWithMonth =
                            maskExpression.slice(0, 2) === MaskExpression.MONTHS;
                        const startWithMonthInput: boolean =
                            maskExpression.slice(0, 2) === MaskExpression.MONTHS &&
                            this.specialCharacters.includes(inputValueCursorMinusTwo);
                        if (
                            (Number(inputSymbol) > 3 && this.leadZeroDateTime) ||
                            (!maskStartWithMonth &&
                                (Number(inputValueSliceCursorPlusTwo) > daysCount ||
                                    Number(inputValueSliceMinusOnePlusOne) > daysCount ||
                                    this.specialCharacters.includes(inputValueCursorPlusOne))) ||
                            (startWithMonthInput
                                ? Number(inputValueSliceMinusOnePlusOne) > daysCount ||
                                  (!this.specialCharacters.includes(inputValueCursor) &&
                                      this.specialCharacters.includes(inputValueCursorPlusTwo)) ||
                                  this.specialCharacters.includes(inputValueCursor)
                                : Number(inputValueSliceCursorPlusTwo) > daysCount ||
                                  (this.specialCharacters.includes(inputValueCursorPlusOne) &&
                                      !backspaced))
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
                        // mask without day
                        const withoutDays: boolean =
                            cursor === 0 &&
                            (Number(inputSymbol) > 2 ||
                                Number(inputValueSliceCursorPlusTwo) > monthsCount ||
                                (this.specialCharacters.includes(inputValueCursorPlusOne) &&
                                    !backspaced));
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
                            Number(inputValueSliceMinusThreeMinusOne) <= daysCount &&
                            !this.specialCharacters.includes(
                                inputValueSliceMinusThreeMinusOne as string
                            ) &&
                            this.specialCharacters.includes(inputValueCursorMinusOne) &&
                            (Number(inputValueSliceCursorPlusTwo) > monthsCount ||
                                this.specialCharacters.includes(inputValueCursorPlusOne));
                        // cursor === 5 && without days
                        const day2monthInputDot: boolean =
                            (Number(inputValueSliceCursorPlusTwo) > monthsCount && cursor === 5) ||
                            (this.specialCharacters.includes(inputValueCursorPlusOne) &&
                                cursor === 5);
                        // // day<10 && month<12 for paste whole data
                        const day1monthPaste: boolean =
                            Number(inputValueSliceMinusThreeMinusOne) > daysCount &&
                            !this.specialCharacters.includes(
                                inputValueSliceMinusThreeMinusOne as string
                            ) &&
                            !this.specialCharacters.includes(
                                inputValueSliceMinusTwoCursor as string
                            ) &&
                            Number(inputValueSliceMinusTwoCursor) > monthsCount &&
                            maskExpression.includes('d0');
                        // 10<day<31 && month<12 for paste whole data
                        const day2monthPaste: boolean =
                            Number(inputValueSliceMinusThreeMinusOne) <= daysCount &&
                            !this.specialCharacters.includes(
                                inputValueSliceMinusThreeMinusOne as string
                            ) &&
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
                } else if (
                    maskExpression[cursor] === MaskExpression.NUMBER_NINE &&
                    this.showMaskTyped
                ) {
                    this._shiftStep(cursor);
                } else if (
                    this.patterns[maskExpression[cursor] ?? MaskExpression.EMPTY_STRING] &&
                    this.patterns[maskExpression[cursor] ?? MaskExpression.EMPTY_STRING]?.optional
                ) {
                    if (
                        !!inputArray[cursor] &&
                        maskExpression !== '099.099.099.099' &&
                        maskExpression !== '000.000.000-00' &&
                        maskExpression !== '00.000.000/0000-00' &&
                        !maskExpression.match(/^9+\.0+$/) &&
                        !this.patterns[maskExpression[cursor] ?? MaskExpression.EMPTY_STRING]
                            ?.optional
                    ) {
                        result += inputArray[cursor];
                    }
                    if (
                        maskExpression.includes(
                            MaskExpression.NUMBER_NINE + MaskExpression.SYMBOL_STAR
                        ) &&
                        maskExpression.includes(
                            MaskExpression.NUMBER_ZERO + MaskExpression.SYMBOL_STAR
                        )
                    ) {
                        cursor++;
                    }

                    cursor++;
                    i--;
                } else if (
                    this.maskExpression[cursor + 1] === MaskExpression.SYMBOL_STAR &&
                    this._findSpecialChar(
                        this.maskExpression[cursor + 2] ?? MaskExpression.EMPTY_STRING
                    ) &&
                    this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] &&
                    multi
                ) {
                    cursor += 3;
                    result += inputSymbol;
                } else if (
                    this.maskExpression[cursor + 1] === MaskExpression.SYMBOL_QUESTION &&
                    this._findSpecialChar(
                        this.maskExpression[cursor + 2] ?? MaskExpression.EMPTY_STRING
                    ) &&
                    this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] &&
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
        }
        if (
            result[processedPosition - 1] &&
            result.length + 1 === maskExpression.length &&
            this.specialCharacters.indexOf(
                maskExpression[maskExpression.length - 1] ?? MaskExpression.EMPTY_STRING
            ) !== -1
        ) {
            result += maskExpression[maskExpression.length - 1];
        }
        let newPosition: number = processedPosition + 1;

        while (this._shift.has(newPosition)) {
            shift++;
            newPosition++;
        }

        let actualShift: number =
            justPasted && !maskExpression.startsWith(MaskExpression.SEPARATOR)
                ? cursor
                : this._shift.has(processedPosition)
                  ? shift
                  : 0;
        if (stepBack) {
            actualShift--;
        }

        cb(actualShift, backspaceShift);
        if (shift < 0) {
            this._shift.clear();
        }
        let onlySpecial = false;
        if (backspaced) {
            onlySpecial = inputArray.every((char) => this.specialCharacters.includes(char));
        }

        let res = `${this.prefix}${onlySpecial ? MaskExpression.EMPTY_STRING : result}${
            this.showMaskTyped ? '' : this.suffix
        }`;

        if (result.length === 0) {
            res = this.instantPrefix ? `${this.prefix}${result}` : `${result}`;
        }

        const isSpecialCharacterMaskFirstSymbol =
            processedValue.length === 1 &&
            this.specialCharacters.includes(maskExpression[0] as string) &&
            processedValue !== maskExpression[0];

        if (
            !this._checkSymbolMask(processedValue, maskExpression[1] as string) &&
            isSpecialCharacterMaskFirstSymbol
        ) {
            return '';
        }

        if (result.includes(MaskExpression.MINUS) && this.prefix && this.allowNegativeNumbers) {
            if (backspaced && result === MaskExpression.MINUS) {
                return '';
            }
            res = `${MaskExpression.MINUS}${this.prefix}${result
                .split(MaskExpression.MINUS)
                .join(MaskExpression.EMPTY_STRING)}${this.suffix}`;
        }
        return res;
    }

    public _findDropSpecialChar(inputSymbol: string): undefined | string {
        if (Array.isArray(this.dropSpecialCharacters)) {
            return this.dropSpecialCharacters.find((val: string) => val === inputSymbol);
        }
        return this._findSpecialChar(inputSymbol);
    }

    public _findSpecialChar(inputSymbol: string): undefined | string {
        return this.specialCharacters.find((val: string) => val === inputSymbol);
    }

    public _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
        this.patterns = this.customPattern ? this.customPattern : this.patterns;
        return (
            (this.patterns[maskSymbol]?.pattern &&
                this.patterns[maskSymbol]?.pattern.test(inputSymbol)) ??
            false
        );
    }

    private _formatWithSeparators = (
        str: string,
        thousandSeparatorChar: string,
        decimalChars: string | string[],
        precision: number
    ) => {
        let x: string[] = [];
        let decimalChar = '';

        if (Array.isArray(decimalChars)) {
            const regExp = new RegExp(
                decimalChars.map((v) => ('[\\^$.|?*+()'.indexOf(v) >= 0 ? `\\${v}` : v)).join('|')
            );
            x = str.split(regExp);
            decimalChar = str.match(regExp)?.[0] ?? MaskExpression.EMPTY_STRING;
        } else {
            x = str.split(decimalChars);
            decimalChar = decimalChars;
        }
        const decimals: string =
            x.length > 1 ? `${decimalChar}${x[1]}` : MaskExpression.EMPTY_STRING;
        let res: string = x[0] ?? MaskExpression.EMPTY_STRING;
        const separatorLimit: string = this.separatorLimit.replace(
            /\s/g,
            MaskExpression.EMPTY_STRING
        );
        if (separatorLimit && +separatorLimit) {
            if (res[0] === MaskExpression.MINUS) {
                res = `-${res.slice(1, res.length).slice(0, separatorLimit.length)}`;
            } else {
                res = res.slice(0, separatorLimit.length);
            }
        }
        const rgx = /(\d+)(\d{3})/;

        while (thousandSeparatorChar && rgx.test(res)) {
            res = res.replace(rgx, '$1' + thousandSeparatorChar + '$2');
        }

        if (typeof precision === 'undefined') {
            return res + decimals;
        } else if (precision === 0) {
            return res;
        }
        return res + decimals.substring(0, precision + 1);
    };

    private percentage = (str: string): boolean => {
        const sanitizedStr = str.replace(',', '.');
        const value = Number(
            this.allowNegativeNumbers && str.includes(MaskExpression.MINUS)
                ? sanitizedStr.slice(1, str.length)
                : sanitizedStr
        );

        return !isNaN(value) && value >= 0 && value <= 100;
    };

    public getPrecision = (maskExpression: string): number => {
        const x: string[] = maskExpression.split(MaskExpression.DOT);
        if (x.length > 1) {
            return Number(x[x.length - 1]);
        }

        return Infinity;
    };

    private checkAndRemoveSuffix = (inputValue: string): string => {
        for (let i = this.suffix?.length - 1; i >= 0; i--) {
            const substr = this.suffix.substring(i, this.suffix?.length);
            if (
                inputValue.includes(substr) &&
                i !== this.suffix?.length - 1 &&
                (i - 1 < 0 ||
                    !inputValue.includes(this.suffix.substring(i - 1, this.suffix?.length)))
            ) {
                return inputValue.replace(substr, MaskExpression.EMPTY_STRING);
            }
        }
        return inputValue;
    };

    private checkInputPrecision = (
        inputValue: string,
        precision: number,
        decimalMarker: NgxMaskConfig['decimalMarker']
    ): string => {
        let processedInputValue = inputValue;
        let processedDecimalMarker = decimalMarker;

        if (precision < Infinity) {
            // TODO need think about decimalMarker
            if (Array.isArray(processedDecimalMarker)) {
                const marker = processedDecimalMarker.find((dm) => dm !== this.thousandSeparator);

                processedDecimalMarker = marker ? marker : processedDecimalMarker[0];
            }
            const precisionRegEx = new RegExp(
                this._charToRegExpExpression(processedDecimalMarker) + `\\d{${precision}}.*$`
            );
            const precisionMatch: RegExpMatchArray | null =
                processedInputValue.match(precisionRegEx);
            const precisionMatchLength: number = (precisionMatch && precisionMatch[0]?.length) ?? 0;
            if (precisionMatchLength - 1 > precision) {
                const diff = precisionMatchLength - 1 - precision;

                processedInputValue = processedInputValue.substring(
                    0,
                    processedInputValue.length - diff
                );
            }
            if (
                precision === 0 &&
                this._compareOrIncludes(
                    processedInputValue[processedInputValue.length - 1],
                    processedDecimalMarker,
                    this.thousandSeparator
                )
            ) {
                processedInputValue = processedInputValue.substring(
                    0,
                    processedInputValue.length - 1
                );
            }
        }
        return processedInputValue;
    };

    private _stripToDecimal(str: string): string {
        return str
            .split(MaskExpression.EMPTY_STRING)
            .filter((i: string, idx: number) => {
                const isDecimalMarker =
                    typeof this.decimalMarker === 'string'
                        ? i === this.decimalMarker
                        : // TODO (inepipenko) use utility type
                          this.decimalMarker.includes(
                              i as MaskExpression.COMMA | MaskExpression.DOT
                          );
                return (
                    i.match('^-?\\d') ||
                    i === this.thousandSeparator ||
                    isDecimalMarker ||
                    (i === MaskExpression.MINUS && idx === 0 && this.allowNegativeNumbers)
                );
            })
            .join(MaskExpression.EMPTY_STRING);
    }

    private _charToRegExpExpression(char: string): string {
        // if (Array.isArray(char)) {
        // 	return char.map((v) => ('[\\^$.|?*+()'.indexOf(v) >= 0 ? `\\${v}` : v)).join('|');
        // }
        if (char) {
            const charsToEscape = '[\\^$.|?*+()';
            return char === ' ' ? '\\s' : charsToEscape.indexOf(char) >= 0 ? `\\${char}` : char;
        }
        return char;
    }

    private _shiftStep(cursor: number) {
        this._shift.add(cursor + this.prefix.length || 0);
    }

    protected _compareOrIncludes<T>(value: T, comparedValue: T | T[], excludedValue: T): boolean {
        return Array.isArray(comparedValue)
            ? comparedValue.filter((v) => v !== excludedValue).includes(value)
            : value === comparedValue;
    }

    private _validIP(valuesIP: string[]): boolean {
        return !(
            valuesIP.length === 4 &&
            !valuesIP.some((value: string, index: number) => {
                if (valuesIP.length !== index + 1) {
                    return value === MaskExpression.EMPTY_STRING || Number(value) > 255;
                }
                return value === MaskExpression.EMPTY_STRING || Number(value.substring(0, 3)) > 255;
            })
        );
    }

    private _splitPercentZero(value: string): string {
        if (value === MaskExpression.MINUS && this.allowNegativeNumbers) {
            return value;
        }
        const decimalIndex =
            typeof this.decimalMarker === 'string'
                ? value.indexOf(this.decimalMarker)
                : value.indexOf(MaskExpression.DOT);
        const emptyOrMinus =
            this.allowNegativeNumbers && value.includes(MaskExpression.MINUS) ? '-' : '';
        if (decimalIndex === -1) {
            const parsedValue = parseInt(emptyOrMinus ? value.slice(1, value.length) : value, 10);
            return isNaN(parsedValue)
                ? MaskExpression.EMPTY_STRING
                : `${emptyOrMinus}${parsedValue}`;
        } else {
            const integerPart = parseInt(value.replace('-', '').substring(0, decimalIndex), 10);
            const decimalPart = value.substring(decimalIndex + 1);
            const integerString = isNaN(integerPart) ? '' : integerPart.toString();

            const decimal =
                typeof this.decimalMarker === 'string' ? this.decimalMarker : MaskExpression.DOT;

            return integerString === MaskExpression.EMPTY_STRING
                ? MaskExpression.EMPTY_STRING
                : `${emptyOrMinus}${integerString}${decimal}${decimalPart}`;
        }
    }

    private _findFirstNonZeroAndDecimalIndex(inputString: string, decimalMarker: '.' | ',') {
        let decimalMarkerIndex: number | null = null;
        let nonZeroIndex: number | null = null;

        for (let i = 0; i < inputString.length; i++) {
            const char = inputString[i];

            if (char === decimalMarker && decimalMarkerIndex === null) {
                decimalMarkerIndex = i;
            }

            if (char && char >= '1' && char <= '9' && nonZeroIndex === null) {
                nonZeroIndex = i;
            }

            if (decimalMarkerIndex !== null && nonZeroIndex !== null) {
                break;
            }
        }

        return {
            decimalMarkerIndex,
            nonZeroIndex,
        };
    }
}
