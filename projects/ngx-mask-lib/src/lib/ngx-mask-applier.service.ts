import { inject, Injectable } from '@angular/core';
import { NGX_MASK_CONFIG, IConfig } from './ngx-mask.config';

@Injectable()
export class NgxMaskApplierService {
    protected _config = inject<IConfig>(NGX_MASK_CONFIG);

    public dropSpecialCharacters: IConfig['dropSpecialCharacters'] =
        this._config.dropSpecialCharacters;

    public hiddenInput: IConfig['hiddenInput'] = this._config.hiddenInput;

    public showTemplate!: IConfig['showTemplate'];

    public clearIfNotMatch: IConfig['clearIfNotMatch'] = this._config.clearIfNotMatch;

    public specialCharacters: IConfig['specialCharacters'] = this._config.specialCharacters;

    public patterns: IConfig['patterns'] = this._config.patterns;

    public prefix: IConfig['prefix'] = this._config.prefix;

    public suffix: IConfig['suffix'] = this._config.suffix;

    public thousandSeparator: IConfig['thousandSeparator'] = this._config.thousandSeparator;

    public decimalMarker: IConfig['decimalMarker'] = this._config.decimalMarker;

    public customPattern!: IConfig['patterns'];

    public showMaskTyped: IConfig['showMaskTyped'] = this._config.showMaskTyped;

    public placeHolderCharacter: IConfig['placeHolderCharacter'] =
        this._config.placeHolderCharacter;

    public validation: IConfig['validation'] = this._config.validation;

    public separatorLimit: IConfig['separatorLimit'] = this._config.separatorLimit;

    public allowNegativeNumbers: IConfig['allowNegativeNumbers'] =
        this._config.allowNegativeNumbers;

    public leadZeroDateTime: IConfig['leadZeroDateTime'] = this._config.leadZeroDateTime;

    private _shift: Set<number> = new Set();

    public maskExpression = '';

    public actualValue = '';

    public shownMaskExpression = '';

    public ipError?: boolean;

    public cpfCnpjError?: boolean;
    public applyMaskWithPattern(
        inputValue: string,
        maskAndPattern: [string, IConfig['patterns']]
    ): string {
        const [mask, customPattern] = maskAndPattern;
        this.customPattern = customPattern;
        return this.applyMask(inputValue, mask);
    }

