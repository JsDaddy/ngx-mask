import { DOCUMENT } from '@angular/common';
import {
    Directive,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    inject,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator,
} from '@angular/forms';

import { CustomKeyboardEvent } from './custom-keyboard-event';
import { IConfig, NGX_MASK_CONFIG, timeMasks, withoutValidation } from './ngx-mask.config';
import { NgxMaskService } from './ngx-mask.service';
import { MaskExpression } from './ngx-mask-expression.enum';

@Directive({
    selector: 'input[mask], textarea[mask]',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: NgxMaskDirective,
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: NgxMaskDirective,
            multi: true,
        },
        NgxMaskService,
    ],
    exportAs: 'mask,ngxMask',
})
export class NgxMaskDirective implements ControlValueAccessor, OnChanges, Validator {
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('mask') public maskExpression: string | undefined | null = '';

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

    @Input() public leadZero: IConfig['leadZero'] | null = null;

    @Input() public triggerOnMaskChange: IConfig['triggerOnMaskChange'] | null = null;

    @Output() public maskFilled: IConfig['maskFilled'] = new EventEmitter<void>();

    private _maskValue = '';

    private _inputValue!: string;

    private _position: number | null = null;

    private _code!: string;

    private _maskExpressionArray: string[] = [];

    private _justPasted = false;

    /**For IME composition event */
    private _isComposing = false;

    private readonly document = inject(DOCUMENT);

    public _maskService = inject(NgxMaskService, { self: true });

