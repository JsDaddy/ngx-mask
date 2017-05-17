import { Directive, OnInit, Input, Output, HostListener,
  ElementRef, EventEmitter, forwardRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const resolvedPromise = Promise.resolve(null);

/** TODO(custom special characters) */
/** TODO(custom patterns) */
/** TODO(cursor position) */

@Directive({
  selector: '[mask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskDirective),
    multi: true
  }]
})
export class MaskDirective implements OnInit, ControlValueAccessor {

  private _modelWithSpecialCharacters: boolean;
  private _maskExpression: string;
  private _maskSpecialCharacters: string[] = ['/', '(', ')', '.', ':', '-', ' ', '+'];
  private _maskAwaliablePatterns: { [key: string]: RegExp } = {
    '0': /\d/,
    '9': /\d/,
    'A': /[a-zA-Z0-9]/,
    'S': /[a-zA-Z]/
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this._modelWithSpecialCharacters = true;
  }

  ngOnInit() {
    resolvedPromise.then(() => this.applyValueChanges());
  }

  @Input('mask')
  public set maskExpression(value: string) {
    if (!value) { return; }
    this._maskExpression = value;
  }

  @Input('specialCharacters')
  public set modelWithSpecialCharacters(value: boolean) {
    this._modelWithSpecialCharacters = value;
  }

  @HostListener('input')
  public onInput() {
    this.applyValueChanges();
  }

  private OnChange = (_: any) => { };

  private _applyMask(inputValue: string, maskExpression: string): string {
    let cursor = 0;
    let result = '';
    const inputArray = inputValue.split('');

    for (let i = 0, inputSymbol = inputArray[0]; i < inputArray.length; i++ , inputSymbol = inputArray[i]) {
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

  /** Remove mask from value, based on specialCharacters */
  private removeMask(value: string): string {
    if (!value) { return value; }
    return value.replace(/(\/|\.|-)/gi, '');
  }

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol === maskSymbol
      || this._maskAwaliablePatterns[maskSymbol] && this._maskAwaliablePatterns[maskSymbol].test(inputSymbol);
  }

  /** It applies the mask in the input and updates the control's value. */
  private applyValueChanges() {
    const val = this.el.nativeElement.value;
    const maskedInput = this._applyMask(val, this._maskExpression);

    this.el.nativeElement.value = maskedInput;

    if (this._modelWithSpecialCharacters === true) {
      this.OnChange(maskedInput);
    } else {
      this.OnChange(this.removeMask(val));
    }
  }

  /** It writes the value in the input */
  writeValue(obj: any): void {
    if (!obj) { return; }
    this.el.nativeElement.value = this._applyMask(obj, this._maskExpression);
  }

  /** It updates the value when changes occurr */
  registerOnChange(fn: any): void {
    this.OnChange = fn;
    return;
  }

  /* TODO */
  registerOnTouched(fn: any): void { }

  /** It disables the input element */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    } else {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'false');
    }
  }

}
