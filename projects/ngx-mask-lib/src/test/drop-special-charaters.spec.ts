import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { expect } from 'vitest';

describe('Directive: Mask (Drop special characters)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('FormControl should be filled without special characters', () => {
        component.mask.set('00-00-00');
        component.dropSpecialCharacters.set(false);
        equal('257898', '25-78-98', fixture);

        expect(component.form.value).equal('25-78-98');
        equal('123456', '12-34-56', fixture);

        expect(component.form.value).equal('12-34-56');
    });

    it('should correct value with mask 00-00/00 with dropSpecialCharacters = /', () => {
        component.mask.set('00-00/00');
        component.dropSpecialCharacters.set(['/']);

        equal('257898', '25-78/98', fixture);
        expect(component.form.value).equal('25-7898');
    });

    it('should correct value with mask 0000.00 with dropSpecialCharacters = true', () => {
        component.mask.set('0000.00');
        component.dropSpecialCharacters.set(true);
        component.form.setValue(123456);

        equal('123456', '1234.56', fixture);
        expect(component.form.value).equal(123456);
    });

    it('FormControl should be filled without special characters', () => {
        component.mask.set('separator.4');
        component.thousandSeparator.set(',');
        component.dropSpecialCharacters.set(true);
        component.form.setValue(2578.9812);

        equal('2578.9812', '2,578.9812', fixture);
        expect(component.form.value).equal(2578.9812);
    });

    it('FormControl should normally handle the removal of whitespace', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(' ');
        component.dropSpecialCharacters.set(true);
        component.form.setValue(1234567.89);

        // @todo add backspace event check

        equal('1234567.89', '1 234 567.89', fixture);
        expect(component.form.value).equal(1234567.89);
    });

    it('dropSpecialCharacter test for valid', () => {
        component.mask.set('(000) 000-0000');
        component.dropSpecialCharacters.set(true);
        component.validation.set(true);
        equal('1', '(1', fixture);
        expect(component.form.valid).equal(false);
        equal('12', '(12', fixture);
        expect(component.form.valid).equal(false);
        equal('123', '(123', fixture);
        expect(component.form.valid).equal(false);
        equal('1234', '(123) 4', fixture);
        expect(component.form.valid).equal(false);
        equal('12345', '(123) 45', fixture);
        expect(component.form.valid).equal(false);
        equal('123456', '(123) 456', fixture);
        expect(component.form.valid).equal(false);
        equal('1234567', '(123) 456-7', fixture);
        expect(component.form.valid).equal(false);
        equal('12345678', '(123) 456-78', fixture);
        expect(component.form.valid).equal(false);
        equal('123456789', '(123) 456-789', fixture);
        expect(component.form.valid).equal(false);
        equal('1234567890', '(123) 456-7890', fixture);
        expect(component.form.valid).equal(true);
    });

    it('dropSpecialCharacter = false test for valid', () => {
        component.mask.set('(000) 000-0000');
        component.dropSpecialCharacters.set(true);
        component.validation.set(true);
        equal('1', '(1', fixture);
        expect(component.form.valid).equal(false);
        equal('12', '(12', fixture);
        expect(component.form.valid).equal(false);
        equal('123', '(123', fixture);
        expect(component.form.valid).equal(false);
        equal('1234', '(123) 4', fixture);
        expect(component.form.valid).equal(false);
        equal('12345', '(123) 45', fixture);
        expect(component.form.valid).equal(false);
        equal('123456', '(123) 456', fixture);
        expect(component.form.valid).equal(false);
        equal('1234567', '(123) 456-7', fixture);
        expect(component.form.valid).equal(false);
        equal('12345678', '(123) 456-78', fixture);
        expect(component.form.valid).equal(false);
        equal('123456789', '(123) 456-789', fixture);
        expect(component.form.valid).equal(false);
        equal('1234567890', '(123) 456-7890', fixture);
        expect(component.form.valid).equal(true);
    });

    it('dropSpecialCharacter = true test for valid with setValue', () => {
        component.mask.set('(000) 000-0000');
        component.dropSpecialCharacters.set(true);
        component.validation.set(true);
        component.form.setValue('1234567890');
        equal('1234567890', '(123) 456-7890', fixture);
        expect(component.form.valid).equal(true);
    });

    it('dropSpecialCharacter = false test for valid with setValue', () => {
        component.mask.set('(000) 000-0000');
        component.dropSpecialCharacters.set(false);
        component.validation.set(true);
        equal('1', '(1', fixture);
        expect(component.form.valid).toBeFalsy();
        equal('12', '(12', fixture);
        expect(component.form.valid).toBeFalsy();
        equal('123', '(123', fixture);
        expect(component.form.valid).toBeFalsy();
        equal('1234', '(123) 4', fixture);
        expect(component.form.valid).toBeFalsy();
        equal('12345', '(123) 45', fixture);
        expect(component.form.valid).toBeFalsy();
        equal('123456', '(123) 456', fixture);
        expect(component.form.valid).toBeFalsy();
        equal('1234567', '(123) 456-7', fixture);
        expect(component.form.valid).toBeFalsy();
        equal('12345678', '(123) 456-78', fixture);
        expect(component.form.valid).toBeFalsy();
        equal('123456789', '(123) 456-789', fixture);
        expect(component.form.valid).toBeFalsy();
        equal('1234567890', '(123) 456-7890', fixture);
        expect(component.form.valid).equal(true);
    });
});
