import { Component, Injector, inject, runInInjectionContext, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { form, FormField, schema, disabled, required, pattern } from '@angular/forms/signals';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { expect } from 'vitest';
import { typeTest } from './utils/test-functions.component';

@Component({
    selector: 'jsdaddy-open-source-test',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    template: `<input mask="0000" [formControl]="form" />`,
})
class TestMaskComponent {
    public form: FormControl = new FormControl('');
}

@Component({
    selector: 'jsdaddy-phone-test',
    imports: [FormsModule, NgxMaskDirective],
    template: `
        <form #phoneForm="ngForm">
            <input
                name="phoneNumber"
                [(ngModel)]="phoneNumber"
                [pattern]="phoneValidationPattern"
                [dropSpecialCharacters]="false"
                [mask]="phoneMask" />
        </form>
    `,
})
class TestPhoneMaskComponent {
    public phoneValidationPattern =
        /^\(?([2-9][0-8][0-9])\)?[-. ]*([2-9][0-9]{2})[-. ]*([0-9]{4})$/;
    public phoneMask = '(000) 000-0000';
    public phoneNumber = '3333333333';
}

@Component({
    selector: 'jsdaddy-signal-mask-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input mask="0000" [formField]="signalForm.value" />`,
})
class TestSignalMaskComponent {
    private injector = inject(Injector);
    public model = signal({ value: '3333' });
    public signalForm = runInInjectionContext(this.injector, () => form(this.model));
}

// External signal read inside the schema logic function so tests can flip it per-case.
const disabledFieldSignal = signal(false);

const disabledSchema = schema<{ value: string }>((path) => {
    disabled(path.value, () => disabledFieldSignal());
});

@Component({
    selector: 'jsdaddy-signal-mask-disabled-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input mask="0000" [formField]="signalForm.value" />`,
})
class TestSignalMaskDisabledComponent {
    private injector = inject(Injector);
    public model = signal({ value: '' });
    public signalForm = runInInjectionContext(this.injector, () =>
        form(this.model, disabledSchema)
    );
}

@Component({
    selector: 'jsdaddy-signal-mask-dynamic-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input [mask]="mask()" [formField]="signalForm.value" />`,
})
class TestSignalMaskDynamicComponent {
    private injector = inject(Injector);
    public mask = signal('000000');
    public model = signal({ value: '123456' });
    public signalForm = runInInjectionContext(this.injector, () => form(this.model));
}

@Component({
    selector: 'jsdaddy-signal-mask-drop-special-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input
        mask="000-000"
        [dropSpecialCharacters]="false"
        [formField]="signalForm.value" />`,
})
class TestSignalMaskDropSpecialComponent {
    private injector = inject(Injector);
    public model = signal({ value: '' });
    public signalForm = runInInjectionContext(this.injector, () => form(this.model));
}

@Component({
    selector: 'jsdaddy-signal-mask-separator-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input
        mask="separator.2"
        [leadZero]="true"
        [thousandSeparator]="thousandSeparator()"
        [formField]="signalForm.value" />`,
})
class TestSignalMaskSeparatorComponent {
    private injector = inject(Injector);
    public thousandSeparator = signal(' ');
    public model = signal({ value: '' });
    public signalForm = runInInjectionContext(this.injector, () => form(this.model));
}

const requiredPatternSchema = schema<{ value: string }>((path) => {
    required(path.value);
    pattern(path.value, /^\d{4}$/);
});

@Component({
    selector: 'jsdaddy-signal-mask-validation-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input mask="0000" [validation]="true" [formField]="signalForm.value" />`,
})
class TestSignalMaskValidationComponent {
    private injector = inject(Injector);
    public model = signal({ value: '' });
    public signalForm = runInInjectionContext(this.injector, () =>
        form(this.model, requiredPatternSchema)
    );
}

@Component({
    selector: 'jsdaddy-signal-mask-or-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input mask="(00) 00000000||+00 (00) 00000000" [formField]="signalForm.value" />`,
})
class TestSignalMaskOrComponent {
    private injector = inject(Injector);
    public model = signal({ value: '' });
    public signalForm = runInInjectionContext(this.injector, () => form(this.model));
}

@Component({
    selector: 'jsdaddy-signal-mask-date-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input mask="d0/M0/0000" [formField]="signalForm.value" />`,
})
class TestSignalMaskDateComponent {
    private injector = inject(Injector);
    public model = signal({ value: '' });
    public signalForm = runInInjectionContext(this.injector, () => form(this.model));
}

@Component({
    selector: 'jsdaddy-signal-mask-time-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input mask="Hh:m0:s0" [formField]="signalForm.value" />`,
})
class TestSignalMaskTimeComponent {
    private injector = inject(Injector);
    public model = signal({ value: '' });
    public signalForm = runInInjectionContext(this.injector, () => form(this.model));
}

@Component({
    selector: 'jsdaddy-signal-mask-percent-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input mask="percent" [formField]="signalForm.value" />`,
})
class TestSignalMaskPercentComponent {
    private injector = inject(Injector);
    public model = signal({ value: '' });
    public signalForm = runInInjectionContext(this.injector, () => form(this.model));
}

@Component({
    selector: 'jsdaddy-signal-mask-prefix-suffix-test',
    imports: [NgxMaskDirective, FormField],
    template: `<input mask="0000" prefix="$ " suffix=" USD" [formField]="signalForm.value" />`,
})
class TestSignalMaskPrefixSuffixComponent {
    private injector = inject(Injector);
    public model = signal({ value: '' });
    public signalForm = runInInjectionContext(this.injector, () => form(this.model));
}

describe('Directive: Forms', () => {
    let fixture: ComponentFixture<TestMaskComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        fixture.detectChanges();
    });

    it('should not mark form as dirty on initial load with initial value', () => {
        const testBed = TestBed.createComponent(TestPhoneMaskComponent);
        const phoneComponent = testBed.componentInstance;
        phoneComponent.phoneNumber = '3333333333';
        testBed.detectChanges();

        // Get the form element and check if it's not dirty
        const formElement = testBed.nativeElement.querySelector('form');
        const inputElement = testBed.nativeElement.querySelector('input');

        // Check that the form is not dirty on initial load
        expect(formElement.classList.contains('ng-dirty')).equal(false);
        expect(inputElement.classList.contains('ng-dirty')).equal(false);
    });
});

