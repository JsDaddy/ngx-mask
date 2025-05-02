import { DOCUMENT } from '@angular/common';
import type { OnChanges, SimpleChanges } from '@angular/core';
import { signal, input, output, Directive, HostListener, inject } from '@angular/core';
import type {
    ControlValueAccessor,
    FormControl,
    ValidationErrors,
    Validator,
} from '@angular/forms';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { CustomKeyboardEvent } from './custom-keyboard-event';
import type { NgxMaskConfig } from './ngx-mask.config';
import { NGX_MASK_CONFIG, timeMasks, withoutValidation } from './ngx-mask.config';
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
    public mask = input<string | undefined | null>('');
    public specialCharacters = input<NgxMaskConfig['specialCharacters']>([]);
    public patterns = input<NgxMaskConfig['patterns']>({});
    public prefix = input<NgxMaskConfig['prefix']>('');
    public suffix = input<NgxMaskConfig['suffix']>('');
    public thousandSeparator = input<NgxMaskConfig['thousandSeparator']>(' ');
    public decimalMarker = input<NgxMaskConfig['decimalMarker']>('.');
    public dropSpecialCharacters = input<NgxMaskConfig['dropSpecialCharacters'] | null>(null);
    public hiddenInput = input<NgxMaskConfig['hiddenInput'] | null>(null);
    public showMaskTyped = input<NgxMaskConfig['showMaskTyped'] | null>(null);
    public placeHolderCharacter = input<NgxMaskConfig['placeHolderCharacter'] | null>(null);
    public shownMaskExpression = input<NgxMaskConfig['shownMaskExpression'] | null>(null);
    public clearIfNotMatch = input<NgxMaskConfig['clearIfNotMatch'] | null>(null);
    public validation = input<NgxMaskConfig['validation'] | null>(null);
    public separatorLimit = input<NgxMaskConfig['separatorLimit'] | null>('');
    public allowNegativeNumbers = input<NgxMaskConfig['allowNegativeNumbers'] | null>(null);
    public leadZeroDateTime = input<NgxMaskConfig['leadZeroDateTime'] | null>(null);
    public leadZero = input<NgxMaskConfig['leadZero'] | null>(null);
    public triggerOnMaskChange = input<NgxMaskConfig['triggerOnMaskChange'] | null>(null);
    public apm = input<NgxMaskConfig['apm'] | null>(null);
    public inputTransformFn = input<NgxMaskConfig['inputTransformFn'] | null>(null);
    public outputTransformFn = input<NgxMaskConfig['outputTransformFn'] | null>(null);
    public keepCharacterPositions = input<NgxMaskConfig['keepCharacterPositions'] | null>(null);
    public instantPrefix = input<NgxMaskConfig['instantPrefix'] | null>(null);

    public maskFilled = output<void>();

    private _maskValue = signal<string>('');
    private _inputValue = signal<string>('');
    private _position = signal<number | null>(null);
    private _code = signal<string>('');
    private _maskExpressionArray = signal<string[]>([]);
    private _justPasted = signal<boolean>(false);
    private _isFocused = signal<boolean>(false);
    /**For IME composition event */
    private _isComposing = signal<boolean>(false);

    public _maskService = inject(NgxMaskService, { self: true });

    private readonly document = inject(DOCUMENT);

    protected _config = inject<NgxMaskConfig>(NGX_MASK_CONFIG);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onChange = (_: any) => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onTouch = () => {};

    public ngOnChanges(changes: SimpleChanges): void {
        const {
            mask,
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
            clearIfNotMatch,
            validation,
            separatorLimit,
            allowNegativeNumbers,
            leadZeroDateTime,
            leadZero,
            triggerOnMaskChange,
            apm,
            inputTransformFn,
            outputTransformFn,
            keepCharacterPositions,
            instantPrefix,
        } = changes;
        if (mask) {
            if (mask.currentValue !== mask.previousValue && !mask.firstChange) {
                this._maskService.maskChanged = true;
            }
            if (mask.currentValue && mask.currentValue.split(MaskExpression.OR).length > 1) {
                this._maskExpressionArray.set(
                    mask.currentValue.split(MaskExpression.OR).sort((a: string, b: string) => {
                        return a.length - b.length;
                    })
                );
                this._setMask();
            } else {
                this._maskExpressionArray.set([]);
                this._maskValue.set(mask.currentValue || MaskExpression.EMPTY_STRING);
                this._maskService.maskExpression = this._maskValue();
            }
        }
        if (specialCharacters) {
            if (!specialCharacters.currentValue || !Array.isArray(specialCharacters.currentValue)) {
                return;
            } else {
                this._maskService.specialCharacters = specialCharacters.currentValue || [];
            }
        }
        if (allowNegativeNumbers) {
            this._maskService.allowNegativeNumbers = allowNegativeNumbers.currentValue;
            if (this._maskService.allowNegativeNumbers) {
                this._maskService.specialCharacters = this._maskService.specialCharacters.filter(
                    (c: string) => c !== MaskExpression.MINUS
                );
            }
        }
        // Only overwrite the mask available patterns if a pattern has actually been passed in
        if (patterns && patterns.currentValue) {
            this._maskService.patterns = patterns.currentValue;
        }
        if (apm && apm.currentValue) {
            this._maskService.apm = apm.currentValue;
        }

        if (instantPrefix) {
            this._maskService.instantPrefix = instantPrefix.currentValue;
        }
        if (prefix) {
            this._maskService.prefix = prefix.currentValue;
        }
        if (suffix) {
            this._maskService.suffix = suffix.currentValue;
        }
        if (thousandSeparator) {
            this._maskService.thousandSeparator = thousandSeparator.currentValue;
            if (thousandSeparator.previousValue && thousandSeparator.currentValue) {
                const previousDecimalMarker = this._maskService.decimalMarker;

                if (thousandSeparator.currentValue === this._maskService.decimalMarker) {
                    this._maskService.decimalMarker =
                        thousandSeparator.currentValue === MaskExpression.COMMA
                            ? MaskExpression.DOT
                            : MaskExpression.COMMA;
                }
                if (this._maskService.dropSpecialCharacters === true) {
                    this._maskService.specialCharacters = this._config.specialCharacters;
                }
                if (
                    typeof previousDecimalMarker === 'string' &&
                    typeof this._maskService.decimalMarker === 'string'
                ) {
                    this._inputValue.set(
                        this._inputValue()
                            .split(thousandSeparator.previousValue)
                            .join('')
                            .replace(previousDecimalMarker, this._maskService.decimalMarker)
                    );
                    this._maskService.actualValue = this._inputValue();
                }
                this._maskService.writingValue = true;
            }
        }
        if (decimalMarker) {
            this._maskService.decimalMarker = decimalMarker.currentValue;
        }
        if (dropSpecialCharacters) {
            this._maskService.dropSpecialCharacters = dropSpecialCharacters.currentValue;
        }
        if (hiddenInput) {
            this._maskService.hiddenInput = hiddenInput.currentValue;
            if (hiddenInput.previousValue === true && hiddenInput.currentValue === false) {
                this._inputValue.set(this._maskService.actualValue);
            }
        }
        if (showMaskTyped) {
            this._maskService.showMaskTyped = showMaskTyped.currentValue;
            if (
                showMaskTyped.previousValue === false &&
                showMaskTyped.currentValue === true &&
                this._isFocused()
            ) {
                requestAnimationFrame(() => {
                    this._maskService._elementRef?.nativeElement.click();
                });
            }
        }
        if (placeHolderCharacter) {
            this._maskService.placeHolderCharacter = placeHolderCharacter.currentValue;
        }
        if (shownMaskExpression) {
            this._maskService.shownMaskExpression = shownMaskExpression.currentValue;
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
        if (inputTransformFn) {
            this._maskService.inputTransformFn = inputTransformFn.currentValue;
        }
        if (outputTransformFn) {
            this._maskService.outputTransformFn = outputTransformFn.currentValue;
        }
        if (keepCharacterPositions) {
            this._maskService.keepCharacterPositions = keepCharacterPositions.currentValue;
        }
        this._applyMask();
    }

    public validate({ value }: FormControl): ValidationErrors | null {
        const processedValue: string = typeof value === 'number' ? String(value) : value;
        const maskValue = this._maskValue();

        if (!this._maskService.validation || !maskValue) {
            return null;
        }
        if (this._maskService.ipError) {
            return this._createValidationError(processedValue);
        }
        if (this._maskService.cpfCnpjError) {
            return this._createValidationError(processedValue);
        }
        if (maskValue.startsWith(MaskExpression.SEPARATOR)) {
            return null;
        }
        if (withoutValidation.includes(maskValue)) {
            return null;
        }
        if (this._maskService.clearIfNotMatch) {
            return null;
        }
        if (timeMasks.includes(maskValue)) {
            return this._validateTime(processedValue);
        }
        if (maskValue === MaskExpression.EMAIL_MASK) {
            const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;

            if (!emailPattern.test(processedValue) && processedValue) {
                return this._createValidationError(processedValue);
            } else {
                return null;
            }
        }
        if (processedValue && processedValue.length >= 1) {
            let counterOfOpt = 0;

            if (
                maskValue.includes(MaskExpression.CURLY_BRACKETS_LEFT) &&
                maskValue.includes(MaskExpression.CURLY_BRACKETS_RIGHT)
            ) {
                const lengthInsideCurlyBrackets = maskValue.slice(
                    maskValue.indexOf(MaskExpression.CURLY_BRACKETS_LEFT) + 1,
                    maskValue.indexOf(MaskExpression.CURLY_BRACKETS_RIGHT)
                );

                return lengthInsideCurlyBrackets === String(processedValue.length)
                    ? null
                    : this._createValidationError(processedValue);
            }
            if (maskValue.startsWith(MaskExpression.PERCENT)) {
                return null;
            }
            for (const key in this._maskService.patterns) {
                if (this._maskService.patterns[key]?.optional) {
                    if (maskValue.indexOf(key) !== maskValue.lastIndexOf(key)) {
                        const opt: string = maskValue
                            .split(MaskExpression.EMPTY_STRING)
                            .filter((i: string) => i === key)
                            .join(MaskExpression.EMPTY_STRING);
                        counterOfOpt += opt.length;
                    } else if (maskValue.indexOf(key) !== -1) {
                        counterOfOpt++;
                    }
                    if (
                        maskValue.indexOf(key) !== -1 &&
                        processedValue.length >= maskValue.indexOf(key)
                    ) {
                        return null;
                    }
                    if (counterOfOpt === maskValue.length) {
                        return null;
                    }
                }
            }
            if (
                (maskValue.indexOf(MaskExpression.SYMBOL_STAR) > 1 &&
                    processedValue.length < maskValue.indexOf(MaskExpression.SYMBOL_STAR)) ||
                (maskValue.indexOf(MaskExpression.SYMBOL_QUESTION) > 1 &&
                    processedValue.length < maskValue.indexOf(MaskExpression.SYMBOL_QUESTION))
            ) {
                return this._createValidationError(processedValue);
            }
            if (
                maskValue.indexOf(MaskExpression.SYMBOL_STAR) === -1 ||
                maskValue.indexOf(MaskExpression.SYMBOL_QUESTION) === -1
            ) {
                const array = maskValue.split('*');
                const length: number = this._maskService.dropSpecialCharacters
                    ? maskValue.length -
                      this._maskService.checkDropSpecialCharAmount(maskValue) -
                      counterOfOpt
                    : this.prefix()
                      ? maskValue.length + this.prefix().length - counterOfOpt
                      : maskValue.length - counterOfOpt;

                if (array.length === 1) {
                    if (processedValue.length < length) {
                        return this._createValidationError(processedValue);
                    }
                }
                if (array.length > 1) {
                    const lastIndexArray = array[array.length - 1];
                    if (
                        lastIndexArray &&
                        this._maskService.specialCharacters.includes(lastIndexArray[0] as string) &&
                        String(processedValue).includes(lastIndexArray[0] ?? '') &&
                        !this.dropSpecialCharacters()
                    ) {
                        const special = value.split(lastIndexArray[0]);
                        return special[special.length - 1].length === lastIndexArray.length - 1
                            ? null
                            : this._createValidationError(processedValue);
                    } else if (
                        ((lastIndexArray &&
                            !this._maskService.specialCharacters.includes(
                                lastIndexArray[0] as string
                            )) ||
                            !lastIndexArray ||
                            this._maskService.dropSpecialCharacters) &&
                        processedValue.length >= length - 1
                    ) {
                        return null;
                    } else {
                        return this._createValidationError(processedValue);
                    }
                }
            }
            if (
                maskValue.indexOf(MaskExpression.SYMBOL_STAR) === 1 ||
                maskValue.indexOf(MaskExpression.SYMBOL_QUESTION) === 1
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
        this._justPasted.set(true);
    }

    @HostListener('focus', ['$event']) public onFocus() {
        this._isFocused.set(true);
    }

    @HostListener('ngModelChange', ['$event'])
    public onModelChange(value: string | undefined | null | number): void {
        // on form reset we need to update the actualValue
        if (
            (value === MaskExpression.EMPTY_STRING ||
                value === null ||
                typeof value === 'undefined') &&
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
        if (this._isComposing()) {
            return;
        }
        const el: HTMLInputElement = e.target as HTMLInputElement;

        const transformedValue = this._maskService.inputTransformFn
            ? this._maskService.inputTransformFn(el.value)
            : el.value;

        if (el.type !== 'number') {
            if (typeof transformedValue === 'string' || typeof transformedValue === 'number') {
                el.value = transformedValue.toString();

                this._inputValue.set(el.value);
                this._setMask();

                if (!this._maskValue()) {
                    this.onChange(el.value);
                    return;
                }

                let position: number =
                    el.selectionStart === 1
                        ? (el.selectionStart as number) + this._maskService.prefix.length
                        : (el.selectionStart as number);

                if (
                    this.showMaskTyped() &&
                    this.keepCharacterPositions() &&
                    this._maskService.placeHolderCharacter.length === 1
                ) {
                    const suffix = this.suffix();
                    const prefix = this.prefix();
                    const inputSymbol = el.value.slice(position - 1, position);
                    const prefixLength = prefix.length;
                    const checkSymbols: boolean = this._maskService._checkSymbolMask(
                        inputSymbol,
                        this._maskService.maskExpression[position - 1 - prefixLength] ??
                            MaskExpression.EMPTY_STRING
                    );

                    const checkSpecialCharacter: boolean = this._maskService._checkSymbolMask(
                        inputSymbol,
                        this._maskService.maskExpression[position + 1 - prefixLength] ??
                            MaskExpression.EMPTY_STRING
                    );
                    const selectRangeBackspace: boolean =
                        this._maskService.selStart === this._maskService.selEnd;
                    const selStart = Number(this._maskService.selStart) - prefixLength;
                    const selEnd = Number(this._maskService.selEnd) - prefixLength;

                    const backspaceOrDelete =
                        this._code() === MaskExpression.BACKSPACE ||
                        this._code() === MaskExpression.DELETE;

                    if (backspaceOrDelete) {
                        if (!selectRangeBackspace) {
                            if (this._maskService.selStart === prefixLength) {
                                this._maskService.actualValue = `${prefix}${this._maskService.maskIsShown.slice(0, selEnd)}${this._inputValue().split(prefix).join('')}`;
                            } else if (
                                this._maskService.selStart ===
                                this._maskService.maskIsShown.length + prefixLength
                            ) {
                                this._maskService.actualValue = `${this._inputValue()}${this._maskService.maskIsShown.slice(selStart, selEnd)}`;
                            } else {
                                this._maskService.actualValue = `${prefix}${this._inputValue()
                                    .split(prefix)
                                    .join('')
                                    .slice(
                                        0,
                                        selStart
                                    )}${this._maskService.maskIsShown.slice(selStart, selEnd)}${this._maskService.actualValue.slice(
                                    selEnd + prefixLength,
                                    this._maskService.maskIsShown.length + prefixLength
                                )}${suffix}`;
                            }
                        } else if (
                            !this._maskService.specialCharacters.includes(
                                this._maskService.maskExpression.slice(
                                    position - prefixLength,
                                    position + 1 - prefixLength
                                )
                            ) &&
                            selectRangeBackspace
                        ) {
                            if (selStart === 1 && prefix) {
                                this._maskService.actualValue = `${prefix}${this._maskService.placeHolderCharacter}${el.value
                                    .split(prefix)
                                    .join('')
                                    .split(suffix)
                                    .join('')}${suffix}`;

                                position = position - 1;
                            } else {
                                const part1 = el.value.substring(0, position);
                                const part2 = el.value.substring(position);
                                this._maskService.actualValue = `${part1}${this._maskService.placeHolderCharacter}${part2}`;
                            }
                        }
                        position = this._code() === MaskExpression.DELETE ? position + 1 : position;
                    }
                    if (!backspaceOrDelete) {
                        if (!checkSymbols && !checkSpecialCharacter && selectRangeBackspace) {
                            position = Number(el.selectionStart) - 1;
                        } else if (
                            this._maskService.specialCharacters.includes(
                                el.value.slice(position, position + 1)
                            ) &&
                            checkSpecialCharacter &&
                            !this._maskService.specialCharacters.includes(
                                el.value.slice(position + 1, position + 2)
                            )
                        ) {
                            this._maskService.actualValue = `${el.value.slice(0, position - 1)}${el.value.slice(position, position + 1)}${inputSymbol}${el.value.slice(position + 2)}`;
                            position = position + 1;
                        } else if (checkSymbols) {
                            if (el.value.length === 1 && position === 1) {
                                this._maskService.actualValue = `${prefix}${inputSymbol}${this._maskService.maskIsShown.slice(
                                    1,
                                    this._maskService.maskIsShown.length
                                )}${suffix}`;
                            } else {
                                this._maskService.actualValue = `${el.value.slice(0, position - 1)}${inputSymbol}${el.value
                                    .slice(position + 1)
                                    .split(suffix)
                                    .join('')}${suffix}`;
                            }
                        } else if (
                            prefix &&
                            el.value.length === 1 &&
                            position - prefixLength === 1 &&
                            this._maskService._checkSymbolMask(
                                el.value,
                                this._maskService.maskExpression[position - 1 - prefixLength] ??
                                    MaskExpression.EMPTY_STRING
                            )
                        ) {
                            this._maskService.actualValue = `${prefix}${el.value}${this._maskService.maskIsShown.slice(
                                1,
                                this._maskService.maskIsShown.length
                            )}${suffix}`;
                        }
                    }
                }

                let caretShift = 0;
                let backspaceShift = false;
                if (this._code() === MaskExpression.DELETE && MaskExpression.SEPARATOR) {
                    this._maskService.deletedSpecialCharacter = true;
                }
                if (
                    this._inputValue().length >= this._maskService.maskExpression.length - 1 &&
                    this._code() !== MaskExpression.BACKSPACE &&
                    this._maskService.maskExpression === MaskExpression.DAYS_MONTHS_YEARS &&
                    position < 10
                ) {
                    const inputSymbol = this._inputValue().slice(position - 1, position);
                    el.value =
                        this._inputValue().slice(0, position - 1) +
                        inputSymbol +
                        this._inputValue().slice(position + 1);
                }
                if (
                    this._maskService.maskExpression === MaskExpression.DAYS_MONTHS_YEARS &&
                    this.leadZeroDateTime()
                ) {
                    if (
                        (position < 3 && Number(el.value) > 31 && Number(el.value) < 40) ||
                        (position === 5 && Number(el.value.slice(3, 5)) > 12)
                    ) {
                        position = position + 2;
                    }
                }
                if (
                    this._maskService.maskExpression === MaskExpression.HOURS_MINUTES_SECONDS &&
                    this.apm()
                ) {
                    if (this._justPasted() && el.value.slice(0, 2) === MaskExpression.DOUBLE_ZERO) {
                        el.value = el.value.slice(1, 2) + el.value.slice(2, el.value.length);
                    }
                    el.value =
                        el.value === MaskExpression.DOUBLE_ZERO
                            ? MaskExpression.NUMBER_ZERO
                            : el.value;
                }

                this._maskService.applyValueChanges(
                    position,
                    this._justPasted(),
                    this._code() === MaskExpression.BACKSPACE ||
                        this._code() === MaskExpression.DELETE,
                    (shift: number, _backspaceShift: boolean) => {
                        this._justPasted.set(false);
                        caretShift = shift;
                        backspaceShift = _backspaceShift;
                    }
                );
                // only set the selection if the element is active
                if (this._getActiveElement() !== el) {
                    return;
                }

                if (this._maskService.plusOnePosition) {
                    position = position + 1;
                    this._maskService.plusOnePosition = false;
                }
                // update position after applyValueChanges to prevent cursor on wrong position when it has an array of maskExpression
                if (this._maskExpressionArray().length) {
                    if (this._code() === MaskExpression.BACKSPACE) {
                        const specialChartMinusOne = this.specialCharacters().includes(
                            this._maskService.actualValue.slice(position - 1, position)
                        );
                        const allowFewMaskChangeMask =
                            this._maskService.removeMask(this._inputValue())?.length ===
                            this._maskService.removeMask(this._maskService.maskExpression)?.length;

                        const specialChartPlusOne = this.specialCharacters().includes(
                            this._maskService.actualValue.slice(position, position + 1)
                        );
                        if (allowFewMaskChangeMask && !specialChartPlusOne) {
                            position = (el.selectionStart as number) + 1;
                        } else {
                            position = specialChartMinusOne ? position - 1 : position;
                        }
                    } else {
                        position =
                            el.selectionStart === 1
                                ? (el.selectionStart as number) + this._maskService.prefix.length
                                : (el.selectionStart as number);
                    }
                }
                this._position.set(
                    this._position() === 1 && this._inputValue().length === 1
                        ? null
                        : this._position()
                );
                let positionToApply: number = this._position()
                    ? this._inputValue().length + position + caretShift
                    : position +
                      (this._code() === MaskExpression.BACKSPACE && !backspaceShift
                          ? 0
                          : caretShift);
                if (positionToApply > this._getActualInputLength()) {
                    positionToApply =
                        el.value === this._maskService.decimalMarker && el.value.length === 1
                            ? this._getActualInputLength() + 1
                            : this._getActualInputLength();
                }
                if (positionToApply < 0) {
                    positionToApply = 0;
                }
                el.setSelectionRange(positionToApply, positionToApply);
                this._position.set(null);
            } else {
                // eslint-disable-next-line no-console
                console.warn(
                    'Ngx-mask writeValue work with string | number, your current value:',
                    typeof transformedValue
                );
            }
        } else {
            if (!this._maskValue()) {
                this.onChange(el.value);
                return;
            }
            this._maskService.applyValueChanges(
                el.value.length,
                this._justPasted(),
                this._code() === MaskExpression.BACKSPACE || this._code() === MaskExpression.DELETE
            );
        }
    }

    // IME starts
    @HostListener('compositionstart', ['$event'])
    public onCompositionStart(): void {
        this._isComposing.set(true);
    }

    // IME completes
    @HostListener('compositionend', ['$event'])
    public onCompositionEnd(e: CustomKeyboardEvent): void {
        this._isComposing.set(false);
        this._justPasted.set(true);
        this.onInput(e);
    }

    @HostListener('blur', ['$event'])
    public onBlur(e: CustomKeyboardEvent): void {
        if (this._maskValue()) {
            const el: HTMLInputElement = e.target as HTMLInputElement;
            if (
                this._maskService.leadZero &&
                el.value.length > 0 &&
                typeof this._maskService.decimalMarker === 'string'
            ) {
                const maskExpression = this._maskService.maskExpression;
                const decimalMarker = this._maskService.decimalMarker as string;
                const suffix = this._maskService.suffix;
                const precision = Number(
                    this._maskService.maskExpression.slice(
                        maskExpression.length - 1,
                        maskExpression.length
                    )
                );

                if (precision > 0) {
                    el.value = suffix ? el.value.split(suffix).join('') : el.value;
                    const decimalPart = el.value.split(decimalMarker)[1] as string;

                    el.value = el.value.includes(decimalMarker)
                        ? el.value +
                          MaskExpression.NUMBER_ZERO.repeat(precision - decimalPart.length) +
                          suffix
                        : el.value +
                          decimalMarker +
                          MaskExpression.NUMBER_ZERO.repeat(precision) +
                          suffix;
                    this._maskService.actualValue = el.value;
                }
            }
            this._maskService.clearIfNotMatchFn();
        }
        this._isFocused.set(false);
        this.onTouch();
    }

    @HostListener('click', ['$event'])
    public onClick(e: MouseEvent | CustomKeyboardEvent): void {
        if (!this._maskValue()) {
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
            (e as any).keyCode !== 38
        ) {
            if (this._maskService.showMaskTyped && !this.keepCharacterPositions()) {
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
            el.type !== 'number' &&
            ((el.selectionStart as number) || (el.selectionEnd as number)) <=
                this._maskService.prefix.length
        ) {
            const specialCharactersAtTheStart =
                this._maskService.maskExpression.match(
                    new RegExp(
                        `^[${this._maskService.specialCharacters.map((c) => `\\${c}`).join('')}]+`
                    )
                )?.[0].length || 0;

            el.selectionStart = this._maskService.prefix.length + specialCharactersAtTheStart;
            return;
        }
        /** select only inserted text */
        if (el && (el.selectionEnd as number) > this._getActualInputLength()) {
            el.selectionEnd = this._getActualInputLength();
        }
    }

    @HostListener('keydown', ['$event'])
    public onKeyDown(e: CustomKeyboardEvent): void {
        if (!this._maskValue()) {
            return;
        }

        if (this._isComposing()) {
            // User finalize their choice from IME composition, so trigger onInput() for the composed text.
            if (e.key === 'Enter') {
                this.onCompositionEnd(e);
            }
            return;
        }

        this._code.set(e.code ? e.code : e.key);
        const el: HTMLInputElement = e.target as HTMLInputElement;
        this._inputValue.set(el.value);
        this._setMask();

        if (el.type !== 'number') {
            if (e.key === MaskExpression.ARROW_UP) {
                e.preventDefault();
            }
            if (
                e.key === MaskExpression.ARROW_LEFT ||
                e.key === MaskExpression.BACKSPACE ||
                e.key === MaskExpression.DELETE
            ) {
                if (e.key === MaskExpression.BACKSPACE && el.value.length === 0) {
                    el.selectionStart = el.selectionEnd;
                }
                if (e.key === MaskExpression.BACKSPACE && (el.selectionStart as number) !== 0) {
                    const prefixLength = this.prefix().length;
                    // If specialChars is false, (shouldn't ever happen) then set to the defaults
                    const specialCharacters = this.specialCharacters().length
                        ? this.specialCharacters()
                        : this._config.specialCharacters;

                    if (prefixLength > 1 && (el.selectionStart as number) <= prefixLength) {
                        el.setSelectionRange(prefixLength, el.selectionEnd);
                    } else {
                        if (
                            this._inputValue().length !== (el.selectionStart as number) &&
                            (el.selectionStart as number) !== 1
                        ) {
                            while (
                                specialCharacters.includes(
                                    (
                                        this._inputValue()[(el.selectionStart as number) - 1] ??
                                        MaskExpression.EMPTY_STRING
                                    ).toString()
                                ) &&
                                ((prefixLength >= 1 &&
                                    (el.selectionStart as number) > prefixLength) ||
                                    prefixLength === 0)
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
                    e.key === MaskExpression.BACKSPACE &&
                    !el.readOnly &&
                    cursorStart === 0 &&
                    el.selectionEnd === el.value.length &&
                    el.value.length !== 0
                ) {
                    this._position.set(
                        this._maskService.prefix ? this._maskService.prefix.length : 0
                    );
                    this._maskService.applyMask(
                        this._maskService.prefix,
                        this._maskService.maskExpression,
                        this._position() as number
                    );
                }
            }
            if (
                !!this.suffix() &&
                this.suffix().length > 1 &&
                this._inputValue().length - this.suffix().length < (el.selectionStart as number)
            ) {
                el.setSelectionRange(
                    this._inputValue().length - this.suffix().length,
                    this._inputValue().length
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
    }

    /** It writes the value in the input */
    public async writeValue(controlValue: unknown): Promise<void> {
        let value = controlValue;
        const inputTransformFn = this._maskService.inputTransformFn;
        if (typeof value === 'object' && value !== null && 'value' in value) {
            if ('disable' in value) {
                this.setDisabledState(Boolean(value.disable));
            }

            value = value.value;
        }
        if (value !== null) {
            value = inputTransformFn ? inputTransformFn(value) : value;
        }
        if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            value === null ||
            typeof value === 'undefined'
        ) {
            if (value === null || typeof value === 'undefined' || value === '') {
                this._maskService.currentValue = '';
                this._maskService.previousValue = '';
            }

            let inputValue: string | number | null | undefined = value;
            if (
                typeof inputValue === 'number' ||
                this._maskValue().startsWith(MaskExpression.SEPARATOR)
            ) {
                inputValue = String(inputValue);
                const localeDecimalMarker = this._maskService.currentLocaleDecimalMarker();
                if (!Array.isArray(this._maskService.decimalMarker)) {
                    inputValue =
                        this._maskService.decimalMarker !== localeDecimalMarker
                            ? inputValue.replace(
                                  localeDecimalMarker,
                                  this._maskService.decimalMarker
                              )
                            : inputValue;
                }

                if (
                    this._maskService.leadZero &&
                    inputValue &&
                    this.mask() &&
                    this.dropSpecialCharacters() !== false
                ) {
                    inputValue = this._maskService._checkPrecision(
                        this._maskService.maskExpression,
                        inputValue as string
                    );
                }

                if (
                    this._maskService.decimalMarker === MaskExpression.COMMA ||
                    (Array.isArray(this._maskService.decimalMarker) &&
                        this._maskService.thousandSeparator === MaskExpression.DOT)
                ) {
                    inputValue = inputValue
                        .toString()
                        .replace(MaskExpression.DOT, MaskExpression.COMMA);
                }
                if (this.mask()?.startsWith(MaskExpression.SEPARATOR) && this.leadZero()) {
                    requestAnimationFrame(() => {
                        this._maskService.applyMask(
                            inputValue?.toString() ?? '',
                            this._maskService.maskExpression
                        );
                    });
                }
                this._maskService.isNumberValue = true;
            }

            if (typeof inputValue !== 'string' || value === null || typeof value === 'undefined') {
                inputValue = '';
            }

            this._inputValue.set(inputValue);
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
            this._inputValue.set(inputValue);
        } else {
            // eslint-disable-next-line no-console
            console.warn(
                'Ngx-mask writeValue work with string | number, your current value:',
                typeof value
            );
        }
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
        const prefixLength = this.prefix().length;
        const suffixLength = this.suffix().length;
        const inputValueLength = this._inputValue().length;

        el.selectionStart = Math.min(
            Math.max(prefixLength, el.selectionStart as number),
            inputValueLength - suffixLength
        );
        el.selectionEnd = Math.min(
            Math.max(prefixLength, el.selectionEnd as number),
            inputValueLength - suffixLength
        );
    }

    /** It disables the input element */
    public setDisabledState(isDisabled: boolean): void {
        this._maskService.formElementProperty = ['disabled', isDisabled];
    }

    private _applyMask(): any {
        this._maskService.maskExpression = this._maskService._repeatPatternSymbols(
            this._maskValue() || ''
        );
        this._maskService.formElementProperty = [
            'value',
            this._maskService.applyMask(this._inputValue(), this._maskService.maskExpression),
        ];
    }

    private _validateTime(value: string): ValidationErrors | null {
        const rowMaskLen: number = this._maskValue()
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

    private _getActualInputLength() {
        return (
            this._maskService.actualValue.length ||
            this._maskService.actualValue.length + this._maskService.prefix.length
        );
    }

    private _createValidationError(actualValue: string): ValidationErrors {
        return {
            mask: {
                requiredMask: this._maskValue(),
                actualValue,
            },
        };
    }

    private _setMask() {
        this._maskExpressionArray().some((mask): boolean | void => {
            const specialChart: boolean = mask
                .split(MaskExpression.EMPTY_STRING)
                .some((char) => this._maskService.specialCharacters.includes(char));
            if (
                (specialChart &&
                    this._inputValue() &&
                    this._areAllCharactersInEachStringSame(this._maskExpressionArray())) ||
                mask.includes(MaskExpression.CURLY_BRACKETS_LEFT)
            ) {
                const test =
                    this._maskService.removeMask(this._inputValue())?.length <=
                    this._maskService.removeMask(mask)?.length;
                if (test) {
                    const maskValue = mask.includes(MaskExpression.CURLY_BRACKETS_LEFT)
                        ? this._maskService._repeatPatternSymbols(mask)
                        : mask;
                    this._maskValue.set(maskValue);
                    this._maskService.maskExpression = maskValue;
                    return test;
                } else {
                    const expression =
                        this._maskExpressionArray()[this._maskExpressionArray().length - 1] ??
                        MaskExpression.EMPTY_STRING;

                    const maskValue = expression.includes(MaskExpression.CURLY_BRACKETS_LEFT)
                        ? this._maskService._repeatPatternSymbols(expression)
                        : expression;
                    this._maskValue.set(maskValue);
                    this._maskService.maskExpression = maskValue;
                }
            } else {
                const cleanMask = this._maskService.removeMask(mask);
                const check: boolean = this._maskService
                    .removeMask(this._inputValue())
                    ?.split(MaskExpression.EMPTY_STRING)
                    .every((character, index) => {
                        const indexMask = cleanMask.charAt(index);
                        return this._maskService._checkSymbolMask(character, indexMask);
                    });

                if (check || this._justPasted()) {
                    this._maskValue.set(mask);
                    this._maskService.maskExpression = mask;
                    return check;
                }
            }
        });
    }

    private _areAllCharactersInEachStringSame(array: string[]): boolean {
        const specialCharacters = this._maskService.specialCharacters;

        function removeSpecialCharacters(str: string): string {
            const regex = new RegExp(`[${specialCharacters.map((ch) => `\\${ch}`).join('')}]`, 'g');
            return str.replace(regex, '');
        }

        const processedArr = array.map(removeSpecialCharacters);

        return processedArr.every((str) => {
            const uniqueCharacters = new Set(str);
            return uniqueCharacters.size === 1;
        });
    }
}