    protected _config = inject<IConfig>(NGX_MASK_CONFIG);

    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
    public onChange = (_: any) => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
            leadZero,
            triggerOnMaskChange,
        } = changes;
        if (maskExpression) {
            if (
                maskExpression.currentValue !== maskExpression.previousValue &&
                !maskExpression.firstChange
            ) {
                this._maskService.maskChanged = true;
            }
            if (allowNegativeNumbers) {
                this._maskService.allowNegativeNumbers = allowNegativeNumbers.currentValue;
                if (this._maskService.allowNegativeNumbers) {
                    this._maskService.specialCharacters =
                        this._maskService.specialCharacters.filter(
                            (c: string) => c !== MaskExpression.MINUS
                        );
                }
            }
            if (
                maskExpression.currentValue &&
                maskExpression.currentValue.split(MaskExpression.OR).length > 1
            ) {
                this._maskExpressionArray = maskExpression.currentValue
                    .split(MaskExpression.OR)
                    .sort((a: string, b: string) => {
                        return a.length - b.length;
                    });
                this._setMask();
            } else {
                this._maskExpressionArray = [];
                this._maskValue = maskExpression.currentValue || MaskExpression.EMPTY_STRING;
                this._maskService.maskExpression = this._maskValue;
            }
        }
        if (specialCharacters) {
            if (!specialCharacters.currentValue || !Array.isArray(specialCharacters.currentValue)) {
                return;
            } else {
                this._maskService.specialCharacters = specialCharacters.currentValue || [];
            }
        }
        // Only overwrite the mask available patterns if a pattern has actually been passed in
        if (patterns && patterns.currentValue) {
            this._maskService.patterns = patterns.currentValue;
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
        if (leadZeroDateTime) {
            this._maskService.leadZeroDateTime = leadZeroDateTime.currentValue;
        }
        if (leadZero) {
            this._maskService.leadZero = leadZero.currentValue;
        }
        if (triggerOnMaskChange) {
            this._maskService.triggerOnMaskChange = triggerOnMaskChange.currentValue;
        }
        this._applyMask();
    }

    // eslint-disable-next-line complexity
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
        if (this._maskValue.startsWith(MaskExpression.SEPARATOR)) {
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
        // if (this._maskValue.startsWith(emailMask)) {
        //     return this._validateEmail(value);
        // }
        if (value && value.toString().length >= 1) {
            let counterOfOpt = 0;
            if (this._maskValue.startsWith(MaskExpression.PERCENT)) {
                return null;
            }
            for (const key in this._maskService.patterns) {
                if (this._maskService.patterns[key]?.optional) {
                    if (this._maskValue.indexOf(key) !== this._maskValue.lastIndexOf(key)) {
                        const opt: string = this._maskValue
                            .split(MaskExpression.EMPTY_STRING)
                            .filter((i: string) => i === key)
                            .join(MaskExpression.EMPTY_STRING);
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
                this._maskValue.indexOf(MaskExpression.CURLY_BRACKETS_LEFT) === 1 &&
                value.toString().length ===
                    this._maskValue.length +
                        Number(
                            (
                                this._maskValue.split(MaskExpression.CURLY_BRACKETS_LEFT)[1] ??
                                MaskExpression.EMPTY_STRING
                            ).split(MaskExpression.CURLY_BRACKETS_RIGHT)[0]
                        ) -
                        4
            ) {
                return null;
            }
            // if (
            //     this._maskValue.indexOf(MaskExpression.SYMBOL_STAR) === 1 ||
            //     this._maskValue.indexOf(MaskExpression.SYMBOL_QUESTION) === 1
            // ) {
            //     return null;
            // }
            else if (
                (this._maskValue.indexOf(MaskExpression.SYMBOL_STAR) > 1 &&
                    value.toString().length <
                        this._maskValue.indexOf(MaskExpression.SYMBOL_STAR)) ||
                (this._maskValue.indexOf(MaskExpression.SYMBOL_QUESTION) > 1 &&
                    value.toString().length <
                        this._maskValue.indexOf(MaskExpression.SYMBOL_QUESTION)) ||
                this._maskValue.indexOf(MaskExpression.CURLY_BRACKETS_LEFT) === 1
            ) {
                return this._createValidationError(value);
            }
            if (
                this._maskValue.indexOf(MaskExpression.SYMBOL_STAR) === -1 ||
                this._maskValue.indexOf(MaskExpression.SYMBOL_QUESTION) === -1
            ) {
                const array = this._maskValue.split('*');
                const length: number = this._maskService.dropSpecialCharacters
                    ? this._maskValue.length -
                      this._maskService.checkSpecialCharAmount(this._maskValue) -
                      counterOfOpt
                    : this.prefix
                    ? this._maskValue.length + this.prefix.length - counterOfOpt
                    : this._maskValue.length - counterOfOpt;
                if (array.length === 1) {
                    if (value.toString().length < length) {
                        return this._createValidationError(value);
                    }
                }
                if (array.length > 1) {
                    const lastIndexArray = array[array.length - 1];
                    if (
                        lastIndexArray &&
                        this._maskService.specialCharacters.includes(lastIndexArray[0] as string) &&
                        value.includes(lastIndexArray[0]) &&
                        !this.dropSpecialCharacters
                    ) {
                        const special = value.split(lastIndexArray[0]);
                        return special[special.length - 1].length === lastIndexArray.length - 1
                            ? null
                            : this._createValidationError(value);
                    } else if (
                        ((lastIndexArray &&
                            !this._maskService.specialCharacters.includes(
                                lastIndexArray[0] as string
                            )) ||
                            !lastIndexArray ||
                            this._maskService.dropSpecialCharacters) &&
                        value.length >= length
                    ) {
                        return null;
                    } else {
                        return this._createValidationError(value);
                    }
                }
            }
            if (
                this._maskValue.indexOf(MaskExpression.SYMBOL_STAR) === 1 ||
                this._maskValue.indexOf(MaskExpression.SYMBOL_QUESTION) === 1
            ) {
                return null;
            }
        }
        if (value) {
            this.maskFilled.emit();
            return null;
        }
        return null;
    }

    @HostListener('paste')
    public onPaste() {
        this._justPasted = true;
    }

    @HostListener('ngModelChange', ['$event'])
    public onModelChange(value: string | undefined | null | number): void {
        // on form reset we need to update the actualValue
        if (
            (value === MaskExpression.EMPTY_STRING || value === null || value === undefined) &&
            this._maskService.actualValue
        ) {
            this._maskService.actualValue = this._maskService.getActualValue(
                MaskExpression.EMPTY_STRING
            );
        }
    }

    @HostListener('input', ['$event'])
    public onInput(e: CustomKeyboardEvent): void {
        // If IME is composing text, we wait for the composed text.
        if (this._isComposing) return;
        const el: HTMLInputElement = e.target as HTMLInputElement;
        this._inputValue = el.value;

        this._setMask();
        if (!this._maskValue) {
            this.onChange(el.value);
            return;
        }
        let position: number =
            el.selectionStart === 1
                ? (el.selectionStart as number) + this._maskService.prefix.length
                : (el.selectionStart as number);

        let caretShift = 0;
        let backspaceShift = false;
        if (this._code === 'Delete' && MaskExpression.SEPARATOR) {
            this._maskService.deletedSpecialCharacter = true;
        }
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
        if (this._getActiveElement() !== el) {
            return;
        }

        // update position after applyValueChanges to prevent cursor on wrong position when it has an array of maskExpression
        if (this._maskExpressionArray.length) {
            position =
                el.selectionStart === 1
                    ? (el.selectionStart as number) + this._maskService.prefix.length
                    : (el.selectionStart as number);
        }

        this._position =
            this._position === 1 && this._inputValue.length === 1 ? null : this._position;

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

    // IME starts
    @HostListener('compositionstart', ['$event'])
    public onCompositionStart(): void {
        this._isComposing = true;
    }

    // IME completes
    @HostListener('compositionend', ['$event'])
    public onCompositionEnd(e: CustomKeyboardEvent): void {
        this._isComposing = false;
        this._justPasted = true;
        this.onInput(e);
    }

    @HostListener('blur')
    public onBlur(): void {
        if (this._maskValue) {
            this._maskService.clearIfNotMatchFn();
        }
        this.onTouch();
    }

    @HostListener('click', ['$event'])
    public onClick(e: MouseEvent | CustomKeyboardEvent): void {
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
            // eslint-disable-next-line
            (e as any).keyCode !== 38
        ) {
            if (this._maskService.showMaskTyped) {
                // We are showing the mask in the input
                this._maskService.maskIsShown = this._maskService.showMaskInInput();
                if (
                    el.setSelectionRange &&
                    this._maskService.prefix + this._maskService.maskIsShown === el.value
                ) {
                    // the input ONLY contains the mask, so position the cursor at the start
                    el.focus();
                    el.setSelectionRange(posStart, posEnd);
                } else {
                    // the input contains some characters already
                    if (el.selectionStart > this._maskService.actualValue.length) {
                        // if the user clicked beyond our value's length, position the cursor at the end of our value
                        el.setSelectionRange(
                            this._maskService.actualValue.length,
                            this._maskService.actualValue.length
                        );
                    }
                }
            }
        }
        const nextValue: string | null =
            el &&
            (el.value === this._maskService.prefix
                ? this._maskService.prefix + this._maskService.maskIsShown
                : el.value);
        /** Fix of cursor position jumping to end in most browsers no matter where cursor is inserted onFocus */
        if (el && el.value !== nextValue) {
            el.value = nextValue;
        }

        /** fix of cursor position with prefix when mouse click occur */
        if (
            el &&
            ((el.selectionStart as number) || (el.selectionEnd as number)) <=
                this._maskService.prefix.length
        ) {
            el.selectionStart = this._maskService.prefix.length;
            return;
        }
        /** select only inserted text */
        if (el && (el.selectionEnd as number) > this._getActualInputLength()) {
            el.selectionEnd = this._getActualInputLength();
        }
    }

    // eslint-disable-next-line complexity
    @HostListener('keydown', ['$event'])
    public onKeyDown(e: CustomKeyboardEvent): void {
        if (!this._maskValue) {
            return;
        }

        if (this._isComposing) {
            // User finalize their choice from IME composition, so trigger onInput() for the composed text.
            if (e.key === 'Enter') this.onCompositionEnd(e);
            return;
        }

        this._code = e.code ? e.code : e.key;
        const el: HTMLInputElement = e.target as HTMLInputElement;
        this._inputValue = el.value;

        this._setMask();

        if (e.key === 'ArrowUp') {
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'Delete') {
            if (e.key === 'Backspace' && el.value.length === 0) {
                el.selectionStart = el.selectionEnd;
            }
            if (e.key === 'Backspace' && (el.selectionStart as number) !== 0) {
                // If specialChars is false, (shouldn't ever happen) then set to the defaults
                this.specialCharacters = this.specialCharacters?.length
                    ? this.specialCharacters
                    : this._config.specialCharacters;
                if (this.prefix.length > 1 && (el.selectionStart as number) <= this.prefix.length) {
                    el.setSelectionRange(this.prefix.length, el.selectionEnd);
                } else {
                    if (
                        this._inputValue.length !== (el.selectionStart as number) &&
                        (el.selectionStart as number) !== 1
                    ) {
                        while (
                            this.specialCharacters.includes(
                                (
                                    this._inputValue[(el.selectionStart as number) - 1] ??
                                    MaskExpression.EMPTY_STRING
                                ).toString()
                            ) &&
                            ((this.prefix.length >= 1 &&
                                (el.selectionStart as number) > this.prefix.length) ||
                                this.prefix.length === 0)
                        ) {
                            el.setSelectionRange(
                                (el.selectionStart as number) - 1,
                                el.selectionEnd
                            );
                        }
                    }
                }
            }
            this.checkSelectionOnDeletion(el);
            if (
                this._maskService.prefix.length &&
                (el.selectionStart as number) <= this._maskService.prefix.length &&
                (el.selectionEnd as number) <= this._maskService.prefix.length
            ) {
                e.preventDefault();
            }
            const cursorStart: number | null = el.selectionStart;
            if (
                e.key === 'Backspace' &&
                !el.readOnly &&
                cursorStart === 0 &&
                el.selectionEnd === el.value.length &&
                el.value.length !== 0
            ) {
                this._position = this._maskService.prefix ? this._maskService.prefix.length : 0;
                this._maskService.applyMask(
                    this._maskService.prefix,
                    this._maskService.maskExpression,
                    this._position
                );
            }
        }
        if (
            !!this.suffix &&
            this.suffix.length > 1 &&
            this._inputValue.length - this.suffix.length < (el.selectionStart as number)
        ) {
            el.setSelectionRange(
                this._inputValue.length - this.suffix.length,
                this._inputValue.length
            );
        } else if (
            (e.code === 'KeyA' && e.ctrlKey) ||
            (e.code === 'KeyA' && e.metaKey) // Cmd + A (Mac)
        ) {
            el.setSelectionRange(0, this._getActualInputLength());
            e.preventDefault();
        }
        this._maskService.selStart = el.selectionStart;
        this._maskService.selEnd = el.selectionEnd;
    }

    /** It writes the value in the input */
    public async writeValue(
        inputValue: string | number | { value: string | number; disable?: boolean }
    ): Promise<void> {
        if (typeof inputValue === 'object' && inputValue !== null && 'value' in inputValue) {
            if ('disable' in inputValue) {
                this.setDisabledState(Boolean(inputValue.disable));
            }
            // eslint-disable-next-line no-param-reassign
            inputValue = inputValue.value;
        }

        if (
            typeof inputValue === 'number' ||
            this._maskValue.startsWith(MaskExpression.SEPARATOR)
        ) {
            // eslint-disable-next-line no-param-reassign
            inputValue = String(inputValue);
            const localeDecimalMarker = this._currentLocaleDecimalMarker();
            if (!Array.isArray(this._maskService.decimalMarker)) {
                // eslint-disable-next-line no-param-reassign
                inputValue =
                    this._maskService.decimalMarker !== localeDecimalMarker
                        ? inputValue.replace(localeDecimalMarker, this._maskService.decimalMarker)
                        : inputValue;
            }
            if (
                this._maskService.leadZero &&
                inputValue &&
                this.maskExpression &&
                this.dropSpecialCharacters !== false
            ) {
                // eslint-disable-next-line no-param-reassign
                inputValue = this._maskService._checkPrecision(
                    this.maskExpression.toString(),
                    inputValue as string
                );
            }
            if (this._maskService.decimalMarker === MaskExpression.COMMA) {
                // eslint-disable-next-line no-param-reassign
                inputValue = inputValue
                    .toString()
                    .replace(MaskExpression.DOT, MaskExpression.COMMA);
            }
            this._maskService.isNumberValue = true;
        }

        if (typeof inputValue !== 'string') {
            // eslint-disable-next-line no-param-reassign
            inputValue = '';
        }

        this._inputValue = inputValue;
        this._setMask();
        if (
            (inputValue && this._maskService.maskExpression) ||
            (this._maskService.maskExpression &&
                (this._maskService.prefix || this._maskService.showMaskTyped))
        ) {
            // Let the service we know we are writing value so that triggering onChange function won't happen during applyMask
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

    public registerOnChange(fn: typeof this.onChange): void {
        this._maskService.onChange = this.onChange = fn;
    }

    public registerOnTouched(fn: typeof this.onTouch): void {
        this.onTouch = fn;
    }

    private _getActiveElement(document: DocumentOrShadowRoot = this.document): Element | null {
        const shadowRootEl = document?.activeElement?.shadowRoot;
        if (!shadowRootEl?.activeElement) {
            return document.activeElement;
        } else {
            return this._getActiveElement(shadowRootEl);
        }
    }

    public checkSelectionOnDeletion(el: HTMLInputElement): void {
        el.selectionStart = Math.min(
            Math.max(this.prefix.length, el.selectionStart as number),
            this._inputValue.length - this.suffix.length
        );
        el.selectionEnd = Math.min(
            Math.max(this.prefix.length, el.selectionEnd as number),
            this._inputValue.length - this.suffix.length
        );
    }

    /** It disables the input element */
    public setDisabledState(isDisabled: boolean): void {
        this._maskService.formElementProperty = ['disabled', isDisabled];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _applyMask(): any {
        this._maskService.maskExpression = this._maskService._repeatPatternSymbols(
            this._maskValue || ''
        );
        this._maskService.formElementProperty = [
            'value',
            this._maskService.applyMask(this._inputValue, this._maskService.maskExpression),
        ];
    }

    private _validateTime(value: string): ValidationErrors | null {
        const rowMaskLen: number = this._maskValue
            .split(MaskExpression.EMPTY_STRING)
            .filter((s: string) => s !== ':').length;
        if (!value) {
            return null; // Don't validate empty values to allow for optional form control
        }

        if (
            (+(value[value.length - 1] ?? -1) === 0 && value.length < rowMaskLen) ||
            value.length <= rowMaskLen - 2
        ) {
            return this._createValidationError(value);
        }

        return null;
    }

    // private _validateEmail(value: string): ValidationErrors | null {
    //     const afterDot: string | undefined = value.split('.')[1];
    //     if (afterDot && afterDot.length > 1) {
    //         return null;
    //     }
    //     if (value) {
    //         return this._createValidationError(value);
    //     }
    //     if (!value) {
    //         return null;
    //     }
    //     return null;
    // }

    private _getActualInputLength() {
        return (
            this._maskService.actualValue.length ||
            this._maskService.actualValue.length + this._maskService.prefix.length
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
        this._maskExpressionArray.some((mask): boolean | void => {
            const specialChart: boolean = mask
                .split(MaskExpression.EMPTY_STRING)
                .some((char) => this._maskService.specialCharacters.includes(char));
            if (
                (specialChart && this._inputValue && !mask.includes(MaskExpression.LETTER_S)) ||
                mask.includes(MaskExpression.CURLY_BRACKETS_LEFT)
            ) {
                const test =
                    this._maskService.removeMask(this._inputValue)?.length <=
                    this._maskService.removeMask(mask)?.length;
                if (test) {
                    this._maskValue =
                        this.maskExpression =
                        this._maskService.maskExpression =
                            mask.includes(MaskExpression.CURLY_BRACKETS_LEFT)
                                ? this._maskService._repeatPatternSymbols(mask)
                                : mask;
                    return test;
                } else {
                    const expression =
                        this._maskExpressionArray[this._maskExpressionArray.length - 1] ??
                        MaskExpression.EMPTY_STRING;
                    this._maskValue =
                        this.maskExpression =
                        this._maskService.maskExpression =
                            expression.includes(MaskExpression.CURLY_BRACKETS_LEFT)
                                ? this._maskService._repeatPatternSymbols(expression)
                                : expression;
                }
            } else {
                const check: boolean = this._inputValue
                    ?.split(MaskExpression.EMPTY_STRING)
                    .every((character, index) => {
                        const indexMask = mask.charAt(index);
                        return this._maskService._checkSymbolMask(character, indexMask);
                    });
                if (check) {
                    this._maskValue = this.maskExpression = this._maskService.maskExpression = mask;
                    return check;
                }
            }
        });
    }

    private _currentLocaleDecimalMarker(): string {
        return (1.1).toLocaleString().substring(1, 2);
    }
}
