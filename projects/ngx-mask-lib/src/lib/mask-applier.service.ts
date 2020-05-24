import { Inject, Injectable } from '@angular/core';

import { config, IConfig } from './config';

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
  public thousandSeparator!: IConfig['thousandSeparator'];
  public decimalMarker!: IConfig['decimalMarker'];
  public customPattern!: IConfig['patterns'];
  public ipError?: boolean;
  public cpfCnpjError?: boolean;
  public showMaskTyped!: IConfig['showMaskTyped'];
  public placeHolderCharacter!: IConfig['placeHolderCharacter'];
  public validation: IConfig['validation'];
  public separatorLimit: IConfig['separatorLimit'];
  public allowNegativeNumbers: IConfig['allowNegativeNumbers'];

  private _shift!: Set<number>;

  public constructor(@Inject(config) protected _config: IConfig) {
    this._shift = new Set();
    this.clearIfNotMatch = this._config.clearIfNotMatch;
    this.dropSpecialCharacters = this._config.dropSpecialCharacters;
    this.maskSpecialCharacters = this._config.specialCharacters;
    this.maskAvailablePatterns = this._config.patterns;
    this.prefix = this._config.prefix;
    this.suffix = this._config.suffix;
    this.thousandSeparator = this._config.thousandSeparator;
    this.decimalMarker = this._config.decimalMarker;
    this.hiddenInput = this._config.hiddenInput;
    this.showMaskTyped = this._config.showMaskTyped;
    this.placeHolderCharacter = this._config.placeHolderCharacter;
    this.validation = this._config.validation;
    this.separatorLimit = this._config.separatorLimit;
    this.allowNegativeNumbers = this._config.allowNegativeNumbers;
  }

  public applyMaskWithPattern(inputValue: string, maskAndPattern: [string, IConfig['patterns']]): string {
    const [mask, customPattern] = maskAndPattern;
    this.customPattern = customPattern;
    return this.applyMask(inputValue, mask);
  }
  public applyMask(inputValue: string, maskExpression: string, position: number = 0, cb: Function = () => {}): string {
    if (inputValue === undefined || inputValue === null || maskExpression === undefined) {
      return '';
    }
    let cursor = 0;
    let result = '';
    let multi = false;
    let backspaceShift = false;
    let shift = 1;
    let stepBack = false;
    if (inputValue.slice(0, this.prefix.length) === this.prefix) {
      inputValue = inputValue.slice(this.prefix.length, inputValue.length);
    }
    if (!!this.suffix && inputValue.endsWith(this.suffix)) {
      inputValue = inputValue.slice(0, inputValue.length - this.suffix.length);
    }
    const inputArray: string[] = inputValue.toString().split('');
    if (maskExpression === 'IP') {
      this.ipError = !!(inputArray.filter((i: string) => i === '.').length < 3 && inputArray.length < 7);
      maskExpression = '099.099.099.099';
    }
    const arr: string[] = [];
    for (let i = 0; i < inputValue.length; i++) {
      if (inputValue[i].match('\\d')) {
        arr.push(inputValue[i]);
      }
    }
    if (maskExpression === 'CPF_CNPJ') {
      this.cpfCnpjError = !!(arr.length !== 11 && arr.length !== 14);
      if (arr.length > 11) {
        maskExpression = '00.000.000/0000-00';
      } else {
        maskExpression = '000.000.000-00';
      }
    }
    if (maskExpression.startsWith('percent')) {
      if (inputValue.match('[a-z]|[A-Z]') || inputValue.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/]/)) {
        inputValue = this._stripToDecimal(inputValue);
        const precision: number = this.getPrecision(maskExpression);
        inputValue = this.checkInputPrecision(inputValue, precision, '.');
      }
      if (inputValue.indexOf('.') > 0 && !this.percentage(inputValue.substring(0, inputValue.indexOf('.')))) {
        const base: string = inputValue.substring(0, inputValue.indexOf('.') - 1);
        inputValue = `${base}${inputValue.substring(inputValue.indexOf('.'), inputValue.length)}`;
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
        inputValue.match(/[-@#!$%\\^&*()_£¬'+|~=`{}\[\]:";<>.?\/]/) ||
        inputValue.match('[^A-Za-z0-9,]')
      ) {
        inputValue = this._stripToDecimal(inputValue);
      }

      inputValue =
        inputValue.length > 1 && inputValue[0] === '0' && inputValue[1] !== this.decimalMarker
          ? inputValue.slice(1, inputValue.length)
          : inputValue;

      // TODO: we had different rexexps here for the different cases... but tests dont seam to bother - check this
      //  separator: no COMMA, dot-sep: no SPACE, COMMA OK, comma-sep: no SPACE, COMMA OK

      const thousandSeperatorCharEscaped: string = this._charToRegExpExpression(this.thousandSeparator);
      const decimalMarkerEscaped: string = this._charToRegExpExpression(this.decimalMarker);
      const invalidChars: string = '@#!$%^&*()_+|~=`{}\\[\\]:\\s,\\.";<>?\\/'
        .replace(thousandSeperatorCharEscaped, '')
        .replace(decimalMarkerEscaped, '');

      const invalidCharRegexp: RegExp = new RegExp('[' + invalidChars + ']');

      if (inputValue.match(invalidCharRegexp)) {
        inputValue = inputValue.substring(0, inputValue.length - 1);
      }

      const precision: number = this.getPrecision(maskExpression);
      inputValue = this.checkInputPrecision(inputValue, precision, this.decimalMarker);
      const strForSep: string = inputValue.replace(new RegExp(thousandSeperatorCharEscaped, 'g'), '');
      result = this._formatWithSeparators(strForSep, this.thousandSeparator, this.decimalMarker, precision);

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
        } else if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) && maskExpression[cursor + 1] === '*') {
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
              const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
              this._shift.add(shiftStep + this.prefix.length || 0);
              i--;
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
              const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
              this._shift.add(shiftStep + this.prefix.length || 0);
              i--;
              continue;
            }
          }
          if (maskExpression[cursor] === 's') {
            if (Number(inputSymbol) > 5) {
              cursor += 1;
              const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
              this._shift.add(shiftStep + this.prefix.length || 0);
              i--;
              continue;
            }
          }
          const daysCount = 31;
          if (maskExpression[cursor] === 'd') {
            if (Number(inputValue.slice(cursor, cursor + 2)) > daysCount || inputValue[cursor + 1] === '/') {
              cursor += 1;
              const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
              this._shift.add(shiftStep + this.prefix.length || 0);
              i--;
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
              (Number(inputValue.slice(cursor, cursor + 2)) > monthsCount || inputValue[cursor + 1] === '/');
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

            if (withoutDays || day1monthInput || day2monthInput || day1monthPaste || day2monthPaste) {
              cursor += 1;
              const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
              this._shift.add(shiftStep + this.prefix.length || 0);
              i--;
              continue;
            }
          }
          result += inputSymbol;
          cursor++;
        } else if (this.maskSpecialCharacters.indexOf(maskExpression[cursor]) !== -1) {
          result += maskExpression[cursor];
          cursor++;
          const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
          this._shift.add(shiftStep + this.prefix.length || 0);
          i--;
        } else if (
          this.maskSpecialCharacters.indexOf(inputSymbol) > -1 &&
          this.maskAvailablePatterns[maskExpression[cursor]] &&
          this.maskAvailablePatterns[maskExpression[cursor]].optional
        ) {
          if (
            !!inputArray[cursor] &&
            maskExpression !== '099.099.099.099' &&
            maskExpression !== '000.000.000-00' &&
            maskExpression !== '00.000.000/0000-00'
          ) {
            result += inputArray[cursor];
          }
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
          this.maskSpecialCharacters.indexOf(inputSymbol) < 0 &&
          inputSymbol !== this.placeHolderCharacter
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
    let res = `${this.prefix}${result}${this.suffix}`;
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

  private _formatWithSeparators = (
    str: string,
    thousandSeparatorChar: string,
    decimalChar: string,
    precision: number
  ) => {
    const x: string[] = str.split(decimalChar);
    const decimals: string = x.length > 1 ? `${decimalChar}${x[1]}` : '';
    let res: string = x[0];
    const separatorLimit: string = this.separatorLimit.replace(/\s/g, '');
    if (separatorLimit && +separatorLimit) {
      if (res[0] === '-') {
        res = `-${res.slice(1, res.length).slice(0, separatorLimit.length)}`;
      } else {
        res = res.slice(0, separatorLimit.length);
      }
    }
    const rgx: RegExp = /(\d+)(\d{3})/;

    while (thousandSeparatorChar && rgx.test(res)) {
      res = res.replace(rgx, '$1' + thousandSeparatorChar + '$2');
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

  private checkInputPrecision = (
    inputValue: string,
    precision: number,
    decimalMarker: IConfig['decimalMarker']
  ): string => {
    if (precision < Infinity) {
      const precisionRegEx: RegExp = new RegExp(this._charToRegExpExpression(decimalMarker) + `\\d{${precision}}.*$`);

      const precisionMatch: RegExpMatchArray | null = inputValue.match(precisionRegEx);
      if (precisionMatch && precisionMatch[0].length - 1 > precision) {
        inputValue = inputValue.substring(0, inputValue.length - 1);
      } else if (precision === 0 && inputValue.endsWith(decimalMarker)) {
        inputValue = inputValue.substring(0, inputValue.length - 1);
      }
    }
    return inputValue;
  };

  private _stripToDecimal(str: string): string {
    return str
      .split('')
      .filter((i: string, idx: number) => {
        return i.match('^-?\\d') || i === '.' || i === ',' || (i === '-' && idx === 0 && this.allowNegativeNumbers);
      })
      .join('');
  }

  private _charToRegExpExpression(char: string): string {
    if (char) {
      const charsToEscape = '[\\^$.|?*+()';
      return char === ' ' ? '\\s' : charsToEscape.indexOf(char) >= 0 ? '\\' + char : char;
    }
    return char;
  }
}
