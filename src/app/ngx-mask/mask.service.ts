import { ElementRef, Inject, Injectable, Renderer2 } from '@angular/core';
import { config, IConfig } from './config';
import { DOCUMENT } from '@angular/common';
import { MaskApplierService } from './mask-applier.service';

@Injectable()
export class MaskService extends MaskApplierService {
  public maskExpression: string = '';
  public isNumberValue: boolean = false;
  public showMaskTyped: boolean = false;
  public maskIsShown: string = '';
  private _formElement: HTMLInputElement;
  // tslint:disable-next-line
  public onChange = (_: any) => { };
  public onTouch = () => { };
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

  public applyMask(
    inputValue: string,
    maskExpression: string,
    position: number = 0,
    cb: Function = () => { }
  ): string {

    this.maskIsShown = this.showMaskTyped ? this.showMaskInInput() : '';
    if (!inputValue && this.showMaskTyped) {
      return this.prefix + this.maskIsShown;
    }
    const result: string = super.applyMask(
      inputValue,
      maskExpression,
      position,
      cb
    );
    if (this.maskExpression === 'dot_separator.2' && this.dropSpecialCharacters === true) {
      this.maskSpecialCharacters = this.maskSpecialCharacters.filter((item: string) => item !== ',');
    }
    if ((this.maskExpression === 'coma_separator.2' && this.dropSpecialCharacters === true)) {
      this.maskSpecialCharacters = this.maskSpecialCharacters.filter((item: string) => item !== '.');

    }
    Array.isArray(this.dropSpecialCharacters)
      ? this.onChange(this._removeMask(this._removeSufix(this._removePrefix(result)), this.dropSpecialCharacters))
      : this.dropSpecialCharacters === true
        ? this.onChange(
          this.isNumberValue
            ? Number(this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters))
            : this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters)
        )
        : this.onChange(this._removeSufix(this._removePrefix(result)));
    let ifMaskIsShown: string = '';
    if (!this.showMaskTyped) {
      return result;
    }
    const resLen: number = result.length;
    const prefNmask: string = this.prefix + this.maskIsShown;
    ifMaskIsShown = prefNmask.slice(resLen);
    return result + ifMaskIsShown;
  }

  public applyValueChanges(
    position: number = 0,
    cb: Function = () => { }
  ): void {
    const maskedInput: string | number = this.applyMask(
      this._formElement.value,
      this.maskExpression,
      position,
      cb
    );
    this._formElement.value = maskedInput;
    if (this._formElement === this.document.activeElement) {
      return;
    }
    this.clearIfNotMatchFn();
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
    if (
      this.clearIfNotMatch === true &&
      this.maskExpression.length !== this._formElement.value.length
    ) {
      this.formElementProperty = ['value', ''];
      this.applyMask(this._formElement.value, this.maskExpression);
    }
  }

  public set formElementProperty([name, value]: [string, string | boolean]) {
    this._renderer.setProperty(this._formElement, name, value);
  }

  private _removeMask(
    value: string,
    specialCharactersForRemove: string[]
  ): string {
    return value
      ? value.replace(this._regExpForRemove(specialCharactersForRemove), '')
      : value;
  }

  private _removePrefix(value: string): string {
    if (!this.prefix) {
      return value;
    }
    return value
      ? value.replace(this.prefix, '')
      : value;
  }

  private _removeSufix(value: string): string {
    if (!this.sufix) {
      return value;
    }
    return value
      ? value.replace(this.sufix, '')
      : value;
  }

  private _regExpForRemove(specialCharactersForRemove: string[]): RegExp {
    return new RegExp(
      specialCharactersForRemove.map((item: string) => `\\${item}`).join('|'),
      'gi'
    );
  }
}
