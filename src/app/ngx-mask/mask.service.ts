import { Inject, Injectable } from '@angular/core';
import { config } from './config';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class MaskService {

  public dropSpecialCharacters: boolean;
  public clearIfNotMatch: boolean;
  public maskExpression: string = '';
  private _maskSpecialCharacters: string[];
  private _maskAvaliablePatterns: { [key: string]: RegExp };
  private _regExpForRemove: RegExp;

  public constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(config) private _config: Config,
  ) {
    this.clearIfNotMatch = this._config.clearIfNotMatch;
    this.dropSpecialCharacters = this._config.dropSpecialCharacters;
    this._maskSpecialCharacters = this._config.specialCharacters;
    this._maskAvaliablePatterns = this._config.patterns;
    this._regExpForRemove = new RegExp(this._maskSpecialCharacters
      .map((item: string) => `\\${item}`)
      .join('|'), 'gi');
  }

  // tslint:disable-next-line
  public onChange = (_: any) => { };

  public onTouch = () => { };

  public applyMask(inputValue: string, maskExpression: string): string {
    if (inputValue === undefined || inputValue === null) {
      return '';
    }

    let cursor: number = 0;
    let result: string = '';
    const inputArray: string[] = inputValue.toString()
      .split('');

    // tslint:disable-next-line
    for (let i: number = 0, inputSymbol: string = inputArray[0]; i
    < inputArray.length; i++ , inputSymbol = inputArray[i]) {
      if (result.length === maskExpression.length) {
        break;
      }

      if (this._checkSymbolMask(inputSymbol, maskExpression[cursor])) {
        result += inputSymbol;
        cursor++;
      } else if (this._maskSpecialCharacters.indexOf(maskExpression[cursor]) !== -1) {
        result += maskExpression[cursor];
        cursor++;
        i--;
      } else if (maskExpression[cursor] === '9') {
        cursor++;
        i--;
      }
    }
    if (result.length + 1 === maskExpression.length
      && this._maskSpecialCharacters.indexOf(maskExpression[maskExpression.length - 1]) !== -1) {
      result += maskExpression[maskExpression.length - 1];
    }
    return result;
  }

  public applyValueChanges(element: HTMLInputElement): void {
    const val: string = element.value;
    const maskedInput: string = this.applyMask(val, this.maskExpression);

    element.value = maskedInput;

    if (this.dropSpecialCharacters === true) {
      this.onChange(this._removeMask(maskedInput));
    } else {
      this.onChange(maskedInput);
    }

    if (element !== this.document.activeElement) {
      this.clearIfNotMatchFn(element);
    }
  }

  public clearIfNotMatchFn(element: HTMLInputElement): void {
    if (this.clearIfNotMatch === true && this.maskExpression.length
      !== element.value.length) {
      element.value = '';
    }
  }

  private _removeMask(value: string): string {
    if (!value) {
      return value;
    }
    return value.replace(this._regExpForRemove, '');
  }

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol === maskSymbol
      || this._maskAvaliablePatterns[maskSymbol]
      && this._maskAvaliablePatterns[maskSymbol].test(inputSymbol);
  }
}