describe('Directive: Signal Forms', () => {
    it('should format the initial signal value with the mask on render', async () => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        const testFixture = TestBed.createComponent(TestSignalMaskComponent);
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        expect(inputElement.value).equal('3333');
    });

    it('should update the underlying signal with the raw unmasked value on input', () => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        const testFixture = TestBed.createComponent(TestSignalMaskComponent);
        const component = testFixture.componentInstance;
        component.model.set({ value: '' });
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        inputElement.value = '1234';
        inputElement.dispatchEvent(new Event('input'));
        testFixture.detectChanges();

        expect(inputElement.value).equal('1234');
        expect(component.signalForm.value().value()).equal('1234');
    });

    it('should mark touched to true on blur, matching reactive/template-driven behavior', () => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        const testFixture = TestBed.createComponent(TestSignalMaskComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();

        expect(component.signalForm.value().touched()).equal(false);

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');
        inputElement.dispatchEvent(new Event('blur'));
        testFixture.detectChanges();

        expect(component.signalForm.value().touched()).equal(true);
    });

    it('should disable the native input when the signal form field is disabled via schema', async () => {
        disabledFieldSignal.set(false);
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        const testFixture = TestBed.createComponent(TestSignalMaskDisabledComponent);
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        expect(inputElement.disabled).equal(false);

        disabledFieldSignal.set(true);
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        expect(inputElement.disabled).equal(true);

        // reset shared signal so other tests are not affected
        disabledFieldSignal.set(false);
    });

    it('should re-apply formatting to the current signal value when the mask changes at runtime', async () => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        const testFixture = TestBed.createComponent(TestSignalMaskDynamicComponent);
        const component = testFixture.componentInstance;
        component.model.set({ value: '' });
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        inputElement.value = '123456';
        inputElement.dispatchEvent(new Event('input'));
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        expect(inputElement.value).equal('123456');

        component.mask.set('00-00-00');
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        expect(inputElement.value).equal('12-34-56');
    });

    it('should keep special characters in the displayed value while unmasking the signal value when dropSpecialCharacters is false', () => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        const testFixture = TestBed.createComponent(TestSignalMaskDropSpecialComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        inputElement.value = '123456';
        inputElement.dispatchEvent(new Event('input'));
        testFixture.detectChanges();

        expect(inputElement.value).equal('123-456');
        expect(component.signalForm.value().value()).equal('123-456');
    });
});

