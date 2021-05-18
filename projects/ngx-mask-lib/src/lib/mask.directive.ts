import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Directive, forwardRef, HostListener, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { CustomKeyboardEvent } from './custom-keyboard-event';
import { config, IConfig, timeMasks, withoutValidation } from './config';
import { MaskService } from './mask.service';

// tslint:disable deprecation
// tslint:disable no-input-rename
@Directive({
  selector: 'input[mask], textarea[mask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaskDirective),
      multi: true,
    },
    MaskService,
  ],
})
export class MaskDirective implements ControlValueAccessor, OnChanges, Validator {
  @Input('mask') public maskExpression: string = '';
  @Input() public specialCharacters: IConfig['specialCharacters'] = [];
  @Input() public patterns: IConfig['patterns'] = {};
  @Input() public prefix: IConfig['prefix'] = '';
  @Input() public suffix: IConfig['suffix'] = '';
  @Input() public thousandSeparator: IConfig['thousandSeparator'] = ' ';
  @Input() public decimalMarker: IConfig['decimalMarker'] = '.';
  @Input() public dropSpecialCharacters: IConfig['dropSpecialCharacters'] | null = null;
  @Input() public hiddenInput: IConfig['hiddenInput'] | null = null;
  @Input() public showMaskTyped: IConfig['showMaskTyped'] | null = null;
  @Input() public placeHolderCharacter: IConfig['placeHolderCharacter'] | null = null;
  @Input() public shownMaskExpression: IConfig['shownMaskExpression'] | null = null;
  @Input() public showTemplate: IConfig['showTemplate'] | null = null;
  @Input() public clearIfNotMatch: IConfig['clearIfNotMatch'] | null = null;
  @Input() public validation: IConfig['validation'] | null = null;
  @Input() public separatorLimit: IConfig['separatorLimit'] | null = null;
  @Input() public allowNegativeNumbers: IConfig['allowNegativeNumbers'] | null = null;
  @Input() public leadZeroDateTime: IConfig['leadZeroDateTime'] | null = null;
  private _maskValue: string = '';
  private _inputValue!: string;
  private _position: number | null = null;
  private _start!: number;
  private _end!: number;
  private _code!: string;
  private _maskExpressionArray: string[] = [];
  private _justPasted: boolean = false;

  public constructor(
    @Inject(DOCUMENT) private document: any,
    private _maskService: MaskService,
    @Inject(config) protected _config: IConfig
  ) {}

  public onChange = (_: any) => {};
  public onTouch = () => {};

