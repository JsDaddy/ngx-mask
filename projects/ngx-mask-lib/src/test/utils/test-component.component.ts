import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { NgxMaskConfig } from 'ngx-mask';
import { NGX_MASK_CONFIG } from 'ngx-mask';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'jsdaddy-open-source-test',
    standalone: true,
    imports: [ReactiveFormsModule, NgxMaskDirective],
    template: `
        <input
            id="mask"
            [mask]="mask"
            [clearIfNotMatch]="clearIfNotMatch"
            [dropSpecialCharacters]="dropSpecialCharacters"
            [specialCharacters]="specialCharacters"
            [patterns]="patterns"
            [suffix]="suffix"
            [prefix]="prefix"
            [thousandSeparator]="thousandSeparator"
            [decimalMarker]="decimalMarker"
            [formControl]="form"
            [showMaskTyped]="showMaskTyped"
            [placeHolderCharacter]="placeHolderCharacter"
            [separatorLimit]="separatorLimit"
            [hiddenInput]="hiddenInput"
            [allowNegativeNumbers]="allowNegativeNumbers"
            [leadZeroDateTime]="leadZeroDateTime"
            [leadZero]="leadZero"
            [keepCharacterPositions]="keepCharacterPositions"
            [apm]="apm"
            [validation]="validation"
            [inputTransformFn]="inputTransformFn"
            [outputTransformFn]="outputTransformFn"
            [triggerOnMaskChange]="triggerOnMaskChange" />
    `,
})
export class TestMaskComponent {
    public mask!: string | null | undefined;
    protected _config = inject<NgxMaskConfig>(NGX_MASK_CONFIG);

    public form: FormControl = new FormControl();

    public dropSpecialCharacters: NgxMaskConfig['dropSpecialCharacters'] =
        this._config.dropSpecialCharacters;

    public clearIfNotMatch: NgxMaskConfig['clearIfNotMatch'] = this._config.clearIfNotMatch;

    public patterns: NgxMaskConfig['patterns'] = this._config.patterns;

    public prefix: NgxMaskConfig['prefix'] = this._config.prefix;

    public thousandSeparator: NgxMaskConfig['thousandSeparator'] = this._config.thousandSeparator;

    public decimalMarker: NgxMaskConfig['decimalMarker'] = this._config.decimalMarker;

    public suffix: NgxMaskConfig['suffix'] = this._config.suffix;

    public specialCharacters: NgxMaskConfig['specialCharacters'] = this._config.specialCharacters;

    public keepCharacterPositions: NgxMaskConfig['keepCharacterPositions'] =
        this._config.keepCharacterPositions;

    public showMaskTyped: NgxMaskConfig['showMaskTyped'] = this._config.showMaskTyped;

    public placeHolderCharacter: NgxMaskConfig['placeHolderCharacter'] =
        this._config.placeHolderCharacter;

    public hiddenInput: NgxMaskConfig['hiddenInput'] = this._config.hiddenInput;

    public separatorLimit: NgxMaskConfig['separatorLimit'] = this._config.separatorLimit;

    public allowNegativeNumbers: NgxMaskConfig['allowNegativeNumbers'] =
        this._config.allowNegativeNumbers;

    public leadZeroDateTime: NgxMaskConfig['leadZeroDateTime'] = this._config.leadZeroDateTime;

    public leadZero: NgxMaskConfig['leadZero'] = this._config.leadZero;

    public triggerOnMaskChange: NgxMaskConfig['triggerOnMaskChange'] =
        this._config.triggerOnMaskChange;

    public validation: NgxMaskConfig['validation'] = this._config.validation;

    public apm: NgxMaskConfig['apm'] = this._config.apm;

    public inputTransformFn: NgxMaskConfig['inputTransformFn'] = this._config.inputTransformFn;

    public outputTransformFn: NgxMaskConfig['outputTransformFn'] = this._config.outputTransformFn;
}
