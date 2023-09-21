import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { IConfig } from '../../lib/ngx-mask.config';

@Component({
    selector: 'jsdaddy-open-source-test',
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
            [apm]="apm"
            [validation]="validation"
            [inputTransformFn]="inputTransformFn || null"
            [outputTransformFn]="outputTransformFn || null"
            [triggerOnMaskChange]="triggerOnMaskChange" />
    `,
})
export class TestMaskComponent {
    public mask!: string | undefined;

    public form: FormControl = new FormControl();

    public dropSpecialCharacters: IConfig['dropSpecialCharacters'] = true;

    public clearIfNotMatch: IConfig['clearIfNotMatch'] = false;

    public patterns!: IConfig['patterns'];

    public prefix: IConfig['prefix'] = '';

    public thousandSeparator: IConfig['thousandSeparator'] | undefined;

    public decimalMarker: IConfig['decimalMarker'] | undefined;

    public suffix: IConfig['suffix'] = '';

    public specialCharacters!: IConfig['specialCharacters'];

    public showMaskTyped: IConfig['showMaskTyped'] = false;

    public placeHolderCharacter: IConfig['placeHolderCharacter'] = '_';

    public hiddenInput: IConfig['hiddenInput'] = false;

    public separatorLimit: IConfig['separatorLimit'] = '';

    public allowNegativeNumbers: IConfig['allowNegativeNumbers'] = false;

    public leadZeroDateTime: IConfig['leadZeroDateTime'] = false;

    // public leadZero: IConfig['leadZero'] = undefined
    public leadZero: IConfig['leadZero'] | undefined;

    public triggerOnMaskChange: IConfig['triggerOnMaskChange'] = false;

    public validation: IConfig['validation'] = true;

    public apm: IConfig['apm'] = false;

    public inputTransformFn: IConfig['inputTransformFn'] | undefined;

    public outputTransformFn: IConfig['outputTransformFn'] | undefined;

    // public cdr = inject(ChangeDetectorRef);
}
