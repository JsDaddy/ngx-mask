import {
  Directive, ElementRef, forwardRef, HostListener, Input, OnInit, Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const resolvedPromise: Promise<null> = Promise.resolve(null);

/** TODO(custom special characters) */
/** TODO(custom patterns) */
/** TODO(cursor position) */

@Directive({
  selector: '[mask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskDirective),
      multi: true
    }
  ]
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

  public constructor(private _elementRef: ElementRef, private _renderer: Renderer2 ) {
    this.modelWithSpecialCharacters = true;
  }

  ngOnInit(): void {
    resolvedPromise.then(() => this._applyValueChanges());
  }

  @Input('mask')
  public set maskExpression(value: string) {
    if (!value) {
      return;
    }
    this._maskExpression = value;
  }

  @Input('specialCharacters')
  public get modelWithSpecialCharacters(): boolean {
    return this._modelWithSpecialCharacters;
  }

  public set modelWithSpecialCharacters(value: boolean) {
    this._modelWithSpecialCharacters = value;
  }

  @HostListener('input')
  public onInput(): void {
    this._applyValueChanges();
  }

  /** It writes the value in the input */
  public writeValue(obj: any): void {
    if (!obj) { return; }
    this._elementRef.nativeElement.value = this._applyMask(obj, this._maskExpression);
  }

  /** It updates the value when changes occurr */
  public registerOnChange(fn: any): void {
    this._onChange = fn;
    return;
  }

  /* TODO */
  public registerOnTouched(fn: any): void { }

  /** It disables the input element */
  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this._renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'true');
    } else {
      this._renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'false');
    }
  }

  private _onChange = (_: any) => { };

  private _applyMask(inputValue: string, maskExpression: string): string {
    let cursor: number = 0;
    let result: string = '';
    const inputArray: string[] = inputValue.split('');

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

  /** Remove mask from value, based on specialCharacters */
  private _removeMask(value: string): string {
    if (!value) { return value; }
    return value.replace(/(\/|\.|-)/gi, '');
  }

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol === maskSymbol
      || this._maskAwaliablePatterns[maskSymbol]
      && this._maskAwaliablePatterns[maskSymbol].test(inputSymbol);
  }

  /** It applies the mask in the input and updates the control's value. */
  private _applyValueChanges(): void {
    const val: string = this._elementRef.nativeElement.value;
    const maskedInput: string = this._applyMask(val, this._maskExpression);

    this._elementRef.nativeElement.value = maskedInput;

    if (this.modelWithSpecialCharacters === true) {
      this._onChange(maskedInput);
    } else {
      this._onChange(this._removeMask(val));
    }
  }

}
