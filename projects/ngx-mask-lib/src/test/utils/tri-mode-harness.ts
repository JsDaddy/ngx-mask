import {
    Component,
    Directive,
    Injector,
    inject,
    runInInjectionContext,
    signal,
    ChangeDetectionStrategy,
} from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, disabled, form, schema } from '@angular/forms/signals';
import type { NgxMaskConfig, NgxMaskOptions } from 'ngx-mask';
import { NGX_MASK_CONFIG, NgxMaskDirective, provideNgxMask } from 'ngx-mask';

export const TRI_MODES = ['reactive', 'template', 'signal'] as const;

export type TriMode = (typeof TRI_MODES)[number];

export type TriModeMaskConfig = {
    mask: string;
    prefix?: string;
    suffix?: string;
    dropSpecialCharacters?: boolean;
    leadZero?: boolean;
    thousandSeparator?: string;
    allowNegativeNumbers?: boolean;
    specialCharacters?: string[];
    patterns?: NgxMaskConfig['patterns'];
    showMaskTyped?: boolean;
    /** Options forwarded to provideNgxMask() (DI-level config, e.g. maskAliases). */
    providerOptions?: NgxMaskOptions;
};

export type TriModeHarness = {
    fixture: ComponentFixture<TriModeConfigBase>;
    getInput: () => HTMLInputElement;
    /** Form-side value: FormControl.value / ngModel property / signal form field value. */
    getBoundValue: () => string | null;
    setBoundValue: (value: string) => Promise<void>;
    /** Types char-by-char (same simulation as the shared typeTest) and returns the display value. */
    typeValue: (value: string) => Promise<string>;
    setDisabled: (isDisabled: boolean) => Promise<void>;
    isInputDisabled: () => boolean;
    /**
     * Mode-idiomatic "user interacted" check after type + blur:
     * reactive → FormControl.dirty, template → ng-dirty class, signal → touched().
     */
    isUserInteracted: () => boolean;
    blur: () => Promise<void>;
    /** Settles NgModel async sync, deferred microtask DOM writes and rAF-deferred leadZero writes. */
    flush: () => Promise<void>;
};

/**
 * Shared mask-config surface for all three host components, mirroring the signal-based
 * config pattern of utils/test-component.component.ts (defaults come from NGX_MASK_CONFIG).
 */
@Directive()
export class TriModeConfigBase {
    protected readonly _config = inject<NgxMaskConfig>(NGX_MASK_CONFIG);

    public readonly maskExpression = signal<string>('');
    public readonly dropSpecialCharacters = signal<NgxMaskConfig['dropSpecialCharacters']>(
        this._config.dropSpecialCharacters
    );
    public readonly specialCharacters = signal<NgxMaskConfig['specialCharacters']>(
        this._config.specialCharacters
    );
    public readonly patterns = signal<NgxMaskConfig['patterns']>(this._config.patterns);
    public readonly prefix = signal<NgxMaskConfig['prefix']>(this._config.prefix);
    public readonly suffix = signal<NgxMaskConfig['suffix']>(this._config.suffix);
    public readonly thousandSeparator = signal<NgxMaskConfig['thousandSeparator']>(
        this._config.thousandSeparator
    );
    public readonly leadZero = signal<NgxMaskConfig['leadZero']>(this._config.leadZero);
    public readonly allowNegativeNumbers = signal<NgxMaskConfig['allowNegativeNumbers']>(
        this._config.allowNegativeNumbers
    );
    public readonly showMaskTyped = signal<NgxMaskConfig['showMaskTyped']>(
        this._config.showMaskTyped
    );
}

@Component({
    selector: 'ngxd-tri-mode-reactive-test',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <input
            id="mask"
            [mask]="maskExpression()"
            [dropSpecialCharacters]="dropSpecialCharacters()"
            [specialCharacters]="specialCharacters()"
            [patterns]="patterns()"
            [prefix]="prefix()"
            [suffix]="suffix()"
            [thousandSeparator]="thousandSeparator()"
            [leadZero]="leadZero()"
            [allowNegativeNumbers]="allowNegativeNumbers()"
            [showMaskTyped]="showMaskTyped()"
            [formControl]="form" />
    `,
})
export class TriModeReactiveComponent extends TriModeConfigBase {
    public readonly form: FormControl<string | null> = new FormControl<string | null>('');
}

@Component({
    selector: 'ngxd-tri-mode-template-test',
    imports: [FormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <input
            id="mask"
            [mask]="maskExpression()"
            [dropSpecialCharacters]="dropSpecialCharacters()"
            [specialCharacters]="specialCharacters()"
            [patterns]="patterns()"
            [prefix]="prefix()"
            [suffix]="suffix()"
            [thousandSeparator]="thousandSeparator()"
            [leadZero]="leadZero()"
            [allowNegativeNumbers]="allowNegativeNumbers()"
            [showMaskTyped]="showMaskTyped()"
            [disabled]="disabledField()"
            [(ngModel)]="value" />
    `,
})
export class TriModeTemplateComponent extends TriModeConfigBase {
    // A signal (not a plain property) so post-init programmatic writes don't trip
    // NG0100 (ExpressionChangedAfterItHasBeenChecked) under zoneless change detection.
    public readonly value = signal<string | null>('');
    public readonly disabledField = signal(false);
}

