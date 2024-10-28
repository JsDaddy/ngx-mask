import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Config } from '../../lib/ngx-mask.config';

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

    public dropSpecialCharacters: Config['dropSpecialCharacters'] | undefined;

    public clearIfNotMatch: Config['clearIfNotMatch'] | undefined;

    public patterns: Config['patterns'] | undefined;

    public prefix: Config['prefix'] = '';

    public thousandSeparator: Config['thousandSeparator'] | undefined;

    public decimalMarker: Config['decimalMarker'] | undefined;

    public suffix: Config['suffix'] = '';

    public specialCharacters: Config['specialCharacters'] | undefined;

    public keepCharacterPositions: Config['keepCharacterPositions'] | undefined;

    public showMaskTyped: Config['showMaskTyped'] | undefined;

    public placeHolderCharacter: Config['placeHolderCharacter'] | undefined;

    public hiddenInput: Config['hiddenInput'] | undefined;

    public separatorLimit: Config['separatorLimit'] = '';

    public allowNegativeNumbers: Config['allowNegativeNumbers'] | undefined;

    public leadZeroDateTime: Config['leadZeroDateTime'] | undefined;

    public leadZero: Config['leadZero'] | undefined;

    public triggerOnMaskChange: Config['triggerOnMaskChange'] | undefined;

    public validation: Config['validation'] | undefined;

    public apm: Config['apm'] | undefined;

    public inputTransformFn: Config['inputTransformFn'] | undefined;

    public outputTransformFn: Config['outputTransformFn'] | undefined;

    public cdr = inject(ChangeDetectorRef);
}
