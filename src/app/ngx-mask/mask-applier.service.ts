import { Inject, Injectable } from '@angular/core';
import { config, IConfig } from './config';

export enum Separators {
    SEPARATOR = 'separator',
    COMMA_SEPARATOR = 'comma_separator',
    DOT_SEPARATOR = 'dot_separator',
}

@Injectable()
export class MaskApplierService {
    public dropSpecialCharacters: IConfig['dropSpecialCharacters'];
    public hiddenInput: IConfig['hiddenInput'];
    public showTemplate!: IConfig['showTemplate'];
    public clearIfNotMatch!: IConfig['clearIfNotMatch'];
    public maskExpression: string = '';
    public actualValue: string = '';
    public shownMaskExpression: string = '';
    public maskSpecialCharacters!: IConfig['specialCharacters'];
    public maskAvailablePatterns!: IConfig['patterns'];
    public prefix!: IConfig['prefix'];
    public suffix!: IConfig['suffix'];
    public customPattern!: IConfig['patterns'];
    public ipError?: boolean;
    public showMaskTyped!: IConfig['showMaskTyped'];
    public validation: IConfig['validation'];

    private _shift!: Set<number>;

    public constructor(@Inject(config) protected _config: IConfig) {
        this._shift = new Set();
        this.clearIfNotMatch = this._config.clearIfNotMatch;
        this.dropSpecialCharacters = this._config.dropSpecialCharacters;
        this.maskSpecialCharacters = this._config!.specialCharacters;
        this.maskAvailablePatterns = this._config.patterns;
        this.prefix = this._config.prefix;
        this.suffix = this._config.suffix;
        this.hiddenInput = this._config.hiddenInput;
        this.showMaskTyped = this._config.showMaskTyped;
        this.validation = this._config.validation;
    }
    // tslint:disable-next-line:no-any
    public applyMaskWithPattern(inputValue: string, maskAndPattern: [string, IConfig['patterns']]): string {
        const [mask, customPattern] = maskAndPattern;
        this.customPattern = customPattern;
        return this.applyMask(inputValue, mask);
    }
    public applyMask(
        inputValue: string,
        maskExpression: string,
        position: number = 0,
        cb: Function = () => {}
    ): string {
        if (inputValue === undefined || inputValue === null || maskExpression === undefined) {
            return '';
        }
        let cursor: number = 0;
        let result: string = ``;
        let multi: boolean = false;
        let backspaceShift: boolean = false;
        let shift: number = 1;
        let stepBack: boolean = false;
        if (inputValue.slice(0, this.prefix.length) === this.prefix) {
            inputValue = inputValue.slice(this.prefix.length, inputValue.length);
        }
        const inputArray: string[] = inputValue.toString().split('');
        if (maskExpression === 'IP') {
            this.ipError = !!(inputArray.filter((i: string) => i === '.').length < 3 && inputArray.length < 7);
            maskExpression = '099.099.099.099';
        }
        if (maskExpression.startsWith('percent')) {
            if (inputValue.match('[a-z]|[A-Z]') || inputValue.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/]/)) {
                inputValue = this._checkInput(inputValue);
                const precision: number = this.getPrecision(maskExpression);
                inputValue = this.checkInputPrecision(inputValue, precision, '.');
            }
            if (this.percentage(inputValue)) {
                result = inputValue;
            } else {
                result = inputValue.substring(0, inputValue.length - 1);
            }
        } else if (
            maskExpression.startsWith(Separators.SEPARATOR) ||
            maskExpression.startsWith(Separators.DOT_SEPARATOR) ||
            maskExpression.startsWith(Separators.COMMA_SEPARATOR)
        ) {
            if (
                inputValue.match('[wа-яА-Я]') ||
                inputValue.match('[ЁёА-я]') ||
                inputValue.match('[a-z]|[A-Z]') ||
                inputValue.match(/[-@#!$%\\^&*()_£¬'+|~=`{}\[\]:";<>.?\/]/)
            ) {
                inputValue = this._checkInput(inputValue);
            }
            const precision: number = this.getPrecision(maskExpression);
            let strForSep: string;
            if (maskExpression.startsWith(Separators.SEPARATOR)) {
                if (
                    inputValue.includes(',') &&
                    inputValue.endsWith(',') &&
                    inputValue.indexOf(',') !== inputValue.lastIndexOf(',')
                ) {
                    inputValue = inputValue.substring(0, inputValue.length - 1);
                }
                inputValue = inputValue.replace('.', ' ');
            }
            if (maskExpression.startsWith(Separators.DOT_SEPARATOR)) {
                if (
                    inputValue.indexOf('.') !== -1 &&
                    inputValue.indexOf('.') === inputValue.lastIndexOf('.') &&
                    (inputValue.indexOf('.') > 3 || inputValue.length < 6)
                ) {
                    inputValue = inputValue.replace('.', ',');
                }
                inputValue =
                    inputValue.length > 1 && inputValue[0] === '0' && inputValue[1] !== ','
                        ? inputValue.slice(1, inputValue.length)
                        : inputValue;
            }
            if (maskExpression.startsWith(Separators.COMMA_SEPARATOR)) {
                inputValue =
                    inputValue.length > 1 && inputValue[0] === '0' && inputValue[1] !== '.'
                        ? inputValue.slice(1, inputValue.length)
                        : inputValue;
            }
            if (maskExpression.startsWith(Separators.SEPARATOR)) {
                if (inputValue.match(/[@#!$%^&*()_+|~=`{}\[\]:.";<>?\/]/)) {
                    inputValue = inputValue.substring(0, inputValue.length - 1);
                }
                inputValue = this.checkInputPrecision(inputValue, precision, ',');
                strForSep = inputValue.replace(/\s/g, '');
                result = this.separator(strForSep, ' ', ',', precision);
            } else if (maskExpression.startsWith(Separators.DOT_SEPARATOR)) {
                if (inputValue.match(/[@#!$%^&*()_+|~=`{}\[\]:\s";<>?\/]/)) {
                    inputValue = inputValue.substring(0, inputValue.length - 1);
                }
                inputValue = this.checkInputPrecision(inputValue, precision, ',');
                strForSep = inputValue.replace(/\./g, '');
                result = this.separator(strForSep, '.', ',', precision);
            } else if (maskExpression.startsWith(Separators.COMMA_SEPARATOR)) {
                strForSep = inputValue.replace(/,/g, '');
                result = this.separator(strForSep, ',', '.', precision);
            }

            const commaShift: number = result.indexOf(',') - inputValue.indexOf(',');
            const shiftStep: number = result.length - inputValue.length;

            if (shiftStep > 0 && result[position] !== ',') {
                backspaceShift = true;
                let _shift: number = 0;
                do {
                    this._shift.add(position + _shift);
                    _shift++;
                } while (_shift < shiftStep);
            } else if (
                (commaShift !== 0 && position > 0 && !(result.indexOf(',') >= position && position > 3)) ||
                (!(result.indexOf('.') >= position && position > 3) && shiftStep <= 0)
            ) {
                this._shift.clear();
                backspaceShift = true;
                shift = shiftStep;
                position += shiftStep;
                this._shift.add(position);
            } else {
                this._shift.clear();
            }
        } else {
            for (
                // tslint:disable-next-line
                let i: number = 0, inputSymbol: string = inputArray[0];
                i < inputArray.length;
                i++, inputSymbol = inputArray[i]
            ) {
                if (cursor === maskExpression.length) {
                    break;
                }
                if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) && maskExpression[cursor + 1] === '?') {
                    result += inputSymbol;
                    cursor += 2;
                } else if (
                    maskExpression[cursor + 1] === '*' &&
                    multi &&
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2])
                ) {
                    result += inputSymbol;
                    cursor += 3;
                    multi = false;
                } else if (
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor]) &&
                    maskExpression[cursor + 1] === '*'
                ) {
                    result += inputSymbol;
                    multi = true;
                } else if (
                    maskExpression[cursor + 1] === '?' &&
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2])
                ) {
                    result += inputSymbol;
                    cursor += 3;
                } else if (
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor]) ||
                    (this.hiddenInput &&
                        this.maskAvailablePatterns[maskExpression[cursor]] &&
                        this.maskAvailablePatterns[maskExpression[cursor]].symbol === inputSymbol)
                ) {
                    if (maskExpression[cursor] === 'H') {
                        if (Number(inputSymbol) > 2) {
                            cursor += 1;
                            const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                                ? inputArray.length
                                : cursor;
                            this._shift.add(shiftStep + this.prefix.length || 0);
                            i--;
                            continue;
                        }
                    }
                    if (maskExpression[cursor] === 'h') {
                        if (result === '2' && Number(inputSymbol) > 3) {
                            continue;
                        }
                    }
                    if (maskExpression[cursor] === 'm') {
                        if (Number(inputSymbol) > 5) {
                            cursor += 1;
                            const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                                ? inputArray.length
                                : cursor;
                            this._shift.add(shiftStep + this.prefix.length || 0);
                            i--;
                            continue;
                        }
                    }
                    if (maskExpression[cursor] === 's') {
                        if (Number(inputSymbol) > 5) {
                            cursor += 1;
                            const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                                ? inputArray.length
                                : cursor;
                            this._shift.add(shiftStep + this.prefix.length || 0);
                            i--;
                            continue;
                        }
                    }
                    if (maskExpression[cursor] === 'd') {
                        if (Number(inputSymbol) > 3) {
                            cursor += 1;
                            const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                                ? inputArray.length
                                : cursor;
                            this._shift.add(shiftStep + this.prefix.length || 0);
                            i--;
                            continue;
                        }
                    }
                    if (maskExpression[cursor - 1] === 'd') {
                        if (Number(inputValue.slice(cursor - 1, cursor + 1)) > 31) {
                            continue;
                        }
                    }
                    if (maskExpression[cursor] === 'M') {
                        if (Number(inputSymbol) > 1) {
                            cursor += 1;
                            const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                                ? inputArray.length
                                : cursor;
                            this._shift.add(shiftStep + this.prefix.length || 0);
                            i--;
                            continue;
                        }
                    }
                    if (maskExpression[cursor - 1] === 'M') {
                        if (Number(inputValue.slice(cursor - 1, cursor + 1)) > 12) {
                            continue;
                        }
                    }
                    result += inputSymbol;
                    cursor++;
                } else if (this.maskSpecialCharacters.indexOf(maskExpression[cursor]) !== -1) {
                    result += maskExpression[cursor];
                    cursor++;
                    const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                        ? inputArray.length
                        : cursor;
                    this._shift.add(shiftStep + this.prefix.length || 0);
                    i--;
                } else if (
                    this.maskSpecialCharacters.indexOf(inputSymbol) > -1 &&
                    this.maskAvailablePatterns[maskExpression[cursor]] &&
                    this.maskAvailablePatterns[maskExpression[cursor]].optional
                ) {
                    cursor++;
                    i--;
                } else if (
                    this.maskExpression[cursor + 1] === '*' &&
                    this._findSpecialChar(this.maskExpression[cursor + 2]) &&
                    this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] &&
                    multi
                ) {
                    cursor += 3;
                    result += inputSymbol;
                } else if (
                    this.maskExpression[cursor + 1] === '?' &&
                    this._findSpecialChar(this.maskExpression[cursor + 2]) &&
                    this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] &&
                    multi
                ) {
                    cursor += 3;
                    result += inputSymbol;
                } else if (
                    this.showMaskTyped &&
                    this.maskSpecialCharacters.indexOf(inputSymbol) < 0
                    && inputSymbol !== '_'
                ) {
                    stepBack = true;
                }
            }
        }
        if (
            result.length + 1 === maskExpression.length &&
            this.maskSpecialCharacters.indexOf(maskExpression[maskExpression.length - 1]) !== -1
        ) {
            result += maskExpression[maskExpression.length - 1];
        }

        let newPosition: number = position + 1;

        while (this._shift.has(newPosition)) {
            shift++;
            newPosition++;
        }

        let actualShift: number = this._shift.has(position) ? shift : 0;
        if (stepBack) {
            actualShift--;
        }

        cb(actualShift, backspaceShift);
        if (shift < 0) {
            this._shift.clear();
        }
        let res: string = this.suffix ? `${this.prefix}${result}${this.suffix}` : `${this.prefix}${result}`;
        if (result.length === 0) {
            res = `${this.prefix}${result}`;
        }
        return res;
    }
    public _findSpecialChar(inputSymbol: string): undefined | string {
        return this.maskSpecialCharacters.find((val: string) => val === inputSymbol);
    }

    protected _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
        this.maskAvailablePatterns = this.customPattern ? this.customPattern : this.maskAvailablePatterns;
        return (
            this.maskAvailablePatterns[maskSymbol] &&
            this.maskAvailablePatterns[maskSymbol].pattern &&
            this.maskAvailablePatterns[maskSymbol].pattern.test(inputSymbol)
        );
    }

    private separator = (str: string, char: string, decimalChar: string, precision: number) => {
        str += '';
        const x: string[] = str.split(decimalChar);
        const decimals: string = x.length > 1 ? `${decimalChar}${x[1]}` : '';
        let res: string = x[0];
        const rgx: RegExp = /(\d+)(\d{3})/;
        while (rgx.test(res)) {
            res = res.replace(rgx, '$1' + char + '$2');
        }
        if (precision === undefined) {
            return res + decimals;
        } else if (precision === 0) {
            return res;
        }
        return res + decimals.substr(0, precision + 1);
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

    private checkInputPrecision = (inputValue: string, precision: number, decimalMarker: string): string => {
        if (precision < Infinity) {
            let precisionRegEx: RegExp;

            if (decimalMarker === '.') {
                precisionRegEx = new RegExp(`\\.\\d{${precision}}.*$`);
            } else {
                precisionRegEx = new RegExp(`,\\d{${precision}}.*$`);
            }

            const precisionMatch: RegExpMatchArray | null = inputValue.match(precisionRegEx);
            if (precisionMatch && precisionMatch[0].length - 1 > precision) {
                inputValue = inputValue.substring(0, inputValue.length - 1);
            } else if (precision === 0 && inputValue.endsWith(decimalMarker)) {
                inputValue = inputValue.substring(0, inputValue.length - 1);
            }
        }
        return inputValue;
    };

    private _checkInput(str: string): string {
        return str
            .split('')
            .filter((i: string) => i.match('\\d') || i === '.' || i === ',')
            .join('');
    }
    // tslint:disable-next-line: max-file-line-count
}