  public ngOnChanges(changes: SimpleChanges): void {
    const {
      maskExpression,
      specialCharacters,
      patterns,
      prefix,
      suffix,
      thousandSeparator,
      decimalMarker,
      dropSpecialCharacters,
      hiddenInput,
      showMaskTyped,
      placeHolderCharacter,
      shownMaskExpression,
      showTemplate,
      clearIfNotMatch,
      validation,
      separatorLimit,
      allowNegativeNumbers,
      leadZeroDateTime,
    } = changes;
    if (maskExpression) {
      this._maskValue = maskExpression.currentValue || '';
      if (maskExpression.currentValue && maskExpression.currentValue.split('||').length > 1) {
        this._maskExpressionArray = maskExpression.currentValue.split('||').sort((a: string, b: string) => {
          return a.length - b.length;
        });
        this._maskValue = this._maskExpressionArray[0];
        this.maskExpression = this._maskExpressionArray[0];
        this._maskService.maskExpression = this._maskExpressionArray[0];
      }
    }
    if (specialCharacters) {
      if (!specialCharacters.currentValue || !Array.isArray(specialCharacters.currentValue)) {
        return;
      } else {
        this._maskService.maskSpecialCharacters = specialCharacters.currentValue || [];
      }
    }
    // Only overwrite the mask available patterns if a pattern has actually been passed in
    if (patterns && patterns.currentValue) {
      this._maskService.maskAvailablePatterns = patterns.currentValue;
    }
    if (prefix) {
      this._maskService.prefix = prefix.currentValue;
    }
    if (suffix) {
      this._maskService.suffix = suffix.currentValue;
    }
    if (thousandSeparator) {
      this._maskService.thousandSeparator = thousandSeparator.currentValue;
    }
    if (decimalMarker) {
      this._maskService.decimalMarker = decimalMarker.currentValue;
    }
    if (dropSpecialCharacters) {
      this._maskService.dropSpecialCharacters = dropSpecialCharacters.currentValue;
    }
    if (hiddenInput) {
      this._maskService.hiddenInput = hiddenInput.currentValue;
    }
    if (showMaskTyped) {
      this._maskService.showMaskTyped = showMaskTyped.currentValue;
    }
    if (placeHolderCharacter) {
      this._maskService.placeHolderCharacter = placeHolderCharacter.currentValue;
    }
    if (shownMaskExpression) {
      this._maskService.shownMaskExpression = shownMaskExpression.currentValue;
    }
    if (showTemplate) {
      this._maskService.showTemplate = showTemplate.currentValue;
    }
    if (clearIfNotMatch) {
      this._maskService.clearIfNotMatch = clearIfNotMatch.currentValue;
    }
    if (validation) {
      this._maskService.validation = validation.currentValue;
    }
    if (separatorLimit) {
      this._maskService.separatorLimit = separatorLimit.currentValue;
    }
    if (allowNegativeNumbers) {
      this._maskService.allowNegativeNumbers = allowNegativeNumbers.currentValue;
      if (this._maskService.allowNegativeNumbers) {
        this._maskService.maskSpecialCharacters = this._maskService.maskSpecialCharacters.filter(
          (c: string) => c !== '-'
        );
      }
    }
    if (leadZeroDateTime) {
      this._maskService.leadZeroDateTime = leadZeroDateTime.currentValue;
    }
    this._applyMask();
  }

  // tslint:disable-next-line: cyclomatic-complexity
  public validate({ value }: FormControl): ValidationErrors | null {
    if (!this._maskService.validation || !this._maskValue) {
      return null;
    }
    if (this._maskService.ipError) {
      return this._createValidationError(value);
    }
    if (this._maskService.cpfCnpjError) {
      return this._createValidationError(value);
    }
    if (this._maskValue.startsWith('separator')) {
      return null;
    }
    if (withoutValidation.includes(this._maskValue)) {
      return null;
    }
    if (this._maskService.clearIfNotMatch) {
      return null;
    }
    if (timeMasks.includes(this._maskValue)) {
      return this._validateTime(value);
    }
    if (value && value.toString().length >= 1) {
      let counterOfOpt = 0;
      for (const key in this._maskService.maskAvailablePatterns) {
        if (
          this._maskService.maskAvailablePatterns[key].optional &&
          this._maskService.maskAvailablePatterns[key].optional === true
        ) {
          if (this._maskValue.indexOf(key) !== this._maskValue.lastIndexOf(key)) {
            const opt: string = this._maskValue
              .split('')
              .filter((i: string) => i === key)
              .join('');
            counterOfOpt += opt.length;
          } else if (this._maskValue.indexOf(key) !== -1) {
            counterOfOpt++;
          }
          if (this._maskValue.indexOf(key) !== -1 && value.toString().length >= this._maskValue.indexOf(key)) {
            return null;
          }
          if (counterOfOpt === this._maskValue.length) {
            return null;
          }
        }
      }
      if (
        this._maskValue.indexOf('{') === 1 &&
        value.toString().length === this._maskValue.length + Number(this._maskValue.split('{')[1].split('}')[0]) - 4
      ) {
        return null;
      }
      if (this._maskValue.indexOf('*') === 1 || this._maskValue.indexOf('?') === 1) {
        return null;
      } else if (
        (this._maskValue.indexOf('*') > 1 && value.toString().length < this._maskValue.indexOf('*')) ||
        (this._maskValue.indexOf('?') > 1 && value.toString().length < this._maskValue.indexOf('?')) ||
        this._maskValue.indexOf('{') === 1
      ) {
        return this._createValidationError(value);
      }
      if (this._maskValue.indexOf('*') === -1 || this._maskValue.indexOf('?') === -1) {
        const length: number = this._maskService.dropSpecialCharacters
          ? this._maskValue.length - this._maskService.checkSpecialCharAmount(this._maskValue) - counterOfOpt
          : this._maskValue.length - counterOfOpt;
        if (value.toString().length < length) {
          return this._createValidationError(value);
        }
      }
    }
    return null;
  }
  @HostListener('paste')
  public onPaste() {
    this._justPasted = true;
  }

