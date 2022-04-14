import { ElementRef, Inject, Injectable, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { config, IConfig } from './config';
import { MaskApplierService } from './mask-applier.service';

@Injectable()
export class MaskService extends MaskApplierService {
	public override maskExpression: string = '';

	public isNumberValue: boolean = false;

	public override placeHolderCharacter: string = '_';

	public maskIsShown: string = '';

	public selStart: number | null = null;

	public selEnd: number | null = null;

	/**
	 * Whether we are currently in writeValue function, in this case when applying the mask we don't want to trigger onChange function,
	 * since writeValue should be a one way only process of writing the DOM value based on the Angular model value.
	 */
	public writingValue: boolean = false;

	public maskChanged: boolean = false;

	public triggerOnMaskChange: boolean = false;

	public onChange = (_: any) => {};

	public constructor(
		@Inject(DOCUMENT) private document: any,
		@Inject(config) protected override _config: IConfig,
		private _elementRef: ElementRef,
		private _renderer: Renderer2,
	) {
		super(_config);
	}

	// eslint-disable-next-line complexity
	public override applyMask(
		inputValue: string,
		maskExpression: string,
		position: number = 0,
		justPasted = false,
		backspaced = false,
		cb: Function = () => {},
	): string {
		if (!maskExpression) {
			return inputValue !== this.actualValue ? this.actualValue : inputValue;
		}
		this.maskIsShown = this.showMaskTyped ? this.showMaskInInput() : '';
		if (this.maskExpression === 'IP' && this.showMaskTyped) {
			this.maskIsShown = this.showMaskInInput(inputValue || '#');
		}
		if (this.maskExpression === 'CPF_CNPJ' && this.showMaskTyped) {
			this.maskIsShown = this.showMaskInInput(inputValue || '#');
		}
		if (!inputValue && this.showMaskTyped) {
			this.formControlResult(this.prefix);
			return this.prefix + this.maskIsShown;
		}
		const getSymbol: string | undefined =
			!!inputValue && typeof this.selStart === 'number' ? inputValue[this.selStart] : '';
		let newInputValue = '';
		if (this.hiddenInput && !this.writingValue) {
			let actualResult: string[] = this.actualValue.split('');
			// eslint-disable  @typescript-eslint/no-unused-expressions
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			inputValue !== '' && actualResult.length
				? typeof this.selStart === 'number' && typeof this.selEnd === 'number'
					? inputValue.length > actualResult.length
						? actualResult.splice(this.selStart, 0, getSymbol!)
						: inputValue.length < actualResult.length
						? actualResult.length - inputValue.length === 1
							? actualResult.splice(this.selStart - 1, 1)
							: actualResult.splice(this.selStart, this.selEnd - this.selStart)
						: null
					: null
				: (actualResult = []);
			if (this.showMaskTyped) {
				// eslint-disable-next-line no-param-reassign
				inputValue = this.removeMask(inputValue);
			}
			// eslint-enable  @typescript-eslint/no-unused-expressions
			newInputValue =
				this.actualValue.length && actualResult.length <= inputValue.length
					? this.shiftTypedSymbols(actualResult.join(''))
					: inputValue;
		}
		newInputValue = Boolean(newInputValue) && newInputValue.length ? newInputValue : inputValue;

		const result: string = super.applyMask(
			newInputValue,
			maskExpression,
			position,
			justPasted,
			backspaced,
			cb,
		);

		this.actualValue = this.getActualValue(result);
		// handle some separator implications:
		// a.) adjust decimalMarker default (. -> ,) if thousandSeparator is a dot
		if (this.thousandSeparator === '.' && this.decimalMarker === '.') {
			this.decimalMarker = ',';
		}

		// b) remove decimal marker from list of special characters to mask
		if (this.maskExpression.startsWith('separator') && this.dropSpecialCharacters === true) {
			this.maskSpecialCharacters = this.maskSpecialCharacters.filter(
				(item: string) =>
					!this._compareOrIncludes(item, this.decimalMarker, this.thousandSeparator), //item !== this.decimalMarker, // !
			);
		}
		this.formControlResult(result);
		if (!this.showMaskTyped) {
			if (this.hiddenInput) {
				return result && result.length ? this.hideInput(result, this.maskExpression) : result;
			}
			return result;
		}
		const resLen: number = result.length;
		const prefNmask: string = this.prefix + this.maskIsShown;

		if (this.maskExpression.includes('H')) {
			const countSkipedSymbol = this._numberSkipedSymbols(result);
			return result + prefNmask.slice(resLen + countSkipedSymbol);
		} else if (this.maskExpression === 'IP' || this.maskExpression === 'CPF_CNPJ') {
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
		cb: Function = () => {},
	): void {
		const formElement = this._elementRef.nativeElement;
		formElement.value = this.applyMask(
			formElement.value,
			this.maskExpression,
			position,
			justPasted,
			backspaced,
			cb,
		);
		if (formElement === this._getActiveElement()) {
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
					this.maskAvailablePatterns[maskExpression[index]!] &&
					this.maskAvailablePatterns[maskExpression[index]!]?.symbol
				) {
					return this.maskAvailablePatterns[maskExpression[index]!]?.symbol;
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
					this._checkSymbolMask(symbol, this.maskExpression[i]!) ||
					(this.maskSpecialCharacters.includes(this.maskExpression[i]!) &&
						symbol === this.maskExpression[i]),
			);
		if (compare.join('') === res) {
			return compare.join('');
		}
		return res;
	}

	public shiftTypedSymbols(inputValue: string): string {
		let symbolToReplace = '';
		const newInputValue: (string | undefined)[] =
			(inputValue &&
				inputValue.split('').map((currSymbol: string, index: number) => {
					if (
						this.maskSpecialCharacters.includes(inputValue[index + 1]!) &&
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

	/**
	 * Convert number value to string
	 * 3.1415 -> '3.1415'
	 * 1e-7 -> '0.0000001'
	 */
	public numberToString(value: number | string): string {
		if (!value && value !== 0) {
			return String(value);
		}
		return Number(value).toLocaleString('fullwide', {
			useGrouping: false,
			maximumFractionDigits: 20,
		});
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
				if (this.maskExpression === 'IP') {
					return this._checkForIp(inputVal);
				}
				if (this.maskExpression === 'CPF_CNPJ') {
					return this._checkForCpfCnpj(inputVal);
				}
			}
			return this.maskExpression.replace(/\w/g, this.placeHolderCharacter);
		}
		return '';
	}

	public clearIfNotMatchFn(): void {
		const formElement = this._elementRef.nativeElement;
		if (
			this.clearIfNotMatch &&
			this.prefix.length + this.maskExpression.length + this.suffix.length !==
				formElement.value.replace(/_/g, '').length
		) {
			this.formElementProperty = ['value', ''];
			this.applyMask(formElement.value, this.maskExpression);
		}
	}

	public set formElementProperty([name, value]: [string, string | boolean]) {
		Promise.resolve().then(() =>
			this._renderer.setProperty(this._elementRef.nativeElement, name, value),
		);
	}

	public checkSpecialCharAmount(mask: string): number {
		const chars: string[] = mask.split('').filter((item: string) => this._findSpecialChar(item));
		return chars.length;
	}

	public removeMask(inputValue: string): string {
		return this._removeMask(
			this._removeSuffix(this._removePrefix(inputValue)),
			this.maskSpecialCharacters.concat('_').concat(this.placeHolderCharacter),
		);
	}

	private _checkForIp(inputVal: string): string {
		if (inputVal === '#') {
			return `${this.placeHolderCharacter}.${this.placeHolderCharacter}.${this.placeHolderCharacter}.${this.placeHolderCharacter}`;
		}
		const arr: string[] = [];
		for (let i = 0; i < inputVal.length; i++) {
			if (inputVal[i]?.match('\\d')) {
				arr.push(inputVal[i]!);
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

		if (inputVal === '#') {
			return cpf;
		}
		const arr: string[] = [];
		for (let i = 0; i < inputVal.length; i++) {
			if (inputVal[i]?.match('\\d')) {
				arr.push(inputVal[i]!);
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
			this.maskChanged = false;
			return;
		}
		if (Array.isArray(this.dropSpecialCharacters)) {
			this.onChange(
				this._toNumber(
					this._removeMask(
						this._removeSuffix(this._removePrefix(inputValue)),
						this.dropSpecialCharacters,
					),
				),
			);
		} else if (this.dropSpecialCharacters) {
			this.onChange(this._toNumber(this._checkSymbols(inputValue)));
		} else {
			this.onChange(this._removeSuffix(inputValue));
		}
	}

	private _toNumber(value: string | number | undefined | null) {
		if (!this.isNumberValue || value === '') {
			return value;
		}
		const num = Number(value);
		return Number.isNaN(num) ? value : num;
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

	private _removeSuffix(value: string): string {
		if (!this.suffix) {
			return value;
		}
		return value ? value.replace(this.suffix, '') : value;
	}

	private _retrieveSeparatorValue(result: string): string {
		return this._removeMask(
			this._removeSuffix(this._removePrefix(result)),
			this.maskSpecialCharacters,
		);
	}

	private _regExpForRemove(specialCharactersForRemove: string[]): RegExp {
		return new RegExp(
			specialCharactersForRemove.map((item: string) => `\\${item}`).join('|'),
			'gi',
		);
	}

	private _checkSymbols(result: string): string | number | undefined | null {
		if (result === '') {
			return result;
		}

		const separatorPrecision: number | null = this._retrieveSeparatorPrecision(this.maskExpression);
		let separatorValue: string = this._retrieveSeparatorValue(result);

		if (this.decimalMarker !== '.' && !Array.isArray(this.decimalMarker)) {
			separatorValue = separatorValue.replace(this.decimalMarker, '.');
		}

		if (!this.isNumberValue) {
			return separatorValue;
		}
		if (separatorPrecision) {
			if (result === this.decimalMarker) {
				return null;
			}
			return this._checkPrecision(this.maskExpression, separatorValue);
		} else {
			return Number(separatorValue);
		}
	}

	// TODO should think about helpers or separting decimal precision to own property
	private _retrieveSeparatorPrecision(maskExpretion: string): number | null {
		const matcher: RegExpMatchArray | null = maskExpretion.match(
			new RegExp(`^separator\\.([^d]*)`),
		);
		return matcher ? Number(matcher[1]) : null;
	}

	private _checkPrecision(separatorExpression: string, separatorValue: string): number | string {
		if (separatorExpression.indexOf('2') > 0) {
			return Number(separatorValue).toFixed(2);
		}
		return Number(separatorValue);
	}
}
