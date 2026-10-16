import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { NgxMaskConfig } from 'ngx-mask';
import { initialConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';

/** Subset of the demo's `MaskOptions` (src/app/shared/accordion/content.types.ts). */
export type DemoExample = Partial<{
    _prefix: string;
    _suffix: string;
    _dropSpecialCharacters: boolean | string[];
    _showMaskTyped: boolean;
    _clearIfNotMatch: boolean;
    _shownMaskExpression: string;
    _validation: boolean;
    _allowNegativeNumbers: boolean;
    _hiddenInput: boolean;
    _leadZero: boolean;
    _leadZeroDateTime: boolean;
    _specialCharacters: string[];
    _apm: boolean;
    _decimalMarker: string | string[];
    _thousandSeparator: string;
    _keepCharacterPositions: boolean;
    _typeFromDecimals: boolean;
    _defaultValueOnBlur: string;
    _placholderCharacter: string;
    _inputTransformFn: NgxMaskConfig['inputTransformFn'];
    _outputTransformFn: NgxMaskConfig['outputTransformFn'];
    _mask: string;
}>;

/**
 * Mirrors the "Reactive Forms" input of the demo (src/app/options/options.component.html): the same
 * bindings with the same fallbacks (`ex._x || default`), so a bug that only shows up when the demo
 * binds every option at once can be reproduced with a real keyboard.
 */
@Component({
    selector: 'ngxd-demo-bindings-harness',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input
            id="masked"
            [placeholder]="''"
            [placeHolderCharacter]="ex()._placholderCharacter || '_'"
            [prefix]="ex()._prefix || ''"
            [suffix]="ex()._suffix || ''"
            [dropSpecialCharacters]="ex()._dropSpecialCharacters ?? true"
            [mask]="ex()._mask || ''"
            [thousandSeparator]="ex()._thousandSeparator || ' '"
            [allowNegativeNumbers]="ex()._allowNegativeNumbers || null"
            [specialCharacters]="ex()._specialCharacters || specialCharacters"
            [shownMaskExpression]="$any(ex()._shownMaskExpression)"
            [formControl]="form"
            [apm]="ex()._apm || false"
            [decimalMarker]="$any(ex()._decimalMarker || '.')"
            [typeFromDecimals]="ex()._typeFromDecimals || false"
            [defaultValueOnBlur]="ex()._defaultValueOnBlur ?? null"
            [leadZero]="ex()._leadZero || false"
            [leadZeroDateTime]="ex()._leadZeroDateTime || false"
            [keepCharacterPositions]="ex()._keepCharacterPositions || false"
            [validation]="ex()._validation || false"
            [showMaskTyped]="ex()._showMaskTyped || false"
            [clearIfNotMatch]="$any(ex()._clearIfNotMatch)"
            [hiddenInput]="ex()._hiddenInput || null"
            [outputTransformFn]="ex()._outputTransformFn || outputTransformFn"
            [inputTransformFn]="ex()._inputTransformFn || inputTransformFn" />
        <pre id="value">{{ form.value }}</pre>
    `,
})
export class DemoBindingsHarnessComponent {
    public readonly ex = input<DemoExample>({});
    public readonly form = new FormControl<string | null>('');
    protected readonly specialCharacters = initialConfig.specialCharacters;
    protected readonly outputTransformFn = initialConfig.outputTransformFn;
    protected readonly inputTransformFn = initialConfig.inputTransformFn;
}
