import { Component, Injector, inject, runInInjectionContext, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { form, FormField, schema, disabled } from '@angular/forms/signals';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { expect } from 'vitest';

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
