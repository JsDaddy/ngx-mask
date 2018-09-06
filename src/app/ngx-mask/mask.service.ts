import { ElementRef, Inject, Injectable, Renderer2 } from '@angular/core';
import { config, IConfig } from './config';
import { DOCUMENT } from '@angular/common';
import { MaskApplierService } from './mask-applier.service';
import { MaskDirective } from './mask.directive';

@Injectable()
export class MaskService extends MaskApplierService {
  public maskExpression: string = '';
  public isNumberValue: boolean = false;

  private _formElement: HTMLInputElement;

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

  public applyMask(
    inputValue: string,
    maskExpression: string,
    position: number = 0,
    cb: Function = () => {}
  ): string  {
    const result: string  = super.applyMask(
      inputValue,
      maskExpression,
      position,
      cb
    );

    Array.isArray(this.dropSpecialCharacters)
        ? this.onChange(this._removeMask(this._removePrefix(result), this.dropSpecialCharacters))
        : this.dropSpecialCharacters === true
         ? this.onChange(
          this.isNumberValue
             ? Number(this._removeMask(this._removePrefix(result), this.maskSpecialCharacters))
             : this._removeMask(this._removePrefix(result), this.maskSpecialCharacters)
            )
         : this.onChange(this._removePrefix(result));
    return result;
  }

  public applyValueChanges(
    position: number = 0,
    cb: Function = () => {}
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
    return value ? value.replace(this.prefix, '') : value;
  }

  private _regExpForRemove(specialCharactersForRemove: string[]): RegExp {
    return new RegExp(
      specialCharactersForRemove.map((item: string) => `\\${item}`).join('|'),
      'gi'
    );
  }
}
