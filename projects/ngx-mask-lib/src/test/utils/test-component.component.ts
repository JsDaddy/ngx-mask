import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
            [keepCharacterPositions]="keepCharacterPositions"
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

    public dropSpecialCharacters: IConfig['dropSpecialCharacters'] | undefined;

    public clearIfNotMatch: IConfig['clearIfNotMatch'] | undefined;

    public patterns: IConfig['patterns'] | undefined;

    public prefix: IConfig['prefix'] = '';

    public thousandSeparator: IConfig['thousandSeparator'] | undefined;

    public decimalMarker: IConfig['decimalMarker'] | undefined;

    public suffix: IConfig['suffix'] = '';

    public specialCharacters: IConfig['specialCharacters'] | undefined;

    public keepCharacterPositions: IConfig['keepCharacterPositions'] | undefined;

    public showMaskTyped: IConfig['showMaskTyped'] | undefined;

    public placeHolderCharacter: IConfig['placeHolderCharacter'] | undefined;

    public hiddenInput: IConfig['hiddenInput'] | undefined;

    public separatorLimit: IConfig['separatorLimit'] = '';

    public allowNegativeNumbers: IConfig['allowNegativeNumbers'] | undefined;

    public leadZeroDateTime: IConfig['leadZeroDateTime'] | undefined;

    public leadZero: IConfig['leadZero'] | undefined;

    public triggerOnMaskChange: IConfig['triggerOnMaskChange'] | undefined;

    public validation: IConfig['validation'] | undefined;

    public setValueFailureBehavior: IConfig['setValueFailureBehavior'] | undefined;

    public apm: IConfig['apm'] | undefined;

    public inputTransformFn: IConfig['inputTransformFn'] | undefined;

    public outputTransformFn: IConfig['outputTransformFn'] | undefined;

    public cdr = inject(ChangeDetectorRef);
}
