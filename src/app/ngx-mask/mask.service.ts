import { ElementRef, Inject, Injectable, Renderer2 } from '@angular/core';
import { config, IConfig } from './config';
import { DOCUMENT } from '@angular/common';
import { MaskApplierService } from './mask-applier.service';

@Injectable()
export class MaskService extends MaskApplierService {
    public validation: boolean = true;
    public maskExpression: string = '';
    public isNumberValue: boolean = false;
    public showMaskTyped: boolean = false;
    public maskIsShown: string = '';
    public selStart: number | null = null;
    public selEnd: number | null = null;
    protected _formElement: HTMLInputElement;
    // tslint:disable-next-line
    public onChange = (_: any) => {};
    public onTouch = () => {};
    public constructor(
        // tslint:disable-next-line
        @Inject(DOCUMENT) private document: any,
        @Inject(config) protected _config: IConfig,
        private _elementRef: ElementRef,
        private _renderer: Renderer2
    ) {
        super(_config);
        this._formElement = this._elementRef.nativeElement;
    }

    // tslint:disable-next-line:cyclomatic-complexity
    public applyMask(
        inputValue: string,
        maskExpression: string,
        position: number = 0,
        cb: Function = () => {}
    ): string {
        this.maskIsShown = this.showMaskTyped ? this.showMaskInInput() : '';
        if (!inputValue && this.showMaskTyped) {
            return this.prefix + this.maskIsShown;
        }
        const getSymbol: string = !!inputValue && typeof this.selStart === 'number' ? inputValue[this.selStart] : '';
        let newInputValue: string = '';
        if (this.hiddenInput) {
            let actualResult: string[] = this.actualValue.split('');
            inputValue !== '' && actualResult.length
                ? typeof this.selStart === 'number' && typeof this.selEnd === 'number'
                    ? inputValue.length > actualResult.length
                        ? actualResult.splice(this.selStart, 0, getSymbol)
                        : inputValue.length < actualResult.length
                        ? actualResult.length - inputValue.length === 1
                            ? actualResult.splice(this.selStart - 1, 1)
                            : actualResult.splice(this.selStart, this.selEnd - this.selStart)
                        : null
                    : null
                : (actualResult = []);
            newInputValue = this.actualValue.length ? this.shiftTypedSymbols(actualResult.join('')) : inputValue;
        }
        newInputValue = newInputValue.length ? newInputValue : inputValue;
        const result: string = super.applyMask(newInputValue, maskExpression, position, cb);
        this.actualValue = this.getActualValue(result);

        if (/dot_separator\.\d{1,}/.test(this.maskExpression) === true && this.dropSpecialCharacters === true) {
            this.maskSpecialCharacters = this.maskSpecialCharacters.filter((item: string) => item !== ',');
        }
        if ('dot_separator' === this.maskExpression && this.dropSpecialCharacters === true) {
            this.maskSpecialCharacters = this.maskSpecialCharacters.filter((item: string) => item !== ',');
        }
        if (/comma_separator\.\d{1,}/.test(this.maskExpression) === true && this.dropSpecialCharacters === true) {
            this.maskSpecialCharacters = this.maskSpecialCharacters.filter((item: string) => item !== '.');
        }
        if ('comma_separator' === this.maskExpression && this.dropSpecialCharacters === true) {
            this.maskSpecialCharacters = this.maskSpecialCharacters.filter((item: string) => item !== '.');
        }

        if (Array.isArray(this.dropSpecialCharacters)) {
            this.onChange(this._removeMask(this._removeSufix(this._removePrefix(result)), this.dropSpecialCharacters));
        } else if (this.dropSpecialCharacters === true) {
            this.onChange(this._checkSymbols(result));
        } else {
            this.onChange(this._removeSufix(this._removePrefix(result)));
        }

        let ifMaskIsShown: string = '';
        if (!this.showMaskTyped) {
            if (this.hiddenInput) {
                return result && result.length ? this.hideInput(result, this.maskExpression) : result;
            }
            return result;
        }
        const resLen: number = result.length;
        const prefNmask: string = this.prefix + this.maskIsShown;
        ifMaskIsShown = prefNmask.slice(resLen);
        return result + ifMaskIsShown;
    }