@Component({
    selector: 'ngxd-tri-mode-signal-test',
    imports: [FormField, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <input
            id="mask"
            [mask]="maskExpression()"
            [dropSpecialCharacters]="dropSpecialCharacters()"
            [specialCharacters]="specialCharacters()"
            [patterns]="patterns()"
            [prefix]="prefix()"
            [suffix]="suffix()"
            [thousandSeparator]="thousandSeparator()"
            [leadZero]="leadZero()"
            [allowNegativeNumbers]="allowNegativeNumbers()"
            [showMaskTyped]="showMaskTyped()"
            [formField]="signalForm.value" />
    `,
})
export class TriModeSignalComponent extends TriModeConfigBase {
    private readonly _injector = inject(Injector);

    public readonly disabledField = signal(false);
    public readonly model = signal<{ value: string }>({ value: '' });
    public readonly signalForm = runInInjectionContext(this._injector, () =>
        form(
            this.model,
            schema<{ value: string }>((path) => {
                disabled(path.value, { when: () => this.disabledField() });
            })
        )
    );
}

function applyConfig(host: TriModeConfigBase, config: TriModeMaskConfig): void {
    host.maskExpression.set(config.mask);
    if (typeof config.dropSpecialCharacters === 'boolean') {
        host.dropSpecialCharacters.set(config.dropSpecialCharacters);
    }
    if (typeof config.leadZero === 'boolean') {
        host.leadZero.set(config.leadZero);
    }
    if (typeof config.allowNegativeNumbers === 'boolean') {
        host.allowNegativeNumbers.set(config.allowNegativeNumbers);
    }
    if (typeof config.prefix === 'string') {
        host.prefix.set(config.prefix);
    }
    if (typeof config.suffix === 'string') {
        host.suffix.set(config.suffix);
    }
    if (typeof config.thousandSeparator === 'string') {
        host.thousandSeparator.set(config.thousandSeparator);
    }
    if (config.specialCharacters) {
        host.specialCharacters.set(config.specialCharacters);
    }
    if (config.patterns) {
        host.patterns.set(config.patterns);
    }
    if (typeof config.showMaskTyped === 'boolean') {
        host.showMaskTyped.set(config.showMaskTyped);
    }
}

/**
 * Char-by-char input simulation, mirroring utils/test-functions.component.ts typeTest()
 * WITHOUT the synthetic DOM 'ngModelChange' dispatch: [(ngModel)] desugars to a real
 * (ngModelChange) binding, so that synthetic Event object would be written into the
 * template-driven model, clobbering the actual bound value. The directive itself only
 * reacts to 'input' events for typing, so dropping the dispatch changes nothing else.
 */
function typeChars(inputValue: string, fixture: ComponentFixture<TriModeConfigBase>): string {
    fixture.detectChanges();
    const inputElement = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    inputElement.value = '';
    inputElement.dispatchEvent(new Event('input'));

    for (const element of inputValue.split('')) {
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: element }));
        const selectionStart = inputElement.selectionStart || 0;
        const selectionEnd = inputElement.selectionEnd || 0;
        inputElement.value =
            inputElement.value.slice(0, selectionStart) +
            element +
            inputElement.value.slice(selectionEnd);

        inputElement.selectionStart = selectionStart + 1;
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }
    return inputElement.value;
}

type ModeAccessors = {
    getBoundValue: () => string | null;
    setBoundValue: (value: string) => void;
    setDisabled: (isDisabled: boolean) => void;
    isUserInteracted: () => boolean;
};

function buildHarness(
    fixture: ComponentFixture<TriModeConfigBase>,
    accessors: ModeAccessors
): TriModeHarness {
    const getInput = (): HTMLInputElement =>
        fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Settles every async write path the three modes use:
    // - whenStable: NgModel syncs model→view via a resolved-promise microtask;
    // - microtask + detectChanges: formElementProperty DOM writes are deferred via queueMicrotask,
    //   and the directive replays a pre-config writeValue after the first ngOnChanges;
    // - requestAnimationFrame: separator + leadZero writes defer the leadZero-normalized
    //   applyMask() call to a rAF callback (see ngx-mask.directive.ts writeValue()).
    const flush = async (): Promise<void> => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await Promise.resolve();
        fixture.detectChanges();
        await new Promise<void>((resolve) => {
            requestAnimationFrame(() => resolve());
        });
        fixture.detectChanges();
    };

    return {
        fixture,
        getInput,
        flush,
        getBoundValue: accessors.getBoundValue,
        isUserInteracted: accessors.isUserInteracted,
        setBoundValue: async (value: string): Promise<void> => {
            accessors.setBoundValue(value);
            await flush();
        },
        typeValue: async (value: string): Promise<string> => {
            typeChars(value, fixture);
            await flush();
            return getInput().value;
        },
        setDisabled: async (isDisabled: boolean): Promise<void> => {
            accessors.setDisabled(isDisabled);
            await flush();
        },
        isInputDisabled: (): boolean => getInput().disabled,
        blur: async (): Promise<void> => {
            getInput().dispatchEvent(new Event('blur'));
            await flush();
        },
    };
}

/**
 * Creates a mask fixture in one of the three form-binding modes with a uniform API,
 * so parity specs can run the exact same steps/assertions against each binding.
 */
export async function createTriModeFixture(
    mode: TriMode,
    config: TriModeMaskConfig,
    /**
     * A `number` initial value is deliberately allowed (issue #1590: `model(65432)`): the
     * directive accepts `string | number` at runtime, so the number is passed through the
     * string-typed bindings via a cast to exercise that path.
     */
    initialValue?: string | number,
    /** Disables the control BEFORE the first change detection pass (initially-disabled control). */
    initialDisabled?: boolean
): Promise<TriModeHarness> {
    TestBed.configureTestingModule({
        imports: [NgxMaskDirective],
        providers: [provideNgxMask(config.providerOptions)],
    });

    let harness: TriModeHarness;

    switch (mode) {
        case 'reactive': {
            const fixture = TestBed.createComponent(TriModeReactiveComponent);
            const component = fixture.componentInstance;
            applyConfig(component, config);
            if (typeof initialValue !== 'undefined') {
                component.form.setValue(initialValue as unknown as string);
            }
            if (initialDisabled) {
                component.form.disable();
            }
            harness = buildHarness(fixture, {
                getBoundValue: () => component.form.value,
                setBoundValue: (value: string) => {
                    component.form.setValue(value);
                },
                setDisabled: (isDisabled: boolean) => {
                    if (isDisabled) {
                        component.form.disable();
                    } else {
                        component.form.enable();
                    }
                },
                isUserInteracted: () => component.form.dirty,
            });
            break;
        }
        case 'template': {
            const fixture = TestBed.createComponent(TriModeTemplateComponent);
            const component = fixture.componentInstance;
            applyConfig(component, config);
            if (typeof initialValue !== 'undefined') {
                component.value.set(initialValue as unknown as string);
            }
            if (initialDisabled) {
                component.disabledField.set(true);
            }
            harness = buildHarness(fixture, {
                getBoundValue: () => component.value(),
                setBoundValue: (value: string) => {
                    component.value.set(value);
                },
                setDisabled: (isDisabled: boolean) => {
                    component.disabledField.set(isDisabled);
                },
                isUserInteracted: () =>
                    (
                        fixture.nativeElement.querySelector('input') as HTMLInputElement
                    ).classList.contains('ng-dirty'),
            });
            break;
        }
        case 'signal': {
            const fixture = TestBed.createComponent(TriModeSignalComponent);
            const component = fixture.componentInstance;
            applyConfig(component, config);
            if (typeof initialValue !== 'undefined') {
                component.model.set({ value: initialValue as unknown as string });
            }
            if (initialDisabled) {
                component.disabledField.set(true);
            }
            harness = buildHarness(fixture, {
                getBoundValue: () => component.signalForm.value().value(),
                setBoundValue: (value: string) => {
                    component.model.set({ value });
                },
                setDisabled: (isDisabled: boolean) => {
                    component.disabledField.set(isDisabled);
                },
                isUserInteracted: () => component.signalForm.value().touched(),
            });
            break;
        }
    }

    await harness.flush();
    return harness;
}
