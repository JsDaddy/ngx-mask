import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
    selector: 'jsdaddy-open-source-test',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    template: `<input mask="0000" [formControl]="form" />`,
})
class TestMaskComponent {
    public form: FormControl = new FormControl('');
}

describe('Directive: Forms', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should propagate masked value to the form control value', () => {
        component.form.setValue('A1234Z');
        expect(component.form.value).toBe('1234');
    });

    it('should propagate masked value to the form control valueChanges observable', () => {
        component.form.valueChanges.subscribe((newValue) => {
            expect(newValue).toEqual('1234');
        });

        component.form.setValue('A1234Z');
    });

    it('should mask values when multiple calls to setValue() are made', () => {
        component.form.setValue('A1234Z');
        expect(component.form.value).toBe('1234');
        component.form.setValue('A1234Z');
        expect(component.form.value).toBe('1234');
        component.form.setValue('A1234Z');
        expect(component.form.value).toBe('1234');
    });

    it('should propagate masked value to the form control valueChanges observable when multiple calls to setValue() are made', () => {
        component.form.valueChanges.subscribe((newValue) => {
            expect(newValue).toEqual('1234');
        });

        component.form.setValue('A1234Z');
        component.form.setValue('A1234Z');
        component.form.setValue('A1234Z');
    });

    it('should not emit to valueChanges if the masked value has not changed with emitEvent: true', () => {
        let emissionsToValueChanges = 0;

        component.form.valueChanges.subscribe(() => {
            emissionsToValueChanges++;
        });

        component.form.setValue('1234', { emitEvent: true });
        component.form.setValue('1234', { emitEvent: true });

        // Expect to emit 3 times, once for the first setValue() call, once by ngx-mask, and once for the second setValue() call.
        // There is not fourth emission for when ngx-mask masks the value for a second time.
        expect(emissionsToValueChanges).toBe(3);
    });

    it('should not emit to valueChanges if the masked value has not changed with emitEvent: false', () => {
        let emissionsToValueChanges = 0;

        component.form.valueChanges.subscribe(() => {
            emissionsToValueChanges++;
        });

        component.form.setValue('1234', { emitEvent: false });
        component.form.setValue('1234', { emitEvent: false });

        // Expect to only have emitted once, only by ngx-mask.
        // There is no second emission for when ngx-mask masks the value for a second time.
        expect(emissionsToValueChanges).toBe(1);
    });
});
