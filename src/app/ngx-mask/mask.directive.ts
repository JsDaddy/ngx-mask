import { Directive, forwardRef, HostListener, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { MaskService } from './mask.service';
import { IConfig, withoutValidation } from './config';
import { CustomKeyboardEvent } from './custom-keyboard-event';

@Directive({
    selector: '[mask]',
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
export class MaskDirective implements ControlValueAccessor, OnChanges {
    @Input('mask') public maskExpression: string = '';
    @Input() public specialCharacters: IConfig['specialCharacters'] = [];
    @Input() public patterns: IConfig['patterns'] = {};
    @Input() public prefix: IConfig['prefix'] = '';
    @Input() public suffix: IConfig['suffix'] = '';
    @Input() public dropSpecialCharacters: IConfig['dropSpecialCharacters'] | null = null;
    @Input() public hiddenInput: IConfig['hiddenInput'] | null = null;
    @Input() public showMaskTyped: IConfig['showMaskTyped'] | null = null;
    @Input() public shownMaskExpression: IConfig['shownMaskExpression'] | null = null;
    @Input() public showTemplate: IConfig['showTemplate'] | null = null;
    @Input() public clearIfNotMatch: IConfig['clearIfNotMatch'] | null = null;
    @Input() public validation: IConfig['validation'] | null = null;
    private _maskValue!: string;
    private _inputValue!: string;
    private _position: number | null = null;
    // tslint:disable-next-line
    private _start!: number;
    private _end!: number;
    private _code!: string;
    // tslint:disable-next-line
    public onChange = (_: any) => {};
    public onTouch = () => {};

    public constructor(
        // tslint:disable-next-line
        @Inject(DOCUMENT) private document: any,
        private _maskService: MaskService
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        // tslint:disable-next-line:max-line-length
        const {
            maskExpression,
            specialCharacters,
            patterns,
            prefix,
            suffix,
            dropSpecialCharacters,
            hiddenInput,
            showMaskTyped,
            shownMaskExpression,
            showTemplate,
            clearIfNotMatch,
            validation,
        } = changes;
        if (maskExpression) {
            this._maskValue = changes.maskExpression.currentValue || '';
        }
        if (specialCharacters) {
            if (
                !specialCharacters.currentValue ||
                !Array.isArray(specialCharacters.currentValue) ||
                (Array.isArray(specialCharacters.currentValue) && !specialCharacters.currentValue.length)
            ) {
                return;
            }
            this._maskService.maskSpecialCharacters = changes.specialCharacters.currentValue || '';
        }
        if (patterns) {
            this._maskService.maskAvailablePatterns = patterns.currentValue;
        }
        if (prefix) {
            this._maskService.prefix = prefix.currentValue;
        }
        if (suffix) {
            this._maskService.suffix = suffix.currentValue;
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
        this._applyMask();
    }

    // tslint:disable-next-line: cyclomatic-complexity
    public validate({ value }: FormControl): ValidationErrors | null {
        if (!this._maskService.validation) {
            return null;
        }
        if (this._maskService.ipError) {
            return { 'Mask error': true };
        }
        if (
            this._maskValue.startsWith('dot_separator') ||
            this._maskValue.startsWith('comma_separator') ||
            this._maskValue.startsWith('separator')
        ) {
            return null;
        }
        if (withoutValidation.includes(this._maskValue)) {
            return null;
        }
        if (this._maskService.clearIfNotMatch) {
            return null;
        }
        if (value && value.toString().length >= 1) {
            let counterOfOpt: number = 0;
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
                    if (
                        this._maskValue.indexOf(key) !== -1 &&
                        value.toString().length >= this._maskValue.indexOf(key)
                    ) {
                        return null;
                    }
                    if (counterOfOpt === this._maskValue.length) {
                        return null;
                    }
                }
            }
            if (
                this._maskValue.indexOf('*') === 1 ||
                this._maskValue.indexOf('?') === 1 ||
                this._maskValue.indexOf('{') === 1
            ) {
                return null;
            } else if (
                (this._maskValue.indexOf('*') > 1 && value.toString().length < this._maskValue.indexOf('*')) ||
                (this._maskValue.indexOf('?') > 1 && value.toString().length < this._maskValue.indexOf('?'))
            ) {
                return { 'Mask error': true };
            }
            if (this._maskValue.indexOf('*') === -1 || this._maskValue.indexOf('?') === -1) {
                const length: number = this._maskService.dropSpecialCharacters
                    ? this._maskValue.length - this._maskService.checkSpecialCharAmount(this._maskValue) - counterOfOpt
                    : this._maskValue.length - counterOfOpt;
                if (value.toString().length < length) {
                    return { 'Mask error': true };
                }
            }
        }
        return null;
    }

    @HostListener('input', ['$event'])
    public onInput(e: CustomKeyboardEvent): void {
        const el: HTMLInputElement = e.target as HTMLInputElement;
        this._inputValue = el.value;
        if (!this._maskValue) {
            this.onChange(el.value);
            return;
        }
        const position: number =
            el.selectionStart === 1
                ? (el.selectionStart as number) + this._maskService.prefix.length
                : (el.selectionStart as number);
        let caretShift: number = 0;
        let backspaceShift: boolean = false;
        this._maskService.applyValueChanges(position, (shift: number, _backspaceShift: boolean) => {
            caretShift = shift;
            backspaceShift = _backspaceShift;
        });
        // only set the selection if the element is active
        if (this.document.activeElement !== el) {
            return;
        }
        this._position = this._position === 1 && this._inputValue.length === 1 ? null : this._position;
        el.selectionStart = el.selectionEnd =
            this._position !== null
                ? this._position
                : position +
                  // tslint:disable-next-line
                  (this._code === 'Backspace' && !backspaceShift ? 0 : caretShift);
        this._position = null;
    }

    @HostListener('blur')
    public onBlur(): void {
        this._maskService.clearIfNotMatchFn();
        this.onTouch();
    }

    @HostListener('click', ['$event'])
    public onFocus(e: MouseEvent | CustomKeyboardEvent): void {
        const el: HTMLInputElement = e.target as HTMLInputElement;
        const posStart: number = 0;
        const posEnd: number = 0;
        if (
            el !== null &&
            el.selectionStart !== null &&
            el.selectionStart === el.selectionEnd &&
            el.selectionStart > this._maskService.prefix.length &&
            // tslint:disable-next-line
            (e as any).keyCode !== 38
        )
            if (this._maskService.showMaskTyped) {
                // ) {
                //     return;
                // }
                this._maskService.maskIsShown = this._maskService.showMaskInInput();
                if (el.setSelectionRange && this._maskService.prefix + this._maskService.maskIsShown === el.value) {
                    el.focus();
                    el.setSelectionRange(posStart, posEnd);
                } else if (el.setSelectionRange && this._maskService.maskIsShown !== el.value) {
                    el.focus();
                    el.setSelectionRange(posStart, posEnd);
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
    }

    @HostListener('keydown', ['$event'])
    public a(e: CustomKeyboardEvent): void {
        this._code = e.code ? e.code : e.key;
        const el: HTMLInputElement = e.target as HTMLInputElement;
        this._maskService.selStart = el.selectionStart;
        this._maskService.selEnd = el.selectionEnd;
        if (e.keyCode === 38) {
            e.preventDefault();
        }
        if (e.keyCode === 37 || e.keyCode === 8) {
            // if (e.keyCode === 37) {
            //     el.selectionStart = (el.selectionEnd as number) - 1;
            // }
            if (e.keyCode === 8 && el.value.length === 0) {
                el.selectionStart = el.selectionEnd;
            }
            if (e.keyCode === 8 && el.value.length === 0) {
                el.selectionStart = el.selectionEnd;
            }
            if (
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
    }

    @HostListener('paste')
    public onPaste(): void {
        this._position = Number.MAX_SAFE_INTEGER;
    }

    /** It writes the value in the input */
    public async writeValue(inputValue: string | number): Promise<void> {
        if (inputValue === undefined) {
            inputValue = '';
        }
        if (typeof inputValue === 'number') {
            inputValue = String(inputValue);
            inputValue = this._maskValue.startsWith('dot_separator') ? inputValue.replace('.', ',') : inputValue;
            this._maskService.isNumberValue = true;
        }
        (inputValue && this._maskService.maskExpression) ||
        (this._maskService.maskExpression && (this._maskService.prefix || this._maskService.showMaskTyped))
            ? (this._maskService.formElementProperty = [
                  'value',
                  this._maskService.applyMask(inputValue, this._maskService.maskExpression),
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
        return (
            (maskExp.match(/{[0-9]+}/) &&
                maskExp.split('').reduce((accum: string, currval: string, index: number): string => {
                    this._start = currval === '{' ? index : this._start;

                    if (currval !== '}') {
                        return this._maskService._findSpecialChar(currval) ? accum + currval : accum;
                    }
                    this._end = index;
                    const repeatNumber: number = Number(maskExp.slice(this._start + 1, this._end));
                    const repaceWith: string = new Array(repeatNumber + 1).join(maskExp[this._start - 1]);
                    return accum + repaceWith;
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
}
