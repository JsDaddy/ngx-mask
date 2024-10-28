import { Component, inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { scan, startWith } from 'rxjs';
import { Config, NGX_MASK_CONFIG } from 'ngx-mask';

@Component({
    selector: 'jsdaddy-open-source-test',
    template: `
        <input
            id="masked"
            [formControl]="form"
            [mask]="mask"
            [prefix]="prefix"
            [suffix]="suffix"
            [leadZero]="leadZero"
            [showMaskTyped]="showMaskTyped"
            [allowNegativeNumbers]="allowNegativeNumbers"
            [decimalMarker]="decimalMarker"
            [thousandSeparator]="thousandSeparator"
            [shownMaskExpression]="shownMaskExpression"
            [leadZeroDateTime]="leadZeroDateTime"
            [dropSpecialCharacters]="dropSpecialCharacters"
            [specialCharacters]="specialCharacters"
            [patterns]="patterns"
            [keepCharacterPositions]="keepCharacterPositions"
            [hiddenInput]="hiddenInput" />

        <pre id="pre">{{ counter$ | async }}</pre>
        <pre id="pre1">{{ form.value }}</pre>
        <div>
            {{ leadZeroDateTime }}
        </div>
    `,
})
export class CypressTestMaskComponent {
    protected _config = inject<Config>(NGX_MASK_CONFIG);
    @Input() public mask = '';

    @Input() public hiddenInput = false;

    @Input() public allowNegativeNumbers = false;

    @Input() public prefix = '';

    @Input() public suffix = '';

    @Input() public leadZero = false;

    @Input() public showMaskTyped = false;

    @Input() public decimalMarker = '.';

    @Input() public thousandSeparator = ',';

    @Input() public keepCharacterPositions = false;

    @Input() public shownMaskExpression = '';

    @Input() public placeHolderCharacter = '';

    @Input() public dropSpecialCharacters = true;

    @Input() public leadZeroDateTime = false;

    @Input() public patterns = this._config.patterns;

    @Input() public specialCharacters = this._config.specialCharacters;

    public form: FormControl = new FormControl('');

    public readonly counter$ = this.form.valueChanges.pipe(
        startWith(0),

        scan((_, __, index) => ++index)
    );
}
