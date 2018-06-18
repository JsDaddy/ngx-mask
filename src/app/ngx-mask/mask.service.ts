import { ElementRef, Inject, Injectable, Renderer2 } from '@angular/core';
import { config, IConfig } from './config';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class MaskService {

  public dropSpecialCharacters: IConfig['dropSpecialCharacters'];
  public showTemplate: IConfig['showTemplate'];
  public clearIfNotMatch: IConfig['clearIfNotMatch'];
  public maskExpression: string = '';
  public maskSpecialCharacters: IConfig['specialCharacters'];
  public maskAvailablePatterns: IConfig['patterns'];

  private _shift: Set<number>;
  private _formElement: HTMLInputElement;

  // tslint:disable-next-line
  public onChange = (_: any) => { };

  public onTouch = () => { };

  public constructor(
    // tslint:disable-next-line
    @Inject(DOCUMENT) private document: any,
    @Inject(config) private _config: IConfig,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
  ) {
    this._shift = new Set();
    this.clearIfNotMatch = this._config.clearIfNotMatch;
    this.dropSpecialCharacters = this._config.dropSpecialCharacters;
    this.maskSpecialCharacters = this._config!.specialCharacters;
    this.maskAvailablePatterns = this._config.patterns;

    this._formElement = this._elementRef.nativeElement;
  }

  public applyMask(inputValue: string, maskExpression: string, position: number = 0, cb: Function = () => { }): string {
    if (inputValue === undefined || inputValue === null || maskExpression === undefined) {
      return '';
    }

    let cursor: number = 0;
    let result: string = '';

    const inputArray: string[] = inputValue.toString()
      .split('');

    let multi: boolean = false;
    // tslint:disable-next-line
    for (let i: number = 0, inputSymbol: string = inputArray[0]; i
      < inputArray.length; i++ , inputSymbol = inputArray[i]) {
      if (cursor === maskExpression.length) {
        break;
      }

      if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) && maskExpression[cursor + 1] === '?') {
        result += inputSymbol;
        cursor += 2;
      } else if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) && maskExpression[cursor + 1] === '*') {
        result += inputSymbol;
        multi = true;
      } else if (maskExpression[cursor + 1] === '*' && multi && this._checkSymbolMask(
        inputSymbol,
        maskExpression[cursor + 2]
      )) {
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


    Array.isArray(this.dropSpecialCharacters)
      ? this.onChange(this._removeMask(result, this.dropSpecialCharacters))
      : this.dropSpecialCharacters === true
        ? this.onChange(this._removeMask(result, this.maskSpecialCharacters))
        : this.onChange(result);

    return result;
  }

  public applyValueChanges(position: number = 0, cb: Function = () => { }): void {
    const maskedInput: string = this.applyMask(this._formElement.value, this.maskExpression, position, cb);

    this._formElement.value = maskedInput;

    if (this._formElement === this.document.activeElement) {
      return;
    }
    this.clearIfNotMatchFn();
  }

  public clearIfNotMatchFn(): void {
    if (
      this.clearIfNotMatch === true && this.maskExpression.length
      !== this._formElement.value.length) {
      this.formElementProperty = ['value', ''];
    }
  }

  public set formElementProperty([name, value]: [string, string | boolean]) {
    this._renderer.setProperty(this._formElement, name, value);
  }

  private _removeMask(value: string, specialCharactersForRemove: string[]): string {
    return value
      ? value.replace(this._regExpForRemove(specialCharactersForRemove), '')
      : value;
  }

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol
      === maskSymbol
      || this.maskAvailablePatterns[maskSymbol] && this.maskAvailablePatterns[maskSymbol].pattern
      && this.maskAvailablePatterns[maskSymbol].pattern.test(inputSymbol);
  }


  private _regExpForRemove(specialCharactersForRemove: string[]): RegExp {
    return new RegExp(specialCharactersForRemove
      .map((item: string) => `\\${item}`)
      .join('|'), 'gi');
  }

}
