import {
  Directive, ElementRef, forwardRef, HostListener, Input, OnInit, Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const resolvedPromise: Promise<null> = Promise.resolve(null);

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

  @Input('mask')
  public set maskExpression(value: string) {
    if (!value) {
      return;
    }
    this._maskExpression = value;
  }

  public constructor(
    private _elementRef: ElementRef,
    private renderer: Renderer2
  ) {
  }

  @Input('specialCharacters')
  public set modelWithSpecialCharacters(value: boolean) {
    this._modelWithSpecialCharacters = value;
  }

  @HostListener('input')
  public onInput(): void {
    const maskedInput: string = this._applyMask(this._elementRef.nativeElement.value, this._maskExpression);
    this._elementRef.nativeElement.value = maskedInput;
    if (this._modelWithSpecialCharacters === true) {
      return this.OnChange(maskedInput);
    }
    this.OnChange(this._removeMask(this._elementRef.nativeElement.value));
  }


  public ngOnInit(): void {
    this._modelWithSpecialCharacters = true;
    resolvedPromise.then(() => {
      if (this._modelWithSpecialCharacters === true) {
        return this.OnChange(this._applyMask(this._elementRef.nativeElement.value, this._maskExpression));
      }
      this.OnChange(this._removeMask(this._elementRef.nativeElement.value));
    });
  }

  /** CONTROL VALUE ACESSOR IMPLEMENTATION */
  public writeValue(obj: string): void {
    if (!obj) { return; }
    this._elementRef.nativeElement.value = this._applyMask(obj, this._maskExpression);
  }

  // tslint:disable-next-line
  public registerOnChange(fn: (_: any) => void): void {
    this.OnChange = fn;
    return;
  }

  // tslint:disable-next-line
  public registerOnTouched(fn: (_: any) => void): void { /* TODO */ }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      return this.renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'true');
    }
    this.renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'false');
  }

  // tslint:disable-next-line
  private OnChange(_: any): void { }

  private _applyMask(inputValue: string, maskExpression: string): string {
    let cursor: number = 0;
    let result: string = '';
    const inputArray: string[] = inputValue.split('');
    // tslint:disable-next-line
    for (let i: number = 0, inputSymbol: string = inputArray[0]; i
    < inputArray.length; i++, inputSymbol = inputArray[i]) {
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

  private _removeMask(value: string): string {
    if (!value) { return value; }
    return value.replace(/(\/|\.|-)/gi, '');
  }

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol === maskSymbol
      || this._maskAwaliablePatterns[maskSymbol]
      && this._maskAwaliablePatterns[maskSymbol].test(inputSymbol);
  }

  private isValidValue(): void {
    /**
     * TODO(verificar se o valor é válido ou não)
     * */
  }

}
