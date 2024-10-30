import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import type { NgxMaskConfig } from 'ngx-mask';

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
    public mask!: string | null | undefined;

    public form: FormControl = new FormControl();

    public dropSpecialCharacters: NgxMaskConfig['dropSpecialCharacters'] | undefined;

    public clearIfNotMatch: NgxMaskConfig['clearIfNotMatch'] | undefined;

    public patterns: NgxMaskConfig['patterns'] | undefined;

    public prefix: NgxMaskConfig['prefix'] = '';

    public thousandSeparator: NgxMaskConfig['thousandSeparator'] | undefined;

    public decimalMarker: NgxMaskConfig['decimalMarker'] | undefined;

    public suffix: NgxMaskConfig['suffix'] = '';

    public specialCharacters: NgxMaskConfig['specialCharacters'] | undefined;

    public keepCharacterPositions: NgxMaskConfig['keepCharacterPositions'] | undefined;

    public showMaskTyped: NgxMaskConfig['showMaskTyped'] | undefined;

    public placeHolderCharacter: NgxMaskConfig['placeHolderCharacter'] | undefined;

    public hiddenInput: NgxMaskConfig['hiddenInput'] | undefined;

    public separatorLimit: NgxMaskConfig['separatorLimit'] = '';

    public allowNegativeNumbers: NgxMaskConfig['allowNegativeNumbers'] | undefined;

    public leadZeroDateTime: NgxMaskConfig['leadZeroDateTime'] | undefined;

    public leadZero: NgxMaskConfig['leadZero'] | undefined;

    public triggerOnMaskChange: NgxMaskConfig['triggerOnMaskChange'] | undefined;

    public validation: NgxMaskConfig['validation'] | undefined;

    public apm: NgxMaskConfig['apm'] | undefined;

    public inputTransformFn: NgxMaskConfig['inputTransformFn'] | undefined;

    public outputTransformFn: NgxMaskConfig['outputTransformFn'] | undefined;

    public cdr = inject(ChangeDetectorRef);
}