  @HostListener('input', ['$event'])
  public onInput(e: CustomKeyboardEvent): void {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    this._inputValue = el.value;

    this._setMask();

    if (!this._maskValue) {
      this.onChange(el.value);
      return;
    }
    const position: number =
      el.selectionStart === 1
        ? (el.selectionStart as number) + this._maskService.prefix.length
        : (el.selectionStart as number);
    let caretShift = 0;
    let backspaceShift = false;
    this._maskService.applyValueChanges(
      position,
      this._justPasted,
      this._code === 'Backspace' || this._code === 'Delete',
      (shift: number, _backspaceShift: boolean) => {
        this._justPasted = false;
        caretShift = shift;
        backspaceShift = _backspaceShift;
      }
    );
    // only set the selection if the element is active
    if (this.document.activeElement !== el) {
      return;
    }
    this._position = this._position === 1 && this._inputValue.length === 1 ? null : this._position;
    let positionToApply: number = this._position
      ? this._inputValue.length + position + caretShift
      : position + (this._code === 'Backspace' && !backspaceShift ? 0 : caretShift);
    if (positionToApply > this._getActualInputLength()) {
      positionToApply = this._getActualInputLength();
    }
    if (positionToApply < 0) {
      positionToApply = 0;
    }
    el.setSelectionRange(positionToApply, positionToApply);
    this._position = null;
  }

  @HostListener('blur')
  public onBlur(): void {
    if (this._maskValue) {
      this._maskService.clearIfNotMatchFn();
    }
    this.onTouch();
  }

  @HostListener('click', ['$event'])
  public onFocus(e: MouseEvent | CustomKeyboardEvent): void {
    if (!this._maskValue) {
      return;
    }
    const el: HTMLInputElement = e.target as HTMLInputElement;
    const posStart = 0;
    const posEnd = 0;
    if (
      el !== null &&
      el.selectionStart !== null &&
      el.selectionStart === el.selectionEnd &&
      el.selectionStart > this._maskService.prefix.length &&
      // tslint:disable-next-line
      (e as any).keyCode !== 38
    ) {
      if (this._maskService.showMaskTyped) {
        // We are showing the mask in the input
        this._maskService.maskIsShown = this._maskService.showMaskInInput();
        if (el.setSelectionRange && this._maskService.prefix + this._maskService.maskIsShown === el.value) {
          // the input ONLY contains the mask, so position the cursor at the start
          el.focus();
          el.setSelectionRange(posStart, posEnd);
        } else {
          // the input contains some characters already
          if (el.selectionStart > this._maskService.actualValue.length) {
            // if the user clicked beyond our value's length, position the cursor at the end of our value
            el.setSelectionRange(this._maskService.actualValue.length, this._maskService.actualValue.length);
          }
        }
      }
    }
    const nextValue: string | null =
      !el.value || el.value === this._maskService.prefix
        ? this._maskService.prefix + this._maskService.maskIsShown
        : el.value;

    /** Fix of cursor position jumping to end in most browsers no matter where cursor is inserted onFocus */
    if (el.value !== nextValue) {
      el.value = nextValue;
    }

    /** fix of cursor position with prefix when mouse click occur */
    if (((el.selectionStart as number) || (el.selectionEnd as number)) <= this._maskService.prefix.length) {
      el.selectionStart = this._maskService.prefix.length;
      return;
    }

    /** select only inserted text */
    if ((el.selectionEnd as number) > this._getActualInputLength()) {
      el.selectionEnd = this._getActualInputLength();
    }
  }

