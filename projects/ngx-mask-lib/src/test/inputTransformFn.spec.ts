import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';
import { provideNgxMask } from '../lib/ngx-mask.providers';

describe('Directive: Mask', () => {
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

    it('inputTransformFn should return value toUpperCase', () => {
        component.mask = 'S*';
        component.inputTransformFn = (value: unknown): string => String(value).toUpperCase();

        equal('a', 'A', fixture);
        equal('an', 'AN', fixture);
        equal('and', 'AND', fixture);
        equal('andr', 'ANDR', fixture);
        equal('andre', 'ANDRE', fixture);
        equal('andrey', 'ANDREY', fixture);
    });

    it('inputTransformFn should return value formValue toUpperCase', () => {
        component.mask = 'S*';
        component.outputTransformFn = (value: string | number | undefined | null): string =>
            String(value).toUpperCase();

        equal('a', 'a', fixture);
        equal('an', 'an', fixture);
        equal('and', 'and', fixture);
        equal('andr', 'andr', fixture);
        equal('andre', 'andre', fixture);
        equal('andrey', 'andrey', fixture);
        expect(component.form.value).toBe('ANDREY');
    });

    it('inputTransformFn should return value formValue toUpperCase but input value to lowerCase', () => {
        component.mask = 'S*';
        component.outputTransformFn = (value: string | number | undefined | null): string =>
            String(value).toUpperCase();
        component.inputTransformFn = (value: unknown): string => String(value).toLowerCase();

        equal('A', 'a', fixture);
        equal('AN', 'an', fixture);
        equal('AND', 'and', fixture);
        equal('ANDR', 'andr', fixture);
        equal('ANDRE', 'andre', fixture);
        equal('ANDREY', 'andrey', fixture);
        expect(component.form.value).toBe('ANDREY');
    });

    it('separator.2 should replace dot in model', () => {
        component.mask = 'separator.2';
        component.decimalMarker = '.';
        component.outputTransformFn = (value: string | number | undefined | null): string => {
            if (String(value).includes('.')) {
                return String(value).replace('.', ',');
            }
            return String(value);
        };

        equal('10.2', '10.2', fixture);
        expect(component.form.value).toBe('10,2');

        equal('109.2', '109.2', fixture);
        expect(component.form.value).toBe('109,2');

        equal('1000.2', '1 000.2', fixture);
        expect(component.form.value).toBe('1000,2');
    });

    it('separator.3 should toFixed value in model and return Number', () => {
        component.mask = 'separator.3';
        component.decimalMarker = '.';
        component.outputTransformFn = (value: string | number | undefined | null): number => {
            if (String(value).includes('.')) {
                const numberValue = parseFloat(String(value));
                const formattedValue = Number(numberValue.toFixed(2));
                return formattedValue;
            }
            return Number(value);
        };

        equal('237.356', '237.356', fixture);
        expect(component.form.value).toBe(237.36);

        equal('11.123', '11.123', fixture);
        expect(component.form.value).toBe(11.12);

        equal('1234.356', '1 234.356', fixture);
        expect(component.form.value).toBe(1234.36);
    });

    it('mask 000.00 should replace dot in model', () => {
        component.mask = '000.00';
        component.dropSpecialCharacters = false;
        component.outputTransformFn = (value: string | number | undefined | null): string => {
            if (String(value).includes('.')) {
                return String(value).replace('.', ',');
            }
            return String(value);
        };

        equal('100.22', '100.22', fixture);
        expect(component.form.value).toBe('100,22');

        equal('12', '12', fixture);
        expect(component.form.value).toBe('12');
    });

    it('mask separator.1 should return number', () => {
        component.mask = 'separator.1';
        component.decimalMarker = ',';
        component.outputTransformFn = (value: string | number | undefined | null): number =>
            Number(value);

        equal('123,2', '123,2', fixture);
        expect(component.form.value).toBe(123.2);

        equal('10,2', '10,2', fixture);
        expect(component.form.value).toBe(10.2);

        equal('1,1', '1,1', fixture);
        expect(component.form.value).toBe(1.1);

        equal('1000,2', '1 000,2', fixture);
        expect(component.form.value).toBe(1000.2);
    });

    it('mask separator.1 should return number decimalMarker dot', () => {
        component.mask = 'separator.1';
        component.decimalMarker = '.';
        component.outputTransformFn = (value: string | number | undefined | null): number =>
            Number(value);

        equal('123.4', '123.4', fixture);
        expect(component.form.value).toBe(123.4);

        equal('12.2', '12.2', fixture);
        expect(component.form.value).toBe(12.2);

        equal('1.1', '1.1', fixture);
        expect(component.form.value).toBe(1.1);

        equal('1000.2', '1 000.2', fixture);
        expect(component.form.value).toBe(1000.2);
    });

    it('mask percent should replace dot in model', () => {
        component.mask = 'percent.2';
        component.outputTransformFn = (value: string | number | undefined | null): string => {
            if (String(value).includes('.')) {
                return String(value).replace('.', ',');
            }
            return String(value);
        };
        equal('1.2', '1.2', fixture);
        expect(component.form.value).toBe('1,2');

        equal('12.2', '12.2', fixture);
        expect(component.form.value).toBe('12,2');

        equal('34.34', '34.34', fixture);
        expect(component.form.value).toBe('34,34');
    });

    it('mask percent should replace dot in model', () => {
        component.mask = 'Hh:m0';
        component.showMaskTyped = true;
        component.dropSpecialCharacters = false;
        component.leadZeroDateTime = true;
        component.outputTransformFn = (value: string | number | undefined | null) => {
            if (value) {
                const fetch = new Date();
                const values = String(value).split(':');
                if (values.length >= 2) {
                    const hour = Number(values[0]);
                    const minuts = Number(values[1]);
                    fetch.setHours(hour);
                    fetch.setMinutes(minuts);
                }
                fetch.setSeconds(0);
                return fetch.toString();
            }
            return;
        };
        const date = new Date();
        component.inputTransformFn = (value: unknown): string => {
            if (typeof value !== 'object') {
                return String(value);
            }
            return `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(
                2,
                '0'
            )}`;
        };
        component.form.setValue(new Date().toString());
        expect(component.form.value).toBe(date.toString());
    });
});
