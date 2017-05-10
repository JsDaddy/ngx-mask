import { Directive, OnInit, Input, Output, HostListener,
  ElementRef, EventEmitter, forwardRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const resolvedPromise = Promise.resolve(null);

@Directive({
  selector: '[mask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskDirective),
    multi: true
  }]
})
export class MaskDirective implements OnInit, ControlValueAccessor {

  private _maskExpression: string;
  private _elementRef: ElementRef;
  private _maskSpecialCharacters: string[] = ['/', '(', ')', '.', ':', '-', ' ', '+'];
  private _maskAwaliablePatterns: {[key: string]: RegExp} = {
    '0': /\d/,
    '9': /\d/,
    'A': /[a-zA-Z0-9]/,
    'S': /[a-zA-Z]/
  };

  constructor(_elementRef: ElementRef, private renderer: Renderer2) {
    this._elementRef = _elementRef;
  }

  ngOnInit() {
    resolvedPromise.then(() => {
      this.OnChange(this._elementRef.nativeElement.value);
    });
  }

  private OnChange = (_: any) => { };

  @HostListener('input')
  public onInput() {
    this._elementRef.nativeElement.value = this._applyMask(this._elementRef.nativeElement.value, this._maskExpression);
    this.OnChange(this._elementRef.nativeElement.value);
  }

  @Input('mask')
  public set maskExpression(value: string) {
    if (!value) { return; }
    this._maskExpression = value;
  }

  private _applyMask(inputValue: string, maskExpression: string): string {
    let cursor = 0;
    let result = '';
    const inputArray = inputValue.split('');

    for (let i = 0, inputSymbol = inputArray[0]; i < inputArray.length;  i++, inputSymbol = inputArray[i]) {
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

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol === maskSymbol
      || this._maskAwaliablePatterns[maskSymbol] && this._maskAwaliablePatterns[maskSymbol].test(inputSymbol);
  }

  private isValidValue() {
    /** TODO(verificar se o valor é válido ou não) */
  }

  /** CONTROL VALUE ACESSOR IMPLEMENTATION */
  writeValue(obj: any): void {
    if (!obj) { return; }
    this._elementRef.nativeElement.value = this._applyMask(obj, this._maskExpression);
  }

  registerOnChange(fn: any): void {
    this.OnChange = fn;
    return;
  }

  registerOnTouched(fn: any): void { /* TODO */ }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'true');
    } else {
      this.renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'false');
    }
  }

}
