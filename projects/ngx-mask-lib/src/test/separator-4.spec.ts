import type { ComponentFixture } from '@angular/core/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal, typeTest } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

describe('Separator: Mask', () => {
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

    it('cursor should move forward if the input starts with -, or 0, or 0.0, or 0.00, or 0.0000000', () => {
        component.mask.set('separator.8');
        component.specialCharacters.set([',', '.']);
        component.allowNegativeNumbers.set(true);
        component.form.setValue(0.723);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '0';
        inputTarget.selectionStart = 1;
        inputTarget.selectionEnd = 1;
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('0');
        expect(inputTarget.selectionStart).toEqual(1);

        inputTarget.value = '-';
        inputTarget.selectionStart = 1;
        inputTarget.selectionEnd = 1;
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('-');
        expect(inputTarget.selectionStart).toEqual(1);

        inputTarget.value = '0.0';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('0.0');
        expect(inputTarget.selectionStart).toEqual(3);
    });

    it('Should work right when reset decimalMarker', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        equal('1000000,00', '1 000 000,00', fixture);
    });

    it('separator precision 2 with thousandSeparator (.) decimalMarker (,) for 12345.67', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        equal('12.345,67', '12.345,67', fixture);
    });

    it('separator precision 2 with thousandSeparator (.) decimalMarker (,) for 12345.67', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        equal('12345,67', '12.345,67', fixture);
    });

    it('check formControl value to be number when decimalMarker is comma', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(' ');
        component.decimalMarker.set(',');

        typeTest('12 345,67', fixture);
        expect(component.form.value).toBe('12345.67');
    });

    it('check formControl value to be number when decimalMarker is array', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(' ');
        component.decimalMarker.set(['.', ',']);

        typeTest('12 345,67', fixture);
        expect(component.form.value).toBe('12345.67');

        typeTest('123 456.78', fixture);
        expect(component.form.value).toBe('123456.78');
    });

    it('right handle character after first 0 value', () => {
        component.mask.set('separator');
        component.decimalMarker.set(',');
        equal('0', '0', fixture);
        equal('0,', '0,', fixture);
        equal('0 ', '0', fixture);
        equal('01', '0,1', fixture);
        equal('0s', '0', fixture);
        equal('0@', '0', fixture);
        // TODO(inepipenko): strange thet return 0.
        // equal('0.', '0', fixture);
        component.decimalMarker.set('.');
        equal('0', '0', fixture);
        equal('0.', '0.', fixture);
        equal('0 ', '0', fixture);
        equal('01', '0.1', fixture);
        equal('0s', '0', fixture);
        equal('0@', '0', fixture);
        equal('0,', '0.', fixture);
        component.decimalMarker.set(['.', ',']);
        equal('0', '0', fixture);
        equal('0.', '0.', fixture);
        equal('0,', '0.', fixture);
        equal('0 ', '0', fixture);
        equal('01', '0.1', fixture);
        equal('0s', '0', fixture);
        equal('0@', '0', fixture);
    });

    it('should add trailing zero when separator.1 and leadZero = true', fakeAsync(() => {
        component.mask.set('separator.1');
        component.leadZero.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(0);
        tick();
        expect(inputTarget.value).toBe('0.0');

        component.form.setValue(1);
        tick();
        expect(inputTarget.value).toBe('1.0');

        component.form.setValue(88);
        tick();
        expect(inputTarget.value).toBe('88.0');

        component.form.setValue(99);
        tick();
        expect(inputTarget.value).toBe('99.0');
    }));

    it('should not modify value with one decimal when separator.1 and leadZero = true', fakeAsync(() => {
        component.mask.set('separator.1');
        component.leadZero.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(0.0);
        tick();
        expect(inputTarget.value).toBe('0.0');

        component.form.setValue(1.0);
        tick();
        expect(inputTarget.value).toBe('1.0');

        component.form.setValue(88.0);
        tick();
        expect(inputTarget.value).toBe('88.0');

        component.form.setValue(99.9);
        tick();
        expect(inputTarget.value).toBe('99.9');
    }));

    it('should display zeros at the end separator2', fakeAsync(() => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1);
        tick();
        expect(inputTarget.value).toBe('1.00');

        component.form.setValue(10);
        tick();
        expect(inputTarget.value).toBe('10.00');

        component.form.setValue(100);
        tick();
        expect(inputTarget.value).toBe('100.00');

        component.form.setValue(1000);
        tick();
        expect(inputTarget.value).toBe('1 000.00');

        component.form.setValue(1000.1);
        tick();
        expect(inputTarget.value).toBe('1 000.10');

        component.form.setValue(1000.11);
        tick();
        expect(inputTarget.value).toBe('1 000.11');

        component.form.setValue(11000.11);
        tick();
        expect(inputTarget.value).toBe('11 000.11');

        equal('0', '0', fixture, true);
        tick();
        expect(component.form.value).toBe('0.00');

        equal('1', '1', fixture, true);
        tick();
        expect(component.form.value).toBe('1.00');

        equal('10', '10', fixture, true);
        tick();
        expect(component.form.value).toBe('10.00');

        equal('10', '10', fixture, true);
        tick();
        expect(component.form.value).toBe('10.00');

        equal('120', '120', fixture, true);
        tick();
        expect(component.form.value).toBe('120.00');

        equal('1220', '1 220', fixture, true);
        tick();
        expect(component.form.value).toBe('1220.00');

        equal('12340', '12 340', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.00');

        equal('12340.1', '12 340.1', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.10');

        equal('12340.12', '12 340.12', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.12');
    }));

    it('should display zeros at the end separator2', fakeAsync(() => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        component.thousandSeparator.set(',');
        component.decimalMarker.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1000);
        tick();
        expect(inputTarget.value).toBe('1,000.00');

        component.form.setValue(100);
        tick();
        expect(inputTarget.value).toBe('100.00');

        component.form.setValue(10000);
        tick();
        expect(inputTarget.value).toBe('10,000.00');

        component.form.setValue(120000);
        tick();
        expect(inputTarget.value).toBe('120,000.00');

        component.form.setValue(10);
        tick();
        expect(inputTarget.value).toBe('10.00');

        equal('12340.12', '12,340.12', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.12');

        equal('12340', '12,340', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.00');

        equal('1234.1', '1,234.1', fixture, true);
        tick();
        expect(component.form.value).toBe('1234.10');

        equal('122340.1', '122,340.1', fixture, true);
        tick();
        expect(component.form.value).toBe('122340.10');
    }));

    it('should display zeros at the end separator3', fakeAsync(() => {
        component.mask.set('separator.3');
        component.leadZero.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(2);
        tick();
        expect(inputTarget.value).toBe('2.000');

        component.form.setValue(20);
        tick();
        expect(inputTarget.value).toBe('20.000');

        component.form.setValue(200);
        tick();
        expect(inputTarget.value).toBe('200.000');

        component.form.setValue(2000);
        tick();
        expect(inputTarget.value).toBe('2 000.000');

        component.form.setValue(2000.1);
        tick();
        expect(inputTarget.value).toBe('2 000.100');

        component.form.setValue(2000.11);
        tick();
        expect(inputTarget.value).toBe('2 000.110');

        component.form.setValue(2000.112);
        tick();
        expect(inputTarget.value).toBe('2 000.112');

        component.form.setValue(22000.11);
        tick();
        expect(inputTarget.value).toBe('22 000.110');

        equal('1', '1', fixture, true);
        tick();
        expect(component.form.value).toBe('1.000');

        equal('30', '30', fixture, true);
        tick();
        expect(component.form.value).toBe('30.000');

        equal('300', '300', fixture, true);
        tick();
        expect(component.form.value).toBe('300.000');

        equal('1234', '1 234', fixture, true);
        tick();
        expect(component.form.value).toBe('1234.000');

        equal('12345', '12 345', fixture, true);
        tick();
        expect(component.form.value).toBe('12345.000');

        equal('12340.1', '12 340.1', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.100');

        equal('12340.12', '12 340.12', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.120');
    }));

    it('should display zeros at the end separator3', fakeAsync(() => {
        component.mask.set('separator.3');
        component.leadZero.set(true);
        component.thousandSeparator.set(',');
        component.decimalMarker.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1000);
        tick();
        expect(inputTarget.value).toBe('1,000.000');

        component.form.setValue(100);
        tick();
        expect(inputTarget.value).toBe('100.000');

        component.form.setValue(10000);
        tick();
        expect(inputTarget.value).toBe('10,000.000');

        component.form.setValue(120000);
        tick();
        expect(inputTarget.value).toBe('120,000.000');

        component.form.setValue(10);
        tick();
        expect(inputTarget.value).toBe('10.000');

        equal('12340.12', '12,340.12', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.120');

        equal('12340', '12,340', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.000');

        equal('1234.1', '1,234.1', fixture, true);
        tick();
        expect(component.form.value).toBe('1234.100');

        equal('122340.1', '122,340.1', fixture, true);
        tick();
        expect(component.form.value).toBe('122340.100');
    }));

    it('should display zeros at the end separator2', fakeAsync(() => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1000);
        tick();
        expect(inputTarget.value).toBe('1.000,00');

        component.form.setValue(100);
        tick();
        expect(inputTarget.value).toBe('100,00');

        component.form.setValue(10000);
        tick();
        expect(inputTarget.value).toBe('10.000,00');

        component.form.setValue(120000);
        tick();
        expect(inputTarget.value).toBe('120.000,00');

        component.form.setValue(10);
        tick();
        expect(inputTarget.value).toBe('10,00');

        equal('12340,12', '12.340,12', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.12');

        equal('12340', '12.340', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.00');

        equal('1234,1', '1.234,1', fixture, true);
        tick();
        expect(component.form.value).toBe('1234.10');

        equal('122340,1', '122.340,1', fixture, true);
        tick();
        expect(component.form.value).toBe('122340.10');
    }));

    it('should display zeros at the end separator3', fakeAsync(() => {
        component.mask.set('separator.3');
        component.leadZero.set(true);
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1000);
        tick();
        expect(inputTarget.value).toBe('1.000,000');

        component.form.setValue(100);
        tick();
        expect(inputTarget.value).toBe('100,000');

        component.form.setValue(10000);
        tick();
        expect(inputTarget.value).toBe('10.000,000');

        component.form.setValue(120000);
        tick();
        expect(inputTarget.value).toBe('120.000,000');

        component.form.setValue(10);
        tick();
        expect(inputTarget.value).toBe('10,000');

        equal('12340,12', '12.340,12', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.120');

        equal('12340', '12.340', fixture, true);
        tick();
        expect(component.form.value).toBe('12340.000');

        equal('1234,1', '1.234,1', fixture, true);
        tick();
        expect(component.form.value).toBe('1234.100');

        equal('122340,1', '122.340,1', fixture, true);
        tick();
        expect(component.form.value).toBe('122340.100');
    }));

    it('should display only 9 separator.2', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        component.decimalMarker.set('.');

        equal('999999999999999', '999,999,999,999,999', fixture);
        expect(component.form.value).toBe('999999999999999');

        equal('999999999999999.9', '999,999,999,999,999.9', fixture);
        expect(component.form.value).toBe('999999999999999.9');

        equal('999999999999999.99', '999,999,999,999,999.99', fixture);
        expect(component.form.value).toBe('999999999999999.99');
    });

    it('should display only 9 separator.3', () => {
        component.mask.set('separator.3');
        component.thousandSeparator.set(',');
        component.decimalMarker.set('.');

        equal('999999999999999', '999,999,999,999,999', fixture);
        expect(component.form.value).toBe('999999999999999');

        equal('999999999999999.9', '999,999,999,999,999.9', fixture);
        expect(component.form.value).toBe('999999999999999.9');

        equal('999999999999999.99', '999,999,999,999,999.99', fixture);
        expect(component.form.value).toBe('999999999999999.99');

        equal('999999999999999.999', '999,999,999,999,999.999', fixture);
        expect(component.form.value).toBe('999999999999999.999');
    });
});