    public applyValueChanges(position: number = 0, cb: Function = () => {}): void {
        const maskedInput: string | number = this.applyMask(this._formElement.value, this.maskExpression, position, cb);
        this._formElement.value = maskedInput;
        if (this._formElement === this.document.activeElement) {
            return;
        }
        this.clearIfNotMatchFn();
    }

    public hideInput(inputValue: string, maskExpression: string): string {
        return inputValue
            .split('')
            .map((curr: string, index: number) => {
                if (
                    this.maskAvailablePatterns &&
                    this.maskAvailablePatterns[maskExpression[index]] &&
                    this.maskAvailablePatterns[maskExpression[index]].symbol
                ) {
                    return this.maskAvailablePatterns[maskExpression[index]].symbol;
                }
                return curr;
            })
            .join('');
    }

    // this function is not necessary, it checks result against maskExpression
    public getActualValue(res: string): string {
        const compare: string[] = res
            .split('')
            .filter(
                (symbol: string, i: number) =>
                    this._checkSymbolMask(symbol, this.maskExpression[i]) ||
                    (this.maskSpecialCharacters.includes(this.maskExpression[i]) && symbol === this.maskExpression[i])
            );
        if (compare.join('') === res) {
            return compare.join('');
        }
        return res;
    }

    public shiftTypedSymbols(inputValue: string): string {
        let symbolToReplace: string = '';
        const newInputValue: string[] =
            (inputValue &&
                inputValue.split('').map((currSymbol: string, index: number) => {
                    if (
                        this.maskSpecialCharacters.includes(inputValue[index + 1]) &&
                        inputValue[index + 1] !== this.maskExpression[index + 1]
                    ) {
                        symbolToReplace = currSymbol;
                        return inputValue[index + 1];
                    }
                    if (symbolToReplace.length) {
                        const replaceSymbol: string = symbolToReplace;
                        symbolToReplace = '';
                        return replaceSymbol;
                    }
                    return currSymbol;
                })) ||
            [];
        return newInputValue.join('');
    }

    public showMaskInInput(): string {
        if (this.showMaskTyped && !!this.shownMaskExpression) {
            if (this.maskExpression.length !== this.shownMaskExpression.length) {
                throw new Error('Mask expression must match mask placeholder length');
            } else {
                return this.shownMaskExpression;
            }
        } else if (this.showMaskTyped) {
            return this.maskExpression.replace(/\w/g, '_');
        }
        return '';
    }

    public clearIfNotMatchFn(): void {
        if (this.clearIfNotMatch === true && this.maskExpression.length !== this._formElement.value.length) {
            this.formElementProperty = ['value', ''];
            this.applyMask(this._formElement.value, this.maskExpression);
        }
    }

    public set formElementProperty([name, value]: [string, string | boolean]) {
        this._renderer.setProperty(this._formElement, name, value);
    }

    public checkSpecialCharAmount(mask: string): number {
        const chars: string[] = mask.split('').filter((item: string) => this._findSpecialChar(item));
        return chars.length;
    }

    private _removeMask(value: string, specialCharactersForRemove: string[]): string {
        return value ? value.replace(this._regExpForRemove(specialCharactersForRemove), '') : value;
    }

    private _removePrefix(value: string): string {
        if (!this.prefix) {
            return value;
        }
        return value ? value.replace(this.prefix, '') : value;
    }

    private _removeSufix(value: string): string {
        if (!this.sufix) {
            return value;
        }
        return value ? value.replace(this.sufix, '') : value;
    }

    private _regExpForRemove(specialCharactersForRemove: string[]): RegExp {
        return new RegExp(specialCharactersForRemove.map((item: string) => `\\${item}`).join('|'), 'gi');
    }
    private _checkSymbols(result: string): string | number | undefined {
        if ('dot_separator.2' === this.maskExpression) {
            // tslint:disable-next-line:max-line-length
            return Number(
                this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters).replace(
                    ',',
                    '.'
                )
            ).toFixed(2);
        }
        if ('comma_separator.2' === this.maskExpression) {
            // tslint:disable-next-line:max-line-length
            return Number(
                this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters)
            ).toFixed(2);
        }
        if (this.isNumberValue) {
            return result === ''
                ? result
                : Number(this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters));
        } else if (
            this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters).indexOf(',') !==
            -1
        ) {
            return this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters).replace(
                ',',
                '.'
            );
        } else {
            return this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters);
        }
    }
}
