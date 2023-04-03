import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

@Component({
    selector: 'ngx-mask-demo-test',
    template: ` <input id="maska" mask="0000" [formControl]="form" /> `,
})
export class TestMaskNoValidationAttributeComponent {
    public form: FormControl = new FormControl('');
}

@Component({
    selector: 'ngx-mask-demo-test',
    template: ` <input id="maska" mask="0000" [validation]="validate" [formControl]="form" /> `,
})
export class TestMaskValidationAttributeComponent {
    public form: FormControl = new FormControl('');

    public validate = true;
}

describe('Directive: Mask (Validation)', () => {
    describe('Global validation true, validation attribute on input not specified', () => {
        let fixture: ComponentFixture<TestMaskNoValidationAttributeComponent>;
        let component: TestMaskNoValidationAttributeComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestMaskNoValidationAttributeComponent],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask({ validation: true })],
            });
            fixture = TestBed.createComponent(TestMaskNoValidationAttributeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should be marked as not valid if not valid', () => {
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(false);
            expect(component.form.hasError('mask')).toBe(true);
        });

        it('should be marked as valid if valid', () => {
            equal('1234', '1234', fixture);
            expect(component.form.valid).toBe(true);
        });
    });

    describe('Global validation true, validation attribute on input specified', () => {
        let fixture: ComponentFixture<TestMaskValidationAttributeComponent>;
        let component: TestMaskValidationAttributeComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestMaskValidationAttributeComponent],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask()],
            });
            fixture = TestBed.createComponent(TestMaskValidationAttributeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should be marked as not valid if not valid and validation attribute true', () => {
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(false);
            expect(component.form.hasError('mask')).toBe(true);
        });

        it('should be marked as valid if valid and validation attribute true', () => {
            equal('1234', '1234', fixture);
            expect(component.form.valid).toBe(true);
        });

        it('should be marked as valid if not valid and validation attribute false', () => {
            component.validate = false;
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(true);
        });
    });

    describe('Global validation false, validation attribute on input not specified', () => {
        let fixture: ComponentFixture<TestMaskNoValidationAttributeComponent>;
        let component: TestMaskNoValidationAttributeComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestMaskNoValidationAttributeComponent],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask({ validation: false })],
            });
            fixture = TestBed.createComponent(TestMaskNoValidationAttributeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should be marked as valid if not valid', () => {
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(true);
        });
    });

    describe('Global validation false, validation attribute on input specified', () => {
        let fixture: ComponentFixture<TestMaskValidationAttributeComponent>;
        let component: TestMaskValidationAttributeComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestMaskValidationAttributeComponent],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask()],
            });
            fixture = TestBed.createComponent(TestMaskValidationAttributeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should be marked as not valid if not valid and validation attribute true', () => {
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(false);
            expect(component.form.hasError('mask')).toBe(true);
        });

        it('should be marked as valid if not valid and validation attribute false', () => {
            component.validate = false;
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(true);
        });
    });
});
