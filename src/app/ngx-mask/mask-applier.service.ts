import { Inject, Injectable } from '@angular/core';
import { config, IConfig } from './config';

@Injectable()
export class MaskApplierService {

  public maskSpecialCharacters: IConfig['specialCharacters'];
  public maskAvailablePatterns: IConfig['patterns'];

  private _shift: Set<number>;

  public constructor(
    @Inject(config) protected _config: IConfig
  ) {
    this._shift = new Set();
    this.maskSpecialCharacters = this._config!.specialCharacters;
    this.maskAvailablePatterns = this._config.patterns;
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
    let result: string = '';
    let multi: boolean = false;

    const inputArray: string[] = inputValue.toString().split('');

    // tslint:disable-next-line
    for (let i: number = 0, inputSymbol: string = inputArray[0]; i < inputArray.length; i++, inputSymbol = inputArray[i]) {
      if (cursor === maskExpression.length) {
        break;
      }

      if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) && maskExpression[cursor + 1] === '?') {
        result += inputSymbol;
        cursor += 2;
      } else if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) && maskExpression[cursor + 1] === '*') {
        result += inputSymbol;
        multi = true;
      } else if (
        maskExpression[cursor + 1] === '*' && multi
        && this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2])
      ) {
        result += inputSymbol;
        cursor += 3;
        multi = false;
      } else if (maskExpression[cursor + 1] === '?' && this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2])) {
        result += inputSymbol;
        cursor += 3;
      } else if (this._checkSymbolMask(inputSymbol, maskExpression[cursor])) {
        result += inputSymbol;
        cursor++;
      } else if (this.maskSpecialCharacters.indexOf(maskExpression[cursor]) !== -1) {
        result += maskExpression[cursor];
        cursor++;
        const shiftStep: number = /\*|\?/g.test(maskExpression.slice(0, cursor))
          ? inputArray.length
          : cursor;
        this._shift.add(shiftStep);
        i--;
      } else if (this.maskSpecialCharacters.indexOf(inputSymbol) > -1
        && this.maskAvailablePatterns[maskExpression[cursor]]
        && this.maskAvailablePatterns[maskExpression[cursor]].optional) {
        cursor++;
        i--;
      }
    }

    if (result.length + 1 === maskExpression.length
      && this.maskSpecialCharacters.indexOf(maskExpression[maskExpression.length - 1]) !== -1) {
      result += maskExpression[maskExpression.length - 1];
    }

    let shift: number = 1;
    let newPosition: number = position + 1;

    while (this._shift.has(newPosition)) {
      shift++;
      newPosition++;
    }

    cb(this._shift.has(position) ? shift : 0);

    return result;
  }

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol === maskSymbol
      || this.maskAvailablePatterns[maskSymbol]
      && this.maskAvailablePatterns[maskSymbol].pattern
      && this.maskAvailablePatterns[maskSymbol].pattern.test(inputSymbol);
  }
}
