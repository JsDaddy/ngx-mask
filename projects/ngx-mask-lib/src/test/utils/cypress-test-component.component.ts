import { Component, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { scan, startWith } from 'rxjs';
import type { NgxMaskConfig } from 'ngx-mask';
import { provideNgxMask } from 'ngx-mask';
import { NgxMaskDirective } from 'ngx-mask';
import { NGX_MASK_CONFIG } from 'ngx-mask';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'jsdaddy-open-source-test',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input
            id="masked"
            [formControl]="form"
            [mask]="mask()"
            [prefix]="prefix()"
            [suffix]="suffix()"
            [leadZero]="leadZero()"
            [showMaskTyped]="showMaskTyped()"
            [allowNegativeNumbers]="allowNegativeNumbers()"
            [decimalMarker]="decimalMarker()"
            [thousandSeparator]="thousandSeparator()"
            [shownMaskExpression]="shownMaskExpression()"
            [leadZeroDateTime]="leadZeroDateTime()"
            [dropSpecialCharacters]="dropSpecialCharacters()"
            [specialCharacters]="specialCharacters()"
            [patterns]="patterns()"
            [keepCharacterPositions]="keepCharacterPositions()"
            [separatorLimit]="separatorLimit()"
            [hiddenInput]="hiddenInput()" />

        <pre id="pre">{{ counter$() }}</pre>
        <pre id="pre1">{{ form.value }}</pre>
        <div>
            {{ leadZeroDateTime() }}
        </div>
    `,
})
export class CypressTestMaskComponent {
    protected _config = inject<NgxMaskConfig>(NGX_MASK_CONFIG);
    public mask = input('');

    public hiddenInput = input<NgxMaskConfig['hiddenInput']>(this._config.hiddenInput);

    public allowNegativeNumbers = input<NgxMaskConfig['allowNegativeNumbers']>(
        this._config.allowNegativeNumbers
    );

    public prefix = input<NgxMaskConfig['prefix']>(this._config.prefix);

    public suffix = input<NgxMaskConfig['suffix']>(this._config.suffix);

    public leadZero = input<NgxMaskConfig['leadZero']>(this._config.leadZero);

    public showMaskTyped = input<NgxMaskConfig['showMaskTyped']>(this._config.showMaskTyped);

    public decimalMarker = input<NgxMaskConfig['decimalMarker'] | string>('.');

    public thousandSeparator = input<NgxMaskConfig['thousandSeparator']>(',');

    public keepCharacterPositions = input<NgxMaskConfig['keepCharacterPositions']>(
        this._config.keepCharacterPositions
    );

    public shownMaskExpression = input<NgxMaskConfig['shownMaskExpression']>(
        this._config.shownMaskExpression
    );

    public placeHolderCharacter = input<NgxMaskConfig['placeHolderCharacter']>(
        this._config.placeHolderCharacter
    );

    public dropSpecialCharacters = input<NgxMaskConfig['dropSpecialCharacters']>(
        this._config.dropSpecialCharacters
    );
    public leadZeroDateTime = input<NgxMaskConfig['leadZeroDateTime']>(
        this._config.leadZeroDateTime
    );

    public separatorLimit = input<NgxMaskConfig['separatorLimit']>(this._config.separatorLimit);

    public patterns = input<NgxMaskConfig['patterns']>(this._config.patterns);

    public specialCharacters = input<NgxMaskConfig['specialCharacters']>(
        this._config.specialCharacters
    );

    public form: FormControl = new FormControl('');

    public readonly counter$ = toSignal(
        this.form.valueChanges.pipe(
            startWith(0),

            scan((acc) => acc + 1, 0)
        )
    );
}
