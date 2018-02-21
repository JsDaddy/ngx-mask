import { ElementRef, EventEmitter, Inject, Injectable, Renderer2 } from '@angular/core';
import { config, IConfig } from './config';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor } from '@angular/forms';
import 'rxjs/add/operator/take';

@Injectable()
export class MaskService implements ControlValueAccessor {

  public dropSpecialCharacters: IConfig['dropSpecialCharacters'];
  public clearIfNotMatch: IConfig['clearIfNotMatch'];
  public maskExpression: string = '';
  public maskSpecialCharacters: IConfig['specialCharacters'];
  public maskAvailablePatterns: IConfig['patterns'];
  public maskSetter$$: EventEmitter<string> = new EventEmitter();

  private _regExpForRemove: RegExp;
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
    this._regExpForRemove = new RegExp(this.maskSpecialCharacters
      .map((item: string) => `\\${item}`)
      .join('|'), 'gi');

    this._formElement = this._elementRef.nativeElement;
  }

  public applyMask(inputValue: string, maskExpression: string, position: number = 0, cb: Function = () => { }): string {
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
      } else if (this.maskSpecialCharacters.indexOf(maskExpression[cursor]) !== -1) {
        result += maskExpression[cursor];
        cursor++;
        this._shift.add(cursor);
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

  public applyValueChanges(position: number = 0, cb: Function = () => { }): void {
    const maskedInput: string = this.applyMask(this._formElement.value, this.maskExpression, position, cb);

    this._formElement.value = maskedInput;

    this.dropSpecialCharacters === true
      ? this.onChange(this._removeMask(maskedInput))
      : this.onChange(maskedInput);

    if (this._formElement === this.document.activeElement) {
      return;
    }
    this.clearIfNotMatchFn();
  }

  public clearIfNotMatchFn(): void {
    if (
      this.clearIfNotMatch === true && this.maskExpression.length
      !== this._formElement.value.length) {
      this._formElementProperty = ['value', ''];
    }
  }


  /** It writes the value in the input */
  public async writeValue(inputValue: string): Promise<void> {
    if (inputValue === undefined) {
      return;
    }
    const maskExpression: string = this.maskExpression || await this.maskSetter$$.take(1)
      .toPromise();

    inputValue
      ? this._formElementProperty = ['value', this.applyMask(inputValue, maskExpression)]
      : this._formElementProperty = ['value', ''];
  }

  // tslint:disable-next-line
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // tslint:disable-next-line
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /** It disables the input element */
  public setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this._formElementProperty = ['disabled', 'true']
      : this._formElementProperty = ['disabled', 'false'];
  }

  private _removeMask(value: string): string {
    return value
      ? value.replace(this._regExpForRemove, '')
      : value;
  }

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol
      === maskSymbol
      || this.maskAvailablePatterns[maskSymbol] && this.maskAvailablePatterns[maskSymbol].pattern
      && this.maskAvailablePatterns[maskSymbol].pattern.test(inputSymbol);
  }

  private set _formElementProperty([name, value]: [string, string]) {
    this._renderer.setProperty(this._formElement, name, value);
  }

}
