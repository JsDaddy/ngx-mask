import {
  Directive, HostListener, Input
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaskService } from './mask.service';
import { IConfig } from './config';

@Directive({
  selector: '[mask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MaskService,
      multi: true
    },
    MaskService
  ],
})
export class MaskDirective {

  private _maskValue: string;

  public constructor(
    private _maskService: MaskService,
  ) { }

  @Input('mask')
  public set maskExpression(value: string) {
    this._maskValue = value || '';
    if (!this._maskValue) {
      return;
    }
    this._maskService.maskExpression = this._maskValue;
    this._maskService.maskSetter$$.emit(this._maskValue);
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
    if (!this._maskValue) {
      return;
    }
    const el: HTMLInputElement = (e.target as HTMLInputElement);
    const position: number = el.selectionStart;

    let caretShift: number = 0;
    this._maskService.applyValueChanges(
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
    this._maskService.clearIfNotMatchFn();
    this._maskService.onTouch();
  }
}
