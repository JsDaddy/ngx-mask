import {
  Directive,
  forwardRef,
  HostListener,
  Inject,
  Input
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaskService } from './mask.service';
import { IConfig } from './config';

@Directive({
  selector: '[mask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskDirective),
      multi: true
    },
    MaskService
  ]
})
export class MaskDirective implements ControlValueAccessor {
  private _maskValue: string;
  private _inputValue: string;
  private _position: number | null = null;
  // tslint:disable-next-line
  private _start: number;
  private _end: number;
  // tslint:disable-next-line
  public onChange = (_: any) => { };
  public onTouch = () => { };
  public constructor(
    // tslint:disable-next-line
    @Inject(DOCUMENT) private document: any,
    private _maskService: MaskService
  ) { }


  @Input('mask')
  public set maskExpression(value: string) {
    this._maskValue = value || '';
    if (!this._maskValue) {
      return;
    }
    this._maskService.maskExpression = this._repeatPatternSymbols(this._maskValue);
    this._maskService.formElementProperty = [
      'value',
      this._maskService.applyMask(
        this._inputValue,
        this._maskService.maskExpression
      )
    ];
  }

  @Input()
  public set specialCharacters(value: IConfig['specialCharacters']) {
    if (
      !value ||
      !Array.isArray(value) ||
      (Array.isArray(value) && !value.length)
    ) {
      return;
    }
    this._maskService.maskSpecialCharacters = value;
  }

  @Input()
  public set patterns(value: IConfig['patterns']) {
    if (!value) {
      return;
    }
    this._maskService.maskAvailablePatterns = value;
  }

  @Input()
  public set prefix(value: IConfig['prefix']) {
    if (!value) {
      return;
    }
    this._maskService.prefix = value;
  }

  @Input()
  public set sufix(value: IConfig['sufix']) {
    if (!value) {
      return;
    }
    this._maskService.sufix = value;
  }

  @Input()
  public set dropSpecialCharacters(value: IConfig['dropSpecialCharacters']) {
    this._maskService.dropSpecialCharacters = value;
  }

  @Input()
  public set showMaskTyped(value: IConfig['showMaskTyped']) {
    if (!value) {
      return;
    }
    this._maskService.showMaskTyped = value;
  }

  @Input()
  public set shownMaskExpression(value: IConfig['shownMaskExpression']) {
    if (!value) {
      return;
    }
    this._maskService.shownMaskExpression = value;
  }

  @Input()
  public set showTemplate(value: IConfig['showTemplate']) {
    this._maskService.showTemplate = value;
  }

  @Input()
  public set clearIfNotMatch(value: IConfig['clearIfNotMatch']) {
    this._maskService.clearIfNotMatch = value;
  }

  @HostListener('input', ['$event'])
  public onInput(e: KeyboardEvent): void {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    this._inputValue = el.value;
    if (!this._maskValue) {
      this.onChange(el.value);
      return;
    }
    const position: number = (el.selectionStart as number) === 1
      ? (el.selectionStart as number) + this._maskService.prefix.length
      : el.selectionStart as number;
    let caretShift: number = 0;
    this._maskService.applyValueChanges(
      position,
      (shift: number) => (caretShift = shift)
    );
    // only set the selection if the element is active
    if (this.document.activeElement !== el) {
      return;
    }
    el.selectionStart = el.selectionEnd =
      this._position !== null
        ? this._position
        : position +
        // tslint:disable-next-line
        ((e as any).inputType === 'deleteContentBackward' ? 0 : caretShift);
    this._position = null;
  }

  @HostListener('blur')
  public onBlur(): void {
    this._maskService.clearIfNotMatchFn();
    this.onTouch();
  }

  @HostListener('click', ['$event'])
  public onFocus(e: MouseEvent | KeyboardEvent): void {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    if (
      el !== null && el.selectionStart !== null &&
      el.selectionStart === el.selectionEnd &&
      el.selectionStart > this._maskService.prefix.length &&
      // tslint:disable-next-line
      (e as any).keyCode !== 38
    ) {
      return;
    }
    if (this._maskService.showMaskTyped) {
      this._maskService.maskIsShown = this._maskService.showMaskInInput();
    }
    el.value = !el.value || el.value === this._maskService.prefix
      ? this._maskService.prefix + this._maskService.maskIsShown
      : el.value;
    /** fix of cursor position with prefix when mouse click occur */
    if (((el.selectionStart as number) || (el.selectionEnd as number)) <= this._maskService.prefix.length) {
      el.selectionStart = this._maskService.prefix.length;
      return;
    }
  }

  @HostListener('keydown', ['$event'])
  public a(e: KeyboardEvent): void {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    if (e.keyCode === 38) {
      e.preventDefault();
    }
    if (e.keyCode === 37 || e.keyCode === 8) {
      if ((el.selectionStart as number) <= this._maskService.prefix.length
        && (el.selectionEnd as number) <= this._maskService.prefix.length) {
        e.preventDefault();
      }
      this.onFocus(e);
      if (e.keyCode === 8
        && el.selectionStart === 0
        && el.selectionEnd === el.value.length) {
        el.value = this._maskService.prefix;
        this._position = this._maskService.prefix ? this._maskService.prefix.length : 1;
        this.onInput(e);
      }
    }
  }

  @HostListener('paste')
  public onPaste(): void {
    this._position = Number.MAX_SAFE_INTEGER;
  }

  /** It writes the value in the input */
  public async writeValue(inputValue: string): Promise<void> {
    if (inputValue === undefined) {
      inputValue = '';
    }
    if (typeof inputValue === 'number') {
      inputValue = String(inputValue);
      this._maskService.isNumberValue = true;
    }
    inputValue && this._maskService.maskExpression ||
      this._maskService.maskExpression && (this._maskService.prefix || this._maskService.showMaskTyped)
      ? (this._maskService.formElementProperty = [
        'value',
        this._maskService.applyMask(
          inputValue,
          this._maskService.maskExpression
        )
      ])
      : (this._maskService.formElementProperty = ['value', inputValue]);
    this._inputValue = inputValue;
  }

  // tslint:disable-next-line
  public registerOnChange(fn: any): void {
    this.onChange = fn;
    this._maskService.onChange = this.onChange;
  }

  // tslint:disable-next-line
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /** It disables the input element */
  public setDisabledState(isDisabled: boolean): void {
    this._maskService.formElementProperty = ['disabled', isDisabled];
  }
  private _repeatPatternSymbols(maskExp: string): string {
    return maskExp.match(/{[0-9]+}/)
      && maskExp.split('')
        .reduce((accum: string, currval: string, index: number): string => {
          this._start = (currval === '{') ? index : this._start;

          if (currval !== '}') {
            return this._maskService._findSpecialChar(currval) ? accum + currval : accum;
          }
          this._end = index;
          const repeatNumber: number = Number(maskExp
            .slice(this._start + 1, this._end));
          const repaceWith: string = new Array(repeatNumber + 1)
            .join(maskExp[this._start - 1]);
          return accum + repaceWith;
        }, '') || maskExp;
  }

}
