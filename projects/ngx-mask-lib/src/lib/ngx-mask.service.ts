import { ElementRef, inject, Injectable, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { NGX_MASK_CONFIG, IConfig } from './ngx-mask.config';
import { NgxMaskApplierService } from './ngx-mask-applier.service';
import { MaskExpression } from './ngx-mask-expression.enum';

@Injectable()
export class NgxMaskService extends NgxMaskApplierService {
    public isNumberValue = false;

    public maskIsShown = '';

    public selStart: number | null = null;

    public selEnd: number | null = null;

    /**
     * Whether we are currently in writeValue function, in this case when applying the mask we don't want to trigger onChange function,
     * since writeValue should be a one way only process of writing the DOM value based on the Angular model value.
     */
    public writingValue = false;

    public maskChanged = false;
    public _maskExpressionArray: string[] = [];

    public triggerOnMaskChange = false;

    private _start!: number;

    private _end!: number;

    private _emitValue = false;

    private _previousValue = '';

    private _currentValue = '';
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
    public onChange = (_: any) => {};

    private readonly document = inject(DOCUMENT);

    protected override _config = inject<IConfig>(NGX_MASK_CONFIG);

    private readonly _elementRef = inject(ElementRef, { optional: true });

    private readonly _renderer = inject(Renderer2, { optional: true });

    // eslint-disable-next-line complexity
    public override applyMask(
        inputValue: string,
        maskExpression: string,
        position = 0,
        justPasted = false,
        backspaced = false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
        cb: (...args: any[]) => any = () => {}
    ): string {
        if (!maskExpression) {
            return inputValue !== this.actualValue ? this.actualValue : inputValue;
        }
        this.maskIsShown = this.showMaskTyped
            ? this.showMaskInInput()
            : MaskExpression.EMPTY_STRING;
        if (this.maskExpression === MaskExpression.IP && this.showMaskTyped) {
            this.maskIsShown = this.showMaskInInput(inputValue || MaskExpression.HASH);
        }
        if (this.maskExpression === MaskExpression.CPF_CNPJ && this.showMaskTyped) {
            this.maskIsShown = this.showMaskInInput(inputValue || MaskExpression.HASH);
        }
        if (!inputValue && this.showMaskTyped) {
            this.formControlResult(this.prefix);
            return this.prefix + this.maskIsShown;
        }
        const getSymbol: string =
            !!inputValue && typeof this.selStart === 'number'
                ? inputValue[this.selStart] ?? MaskExpression.EMPTY_STRING
                : MaskExpression.EMPTY_STRING;
        let newInputValue = '';
        if (this.hiddenInput !== undefined && !this.writingValue) {
            let actualResult: string[] =
                inputValue && inputValue.length === 1
                    ? inputValue.split(MaskExpression.EMPTY_STRING)
                    : this.actualValue.split(MaskExpression.EMPTY_STRING);
            // eslint-disable  @typescript-eslint/no-unused-expressions
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            if (typeof this.selStart === 'object' && typeof this.selEnd === 'object') {
                this.selStart = Number(this.selStart);
                this.selEnd = Number(this.selEnd);
            } else {
                inputValue !== MaskExpression.EMPTY_STRING && actualResult.length
                    ? typeof this.selStart === 'number' && typeof this.selEnd === 'number'
                        ? inputValue.length > actualResult.length
                            ? actualResult.splice(this.selStart, 0, getSymbol)
                            : inputValue.length < actualResult.length
                            ? actualResult.length - inputValue.length === 1
                                ? backspaced
                                    ? actualResult.splice(this.selStart - 1, 1)
                                    : actualResult.splice(inputValue.length - 1, 1)
                                : actualResult.splice(this.selStart, this.selEnd - this.selStart)
                            : null
                        : null
                    : (actualResult = []);
            }
            if (this.showMaskTyped) {
                if (!this.hiddenInput) {
                    // eslint-disable-next-line no-param-reassign
                    inputValue = this.removeMask(inputValue);
                }
            }
            // eslint-enable  @typescript-eslint/no-unused-expressions
            newInputValue =
                this.actualValue.length && actualResult.length <= inputValue.length
                    ? this.shiftTypedSymbols(actualResult.join(MaskExpression.EMPTY_STRING))
                    : inputValue;
        }
        if (justPasted && (this.hiddenInput || !this.hiddenInput)) {
            newInputValue = inputValue;
        }

        if (this.deletedSpecialCharacter && position) {
            if (this.specialCharacters.includes(this.actualValue.slice(position, position + 1))) {
                // eslint-disable-next-line no-param-reassign
                position = position + 1;
            } else if (maskExpression.slice(position - 1, position + 1) !== MaskExpression.MONTHS) {
                // eslint-disable-next-line no-param-reassign
                position = position - 2;
            }
            // eslint-disable-next-line no-param-reassign
            this.deletedSpecialCharacter = false;
        }
        if (
            this.showMaskTyped &&
            this.placeHolderCharacter.length === 1 &&
            !this.leadZeroDateTime
        ) {
            // eslint-disable-next-line no-param-reassign
            inputValue = this.removeMask(inputValue);
        }

        if (this.maskChanged) {
            newInputValue = inputValue;
        } else {
            newInputValue =
                Boolean(newInputValue) && newInputValue.length ? newInputValue : inputValue;
        }

        if (this.showMaskTyped && this.keepCharacterPositions && this.actualValue && !justPasted) {
            const value = this.dropSpecialCharacters
                ? this.removeMask(this.actualValue)
                : this.actualValue;
            this.formControlResult(value);
            return this.actualValue
                ? this.actualValue
                : this.prefix + this.maskIsShown + this.suffix;
        }

        const result: string = super.applyMask(
            newInputValue,
            maskExpression,
            position,
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

        if (result || result === '') {
            this._previousValue = this._currentValue;
            this._currentValue = result;
            this._emitValue =
                this._previousValue !== this._currentValue ||
                this.maskChanged ||
                (this._previousValue === this._currentValue && justPasted);
        }
        this._emitValue ? this.formControlResult(result) : '';

        if (!this.showMaskTyped || (this.showMaskTyped && this.hiddenInput)) {
            if (this.hiddenInput) {
                if (backspaced) {
                    return this.hideInput(result, this.maskExpression);
                }
                return (
                    this.hideInput(result, this.maskExpression) +
                    this.maskIsShown.slice(result.length)
                );
            }
            return result;
        }
        const resLen: number = result.length;
        const prefNmask: string = this.prefix + this.maskIsShown;

        if (this.maskExpression.includes(MaskExpression.HOURS)) {
            const countSkipedSymbol = this._numberSkipedSymbols(result);
            return result + prefNmask.slice(resLen + countSkipedSymbol);
        } else if (
            this.maskExpression === MaskExpression.IP ||
            this.maskExpression === MaskExpression.CPF_CNPJ
        ) {
            return result + prefNmask;
        }
        return result + prefNmask.slice(resLen);
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
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
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
        Promise.resolve().then(
            () => this._renderer?.setProperty(this._elementRef?.nativeElement, name, value)
        );
    }

    public checkSpecialCharAmount(mask: string): number {
        const chars: string[] = mask
            .split(MaskExpression.EMPTY_STRING)
            .filter((item: string) => this._findSpecialChar(item));
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
        if (this.writingValue || (!this.triggerOnMaskChange && this.maskChanged)) {
            this.maskChanged
                ? this.onChange(
                      this.outputTransformFn(
                          this._toNumber(
                              this._checkSymbols(this._removeSuffix(this._removePrefix(inputValue)))
                          )
                      )
                  )
                : '';
            this.maskChanged = false;
            return;
        }
        if (Array.isArray(this.dropSpecialCharacters)) {
            this.onChange(
                this.outputTransformFn(
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
                this.outputTransformFn(
                    this._toNumber(
                        this._checkSymbols(this._removeSuffix(this._removePrefix(inputValue)))
                    )
                )
            );
        } else {
            this.onChange(this.outputTransformFn(this._toNumber(inputValue)));
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
        if (String(value).length > 16 && this.separatorLimit.length > 14) {
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
        const specialCharacters = Array.isArray(this.dropSpecialCharacters)
            ? this.specialCharacters.filter((v) => {
                  return (this.dropSpecialCharacters as string[]).includes(v);
              })
            : this.specialCharacters;
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
        if (result === MaskExpression.EMPTY_STRING) {
            return result;
        }
        if (
            this.maskExpression.startsWith(MaskExpression.PERCENT) &&
            this.decimalMarker === MaskExpression.COMMA
        ) {
            // eslint-disable-next-line no-param-reassign
            result = result.replace(MaskExpression.COMMA, MaskExpression.DOT);
        }
        const separatorPrecision: number | null = this._retrieveSeparatorPrecision(
            this.maskExpression
        );
        const separatorValue: string = this._replaceDecimalMarkerToDot(
            this._retrieveSeparatorValue(result)
        );

        if (!this.isNumberValue) {
            return separatorValue;
        }
        if (separatorPrecision) {
            if (result === this.decimalMarker) {
                return null;
            }
            if (this.separatorLimit.length > 14) {
                return String(separatorValue);
            }
            return this._checkPrecision(this.maskExpression, separatorValue);
        } else {
            return separatorValue;
        }
    }

    // TODO should think about helpers or separting decimal precision to own property
    private _retrieveSeparatorPrecision(maskExpretion: string): number | null {
        const matcher: RegExpMatchArray | null = maskExpretion.match(
            new RegExp(`^separator\\.([^d]*)`)
        );
        return matcher ? Number(matcher[1]) : null;
    }

    public _checkPrecision(separatorExpression: string, separatorValue: string): number | string {
        const separatorPrecision = separatorExpression.slice(10, 11);
        if (
            separatorExpression.indexOf('2') > 0 ||
            (this.leadZero && Number(separatorPrecision) > 1)
        ) {
            if (this.decimalMarker === MaskExpression.COMMA && this.leadZero) {
                // eslint-disable-next-line no-param-reassign
                separatorValue = separatorValue.replace(',', '.');
            }
            return this.leadZero
                ? Number(separatorValue).toFixed(Number(separatorPrecision))
                : Number(separatorValue).toFixed(2);
        }
        return this.numberToString(separatorValue);
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
