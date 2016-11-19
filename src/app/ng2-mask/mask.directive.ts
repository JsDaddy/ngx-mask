import {
  Directive,
  OnInit,
  Input,
  Output,
  HostListener,
  ElementRef,
  EventEmitter,
} from '@angular/core';

const resolvedPromise = Promise.resolve(null);

@Directive({
  selector: '[mask]'
})
export class MaskDirective implements OnInit {

  @HostListener('input')
  public onInput() {
    this._elementRef.nativeElement.value = this._applyMask(this._elementRef.nativeElement.value, this._maskExpression);
    this.ngModelChange.emit(this._applyMask(this._elementRef.nativeElement.value, this._maskExpression));
  }

  ngOnInit() {
    resolvedPromise.then(() =>
      this.ngModelChange.emit(this._applyMask(this._elementRef.nativeElement.value, this._maskExpression)));
  }

  @Input('mask')
  public set maskExpression(value: string) {
    if (!value) {
      return;
    }
    this._maskExpression = value;
  }

  @Output()
  public ngModelChange = new EventEmitter();


  private _maskExpression: string;
  private _elementRef: ElementRef;
  private _maskSpecialCharacters: string[] = ['/', '(', ')', '.', ':', '-', ' ', '+'];
  private _maskAwaliablePatterns: {[key: string]: RegExp} = {
    '0': /\d/,
    '9': /\d/,
    'A': /[a-zA-Z0-9]/,
    'S': /[a-zA-Z]/
  }


  public constructor(_elementRef: ElementRef) {
    this._elementRef = _elementRef;
  }

  private _applyMask(inputValue: string, maskExpression: string): string {
    let cursor = 0
    let result = '';
    let inputArray = inputValue.split('');
    for (let i = 0, inputSymbol = inputArray[0];
         i < inputArray.length;
         i++, inputSymbol = inputArray[i]) {
      if (result.length === maskExpression.length) {
        break;
      }

      if (this._checkSymbolMask(inputSymbol, maskExpression[cursor])) {
        result += inputSymbol;
        cursor++;
      } else if (this._maskSpecialCharacters.includes(maskExpression[cursor])) {
        result += maskExpression[cursor];
        cursor++;
        i--;
      } else if (maskExpression[cursor] === '9') {
        cursor++;
        i--;
      }
    }

    if (result.length + 1 === maskExpression.length
      && this._maskSpecialCharacters.includes(maskExpression[maskExpression.length - 1])) {
      result += maskExpression[maskExpression.length - 1];
    }

    return result;
  }

  private _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    return inputSymbol === maskSymbol
      || this._maskAwaliablePatterns[maskSymbol] && this._maskAwaliablePatterns[maskSymbol].test(inputSymbol)
  }

}
