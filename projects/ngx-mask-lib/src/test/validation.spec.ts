import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { equal } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TestMaskComponent } from './utils/test-component.component';

describe('Directive: Mask (Validation)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask({ validation: true })],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be marked as not valid if not valid and validation attribute true', () => {
        component.mask.set('0000');
        component.form.addValidators(Validators.required);

        equal('12', '12', fixture);
        expect(component.form.valid).toBe(false);
        expect(component.form.hasError('mask')).toBe(true);
    });

    it('should be marked as valid if not valid and validation attribute false', () => {
        component.validation.set(false);
        component.form.addValidators(Validators.required);

        equal('12', '12', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('should be marked as valid if valid and validation attribute true', () => {
        component.mask.set('0000');
        component.form.addValidators(Validators.required);

        equal('1234', '1234', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('should be marked as valid if not valid and validation attribute false', () => {
        component.validation.set(false);
        component.mask.set('0000');
        component.form.addValidators(Validators.required);

        equal('12', '12', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('should be not valid email mask A*@A*.SSS', () => {
        component.mask.set('A*@A*.SSS');
        component.dropSpecialCharacters.set(false);
        component.form.addValidators(Validators.required);

        equal('a', 'a', fixture);
        expect(component.form.valid).toBe(false);
        equal('as', 'as', fixture);
        expect(component.form.valid).toBe(false);
        equal('asd', 'asd', fixture);
        expect(component.form.valid).toBe(false);
        equal('andr', 'andr', fixture);
        expect(component.form.valid).toBe(false);
        equal('testing', 'testing', fixture);
        expect(component.form.valid).toBe(false);
        equal('testing@', 'testing@', fixture);
        expect(component.form.valid).toBe(false);
        equal('testing@a', 'testing@a', fixture);
        expect(component.form.valid).toBe(false);
        equal('testing@aa', 'testing@aa', fixture);
        expect(component.form.valid).toBe(false);
        equal('testing@gmail', 'testing@gmail', fixture);
        expect(component.form.valid).toBe(false);
        equal('testing@gmail.', 'testing@gmail.', fixture);
        expect(component.form.valid).toBe(false);
        equal('testing@gmail.c', 'testing@gmail.c', fixture);
        expect(component.form.valid).toBe(false);
        equal('testing@email.ua', 'testing@email.ua', fixture);
        expect(component.form.valid).toBe(false);
    });

    it('should valid email mask A*@A*.SSS', () => {
        component.mask.set('A*@A*.SSS');
        component.dropSpecialCharacters.set(false);
        component.form.addValidators(Validators.required);

        equal('testing@gmail.com', 'testing@gmail.com', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('should be not valid mask A*@A*.SS', () => {
        component.mask.set('A*@A*.SS');
        component.dropSpecialCharacters.set(false);
        component.form.addValidators(Validators.required);

        equal('d', 'd', fixture);
        expect(component.form.valid).toBe(false);
        equal('dd', 'dd', fixture);
        expect(component.form.valid).toBe(false);
        equal('ddd', 'ddd', fixture);
        expect(component.form.valid).toBe(false);
        equal('dddd', 'dddd', fixture);
        expect(component.form.valid).toBe(false);
        equal('andre', 'andre', fixture);
        expect(component.form.valid).toBe(false);
        equal('andrey', 'andrey', fixture);
        expect(component.form.valid).toBe(false);
        equal('andrey@', 'andrey@', fixture);
        expect(component.form.valid).toBe(false);
        equal('andrey@a', 'andrey@a', fixture);
        expect(component.form.valid).toBe(false);
        equal('andrey@te', 'andrey@te', fixture);
        expect(component.form.valid).toBe(false);
        equal('andrey@test', 'andrey@test', fixture);
        expect(component.form.valid).toBe(false);
        equal('andrey@test.c', 'andrey@test.c', fixture);
        expect(component.form.valid).toBe(false);
    });

    it('should valid email mask', () => {
        component.mask.set('A*@A*.SS');
        component.dropSpecialCharacters.set(false);
        component.form.addValidators(Validators.required);

        equal('testing@some.ua', 'testing@some.ua', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('should valid from one digit mask 0*', () => {
        component.mask.set('0*');
        component.form.setValidators([Validators.required, Validators.min(1)]);
        component.form.updateValueAndValidity();

        equal('', '', fixture);
        expect(component.form.valid).toBe(false);
        equal('0', '0', fixture);
        expect(component.form.valid).toBe(false);
        equal('00', '00', fixture);
        expect(component.form.valid).toBe(false);
        equal('1', '1', fixture);
        expect(component.form.valid).toBe(true);
        equal('01', '01', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('should valid from one digit mask S*', () => {
        component.mask.set('S*');
        component.form.setValidators([Validators.required, Validators.min(1)]);
        component.form.updateValueAndValidity();

        equal('', '', fixture);
        expect(component.form.valid).toBe(false);
        equal('d', 'd', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('should valid from one digit mask A*', () => {
        component.mask.set('A*');
        component.form.setValidators([Validators.required, Validators.min(1)]);
        component.form.updateValueAndValidity();

        equal('', '', fixture);
        expect(component.form.valid).toBe(false);
        equal('d', 'd', fixture);
        expect(component.form.valid).toBe(true);
        equal('1', '1', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('mask with number value should work as expected mask 0*', () => {
        component.mask.set('0*');
        component.form.setValidators([Validators.required, Validators.min(1)]);
        component.form.updateValueAndValidity();

        equal('44', '44', fixture);
        expect(component.form.valid).toBe(true);
        expect(component.form.value).toBe('44');

        equal('', '', fixture);
        expect(component.form.invalid).toBe(true);
        expect(component.form.value).toBe('');

        equal('1', '1', fixture);
        expect(component.form.valid).toBe(true);
        expect(component.form.value).toBe('1');
    });

    it('mask with number value should work as expected mask 000.00', () => {
        component.mask.set('000.00');
        component.form.addValidators(Validators.required);
        component.form.setValue('');

        equal('', '', fixture);
        expect(component.form.invalid).toBe(true);
        expect(component.form.value).toBe('');

        equal('44', '44', fixture);
        expect(component.form.invalid).toBe(true);
        expect(component.form.value).toBe('44');

        equal('1', '1', fixture);
        expect(component.form.invalid).toBe(true);
        expect(component.form.value).toBe('1');

        equal('444', '444', fixture);
        expect(component.form.invalid).toBe(true);
        expect(component.form.value).toBe('444');

        equal('444.3', '444.3', fixture);
        expect(component.form.invalid).toBe(true);
        expect(component.form.value).toBe('4443');

        equal('444.31', '444.31', fixture);
        expect(component.form.valid).toBe(true);
        expect(component.form.value).toBe('44431');
    });

    it('dropSpecialCharacters is different from specialCharacters', () => {
        component.mask.set('+000');
        component.specialCharacters.set(['+', ' ']);
        component.dropSpecialCharacters.set([' ']);
        component.form.addValidators(Validators.required);

        equal('+37', '+37', fixture);
        expect(component.form.valid).toBe(false);

        equal('+373', '+373', fixture);
        expect(component.form.valid).toBe(true);

        component.mask.set('+000 000 00 000');

        equal('+3736000000', '+373 600 00 00', fixture);
        expect(component.form.valid).toBe(false);

        equal('+37360000000', '+373 600 00 000', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('email Mask should validated correct', () => {
        component.mask.set('A*@A*.A*');
        component.dropSpecialCharacters.set(false);
        component.form.addValidators(Validators.required);

        equal('validate', 'validate', fixture);
        expect(component.form.valid).toBe(false);

        equal('validate@', 'validate@', fixture);
        expect(component.form.valid).toBe(false);

        equal('validate@some', 'validate@some', fixture);
        expect(component.form.valid).toBe(false);

        equal('validate@some.', 'validate@some.', fixture);
        expect(component.form.valid).toBe(false);

        equal('validate@some.e', 'validate@some.e', fixture);
        expect(component.form.valid).toBe(true);

        equal('validate@some.eu', 'validate@some.eu', fixture);
        expect(component.form.valid).toBe(true);

        equal('validate@some.com', 'validate@some.com', fixture);
        expect(component.form.valid).toBe(true);
    });
});
