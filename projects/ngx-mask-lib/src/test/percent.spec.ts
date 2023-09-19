import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskModule } from '../lib/ngx-mask.module';

describe('Directive: Mask (Percent)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskModule.forRoot()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('percent for empty', () => {
        component.mask = 'percent';
        equal('', '', fixture);
    });

    it('percent for 100', () => {
        component.mask = 'percent';
        equal('100', '100', fixture);
    });

    it('percent for 99', () => {
        component.mask = 'percent';
        equal('99', '99', fixture);
    });

    it('percent for 123', () => {
        component.mask = 'percent';
        equal('123', '12', fixture);
    });

    it('percent for 99.99', () => {
        component.mask = 'percent';
        equal('99.99', '99.99', fixture);
    });

    it('percent for 99', () => {
        component.mask = 'percent.0';
        equal('99.99999', '99', fixture);
    });

    it('percent for 99.99', () => {
        component.mask = 'percent.2';
        equal('99.9999', '99.99', fixture);
    });

    it('percent for 1.123', () => {
        component.mask = 'percent.3';
        equal('1.12345', '1.123', fixture);
    });

    it('percent for 123.23', () => {
        component.mask = 'percent';
        equal('123.23', '12.23', fixture);
    });

    it('percent with suffix', () => {
        component.mask = 'percent';
        component.suffix = '%';
        equal('50', '50%', fixture);
        equal('123', '12%', fixture);
        equal('50.50', '50.50%', fixture);
    });

    it('percent for split zero percent.2', () => {
        component.mask = 'percent.2';
        equal('01.23', '1.23', fixture);
        equal('012.23', '12.23', fixture);
        equal('099.23', '99.23', fixture);
        equal('0999.23', '99.23', fixture);
        equal('034.023', '34.02', fixture);
    });

    it('percent for split zero percent', () => {
        component.mask = 'percent';
        equal('01.23', '1.23', fixture);
        equal('012.23', '12.23', fixture);
        equal('099.23', '99.23', fixture);
        equal('0999.23', '99.23', fixture);
        equal('034.023', '34.023', fixture);
    });

    it('percent for split zero percent.3', () => {
        component.mask = 'percent.3';
        equal('01.233', '1.233', fixture);
        equal('012.232', '12.232', fixture);
        equal('099.230', '99.230', fixture);
        equal('0999.000', '99.000', fixture);
        equal('034.023', '34.023', fixture);
    });

    it('percent for split zero percent.2 should be valid', () => {
        component.mask = 'percent.2';
        component.validation = true;
        fixture.detectChanges();

        equal('1', '1', fixture);
        expect(component.form.value).toBe('1');
        expect(component.form.valid).toBeTruthy();
    });

    it('percent for split zero percent.3 should be valid', () => {
        component.mask = 'percent.3';
        component.validation = true;
        fixture.detectChanges();

        equal('1', '1', fixture);
        expect(component.form.value).toBe('1');
        expect(component.form.valid).toBeTruthy();
    });

    it('percent for split zero percent should be valid', () => {
        component.mask = 'percent';
        component.validation = true;
        fixture.detectChanges();

        equal('1', '1', fixture);
        expect(component.form.value).toBe('1');
        expect(component.form.valid).toBeTruthy();
    });

    it('percent with decimalMarker = , percent.2 ', () => {
        component.mask = 'percent.2';
        component.decimalMarker = ',';

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('12,2', '12,2', fixture);
        equal('12,22', '12,22', fixture);
        expect(component.form.value).toBe('12.22');
    });

    it('percent with decimalMarker = , percent.3 ', () => {
        component.mask = 'percent.3';
        component.decimalMarker = ',';

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('12,2', '12,2', fixture);
        equal('12,22', '12,22', fixture);
        equal('12,222', '12,222', fixture);
        expect(component.form.value).toBe('12.222');
    });

    it('percent with decimalMarker = , percent.2 drop false ', () => {
        component.mask = 'percent.2';
        component.dropSpecialCharacters = false;
        component.decimalMarker = ',';

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('12,2', '12,2', fixture);
        equal('12,22', '12,22', fixture);
        expect(component.form.value).toBe('12,22');
    });

    it('percent with decimalMarker = , percent.3 drop false ', () => {
        component.mask = 'percent.3';
        component.dropSpecialCharacters = false;
        component.decimalMarker = ',';

        equal('2', '2', fixture);
        equal('22', '22', fixture);
        equal('12,2', '12,2', fixture);
        equal('12,221', '12,221', fixture);
        expect(component.form.value).toBe('12,221');
    });

    it('percent with decimalMarker = , percent.2 drop false with suffix ', () => {
        component.mask = 'percent.2';
        component.dropSpecialCharacters = false;
        component.decimalMarker = ',';
        component.suffix = '%';

        equal('1', '1%', fixture);
        equal('12', '12%', fixture);
        equal('12,2', '12,2%', fixture);
        equal('12,22', '12,22%', fixture);
        expect(component.form.value).toBe('12,22%');
    });

    it('percent with decimalMarker = , percent.3 drop false with suffix ', () => {
        component.mask = 'percent.3';
        component.dropSpecialCharacters = false;
        component.suffix = '%';
        component.decimalMarker = ',';

        equal('2', '2%', fixture);
        equal('22', '22%', fixture);
        equal('12,2', '12,2%', fixture);
        equal('12,221', '12,221%', fixture);
        expect(component.form.value).toBe('12,221%');
    });

    it('percent with decimalMarker = , percent.2with suffix ', () => {
        component.mask = 'percent.2';
        component.suffix = '%';
        component.decimalMarker = ',';

        equal('1', '1%', fixture);
        equal('12', '12%', fixture);
        equal('12,2', '12,2%', fixture);
        equal('12,22', '12,22%', fixture);
        expect(component.form.value).toBe('12.22');
    });

    it('percent with decimalMarker = , percent.3  with suffix ', () => {
        component.mask = 'percent.3';
        component.suffix = '%';
        component.decimalMarker = ',';

        equal('2', '2%', fixture);
        equal('22', '22%', fixture);
        equal('12,2', '12,2%', fixture);
        equal('12,221', '12,221%', fixture);
        expect(component.form.value).toBe('12.221');
    });
});
