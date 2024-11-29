import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

describe('Directive: Mask (Repeat)', () => {
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

    it('repeat mask', () => {
        component.mask.set('0{4}');
        equal('1234', '1234', fixture);
    });

    it('should work when repeat value is more then 9', () => {
        component.mask.set('A{12}');
        equal('123456789ABC', '123456789ABC', fixture);
    });

    it('should correctly handle leading zeros', () => {
        component.mask.set('A{02}');
        equal('1234', '12', fixture);

        component.mask.set('A{0000012}');
        equal('123456789ABCDE', '123456789ABC', fixture);
    });

    it('should repeat digits only', () => {
        component.mask.set('0{6}');
        equal('AbC12345678Bfc', '123456', fixture);
    });

    it('should repeat digits and letters', () => {
        component.mask.set('A{6}');
        equal('AbC12345678Bfc', 'AbC123', fixture);
    });

    it('should repeat only letters', () => {
        component.mask.set('S{6}');
        equal('AbC12345678Bfc', 'AbCBfc', fixture);
    });

    it('repeat mask date', () => {
        component.mask.set('0{2}/0{2}/0{4}');
        equal('12345678', '12/34/5678', fixture);
    });

    // it('specialCharacters quotes', () => {
    //     component.mask = '\'00\'00\'0000\'';
    //     equal('12345678', '\'12\'34\'5678\'', fixture);
    // });

    it('specialCharacters quotes', () => {
        component.mask.set('0-0-0*-0*-0*');
        equal('123', '1-2-3', fixture);
        equal('123-42-', '1-2-3-42-', fixture);
    });

    it('should repeat digits only and work with dynamicMask', () => {
        component.mask.set('0{4}||0{6}');
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12345', '12345', fixture);
        equal('123456', '123456', fixture);
    });

    it('should repeat digits only and work with dynamicMask', () => {
        component.mask.set('SS0{4}');
        equal('d', 'd', fixture);
        equal('dd', 'dd', fixture);
        equal('dd1', 'dd1', fixture);
        equal('aa22', 'aa22', fixture);
        equal('aa222', 'aa222', fixture);
        equal('dd2134', 'dd2134', fixture);
    });

    it('should repeat digits only and work with dynamicMask', () => {
        component.mask.set('A{5}.S{2}');
        equal('d', 'd', fixture);
        equal('dd', 'dd', fixture);
        equal('dd1', 'dd1', fixture);
        equal('aa22', 'aa22', fixture);
        equal('aa222', 'aa222', fixture);
        equal('dd213D', 'dd213.D', fixture);
        equal('dd213DW', 'dd213.DW', fixture);
    });

    it('should A{8} be valid if length 8', () => {
        component.mask.set('A{8}');
        equal('1', '1', fixture);
        expect(component.form.valid).toBe(false);
        equal('12', '12', fixture);
        expect(component.form.valid).toBe(false);

        equal('123', '123', fixture);
        expect(component.form.valid).toBe(false);

        equal('1234', '1234', fixture);
        expect(component.form.valid).toBe(false);

        equal('12345', '12345', fixture);
        expect(component.form.valid).toBe(false);

        equal('123456', '123456', fixture);
        expect(component.form.valid).toBe(false);

        equal('1234567', '1234567', fixture);
        expect(component.form.valid).toBe(false);

        equal('12345678', '12345678', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('should A{9} be valid if length 9', () => {
        component.mask.set('A{9}');
        equal('1', '1', fixture);
        expect(component.form.valid).toBe(false);
        equal('12', '12', fixture);
        expect(component.form.valid).toBe(false);

        equal('123', '123', fixture);
        expect(component.form.valid).toBe(false);

        equal('1234', '1234', fixture);
        expect(component.form.valid).toBe(false);

        equal('12345', '12345', fixture);
        expect(component.form.valid).toBe(false);

        equal('123456', '123456', fixture);
        expect(component.form.valid).toBe(false);

        equal('1234567', '1234567', fixture);
        expect(component.form.valid).toBe(false);

        equal('12345678', '12345678', fixture);
        expect(component.form.valid).toBe(false);

        equal('123456789', '123456789', fixture);
        expect(component.form.valid).toBe(true);
    });

    it('should A{10} be valid if length 10', () => {
        component.mask.set('A{10}');
        equal('1', '1', fixture);
        expect(component.form.valid).toBe(false);
        equal('12', '12', fixture);
        expect(component.form.valid).toBe(false);

        equal('123', '123', fixture);
        expect(component.form.valid).toBe(false);

        equal('1234', '1234', fixture);
        expect(component.form.valid).toBe(false);

        equal('12345', '12345', fixture);
        expect(component.form.valid).toBe(false);

        equal('123456', '123456', fixture);
        expect(component.form.valid).toBe(false);

        equal('1234567', '1234567', fixture);
        expect(component.form.valid).toBe(false);

        equal('12345678', '12345678', fixture);
        expect(component.form.valid).toBe(false);

        equal('123456789', '123456789', fixture);
        expect(component.form.valid).toBe(false);

        equal('1234567890', '1234567890', fixture);
        expect(component.form.valid).toBe(true);
    });
});
