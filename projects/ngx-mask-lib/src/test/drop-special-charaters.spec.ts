import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask (Drop special characters)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('FormControl should be filled without special characters', () => {
        component.mask = '00-00-00';
        component.dropSpecialCharacters = false;
        equal('257898', '25-78-98', fixture);

        expect(component.form.value).toBe('25-78-98');

        equal('123456', '12-34-56', fixture);

        expect(component.form.value).toBe('12-34-56');

        component.mask = '00-00/00';
        component.dropSpecialCharacters = ['/'];
        equal('257898', '25-78/98', fixture);
        expect(component.form.value).toBe('25-7898');

        component.mask = '0000.00';
        component.dropSpecialCharacters = true;
        component.form.setValue(123456);
        equal('123456', '1234.56', fixture);
        expect(component.form.value).toBe(123456);
    });

    it('FormControl should be filled without special characters', () => {
        component.mask = 'separator.4';
        component.thousandSeparator = ',';
        component.dropSpecialCharacters = true;
        component.form.setValue(2578.9812);

        equal('2578.9812', '2,578.9812', fixture);
        expect(component.form.value).toBe(2578.9812);
    });

    it('FormControl should normally handle the removal of whitespace', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ' ';
        component.dropSpecialCharacters = true;
        component.form.setValue(1234567.89);

        // @todo add backspace event check

        equal('1234567.89', '1 234 567.89', fixture);
        expect(component.form.value).toBe(1234567.89);
    });

    it('dropSpecialCharacter test for valid', () => {
        component.mask = '(000) 000-0000';
        component.dropSpecialCharacters = true;
        component.validation = true;
        equal('1', '(1', fixture);
        expect(component.form.valid).toBe(false);
        equal('12', '(12', fixture);
        expect(component.form.valid).toBe(false);
        equal('123', '(123', fixture);
        expect(component.form.valid).toBe(false);
        equal('1234', '(123) 4', fixture);
        expect(component.form.valid).toBe(false);
        equal('12345', '(123) 45', fixture);
        expect(component.form.valid).toBe(false);
        equal('123456', '(123) 456', fixture);
        expect(component.form.valid).toBe(false);
        equal('1234567', '(123) 456-7', fixture);
        expect(component.form.valid).toBe(false);
        equal('12345678', '(123) 456-78', fixture);
        expect(component.form.valid).toBe(false);
        equal('123456789', '(123) 456-789', fixture);
        expect(component.form.valid).toBe(false);
        equal('1234567890', '(123) 456-7890', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('dropSpecialCharacter = false test for valid', () => {
        component.mask = '(000) 000-0000';
        component.dropSpecialCharacters = true;
        component.validation = true;
        equal('1', '(1', fixture);
        expect(component.form.valid).toBe(false);
        equal('12', '(12', fixture);
        expect(component.form.valid).toBe(false);
        equal('123', '(123', fixture);
        expect(component.form.valid).toBe(false);
        equal('1234', '(123) 4', fixture);
        expect(component.form.valid).toBe(false);
        equal('12345', '(123) 45', fixture);
        expect(component.form.valid).toBe(false);
        equal('123456', '(123) 456', fixture);
        expect(component.form.valid).toBe(false);
        equal('1234567', '(123) 456-7', fixture);
        expect(component.form.valid).toBe(false);
        equal('12345678', '(123) 456-78', fixture);
        expect(component.form.valid).toBe(false);
        equal('123456789', '(123) 456-789', fixture);
        expect(component.form.valid).toBe(false);
        equal('1234567890', '(123) 456-7890', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('dropSpecialCharacter = true test for valid with setValue', () => {
        component.mask = '(000) 000-0000';
        component.dropSpecialCharacters = true;
        component.validation = true;
        component.form.setValue('1234567890');
        equal('1234567890', '(123) 456-7890', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('dropSpecialCharacter = false test for valid with setValue', () => {
        component.mask = '(000) 000-0000';
        component.dropSpecialCharacters = false;
        component.validation = true;
        component.form.setValue('1234567890');
        equal('1234567890', '(123) 456-7890', fixture);
        expect(component.form.valid).toBe(true);
    });
});