    public applyMask(
        inputValue: string | object | boolean | null | undefined,
        maskExpression: string,
        position = 0,
        justPasted = false,
        backspaced = false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
        cb: (...args: any[]) => any = () => {}
    ): string {
        if (!maskExpression || typeof inputValue !== 'string') {
            return '';
        }
        let cursor = 0;
        let result = '';
        let multi = false;
        let backspaceShift = false;
        let shift = 1;
        let stepBack = false;
        if (inputValue.slice(0, this.prefix.length) === this.prefix) {
            // eslint-disable-next-line no-param-reassign
            inputValue = inputValue.slice(this.prefix.length, inputValue.length);
        }
        if (!!this.suffix && inputValue?.length > 0) {
            // eslint-disable-next-line no-param-reassign
            inputValue = this.checkAndRemoveSuffix(inputValue);
        }
        const inputArray: string[] = inputValue.toString().split('');
        if (maskExpression === 'IP') {
            const valuesIP = inputValue.split('.');
            this.ipError = this._validIP(valuesIP);
            // eslint-disable-next-line no-param-reassign
            maskExpression = '099.099.099.099';
        }
        const arr: string[] = [];
        for (let i = 0; i < inputValue.length; i++) {
            if (inputValue[i]?.match('\\d')) {
                arr.push(inputValue[i] ?? '');
            }
        }
        if (maskExpression === 'CPF_CNPJ') {
            this.cpfCnpjError = arr.length !== 11 && arr.length !== 14;
            if (arr.length > 11) {
                // eslint-disable-next-line no-param-reassign
                maskExpression = '00.000.000/0000-00';
            } else {
                // eslint-disable-next-line no-param-reassign
                maskExpression = '000.000.000-00';
            }
        }
        if (maskExpression.startsWith('percent')) {
            if (
                inputValue.match('[a-z]|[A-Z]') ||
                // eslint-disable-next-line no-useless-escape
                inputValue.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/.]/)
            ) {
                // eslint-disable-next-line no-param-reassign
                inputValue = this._stripToDecimal(inputValue);
                const precision: number = this.getPrecision(maskExpression);
                // eslint-disable-next-line no-param-reassign
                inputValue = this.checkInputPrecision(inputValue, precision, this.decimalMarker);
            }
            if (
                inputValue.indexOf('.') > 0 &&
                !this.percentage(inputValue.substring(0, inputValue.indexOf('.')))
            ) {
                const base: string = inputValue.substring(0, inputValue.indexOf('.') - 1);
                // eslint-disable-next-line no-param-reassign
                inputValue = `${base}${inputValue.substring(
                    inputValue.indexOf('.'),
                    inputValue.length
                )}`;
            }
            if (this.percentage(inputValue)) {
                result = inputValue;
            } else {
                result = inputValue.substring(0, inputValue.length - 1);
            }
        } else if (maskExpression.startsWith('separator')) {
            if (
                inputValue.match('[wа-яА-Я]') ||
                inputValue.match('[ЁёА-я]') ||
                inputValue.match('[a-z]|[A-Z]') ||
                inputValue.match(/[-@#!$%\\^&*()_£¬'+|~=`{}\]:";<>.?/]/) ||
                inputValue.match('[^A-Za-z0-9,]')
            ) {
                // eslint-disable-next-line no-param-reassign
                inputValue = this._stripToDecimal(inputValue);
            }

            // eslint-disable-next-line no-param-reassign
            inputValue =
                inputValue.length > 1 &&
                inputValue[0] === '0' &&
                inputValue[1] !== this.thousandSeparator &&
                !this._compareOrIncludes(
                    inputValue[1],
                    this.decimalMarker,
                    this.thousandSeparator
                ) &&
                !backspaced
                    ? inputValue.slice(0, inputValue.length - 1)
                    : inputValue;

            if (backspaced) {
                // eslint-disable-next-line no-param-reassign
                inputValue = this._compareOrIncludes(
                    inputValue[inputValue.length - 1],
                    this.decimalMarker,
                    this.thousandSeparator
                )
                    ? inputValue.slice(0, inputValue.length - 1)
                    : inputValue;
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
                    invalidChars = invalidChars.replace(this._charToRegExpExpression(marker), '');
                }
            } else {
                invalidChars = invalidChars.replace(
                    this._charToRegExpExpression(this.decimalMarker),
                    ''
                );
            }

            const invalidCharRegexp = new RegExp('[' + invalidChars + ']');

            if (
                inputValue.match(invalidCharRegexp) ||
                (inputValue.length === 1 &&
                    this._compareOrIncludes(inputValue, this.decimalMarker, this.thousandSeparator))
            ) {
                // eslint-disable-next-line no-param-reassign
                inputValue = inputValue.substring(0, inputValue.length - 1);
            }

            const precision: number = this.getPrecision(maskExpression);
            // eslint-disable-next-line no-param-reassign
            inputValue = this.checkInputPrecision(inputValue, precision, this.decimalMarker);
            const strForSep: string = inputValue.replace(
                new RegExp(thousandSeparatorCharEscaped, 'g'),
                ''
            );
            result = this._formatWithSeparators(
                strForSep,
                this.thousandSeparator,
                this.decimalMarker,
                precision
            );
            const commaShift: number = result.indexOf(',') - inputValue.indexOf(',');
            const shiftStep: number = result.length - inputValue.length;

            if (shiftStep > 0 && result[position] !== ',') {
                backspaceShift = true;
                let _shift = 0;
                do {
                    this._shift.add(position + _shift);
                    _shift++;
                } while (_shift < shiftStep);
            } else if (
                (commaShift !== 0 &&
                    position > 0 &&
                    !(result.indexOf(',') >= position && position > 3)) ||
                (!(result.indexOf('.') >= position && position > 3) && shiftStep <= 0)
            ) {
                this._shift.clear();
                backspaceShift = true;
                shift = shiftStep;
                // eslint-disable-next-line no-param-reassign
                position += shiftStep;
                this._shift.add(position);
            } else {
                this._shift.clear();
            }
        } else {
            for (
                // eslint-disable-next-line
                let i: number = 0, inputSymbol: string = inputArray[0]!;
                i < inputArray.length;
                i++, inputSymbol = inputArray[i] ?? ''
            ) {
                if (cursor === maskExpression.length) {
                    break;
                }
                if (
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor] ?? '') &&
                    maskExpression[cursor + 1] === '?'
                ) {
                    result += inputSymbol;
                    cursor += 2;
                } else if (
                    maskExpression[cursor + 1] === '*' &&
                    multi &&
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2] ?? '')
                ) {
                    result += inputSymbol;
                    cursor += 3;
                    multi = false;
                } else if (
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor] ?? '') &&
                    maskExpression[cursor + 1] === '*'
                ) {
                    result += inputSymbol;
                    multi = true;
                } else if (
                    maskExpression[cursor + 1] === '?' &&
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2] ?? '')
                ) {
                    result += inputSymbol;
                    cursor += 3;
                } else if (this._checkSymbolMask(inputSymbol, maskExpression[cursor] ?? '')) {
                    if (maskExpression[cursor] === 'H') {
                        if (Number(inputSymbol) > 2) {
                            cursor += 1;
                            this._shiftStep(maskExpression, cursor, inputArray.length);
                            i--;
                            if (this.leadZeroDateTime) {
                                result += '0';
                            }
                            continue;
                        }
                    }
                    if (maskExpression[cursor] === 'h') {
                        if (result === '2' && Number(inputSymbol) > 3) {
                            cursor += 1;
                            i--;
                            continue;
                        }
                    }
                    if (maskExpression[cursor] === 'm') {
                        if (Number(inputSymbol) > 5) {
                            cursor += 1;
                            this._shiftStep(maskExpression, cursor, inputArray.length);
                            i--;
                            if (this.leadZeroDateTime) {
                                result += '0';
                            }
                            continue;
                        }
                    }
                    if (maskExpression[cursor] === 's') {
                        if (Number(inputSymbol) > 5) {
                            cursor += 1;
                            this._shiftStep(maskExpression, cursor, inputArray.length);
                            i--;
                            if (this.leadZeroDateTime) {
                                result += '0';
                            }
                            continue;
                        }
                    }
                    const daysCount = 31;
                    if (maskExpression[cursor] === 'd') {
                        if (
                            (Number(inputSymbol) > 3 && this.leadZeroDateTime) ||
                            Number(inputValue.slice(cursor, cursor + 2)) > daysCount ||
                            inputValue[cursor + 1] === '/'
                        ) {
                            cursor += 1;
                            this._shiftStep(maskExpression, cursor, inputArray.length);
                            i--;
                            if (this.leadZeroDateTime) {
                                result += '0';
                            }
                            continue;
                        }
                    }
                    if (maskExpression[cursor] === 'M') {
                        const monthsCount = 12;
                        // mask without day
                        const withoutDays: boolean =
                            cursor === 0 &&
                            (Number(inputSymbol) > 2 ||
                                Number(inputValue.slice(cursor, cursor + 2)) > monthsCount ||
                                inputValue[cursor + 1] === '/');
                        // day<10 && month<12 for input
                        const day1monthInput: boolean =
                            inputValue.slice(cursor - 3, cursor - 1).includes('/') &&
                            ((inputValue[cursor - 2] === '/' &&
                                Number(inputValue.slice(cursor - 1, cursor + 1)) > monthsCount &&
                                inputValue[cursor] !== '/') ||
                                inputValue[cursor] === '/' ||
                                (inputValue[cursor - 3] === '/' &&
                                    Number(inputValue.slice(cursor - 2, cursor)) > monthsCount &&
                                    inputValue[cursor - 1] !== '/') ||
                                inputValue[cursor - 1] === '/');
                        // 10<day<31 && month<12 for input
                        const day2monthInput: boolean =
                            Number(inputValue.slice(cursor - 3, cursor - 1)) <= daysCount &&
                            !inputValue.slice(cursor - 3, cursor - 1).includes('/') &&
                            inputValue[cursor - 1] === '/' &&
                            (Number(inputValue.slice(cursor, cursor + 2)) > monthsCount ||
                                inputValue[cursor + 1] === '/');
                        // day<10 && month<12 for paste whole data
                        const day1monthPaste: boolean =
                            Number(inputValue.slice(cursor - 3, cursor - 1)) > daysCount &&
                            !inputValue.slice(cursor - 3, cursor - 1).includes('/') &&
                            !inputValue.slice(cursor - 2, cursor).includes('/') &&
                            Number(inputValue.slice(cursor - 2, cursor)) > monthsCount;
                        // 10<day<31 && month<12 for paste whole data
                        const day2monthPaste: boolean =
                            Number(inputValue.slice(cursor - 3, cursor - 1)) <= daysCount &&
                            !inputValue.slice(cursor - 3, cursor - 1).includes('/') &&
                            inputValue[cursor - 1] !== '/' &&
                            Number(inputValue.slice(cursor - 1, cursor + 1)) > monthsCount;

                        if (
                            (Number(inputSymbol) > 1 && this.leadZeroDateTime) ||
                            withoutDays ||
                            day1monthInput ||
                            day2monthInput ||
                            day1monthPaste ||
                            day2monthPaste
                        ) {
                            cursor += 1;
                            this._shiftStep(maskExpression, cursor, inputArray.length);
                            i--;
                            if (this.leadZeroDateTime) {
                                result += '0';
                            }
                            continue;
                        }
                    }
                    result += inputSymbol;
                    cursor++;
                } else if (inputSymbol === ' ' && maskExpression[cursor] === ' ') {
                    result += inputSymbol;
                    cursor++;
                } else if (this.specialCharacters.indexOf(maskExpression[cursor] ?? '') !== -1) {
                    result += maskExpression[cursor];
                    cursor++;
                    this._shiftStep(maskExpression, cursor, inputArray.length);
                    i--;
                } else if (
                    this.specialCharacters.indexOf(inputSymbol) > -1 &&
                    this.patterns[maskExpression[cursor] ?? ''] &&
                    this.patterns[maskExpression[cursor] ?? '']?.optional
                ) {
                    if (
                        !!inputArray[cursor] &&
                        maskExpression !== '099.099.099.099' &&
                        maskExpression !== '000.000.000-00' &&
                        maskExpression !== '00.000.000/0000-00' &&
                        !maskExpression.match(/^9+\.0+$/)
                    ) {
                        result += inputArray[cursor];
                    }
                    cursor++;
                    i--;
                } else if (
                    this.maskExpression[cursor + 1] === '*' &&
                    this._findSpecialChar(this.maskExpression[cursor + 2] ?? '') &&
                    this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] &&
                    multi
                ) {
                    cursor += 3;
                    result += inputSymbol;
                } else if (
                    this.maskExpression[cursor + 1] === '?' &&
                    this._findSpecialChar(this.maskExpression[cursor + 2] ?? '') &&
                    this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] &&
                    multi
                ) {
                    cursor += 3;
                    result += inputSymbol;
                } else if (
                    this.showMaskTyped &&
                    this.specialCharacters.indexOf(inputSymbol) < 0 &&
                    inputSymbol !== this.placeHolderCharacter
                ) {
                    stepBack = true;
                }
            }
        }
        if (
            result.length + 1 === maskExpression.length &&
            this.specialCharacters.indexOf(maskExpression[maskExpression.length - 1] ?? '') !== -1
        ) {
            result += maskExpression[maskExpression.length - 1];
        }

        let newPosition: number = position + 1;

        while (this._shift.has(newPosition)) {
            shift++;
            newPosition++;
        }

        let actualShift: number =
            justPasted && !maskExpression.startsWith('separator')
                ? cursor
                : this._shift.has(position)
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
        let res = `${this.prefix}${onlySpecial ? '' : result}${this.suffix}`;
        if (result.length === 0) {
            res = `${this.prefix}${result}`;
        }
        return res;
    }

    public _findSpecialChar(inputSymbol: string): undefined | string {
        return this.specialCharacters.find((val: string) => val === inputSymbol);
    }

    protected _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
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
            decimalChar = str.match(regExp)?.[0] ?? '';
        } else {
            x = str.split(decimalChars);
            decimalChar = decimalChars;
        }
        const decimals: string = x.length > 1 ? `${decimalChar}${x[1]}` : '';
        let res: string = x[0] ?? '';
        const separatorLimit: string = this.separatorLimit.replace(/\s/g, '');
        if (separatorLimit && +separatorLimit) {
            if (res[0] === '-') {
                res = `-${res.slice(1, res.length).slice(0, separatorLimit.length)}`;
            } else {
                res = res.slice(0, separatorLimit.length);
            }
        }
        const rgx = /(\d+)(\d{3})/;

        while (thousandSeparatorChar && rgx.test(res)) {
            res = res.replace(rgx, '$1' + thousandSeparatorChar + '$2');
        }

        if (precision === undefined) {
            return res + decimals;
        } else if (precision === 0) {
            return res;
        }
        return res + decimals.substring(0, precision + 1);
    };

    private percentage = (str: string): boolean => {
        return Number(str) >= 0 && Number(str) <= 100;
    };

    private getPrecision = (maskExpression: string): number => {
        const x: string[] = maskExpression.split('.');
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
                return inputValue.replace(substr, '');
            }
        }
        return inputValue;
    };

    private checkInputPrecision = (
        inputValue: string,
        precision: number,
        decimalMarker: IConfig['decimalMarker']
    ): string => {
        if (precision < Infinity) {
            // TODO need think about decimalMarker
            if (Array.isArray(decimalMarker)) {
                const marker = decimalMarker.find((dm) => dm !== this.thousandSeparator);
                // eslint-disable-next-line no-param-reassign
                decimalMarker = marker ? marker : decimalMarker[0];
            }
            const precisionRegEx = new RegExp(
                this._charToRegExpExpression(decimalMarker) + `\\d{${precision}}.*$`
            );

            const precisionMatch: RegExpMatchArray | null = inputValue.match(precisionRegEx);
            const precisionMatchLength: number = (precisionMatch && precisionMatch[0]?.length) ?? 0;
            if (precisionMatchLength - 1 > precision) {
                const diff = precisionMatchLength - 1 - precision;
                // eslint-disable-next-line no-param-reassign
                inputValue = inputValue.substring(0, inputValue.length - diff);
            }
            if (
                precision === 0 &&
                this._compareOrIncludes(
                    inputValue[inputValue.length - 1],
                    decimalMarker,
                    this.thousandSeparator
                )
            ) {
                // eslint-disable-next-line no-param-reassign
                inputValue = inputValue.substring(0, inputValue.length - 1);
            }
        }
        return inputValue;
    };

    private _stripToDecimal(str: string): string {
        return str
            .split('')
            .filter((i: string, idx: number) => {
                const isDecimalMarker =
                    typeof this.decimalMarker === 'string'
                        ? i === this.decimalMarker
                        : // TODO (inepipenko) use utility type
                          this.decimalMarker.includes(i as ',' | '.');
                return (
                    i.match('^-?\\d') ||
                    i === this.thousandSeparator ||
                    isDecimalMarker ||
                    (i === '-' && idx === 0 && this.allowNegativeNumbers)
                );
            })
            .join('');
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

    private _shiftStep(maskExpression: string, cursor: number, inputLength: number) {
        const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
            ? inputLength
            : cursor;
        this._shift.add(shiftStep + this.prefix.length || 0);
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
                    return value === '' || Number(value) > 255;
                }
                return value === '' || Number(value.substring(0, 3)) > 255;
            })
        );
    }
}
