import type { OnInit } from '@angular/core';
import { Component, inject, Injector, input, runInInjectionContext, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { FieldTree } from '@angular/forms/signals';
import { form, FormField } from '@angular/forms/signals';
import type { NgxMaskConfig } from 'ngx-mask';
import { initialConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';

/** What the demo's controls hold: a string, or a number once a numeric model was written. */
export type DemoModel = string | number | null;

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
 * Mirrors the three inputs of the demo's example card (src/app/options/options.component.html):
 * Reactive Forms, Template-driven and Signal Forms, with the same bindings and the same fallbacks
 * (`ex._x || default`), so a bug that only shows up with the demo's exact wiring can be reproduced
 * with a real keyboard. The controls are created from `initialValue` when the component
 * initialises, as the demo does for every example.
 */
@Component({
    selector: 'ngxd-demo-bindings-harness',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule, FormsModule, FormField],
    providers: [provideNgxMask()],
    template: `
        @if (reactive(); as control) {
            <input
                id="masked"
                [formControl]="control"
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
            <input
                id="ngmodel"
                [(ngModel)]="model"
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
            <input
                id="signal"
                [formField]="signalField()!.value"
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
        }
        <pre id="value">{{ reactive()?.value }}</pre>
    `,
})
export class DemoBindingsHarnessComponent implements OnInit {
    public readonly ex = input<DemoExample>({});
    /** The model every control starts from; a number models a numeric model. */
    public readonly initialValue = input<DemoModel>('');
    protected readonly reactive = signal<FormControl<DemoModel> | null>(null);
    protected readonly signalField = signal<FieldTree<{ value: DemoModel }> | null>(null);
    public model: DemoModel = '';
    protected readonly specialCharacters = initialConfig.specialCharacters;
    protected readonly outputTransformFn = initialConfig.outputTransformFn;
    protected readonly inputTransformFn = initialConfig.inputTransformFn;
    private readonly injector = inject(Injector);

    public get form(): FormControl<DemoModel> {
        return this.reactive() as FormControl<DemoModel>;
    }

    public get signalValue(): DemoModel {
        return (this.signalField() as FieldTree<{ value: DemoModel }>).value().value();
    }

    public ngOnInit(): void {
        const initial = this.initialValue();
        this.model = initial;
        const signalModel = signal<{ value: DemoModel }>({ value: initial });
        this.signalField.set(runInInjectionContext(this.injector, () => form(signalModel)));
        this.reactive.set(new FormControl<DemoModel>(initial));
    }
}
