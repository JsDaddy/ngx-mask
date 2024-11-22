import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask (Allow negative numbers)', () => {
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

    it('FormControl or NgModel should not allow negative numbers (default functionality)', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        component.allowNegativeNumbers = false;
        component.dropSpecialCharacters = true;
        equal('-10,000.00', '10,000.00', fixture);

        expect(component.form.value).toBe('10000.00');

        component.form.setValue(-123456);
        equal('-123456.00', '123,456.00', fixture);
        expect(component.form.value).toBe(123456);
    });

    it('FormControl and NgModel should be filled with negative values', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        component.allowNegativeNumbers = true;
        component.dropSpecialCharacters = true;
        component.form.setValue(-123456);

        equal('-123456.00', '-123,456.00', fixture);
        expect(component.form.value).toBe(-123456);
    });

    it('allowNegativeNumber to mask', () => {
        component.mask = '000.00';
        component.allowNegativeNumbers = true;

        equal('-123.00', '-123.00', fixture);
        equal('-311.9', '-311.9', fixture);
        equal('-311', '-311', fixture);
        equal('123.00', '123.00', fixture);

        component.mask = '0000';
        component.allowNegativeNumbers = true;

        equal('-1230', '-1230', fixture);
        equal('-3119', '-3119', fixture);
        equal('-311', '-311', fixture);
        equal('-31', '-31', fixture);
        equal('-3', '-3', fixture);
        equal('1230', '1230', fixture);
    });

    it('allowNegativeNumber to percent', () => {
        component.mask = 'percent';
        component.allowNegativeNumbers = true;

        equal('-101', '-10', fixture);
        equal('-100', '-100', fixture);
        equal('-999', '-99', fixture);
        equal('-20', '-20', fixture);

        component.mask = 'percent.2';
        component.allowNegativeNumbers = true;

        equal('-100.00', '-100.00', fixture);
        equal('-100.02', '-100.0', fixture);
        equal('-999', '-99', fixture);
        equal('-99.10', '-99.10', fixture);
        equal('-11.11', '-11.11', fixture);
        equal('-12.30', '-12.30', fixture);

        component.mask = 'percent.3';
        component.allowNegativeNumbers = true;

        equal('-100.000', '-100.000', fixture);
        equal('-99.001', '-99.001', fixture);
        equal('-999', '-99', fixture);
        equal('-99.10', '-99.10', fixture);
        equal('-11.11', '-11.11', fixture);
        equal('-12.30', '-12.30', fixture);
    });

    it('allowNegativeNumber to separator', () => {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;

        equal('-101', '-101', fixture);
        equal('-100', '-100', fixture);
        equal('-999', '-999', fixture);
        equal('-3000', '-3 000', fixture);

        component.mask = 'separator.2';
        component.allowNegativeNumbers = true;

        equal('-100.00', '-100.00', fixture);
        equal('-100.02', '-100.02', fixture);
        equal('-999', '-999', fixture);
        equal('-44.10', '-44.10', fixture);
        equal('-91.11', '-91.11', fixture);
        equal('-1112.30', '-1 112.30', fixture);

        component.mask = 'separator.3';
        component.allowNegativeNumbers = true;

        equal('-100.000', '-100.000', fixture);
        equal('-99.001', '-99.001', fixture);
        equal('-999', '-999', fixture);
        equal('-99.100', '-99.100', fixture);
        equal('-11.110', '-11.110', fixture);
        equal('-12.301', '-12.301', fixture);
    });
});
