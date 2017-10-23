import {
  Directive, ElementRef, forwardRef, HostListener, Input, OnInit,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaskService } from './mask.service';
import { IConfig } from './config';

const resolvedPromise: Promise<null> = Promise.resolve(null);

@Directive({
  selector: '[mask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskDirective),
      multi: true
    },
    MaskService
  ],
})
export class MaskDirective implements OnInit, ControlValueAccessor {
  public constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _maskService: MaskService,
  ) {}

  public ngOnInit(): void {
    resolvedPromise.then(() => this._maskService.applyValueChanges(this._elementRef.nativeElement));
  }

  @Input('mask')
  public set maskExpression(value: string) {
    if (!value) {
      return;
    }
    this._maskService.maskExpression = value;
  }

  @Input()
  public set specialCharacters(value: IConfig['specialCharacters']) {
    if (!value || !Array.isArray(value) || Array.isArray(value) && !value.length) {
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
  public set dropSpecialCharacters(value: IConfig['dropSpecialCharacters']) {
    this._maskService.dropSpecialCharacters = value;
  }

  @Input()
  public set clearIfNotMatch(value: IConfig['clearIfNotMatch']) {
    this._maskService.clearIfNotMatch = value;
  }

  @HostListener('input', ['$event'])
  public onInput(e: KeyboardEvent): void {
    const el: HTMLInputElement = (e.target as HTMLInputElement);
    const position: number = el.selectionStart;

    let caretShift: number = 0;
    this._maskService.applyValueChanges(
      this._elementRef.nativeElement,
      position,
      (shift: number) => caretShift = shift
    );
    el.selectionStart = el.selectionEnd = position + (
      // tslint:disable-next-line
      (e as any).inputType === 'deleteContentBackward'
        ? 0
        : caretShift
    );
  }

  @HostListener('blur')
  public onBlur(): void {
    this._maskService.clearIfNotMatchFn(this._elementRef.nativeElement);
    this._maskService.applyValueChanges(this._elementRef.nativeElement);
    this._maskService.onTouch();
  }

  /** It writes the value in the input */
  public writeValue(inputValue: string): void {
    this._elementRef.nativeElement.value = this._maskService.applyMask(inputValue, this._maskService.maskExpression);
    this._maskService.applyValueChanges(this._elementRef.nativeElement);
  }

  // tslint:disable-next-line
  public registerOnChange(fn: any): void {
    this._maskService.onChange = fn;
  }

  // tslint:disable-next-line
  public registerOnTouched(fn: any): void {
    this._maskService.onTouch = fn;
  }

  /** It disables the input element */
  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      return this._renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'true');
    }
    return this._renderer.removeAttribute(this._elementRef.nativeElement, 'disabled');
  }
}