describe('Directive: Signal Forms (separator.2 decimal reflow)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
    });

    it('should reflow a raw decimal into a leadZero-padded display on initial render, matching Reactive Forms output for the same input', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskSeparatorComponent);
        const component = testFixture.componentInstance;
        component.model.set({ value: '10.2' });
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();
        // separator + leadZero writes defer the leadZero-normalized applyMask() call to a
        // requestAnimationFrame callback (see ngx-mask.directive.ts writeValue()), matching the
        // wait pattern used by separator-3.spec.ts's Reactive Forms equivalent tests.
        await new Promise((resolve) => requestAnimationFrame(resolve));
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        // Cross-checked against separator-2.spec.ts: reactive form.setValue('10.2') with
        // leadZero => '10.20' for the same separator.2 mask (display only). The initial
        // programmatic write intentionally does NOT emit back to the model (isInitialized
        // guard in formControlResult), so the model keeps the value it was set with.
        expect(inputElement.value).equal('10.20');
        expect(component.signalForm.value().value()).equal('10.2');
    });

    it('should insert the thousand separator while reformatting on signal value change, matching Reactive Forms output for the same input', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskSeparatorComponent);
        const component = testFixture.componentInstance;
        component.model.set({ value: '' });
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        component.model.set({ value: '1234.5' });
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();
        // separator + leadZero writes defer the leadZero-normalized applyMask() call to a
        // requestAnimationFrame callback (see ngx-mask.directive.ts writeValue()).
        await new Promise((resolve) => requestAnimationFrame(resolve));
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        // Cross-checked against separator.spec.ts: reactive '1234.50' with default space
        // thousandSeparator formats as '1 234.50'. The model holds the UNMASKED value
        // (dropSpecialCharacters defaults to true) — thousand separators are dropped, the
        // leadZero-normalized decimal part is kept — same as reactive form.value.
        expect(inputElement.value).equal('1 234.50');
        expect(component.signalForm.value().value()).equal('1234.50');
    });

    it('should not desync the echoed signal value while typing triggers active reformatting (_skipNextValueEffect guard)', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskSeparatorComponent);
        const component = testFixture.componentInstance;
        component.model.set({ value: '' });
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        // Simulate real per-character typing (with cursor tracking), the same way
        // Reactive Forms separator specs exercise the mid-typing reformatting path.
        typeTest('1234500', testFixture);
        await Promise.resolve();
        testFixture.detectChanges();

        // Parity with Reactive Forms: while typing, the DISPLAY keeps the typed reflow —
        // leadZero pads only the propagated MODEL value (formControlResult → _checkPrecision)
        // plus the display on blur. The FormField model echo of the just-propagated value is
        // skipped (see _lastPropagatedValue in ngx-mask.directive.ts), so the display is no
        // longer rewritten to '1 234 500.00' mid-typing — the exact same split Reactive Forms
        // shows (form.value '1234500.00', display '1 234 500').
        expect(inputElement.value).equal('1 234 500');
        expect(component.signalForm.value().value()).equal('1234500.00');
    });

    it('should apply a custom thousandSeparator while reflowing the signal value', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskSeparatorComponent);
        const component = testFixture.componentInstance;
        component.thousandSeparator.set('.');
        component.model.set({ value: '' });
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        component.model.set({ value: '1000000.00' });
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        // When thousandSeparator is '.', the service auto-switches the decimal marker to ','
        // to avoid ambiguity with the thousand separator (same behavior as Reactive Forms).
        expect(inputElement.value).equal('1.000.000,00');
    });
});

describe('Directive: Signal Forms (validation / schema)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask({ validation: true })],
        });
    });

    it('should report the field as invalid via the Signal Forms schema when the masked value does not satisfy the schema pattern, independent of NgxMaskDirective.validate()', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskValidationComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        inputElement.value = '12';
        inputElement.dispatchEvent(new Event('input'));
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        expect(inputElement.value).equal('12');
        expect(component.signalForm.value().valid()).equal(false);
        expect(component.signalForm.value().errors().length).toBeGreaterThan(0);
    });

    it('should report the field as valid via the Signal Forms schema once the masked value satisfies the schema pattern', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskValidationComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        inputElement.value = '1234';
        inputElement.dispatchEvent(new Event('input'));
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        expect(inputElement.value).equal('1234');
        expect(component.signalForm.value().valid()).equal(true);
        expect(component.signalForm.value().errors().length).equal(0);
    });

    it('should report the field as invalid via the Signal Forms `required` schema logic when the value is empty, even with [validation]=true on the directive', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskValidationComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        expect(component.signalForm.value().valid()).equal(false);

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');
        expect(inputElement.value).equal('');
    });
});

