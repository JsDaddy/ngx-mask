import { Directive, AfterViewInit, OnInit, Input, Output, HostListener, ElementRef, EventEmitter, NgZone } from '@angular/core';

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
  private _zone: NgZone;


  public constructor(_elementRef: ElementRef, _zone: NgZone) {
    this._elementRef = _elementRef;
    this._zone = _zone;
  }

  private _applyMask(inputValue: string, maskExpression: string): string {
    let cursor = 0
    let result = '';
    for (let inputSymbol of inputValue.split('')) {
      if (result.length === maskExpression.length) {
        break;
      }
      while (['/', '(', ')', '.', ':', '-', ' ', '+'].includes(maskExpression[cursor])) {
        result += maskExpression[cursor];
        cursor++;
      }
      if (this._checkSymbolMask(inputSymbol, maskExpression[cursor])) {
        result += inputSymbol;
        cursor++;
      }
    }

    if (result.length + 1 === maskExpression.length
      && ['/', '(', ')', '.', ':', '-', ' ', '+'].includes(maskExpression[maskExpression.length - 1])) {
      result += maskExpression[maskExpression.length - 1];
    }

    return result;
  }

  private _checkSymbolMask(input: string, letter: string): boolean {
    return input === letter
      || letter === '0' && /\d/.test(input)
      || letter === 'A' && /[a-zA-Z0-9]/.test(input)
      || letter === 'S' && /[a-zA-Z]/.test(input)
  }
}