  // tslint:disable-next-line: cyclomatic-complexity
  @HostListener('keydown', ['$event'])
  public onKeyDown(e: CustomKeyboardEvent): void {
    if (!this._maskValue) {
      return;
    }
    this._code = e.code ? e.code : e.key;
    const el: HTMLInputElement = e.target as HTMLInputElement;
    this._inputValue = el.value;

    this._setMask();

    if (e.keyCode === 38) {
      e.preventDefault();
    }
    if (e.keyCode === 37 || e.keyCode === 8 || e.keyCode === 46) {
      if (e.keyCode === 8 && el.value.length === 0) {
        el.selectionStart = el.selectionEnd;
      }
      if (e.keyCode === 8 && (el.selectionStart as number) !== 0) {
        // If specialChars is false, (shouldn't ever happen) then set to the defaults
        this.specialCharacters = this.specialCharacters?.length
          ? this.specialCharacters
          : this._config.specialCharacters;
        if (this.prefix.length > 1 && (el.selectionStart as number) <= this.prefix.length) {
          el.setSelectionRange(this.prefix.length, this.prefix.length);
        } else {
          if (this._inputValue.length !== (el.selectionStart as number) && (el.selectionStart as number) !== 1) {
            while (
              this.specialCharacters.includes(this._inputValue[(el.selectionStart as number) - 1].toString()) &&
              ((this.prefix.length >= 1 && (el.selectionStart as number) > this.prefix.length) ||
                this.prefix.length === 0)
            ) {
              el.setSelectionRange((el.selectionStart as number) - 1, (el.selectionStart as number) - 1);
            }
          }
          this.suffixCheckOnPressDelete(e.keyCode, el);
        }
      }
      this.suffixCheckOnPressDelete(e.keyCode, el);
      if (
        this._maskService.prefix.length &&
        (el.selectionStart as number) <= this._maskService.prefix.length &&
        (el.selectionEnd as number) <= this._maskService.prefix.length
      ) {
        e.preventDefault();
      }
      const cursorStart: number | null = el.selectionStart;
      // this.onFocus(e);
      if (
        e.keyCode === 8 &&
        !el.readOnly &&
        cursorStart === 0 &&
        el.selectionEnd === el.value.length &&
        el.value.length !== 0
      ) {
        this._position = this._maskService.prefix ? this._maskService.prefix.length : 0;
        this._maskService.applyMask(this._maskService.prefix, this._maskService.maskExpression, this._position);
      }
    }
    if (
      !!this.suffix &&
      this.suffix.length > 1 &&
      this._inputValue.length - this.suffix.length < (el.selectionStart as number)
    ) {
      el.setSelectionRange(this._inputValue.length - this.suffix.length, this._inputValue.length);
    } else if (
      (e.keyCode === 65 && e.ctrlKey === true) || // Ctrl+ A
      (e.keyCode === 65 && e.metaKey === true) // Cmd + A (Mac)
    ) {
      el.setSelectionRange(0, this._getActualInputLength());
      e.preventDefault();
    }
    this._maskService.selStart = el.selectionStart;
    this._maskService.selEnd = el.selectionEnd;
  }