describe('Directive: Signal Forms (dynamic OR-masks)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
    });

    it('should match the first alternative of an OR-mask expression through the signal value effect', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskOrComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        inputElement.value = '5549362216';
        inputElement.dispatchEvent(new Event('input'));
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        // Cross-checked against dynamic.spec.ts: reactive typing '5549362216' into
        // '(00) 00000000||+00 (00) 00000000' formats as '(55) 49362216'.
        expect(inputElement.value).equal('(55) 49362216');
        expect(component.signalForm.value().value()).equal('5549362216');
    });

    it('should switch to the second alternative of the OR-mask expression once the value grows beyond the first alternative capacity', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskOrComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        inputElement.value = '55493622168';
        inputElement.dispatchEvent(new Event('input'));
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        // Cross-checked against dynamic.spec.ts: reactive typing an 11-digit value into the same
        // OR-mask expression formats as '+55 (49) 3622168'.
        expect(inputElement.value).equal('+55 (49) 3622168');
        expect(component.signalForm.value().value()).equal('55493622168');
    });
});

describe('Directive: Signal Forms (date / time masks)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
    });

    it('should auto-insert date separators while typing through the signal value effect without echo-guard interference', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskDateComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        // Type character-by-character (with cursor tracking), matching how
        // custom-date.spec.ts / time-mask.spec.ts exercise the same mid-typing
        // separator auto-insertion logic via typeTest().
        typeTest('25121999', testFixture);
        await Promise.resolve();
        testFixture.detectChanges();

        // Cross-checked against custom-date.spec.ts / time-mask.spec.ts: reactive typing
        // '25121999' into 'd0/M0/0000' formats as '25/12/1999'.
        expect(inputElement.value).equal('25/12/1999');
        // Model holds the unmasked digits (dropSpecialCharacters defaults to true),
        // same as reactive form.value for the same mask.
        expect(component.signalForm.value().value()).equal('25121999');
    });

    it('should auto-insert time separators while typing through the signal value effect without echo-guard interference', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskTimeComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        // Type character-by-character (with cursor tracking), matching how
        // time-mask.spec.ts exercises the same mid-typing separator auto-insertion
        // logic via typeTest().
        typeTest('235959', testFixture);
        await Promise.resolve();
        testFixture.detectChanges();

        // Cross-checked against time-mask.spec.ts: reactive typing '235959' into 'Hh:m0:s0'
        // formats as '23:59:59'.
        expect(inputElement.value).equal('23:59:59');
        // Model holds the unmasked digits (dropSpecialCharacters defaults to true),
        // same as reactive form.value for the same mask.
        expect(component.signalForm.value().value()).equal('235959');
    });
});

describe('Directive: Signal Forms (percent, prefix/suffix)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
    });

    it('should clamp typed input to a valid percent value through the signal value effect', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskPercentComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        inputElement.value = '150';
        inputElement.dispatchEvent(new Event('input'));
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        // Cross-checked against percent.spec.ts: reactive typing '150' into 'percent' clamps to '15'.
        expect(inputElement.value).equal('15');
        expect(component.signalForm.value().value()).equal('15');
    });

    it('should apply prefix and suffix around the masked value through the signal value effect', async () => {
        const testFixture = TestBed.createComponent(TestSignalMaskPrefixSuffixComponent);
        const component = testFixture.componentInstance;
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        const inputElement: HTMLInputElement = testFixture.nativeElement.querySelector('input');

        inputElement.value = '1234';
        inputElement.dispatchEvent(new Event('input'));
        testFixture.detectChanges();
        await Promise.resolve();
        testFixture.detectChanges();

        expect(inputElement.value).equal('$ 1234 USD');
        expect(component.signalForm.value().value()).equal('1234');
    });
});
