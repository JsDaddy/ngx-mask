import type { Mock } from 'vitest';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { vi, expect } from 'vitest';

@Component({
    selector: 'ngxd-open-source-test',
    standalone: true,
    imports: [ReactiveFormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: ` <input (maskFilled)="maskFilled()" [mask]="mask()" [formControl]="form" /> `,
})
class TestMaskComponent {
    public form: FormControl = new FormControl('');
    public mask = signal('0000');

    public isMaskFilled = signal<boolean>(false);

    public maskFilled(): void {
        this.isMaskFilled.set(true);
    }
}

describe('Directive: Mask (Function maskFilled)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    let maskFilledSpy: Mock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        maskFilledSpy = vi.spyOn(component, 'maskFilled');
    });

    it('should call function maskFilled and isMaskFilled should be true', () => {
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '9999';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.isMaskFilled()).equal(true);
        expect(maskFilledSpy).toHaveBeenCalledTimes(1);
        expect(maskFilledSpy).toHaveBeenCalledWith();
    });

    it('isMaskFilled should be false', () => {
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '999';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.isMaskFilled()).equal(false);
    });

    it('emits once for the keystroke that completes the mask, not for later revalidation', () => {
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '1234';
        inputElement.dispatchEvent(new Event('input'));
        component.form.updateValueAndValidity();
        component.form.updateValueAndValidity();
        fixture.detectChanges();

        expect(maskFilledSpy).toHaveBeenCalledTimes(1);
    });

    it('does not emit when a complete value is written programmatically', () => {
        component.form.setValue('1234');
        fixture.detectChanges();
        component.form.patchValue('5678');
        component.form.updateValueAndValidity();
        fixture.detectChanges();

        expect(maskFilledSpy).not.toHaveBeenCalled();
    });

    it('emits once for a complete pasted value', () => {
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

        inputElement.dispatchEvent(new Event('paste'));
        inputElement.value = '1234';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(maskFilledSpy).toHaveBeenCalledTimes(1);
    });

    it('does not emit for an incomplete edit that follows a programmatic write', () => {
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
        component.form.setValue('1234');

        inputElement.value = '123';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(maskFilledSpy).not.toHaveBeenCalled();
    });

    it('emits once when an IME composition completes the mask', () => {
        component.mask.set('AAAA');
        fixture.detectChanges();
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

        inputElement.dispatchEvent(new Event('compositionstart'));
        inputElement.value = 'abcd';
        inputElement.dispatchEvent(new Event('input'));
        expect(maskFilledSpy).not.toHaveBeenCalled();
        inputElement.dispatchEvent(new Event('compositionend'));
        fixture.detectChanges();

        expect(maskFilledSpy).toHaveBeenCalledTimes(1);
    });
});

@Component({
    selector: 'ngxd-open-source-no-forms-test',
    standalone: true,
    imports: [NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<input mask="0000" (maskFilled)="filled = filled + 1" />`,
})
class NoFormsMaskFilledComponent {
    public filled = 0;
}

describe('Directive: Mask (maskFilled without forms)', () => {
    let fixture: ComponentFixture<NoFormsMaskFilledComponent>;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective, NoFormsMaskFilledComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(NoFormsMaskFilledComponent);
        fixture.detectChanges();
        inputElement = fixture.nativeElement.querySelector('input');
    });

    it('emits exactly once when typing completes the mask and there is no NgControl', () => {
        inputElement.value = '1234';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(fixture.componentInstance.filled).equal(1);
    });

    it('does not emit for an incomplete value and there is no NgControl', () => {
        inputElement.value = '123';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(fixture.componentInstance.filled).equal(0);
    });
});
