import {
  Directive, ElementRef, forwardRef, HostListener, Inject, Input, OnInit,
  Renderer
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const resolvedPromise: Promise<null> = Promise.resolve(null);

/** TODO(custom special characters) */
/** TODO(custom patterns) */
/** TODO(cursor position) */
/** TODO(create special characters object to specialCharacters directive) */

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
  private _clearIfNotMatch: boolean;
  private _maskExpression: string;
  private _maskSpecialCharacters: string[] = ['/', '(', ')', '.', ':', '-', ' ', '+'];
  private _maskAwaliablePatterns: { [key: string]: RegExp } = {
    '0': /\d/,
    '9': /\d/,
    'A': /[a-zA-Z0-9]/,
    'S': /[a-zA-Z]/
  };

  public constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    @Inject(DOCUMENT) private document: any
  ) {
    this.modelWithSpecialCharacters = true;
    this._clearIfNotMatch = false;
  }

  public ngOnInit(): void {
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

  @Input('clearIfNotMatch')
  public get clearIfNotMatch(): boolean {
    return this._clearIfNotMatch;
  }

  public set clearIfNotMatch(value: boolean) {
    this._clearIfNotMatch = value;
  }

  @HostListener('input')
  public onInput(): void {
    this._applyValueChanges();
  }

  @HostListener('blur')
  public onBlur(): void {
    this._clearIfNotMatchFn();
    this._applyValueChanges();
    this._onTouch();
  }

  /** It writes the value in the input */
  public writeValue(inputValue: string): void {
    if (!inputValue) {
      return;
    }
    this._elementRef.nativeElement.value = this._applyMask(inputValue, this._maskExpression);
  }

  // tslint:disable-next-line
  public registerOnChange(fn: any): void {
    this._onChange = fn;
    return;
  }

  /* TODO */
  // tslint:disable-next-line
  public registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  /** It disables the input element */
  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'disabled', 'true');
      return;
    }
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'disabled', 'false');
  }

  // tslint:disable-next-line
  private _onChange = (_: any) => { };

  private _onTouch = () => { };

  private _applyMask(inputValue: string, maskExpression: string): string {
    if (inputValue === undefined || inputValue === null) {
      return '';
    }

    let cursor: number = 0;
    let result: string = '';
    const inputArray: string[] = inputValue.toString().split('');

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
    if (!value) {
      return value;
    }
    return value.replace(/(\/|\.|-|\(|\)|:| |\+)/gi, '');
  }

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol === maskSymbol
      || this._maskAwaliablePatterns[maskSymbol]
      && this._maskAwaliablePatterns[maskSymbol].test(inputSymbol);
  }

  private _clearIfNotMatchFn(): void {
    if (this.clearIfNotMatch === true && this._maskExpression.length
      !== this._elementRef.nativeElement.value.length) {
      this._elementRef.nativeElement.value = '';
    }
  }

  /** It applies the mask in the input and updates the control's value. */
  private _applyValueChanges(): void {
    const val: string = this._elementRef.nativeElement.value;
    const maskedInput: string = this._applyMask(val, this._maskExpression);

    this._elementRef.nativeElement.value = maskedInput;

    if (this.modelWithSpecialCharacters === true) {
      this._onChange(maskedInput);
    } else {
      this._onChange(this._removeMask(maskedInput));
    }

    if (this._elementRef.nativeElement !== this.document.activeElement) {
      this._clearIfNotMatchFn();
    }
  }

}
