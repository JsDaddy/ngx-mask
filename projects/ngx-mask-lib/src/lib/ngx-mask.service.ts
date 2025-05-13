import { ElementRef, inject, Injectable, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import type { NgxMaskConfig } from './ngx-mask.config';
import { NGX_MASK_CONFIG } from './ngx-mask.config';
import { NgxMaskApplierService } from './ngx-mask-applier.service';
import { MaskExpression } from './ngx-mask-expression.enum';

@Injectable()
export class NgxMaskService extends NgxMaskApplierService {
    public isNumberValue = false;
    public maskIsShown = '';
    public selStart: number | null = null;
    public selEnd: number | null = null;
    public maskChanged = false;
    public maskExpressionArray: string[] = [];
    public previousValue = '';
    public currentValue = '';
    /**
     * Whether we are currently in writeValue function, in this case when applying the mask we don't want to trigger onChange function,
     * since writeValue should be a one way only process of writing the DOM value based on the Angular model value.
     */
    public writingValue = false;

    private _emitValue = false;
    private _start!: number;
    private _end!: number;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onChange = (_: any) => {};

    public readonly _elementRef = inject(ElementRef, { optional: true });

    private readonly document = inject(DOCUMENT);

    protected override _config = inject<NgxMaskConfig>(NGX_MASK_CONFIG);

    private readonly _renderer = inject(Renderer2, { optional: true });

    /**
     * Applies the mask to the input value.
     * @param inputValue The input value to be masked.
     * @param maskExpression The mask expression to apply.
     * @param position The position in the input value.
     * @param justPasted Whether the value was just pasted.
     * @param backspaced Whether the value was backspaced.
     * @param cb Callback function.
     * @returns The masked value.
     */
    public override applyMask(
        inputValue: string,
        maskExpression: string,
        position = 0,
        justPasted = false,
        backspaced = false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        cb: (...args: any[]) => any = () => {}
    ): string {
        // If no mask expression, return the input value or the actual value
        if (!maskExpression) {
            return inputValue !== this.actualValue ? this.actualValue : inputValue;
        }

        // Show mask in input if required
        this.maskIsShown = this.showMaskTyped
            ? this.showMaskInInput()
            : MaskExpression.EMPTY_STRING;

        // Handle specific mask expressions
        if (this.maskExpression === MaskExpression.IP && this.showMaskTyped) {
            this.maskIsShown = this.showMaskInInput(inputValue || MaskExpression.HASH);
        }
        if (this.maskExpression === MaskExpression.CPF_CNPJ && this.showMaskTyped) {
            this.maskIsShown = this.showMaskInInput(inputValue || MaskExpression.HASH);
        }

        // Handle empty input value with mask typed
        if (!inputValue && this.showMaskTyped) {
            this.formControlResult(this.prefix);
            return `${this.prefix}${this.maskIsShown}${this.suffix}`;
        }

        const getSymbol: string =
            !!inputValue && typeof this.selStart === 'number'
                ? (inputValue[this.selStart] ?? MaskExpression.EMPTY_STRING)
                : MaskExpression.EMPTY_STRING;
        let newInputValue = '';
        let newPosition = position;

        // Handle hidden input or input with asterisk symbol
        if (
            (this.hiddenInput ||
                (inputValue && inputValue.indexOf(MaskExpression.SYMBOL_STAR) >= 0)) &&
            !this.writingValue
        ) {
            let actualResult: string[] =
                inputValue && inputValue.length === 1
                    ? inputValue.split(MaskExpression.EMPTY_STRING)
                    : this.actualValue.split(MaskExpression.EMPTY_STRING);

            // Handle backspace
            if (backspaced) {
                actualResult = actualResult
                    .slice(0, position)
                    .concat(actualResult.slice(position + 1));
            }

            // Remove mask if showMaskTyped is true
            if (this.showMaskTyped) {
                // eslint-disable-next-line no-param-reassign
                inputValue = this.removeMask(inputValue);
                actualResult = this.removeMask(actualResult.join('')).split(
                    MaskExpression.EMPTY_STRING
                );
            }

            // Handle selection start and end
            if (typeof this.selStart === 'object' && typeof this.selEnd === 'object') {
                this.selStart = Number(this.selStart);
                this.selEnd = Number(this.selEnd);
            } else {
                if (inputValue !== MaskExpression.EMPTY_STRING && actualResult.length) {
                    if (typeof this.selStart === 'number' && typeof this.selEnd === 'number') {
                        if (inputValue.length > actualResult.length) {
                            actualResult.splice(this.selStart, 0, getSymbol);
                        } else if (inputValue.length < actualResult.length) {
                            if (actualResult.length - inputValue.length === 1) {
                                if (backspaced) {
                                    actualResult.splice(this.selStart - 1, 1);
                                } else {
                                    actualResult.splice(inputValue.length - 1, 1);
                                }
                            } else {
                                actualResult.splice(this.selStart, this.selEnd - this.selStart);
                            }
                        }
                    }
                } else {
                    actualResult = [];
                }
            }

            // Remove mask if showMaskTyped is true and hiddenInput is false
            if (this.showMaskTyped && !this.hiddenInput) {
                newInputValue = this.removeMask(inputValue);
            }

            // Handle actual value length
            if (this.actualValue.length) {
                if (actualResult.length < inputValue.length) {
                    newInputValue = this.shiftTypedSymbols(
                        actualResult.join(MaskExpression.EMPTY_STRING)
                    );
                } else if (actualResult.length === inputValue.length) {
                    newInputValue = actualResult.join(MaskExpression.EMPTY_STRING);
                } else {
                    newInputValue = inputValue;
                }
            } else {
                newInputValue = inputValue;
            }
        }

        // Handle just pasted input
        if (justPasted && (this.hiddenInput || !this.hiddenInput)) {
            newInputValue = inputValue;
        }

        // Handle backspace with special characters
        if (
            backspaced &&
            this.specialCharacters.indexOf(
                this.maskExpression[newPosition] ?? MaskExpression.EMPTY_STRING
            ) !== -1 &&
            this.showMaskTyped &&
            !this.prefix
        ) {
            newInputValue = this.currentValue;
        }

        // Handle deleted special character
        if (this.deletedSpecialCharacter && newPosition) {
            if (
                this.specialCharacters.includes(
                    this.actualValue.slice(newPosition, newPosition + 1)
                )
            ) {
                newPosition = newPosition + 1;
            } else if (
                maskExpression.slice(newPosition - 1, newPosition + 1) !== MaskExpression.MONTHS
            ) {
                newPosition = newPosition - 2;
            }

            this.deletedSpecialCharacter = false;
        }

        // Remove mask if showMaskTyped is true and placeHolderCharacter length is 1
        if (
            this.showMaskTyped &&
            this.placeHolderCharacter.length === 1 &&
            !this.leadZeroDateTime
        ) {
            newInputValue = this.removeMask(newInputValue);
        }

        // Handle mask changed
        if (this.maskChanged) {
            newInputValue = inputValue;
        } else {
            newInputValue =
                Boolean(newInputValue) && newInputValue.length ? newInputValue : inputValue;
        }

        // Handle showMaskTyped and keepCharacterPositions
        if (
            this.showMaskTyped &&
            this.keepCharacterPositions &&
            this.actualValue &&
            !justPasted &&
            !this.writingValue
        ) {
            const value = this.dropSpecialCharacters
                ? this.removeMask(this.actualValue)
                : this.actualValue;
            this.formControlResult(value);
            return this.actualValue
                ? this.actualValue
                : `${this.prefix}${this.maskIsShown}${this.suffix}`;
        }

        // Apply the mask using the parent class method
        const result: string = super.applyMask(
            newInputValue,
            maskExpression,
            newPosition,
            justPasted,
            backspaced,
            cb
        );

        this.actualValue = this.getActualValue(result);

        // handle some separator implications:
        // a.) adjust decimalMarker default (. -> ,) if thousandSeparator is a dot
        if (
            this.thousandSeparator === MaskExpression.DOT &&
            this.decimalMarker === MaskExpression.DOT
        ) {
            this.decimalMarker = MaskExpression.COMMA;
        }
        // b) remove decimal marker from list of special characters to mask
        if (
            this.maskExpression.startsWith(MaskExpression.SEPARATOR) &&
            this.dropSpecialCharacters === true
        ) {
            this.specialCharacters = this.specialCharacters.filter(
                (item: string) =>
                    !this._compareOrIncludes(item, this.decimalMarker, this.thousandSeparator) //item !== this.decimalMarker, // !
            );
        }

        // Update previous and current values
        if (result || result === '') {
            this.previousValue = this.currentValue;
            this.currentValue = result;

            this._emitValue =
                this.previousValue !== this.currentValue ||
                (newInputValue !== this.currentValue && this.writingValue) ||
                (this.previousValue === this.currentValue && justPasted);
        }

        // Propagate the input value back to the Angular model
        // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
        this._emitValue ? this.formControlResult(result) : '';

        // Handle hidden input and showMaskTyped
        if (!this.showMaskTyped || (this.showMaskTyped && this.hiddenInput)) {
            if (this.hiddenInput) {
                return `${this.hideInput(result, this.maskExpression)}${this.maskIsShown.slice(result.length)}`;
            }
            return result;
        }

        const resLen: number = result.length;
        const prefNmask = `${this.prefix}${this.maskIsShown}${this.suffix}`;

        // Handle specific mask expressions
        if (this.maskExpression.includes(MaskExpression.HOURS)) {
            const countSkipedSymbol = this._numberSkipedSymbols(result);
            return `${result}${prefNmask.slice(resLen + countSkipedSymbol)}`;
        } else if (
            this.maskExpression === MaskExpression.IP ||
            this.maskExpression === MaskExpression.CPF_CNPJ
        ) {
            return `${result}${prefNmask}`;
        }

        return `${result}${prefNmask.slice(resLen)}`;
    }

    // get the number of characters that were shifted
    private _numberSkipedSymbols(value: string): number {
        const regex = /(^|\D)(\d\D)/g;
        let match = regex.exec(value);
        let countSkipedSymbol = 0;
        while (match != null) {
            countSkipedSymbol += 1;
            match = regex.exec(value);
        }
        return countSkipedSymbol;
    }

    public applyValueChanges(
        position: number,
        justPasted: boolean,
        backspaced: boolean,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        cb: (...args: any[]) => any = () => {}
    ): void {
        const formElement = this._elementRef?.nativeElement;
        if (!formElement) {
            return;
        }

        formElement.value = this.applyMask(
            formElement.value,
            this.maskExpression,
            position,
            justPasted,
            backspaced,
            cb
        );
        if (formElement === this._getActiveElement()) {
            return;
        }
        this.clearIfNotMatchFn();
    }

    public hideInput(inputValue: string, maskExpression: string): string {
        return inputValue
            .split(MaskExpression.EMPTY_STRING)
            .map((curr: string, index: number) => {
                if (
                    this.patterns &&
                    this.patterns[maskExpression[index] ?? MaskExpression.EMPTY_STRING] &&
                    this.patterns[maskExpression[index] ?? MaskExpression.EMPTY_STRING]?.symbol
                ) {
                    return this.patterns[maskExpression[index] ?? MaskExpression.EMPTY_STRING]
                        ?.symbol;
                }
                return curr;
            })
            .join(MaskExpression.EMPTY_STRING);
    }

    // this function is not necessary, it checks result against maskExpression
    public getActualValue(res: string): string {
        const compare: string[] = res
            .split(MaskExpression.EMPTY_STRING)
            .filter((symbol: string, i: number) => {
                const maskChar = this.maskExpression[i] ?? MaskExpression.EMPTY_STRING;
                return (
                    this._checkSymbolMask(symbol, maskChar) ||
                    (this.specialCharacters.includes(maskChar) && symbol === maskChar)
                );
            });
        if (compare.join(MaskExpression.EMPTY_STRING) === res) {
            return compare.join(MaskExpression.EMPTY_STRING);
        }
        return res;
    }

    public shiftTypedSymbols(inputValue: string): string {
        let symbolToReplace = '';
        const newInputValue: (string | undefined)[] =
            (inputValue &&
                inputValue
                    .split(MaskExpression.EMPTY_STRING)
                    .map((currSymbol: string, index: number) => {
                        if (
                            this.specialCharacters.includes(
                                inputValue[index + 1] ?? MaskExpression.EMPTY_STRING
                            ) &&
                            inputValue[index + 1] !== this.maskExpression[index + 1]
                        ) {
                            symbolToReplace = currSymbol;
                            return inputValue[index + 1];
                        }
                        if (symbolToReplace.length) {
                            const replaceSymbol: string = symbolToReplace;
                            symbolToReplace = MaskExpression.EMPTY_STRING;
                            return replaceSymbol;
                        }
                        return currSymbol;
                    })) ||
            [];
        return newInputValue.join(MaskExpression.EMPTY_STRING);
    }

    /**
     * Convert number value to string
     * 3.1415 -> '3.1415'
     * 1e-7 -> '0.0000001'
     */
    public numberToString(value: number | string): string {
        if (
            (!value && value !== 0) ||
            (this.maskExpression.startsWith(MaskExpression.SEPARATOR) &&
                (this.leadZero || !this.dropSpecialCharacters)) ||
            (this.maskExpression.startsWith(MaskExpression.SEPARATOR) &&
                this.separatorLimit.length > 14 &&
                String(value).length > 14)
        ) {
            return String(value);
        }
        return Number(value)
            .toLocaleString('fullwide', {
                useGrouping: false,
                maximumFractionDigits: 20,
            })
            .replace(`/${MaskExpression.MINUS}/`, MaskExpression.MINUS);
    }

    public showMaskInInput(inputVal?: string): string {
        if (this.showMaskTyped && !!this.shownMaskExpression) {
            if (this.maskExpression.length !== this.shownMaskExpression.length) {
                throw new Error('Mask expression must match mask placeholder length');
            } else {
                return this.shownMaskExpression;
            }
        } else if (this.showMaskTyped) {
            if (inputVal) {
                if (this.maskExpression === MaskExpression.IP) {
                    return this._checkForIp(inputVal);
                }
                if (this.maskExpression === MaskExpression.CPF_CNPJ) {
                    return this._checkForCpfCnpj(inputVal);
                }
            }
            if (this.placeHolderCharacter.length === this.maskExpression.length) {
                return this.placeHolderCharacter;
            }
            return this.maskExpression.replace(/\w/g, this.placeHolderCharacter);
        }
        return '';
    }

    public clearIfNotMatchFn(): void {
        const formElement = this._elementRef?.nativeElement;
        if (!formElement) {
            return;
        }
        if (
            this.clearIfNotMatch &&
            this.prefix.length + this.maskExpression.length + this.suffix.length !==
                formElement.value.replace(this.placeHolderCharacter, MaskExpression.EMPTY_STRING)
                    .length
        ) {
            this.formElementProperty = ['value', MaskExpression.EMPTY_STRING];
            this.applyMask('', this.maskExpression);
        }
    }

    public set formElementProperty([name, value]: [string, string | boolean]) {
        if (!this._renderer || !this._elementRef) {
            return;
        }
        //[TODO]: andriikamaldinov1 find better solution
        Promise.resolve().then(() =>
            this._renderer?.setProperty(this._elementRef?.nativeElement, name, value)
        );
    }

    public checkDropSpecialCharAmount(mask: string): number {
        const chars: string[] = mask
            .split(MaskExpression.EMPTY_STRING)
            .filter((item: string) => this._findDropSpecialChar(item));
        return chars.length;
    }

    public removeMask(inputValue: string): string {
        return this._removeMask(
            this._removeSuffix(this._removePrefix(inputValue)),
            this.specialCharacters.concat('_').concat(this.placeHolderCharacter)
        );
    }

    private _checkForIp(inputVal: string): string {
        if (inputVal === MaskExpression.HASH) {
            return `${this.placeHolderCharacter}.${this.placeHolderCharacter}.${this.placeHolderCharacter}.${this.placeHolderCharacter}`;
        }
        const arr: string[] = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < inputVal.length; i++) {
            const value = inputVal[i] ?? MaskExpression.EMPTY_STRING;
            if (!value) {
                continue;
            }
            if (value.match('\\d')) {
                arr.push(value);
            }
        }
        if (arr.length <= 3) {
            return `${this.placeHolderCharacter}.${this.placeHolderCharacter}.${this.placeHolderCharacter}`;
        }
        if (arr.length > 3 && arr.length <= 6) {
            return `${this.placeHolderCharacter}.${this.placeHolderCharacter}`;
        }
        if (arr.length > 6 && arr.length <= 9) {
            return this.placeHolderCharacter;
        }
        if (arr.length > 9 && arr.length <= 12) {
            return '';
        }
        return '';
    }

    private _checkForCpfCnpj(inputVal: string): string {
        const cpf =
            `${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}` +
            `.${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}` +
            `.${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}` +
            `-${this.placeHolderCharacter}${this.placeHolderCharacter}`;
        const cnpj =
            `${this.placeHolderCharacter}${this.placeHolderCharacter}` +
            `.${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}` +
            `.${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}` +
            `/${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}` +
            `-${this.placeHolderCharacter}${this.placeHolderCharacter}`;

        if (inputVal === MaskExpression.HASH) {
            return cpf;
        }
        const arr: string[] = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < inputVal.length; i++) {
            const value = inputVal[i] ?? MaskExpression.EMPTY_STRING;
            if (!value) {
                continue;
            }
            if (value.match('\\d')) {
                arr.push(value);
            }
        }
        if (arr.length <= 3) {
            return cpf.slice(arr.length, cpf.length);
        }
        if (arr.length > 3 && arr.length <= 6) {
            return cpf.slice(arr.length + 1, cpf.length);
        }
        if (arr.length > 6 && arr.length <= 9) {
            return cpf.slice(arr.length + 2, cpf.length);
        }
        if (arr.length > 9 && arr.length < 11) {
            return cpf.slice(arr.length + 3, cpf.length);
        }
        if (arr.length === 11) {
            return '';
        }
        if (arr.length === 12) {
            if (inputVal.length === 17) {
                return cnpj.slice(16, cnpj.length);
            }
            return cnpj.slice(15, cnpj.length);
        }
        if (arr.length > 12 && arr.length <= 14) {
            return cnpj.slice(arr.length + 4, cnpj.length);
        }
        return '';
    }

    /**
     * Recursively determine the current active element by navigating the Shadow DOM until the Active Element is found.
     */
    private _getActiveElement(document: DocumentOrShadowRoot = this.document): Element | null {
        const shadowRootEl = document?.activeElement?.shadowRoot;
        if (!shadowRootEl?.activeElement) {
            return document.activeElement;
        } else {
            return this._getActiveElement(shadowRootEl);
        }
    }

    /**
     * Propogates the input value back to the Angular model by triggering the onChange function. It won't do this if writingValue
     * is true. If that is true it means we are currently in the writeValue function, which is supposed to only update the actual
     * DOM element based on the Angular model value. It should be a one way process, i.e. writeValue should not be modifying the Angular
     * model value too. Therefore, we don't trigger onChange in this scenario.
     * @param inputValue the current form input value
     */
    private formControlResult(inputValue: string): void {
        const outputTransformFn = this.outputTransformFn
            ? this.outputTransformFn
            : (v: unknown) => v;
        this.writingValue = false;
        this.maskChanged = false;
        if (Array.isArray(this.dropSpecialCharacters)) {
            this.onChange(
                outputTransformFn(
                    this._toNumber(
                        this._checkSymbols(
                            this._removeMask(
                                this._removeSuffix(this._removePrefix(inputValue)),
                                this.dropSpecialCharacters
                            )
                        )
                    )
                )
            );
        } else if (
            this.dropSpecialCharacters ||
            (!this.dropSpecialCharacters && this.prefix === inputValue)
        ) {
            this.onChange(
                outputTransformFn(
                    this._toNumber(
                        this._checkSymbols(this._removeSuffix(this._removePrefix(inputValue)))
                    )
                )
            );
        } else {
            this.onChange(outputTransformFn(this._toNumber(inputValue)));
        }
    }

    private _toNumber(value: string | number | undefined | null) {
        if (!this.isNumberValue || value === MaskExpression.EMPTY_STRING) {
            return value;
        }
        if (
            this.maskExpression.startsWith(MaskExpression.SEPARATOR) &&
            (this.leadZero || !this.dropSpecialCharacters)
        ) {
            return value;
        }

        if (String(value).length > 14 && this.maskExpression.startsWith(MaskExpression.SEPARATOR)) {
            return String(value);
        }

        const num = Number(value);
        if (this.maskExpression.startsWith(MaskExpression.SEPARATOR) && Number.isNaN(num)) {
            const val = String(value).replace(',', '.');
            return Number(val);
        }

        return Number.isNaN(num) ? value : num;
    }

    private _removeMask(value: string, specialCharactersForRemove: string[]): string {
        if (
            this.maskExpression.startsWith(MaskExpression.PERCENT) &&
            value.includes(MaskExpression.DOT)
        ) {
            return value;
        }

        return value
            ? value.replace(
                  this._regExpForRemove(specialCharactersForRemove),
                  MaskExpression.EMPTY_STRING
              )
            : value;
    }

    private _removePrefix(value: string): string {
        if (!this.prefix) {
            return value;
        }
        return value ? value.replace(this.prefix, MaskExpression.EMPTY_STRING) : value;
    }

    private _removeSuffix(value: string): string {
        if (!this.suffix) {
            return value;
        }
        return value ? value.replace(this.suffix, MaskExpression.EMPTY_STRING) : value;
    }

    private _retrieveSeparatorValue(result: string): string {
        let specialCharacters = Array.isArray(this.dropSpecialCharacters)
            ? this.specialCharacters.filter((v) => {
                  return (this.dropSpecialCharacters as string[]).includes(v);
              })
            : this.specialCharacters;
        if (
            !this.deletedSpecialCharacter &&
            this._checkPatternForSpace() &&
            result.includes(MaskExpression.WHITE_SPACE) &&
            this.maskExpression.includes(MaskExpression.SYMBOL_STAR)
        ) {
            specialCharacters = specialCharacters.filter(
                (char) => char !== MaskExpression.WHITE_SPACE
            );
        }

        return this._removeMask(result, specialCharacters as string[]);
    }

    private _regExpForRemove(specialCharactersForRemove: string[]): RegExp {
        return new RegExp(
            specialCharactersForRemove.map((item: string) => `\\${item}`).join('|'),
            'gi'
        );
    }

    private _replaceDecimalMarkerToDot(value: string): string {
        const markers = Array.isArray(this.decimalMarker)
            ? this.decimalMarker
            : [this.decimalMarker];

        return value.replace(this._regExpForRemove(markers), MaskExpression.DOT);
    }

    public _checkSymbols(result: string): string | number | undefined | null {
        let processedResult = result;

        if (processedResult === MaskExpression.EMPTY_STRING) {
            return processedResult;
        }

        if (
            this.maskExpression.startsWith(MaskExpression.PERCENT) &&
            this.decimalMarker === MaskExpression.COMMA
        ) {
            processedResult = processedResult.replace(MaskExpression.COMMA, MaskExpression.DOT);
        }
        const separatorPrecision: number | null = this._retrieveSeparatorPrecision(
            this.maskExpression
        );

        const separatorValue: string =
            this.specialCharacters.length === 0
                ? this._retrieveSeparatorValue(processedResult)
                : this._replaceDecimalMarkerToDot(this._retrieveSeparatorValue(processedResult));

        if (!this.isNumberValue) {
            return separatorValue;
        }
        if (separatorPrecision) {
            if (processedResult === this.decimalMarker) {
                return null;
            }
            if (separatorValue.length > 14) {
                return String(separatorValue);
            }
            return this._checkPrecision(this.maskExpression, separatorValue);
        } else {
            return separatorValue;
        }
    }

    private _checkPatternForSpace(): boolean {
        for (const key in this.patterns) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.patterns[key] && this.patterns[key]?.hasOwnProperty('pattern')) {
                const patternString = this.patterns[key]?.pattern.toString();
                const pattern = this.patterns[key]?.pattern;
                if (
                    (patternString?.includes(MaskExpression.WHITE_SPACE) as boolean) &&
                    pattern?.test(this.maskExpression)
                ) {
                    return true;
                }
            }
        }
        return false;
    }
    // TODO should think about helpers or separting decimal precision to own property
    private _retrieveSeparatorPrecision(maskExpretion: string): number | null {
        const matcher: RegExpMatchArray | null = maskExpretion.match(
            new RegExp(`^separator\\.([^d]*)`)
        );
        return matcher ? Number(matcher[1]) : null;
    }

    public _checkPrecision(separatorExpression: string, separatorValue: string): number | string {
        const separatorPrecision = this.getPrecision(separatorExpression);
        let value = separatorValue;

        if (
            separatorExpression.indexOf('2') > 0 ||
            (this.leadZero && Number(separatorPrecision) > 0)
        ) {
            if (this.decimalMarker === MaskExpression.COMMA && this.leadZero) {
                value = value.replace(',', '.');
            }
            return this.leadZero
                ? Number(value).toFixed(Number(separatorPrecision))
                : Number(value).toFixed(2);
        }
        return this.numberToString(value);
    }

    public _repeatPatternSymbols(maskExp: string): string {
        return (
            (maskExp.match(/{[0-9]+}/) &&
                maskExp
                    .split(MaskExpression.EMPTY_STRING)
                    .reduce((accum: string, currVal: string, index: number): string => {
                        this._start =
                            currVal === MaskExpression.CURLY_BRACKETS_LEFT ? index : this._start;
                        if (currVal !== MaskExpression.CURLY_BRACKETS_RIGHT) {
                            return this._findSpecialChar(currVal) ? accum + currVal : accum;
                        }
                        this._end = index;
                        const repeatNumber = Number(maskExp.slice(this._start + 1, this._end));
                        const replaceWith: string = new Array(repeatNumber + 1).join(
                            maskExp[this._start - 1]
                        );
                        if (
                            maskExp.slice(0, this._start).length > 1 &&
                            maskExp.includes(MaskExpression.LETTER_S)
                        ) {
                            const symbols = maskExp.slice(0, this._start - 1);
                            return symbols.includes(MaskExpression.CURLY_BRACKETS_LEFT)
                                ? accum + replaceWith
                                : symbols + accum + replaceWith;
                        } else {
                            return accum + replaceWith;
                        }
                    }, '')) ||
            maskExp
        );
    }

    public currentLocaleDecimalMarker(): string {
        return (1.1).toLocaleString().substring(1, 2);
    }
}