  /** It writes the value in the input */
  public async writeValue(inputValue: string | number | { value: string | number; disable?: boolean }): Promise<void> {
    if (typeof inputValue === 'object' && inputValue !== null && 'value' in inputValue) {
      if ('disable' in inputValue) {
        this.setDisabledState(Boolean(inputValue.disable));
      }
      inputValue = inputValue.value;
    }

    if (inputValue === undefined) {
      inputValue = '';
    }
    if (typeof inputValue === 'number') {
      inputValue = String(inputValue);
      inputValue = this.decimalMarker !== '.' ? inputValue.replace('.', this.decimalMarker) : inputValue;
      this._maskService.isNumberValue = true;
    }

    this._inputValue = inputValue;
    this._setMask();

    if (
      (inputValue && this._maskService.maskExpression) ||
      (this._maskService.maskExpression && (this._maskService.prefix || this._maskService.showMaskTyped))
    ) {
      // Let the service we know we are writing value so that triggering onChange function wont happen during applyMask
      this._maskService.writingValue = true;
      this._maskService.formElementProperty = [
        'value',
        this._maskService.applyMask(inputValue, this._maskService.maskExpression),
      ];
      // Let the service know we've finished writing value
      this._maskService.writingValue = false;
    } else {
      this._maskService.formElementProperty = ['value', inputValue];
    }
    this._inputValue = inputValue;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
    this._maskService.onChange = this.onChange;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public suffixCheckOnPressDelete(keyCode: number, el: HTMLInputElement): void {
    if (keyCode === 46 && this.suffix.length > 0) {
      if (this._inputValue.length - this.suffix.length <= (el.selectionStart as number)) {
        el.setSelectionRange(this._inputValue.length - this.suffix.length, this._inputValue.length);
      }
    }
    if (keyCode === 8) {
      if (this.suffix.length > 1 && this._inputValue.length - this.suffix.length < (el.selectionStart as number)) {
        el.setSelectionRange(this._inputValue.length - this.suffix.length, this._inputValue.length);
      }
      if (this.suffix.length === 1 && this._inputValue.length === (el.selectionStart as number)) {
        el.setSelectionRange((el.selectionStart as number) - 1, (el.selectionStart as number) - 1);
      }
    }
  }

  /** It disables the input element */
  public setDisabledState(isDisabled: boolean): void {
    this._maskService.formElementProperty = ['disabled', isDisabled];
  }

  private _repeatPatternSymbols(maskExp: string): string {
    return (
      (maskExp.match(/{[0-9]+}/) &&
        maskExp.split('').reduce((accum: string, currval: string, index: number): string => {
          this._start = currval === '{' ? index : this._start;

          if (currval !== '}') {
            return this._maskService._findSpecialChar(currval) ? accum + currval : accum;
          }
          this._end = index;
          const repeatNumber: number = Number(maskExp.slice(this._start + 1, this._end));
          const replaceWith: string = new Array(repeatNumber + 1).join(maskExp[this._start - 1]);
          return accum + replaceWith;
        }, '')) ||
      maskExp
    );
  }

  // tslint:disable-next-line:no-any
  private _applyMask(): any {
    this._maskService.maskExpression = this._repeatPatternSymbols(this._maskValue || '');
    this._maskService.formElementProperty = [
      'value',
      this._maskService.applyMask(this._inputValue, this._maskService.maskExpression),
    ];
  }

  private _validateTime(value: string): ValidationErrors | null {
    const rowMaskLen: number = this._maskValue.split('').filter((s: string) => s !== ':').length;
    if (!value) {
      return null; // Don't validate empty values to allow for optional form control
    }

    if ((+value[value.length - 1] === 0 && value.length < rowMaskLen) || value.length <= rowMaskLen - 2) {
      return this._createValidationError(value);
    }

    return null;
  }

  private _getActualInputLength() {
    return (
      this._maskService.actualValue.length || this._maskService.actualValue.length + this._maskService.prefix.length
    );
  }

  private _createValidationError(actualValue: string): ValidationErrors {
    return {
      mask: {
        requiredMask: this._maskValue,
        actualValue,
      },
    };
  }

  private _setMask() {
    if (this._maskExpressionArray.length > 0) {
      this._maskExpressionArray.some((mask) => {
        const test =
          this._maskService.removeMask(this._inputValue)?.length <= this._maskService.removeMask(mask)?.length;
        if (this._inputValue && test) {
          this._maskValue = mask;
          this.maskExpression = mask;
          this._maskService.maskExpression = mask;
          return test;
        } else {
          this._maskValue = this._maskExpressionArray[this._maskExpressionArray.length - 1];
          this.maskExpression = this._maskExpressionArray[this._maskExpressionArray.length - 1];
          this._maskService.maskExpression = this._maskExpressionArray[this._maskExpressionArray.length - 1];
        }
      });
    }
  }
}
