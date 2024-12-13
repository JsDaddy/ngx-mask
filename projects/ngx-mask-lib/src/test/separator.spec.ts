import type { ComponentFixture } from '@angular/core/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal, Paste, typeTest } from './utils/test-functions.component';
import { initialConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';

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

    it('separator for empty', () => {
        component.mask.set('separator');
        equal('', '', fixture);
    });

    it('separator for 100', () => {
        component.mask.set('separator');
        equal('100', '100', fixture);
    });

    it('separator for -100', () => {
        component.mask.set('separator');
        component.allowNegativeNumbers.set(true);
        equal('-100', '-100', fixture);
    });

    it('separator for 1000', () => {
        component.mask.set('separator');
        equal('1000', '1 000', fixture);
    });

    it('separator for -1000', () => {
        component.mask.set('separator');
        component.allowNegativeNumbers.set(true);
        equal('-1000', '-1 000', fixture);
    });

    it('separator for 10000', () => {
        component.mask.set('separator');
        equal('10000', '10 000', fixture);
    });

    it('separator for -10000', () => {
        component.mask.set('separator');
        component.allowNegativeNumbers.set(true);
        equal('-10000', '-10 000', fixture);
    });

    it('separator for -100000', () => {
        component.mask.set('separator');
        component.allowNegativeNumbers.set(true);
        equal('-100000', '-100 000', fixture);
    });

    it('separator for 100000', () => {
        component.mask.set('separator');
        equal('100000', '100 000', fixture);
    });

    it('separator for 1000000', () => {
        component.mask.set('separator');
        equal('1000000', '1 000 000', fixture);
    });

    it('separator for -1000000', () => {
        component.mask.set('separator');
        component.allowNegativeNumbers.set(true);
        equal('-1000000', '-1 000 000', fixture);
    });

    it('should limit separator to 1000', () => {
        component.mask.set('separator');
        component.separatorLimit.set('1000');
        equal('1000000', '1 000', fixture);
    });

    it('separator precision 2 for 1000000.00', () => {
        component.mask.set('separator.2');
        equal('1000000.00', '1 000 000.00', fixture);
    });

    it('separator precision 2 for -1000000.00', () => {
        component.mask.set('separator.2');
        component.allowNegativeNumbers.set(true);
        equal('-1000000.00', '-1 000 000.00', fixture);
    });

    it('should limit separator with precision 2 to 10000', () => {
        component.mask.set('separator.2');
        component.separatorLimit.set('10000');
        equal('1000000.00', '10 000.00', fixture);
    });
    it('should limit separator with precision 2 to 10 000', () => {
        component.mask.set('separator.2');
        component.separatorLimit.set('10 000');
        equal('1000000.00', '10 000.00', fixture);
    });

    it('separator precision 0 for 1000000.00', () => {
        component.mask.set('separator.0');
        equal('1000000.00', '1 000 000', fixture, false, Paste);
    });

    it('separator precision 2 with 0 after point for 1000000.00', () => {
        component.mask.set('separator.2');
        equal('1000000.20', '1 000 000.20', fixture);
    });

    it('separator.2 with suffix', () => {
        component.mask.set('separator.2');
        component.suffix.set('₽');
        equal('50', '50₽', fixture);
        equal('123 4', '1 234₽', fixture);
        equal('50.50', '50.50₽', fixture);
    });

    it('separator for letters', () => {
        component.mask.set('separator');
        equal('a', '', fixture);
        equal('1a', '1', fixture);
        equal('1000a', '1 000', fixture);
        equal('1000/', '1 000', fixture);
    });

    it('separator thousandSeparator . for 1000000', () => {
        component.mask.set('separator');
        component.thousandSeparator.set('.');
        equal('1000000', '1.000.000', fixture);
    });

    it('should not add any sperator if thousandSeparator set as empty string', () => {
        component.mask.set('separator');
        component.thousandSeparator.set('');
        equal('1000000', '1000000', fixture);
    });

    it('should not accept more than one minus signal at the beginning of input for separator thousandSeparator . for --1000', () => {
        component.mask.set('separator');
        component.thousandSeparator.set('.');
        component.allowNegativeNumbers.set(true);
        equal('--1000', '-1.000', fixture);
    });

    it('should not accept more than one minus signal for separator thousandSeparator . for -100-0000', () => {
        component.mask.set('separator');
        component.thousandSeparator.set('.');
        component.allowNegativeNumbers.set(true);
        equal('-100-0000', '-1.000.000', fixture);
    });

    it('should limit separator thousandSeparator . to 100000', () => {
        component.mask.set('separator');
        component.thousandSeparator.set('.');
        component.separatorLimit.set('100000');
        equal('1000000', '100.000', fixture);
    });

    it('should limit separator thousandSeparator . to -100000', () => {
        component.mask.set('separator');
        component.thousandSeparator.set('.');
        component.separatorLimit.set('100000');
        component.allowNegativeNumbers.set(true);
        equal('-1000000', '-100.000', fixture);
    });

    it('separator thousandSeparator . precision 2 for 1000000.00', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        equal('1000000,00', '1.000.000,00', fixture);
    });

    it('separator thousandSeparator . precision 2 for -1000000.00', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.allowNegativeNumbers.set(true);
        equal('-1000000,00', '-1.000.000,00', fixture);
    });

    it('separator thousandSeparator . precision 2 with 0 after point for 1000000.00', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        equal('1000000,20', '1.000.000,20', fixture);
    });

    it('separator thousandSeparator . precision 0 for 1000000.00', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set('.');
        equal('1000000,00', '1.000.000', fixture, false, Paste);
    });

    it('separator thousandSeparator , for 1000000', () => {
        component.mask.set('separator');
        component.thousandSeparator.set(',');
        equal('1000000', '1,000,000', fixture);
    });

    it('separator thousandSeparator , precision 2 for 1000000.00', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        equal('1000000.00', '1,000,000.00', fixture);
    });

    it('separator thousandSeparator , precision 2 with 0 after point for 1000000.00', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        equal('1000000.20', '1,000,000.20', fixture);
    });

    it('separator thousandSeparator , precision 0 for 1000000.00', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set(',');
        equal('1000000.00', '1,000,000', fixture, false, Paste);
    });

    it(`separator thousandSeparator ' for 1000000`, () => {
        component.mask.set('separator');
        component.thousandSeparator.set(`'`);
        equal('1000000', `1'000'000`, fixture);
    });

    it(`separator thousandSeparator ' precision 2 for 1000000.00`, () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(`'`);
        equal('1000000.00', `1'000'000.00`, fixture);
    });

    it(`separator thousandSeparator ' precision 2 with 0 after point for 1000000.00`, () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(`'`);
        equal('1000000.20', `1'000'000.20`, fixture);
    });

    it(`separator thousandSeparator ' precision 0 for 1000000.00`, () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set(`'`);
        equal('1000000.00', `1'000'000`, fixture, false, Paste);
    });

    it('should not shift cursor for input in-between digits', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1,5000,000';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('15,000,000');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for input in-between digits', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1.5000.000';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('15.000.000');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for input in-between digits', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1,5000,000.00';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('15,000,000.00');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for input in-between digits', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1.5000.000,00';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('15.000.000,00');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for input in-between digits', () => {
        component.mask.set('separator');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1,5000,000.000';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('15,000,000.000');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for input in-between digits', () => {
        component.mask.set('separator');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1.5000.000,000';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('15.000.000,000');
        expect(inputTarget.selectionStart).toEqual(3);
    });

    it('should not shift cursor for backspace on in-between digits', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1,234,67';
        inputTarget.selectionStart = 6;
        inputTarget.selectionEnd = 6;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('123,467');
        expect(inputTarget.selectionStart).toEqual(4);
    });
    it('should not shift cursor for backspace on in-between digits', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1.234.67';
        inputTarget.selectionStart = 6;
        inputTarget.selectionEnd = 6;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('123.467');
        expect(inputTarget.selectionStart).toEqual(4);
    });

    it('should not shift cursor for backspace on in-between digits', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1,234,67.00';
        inputTarget.selectionStart = 8;
        inputTarget.selectionEnd = 8;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('123,467.00');
        expect(inputTarget.selectionStart).toEqual(7);
    });
    it('should not shift cursor for backspace on in-between digits', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1.234.67,00';
        inputTarget.selectionStart = 8;
        inputTarget.selectionEnd = 8;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('123.467,00');
        expect(inputTarget.selectionStart).toEqual(7);
    });

    it('should not shift cursor on backspace when result has no separator', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1,34';
        inputTarget.selectionStart = 2;
        inputTarget.selectionEnd = 2;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('134');
        expect(inputTarget.selectionStart).toEqual(0);
    });

    it('caret should remain in position when deleting the first digit', () => {
        component.mask.set('separator');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1,000';
        inputTarget.selectionStart = 0;
        inputTarget.selectionEnd = 0;

        debugElement.triggerEventHandler('input', { target: inputTarget });
        debugElement.triggerEventHandler('keydown', {
            code: 'Delete',
            keyCode: 46,
            target: inputTarget,
        });

        expect(inputTarget.selectionStart).toEqual(0);
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

    it('should keep the cursor position after deleting a character', () => {
        component.mask.set('separator.2');
        const inputElement = fixture.nativeElement.querySelector('input');
        inputElement.value = '123 456';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(4, 4);

        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
        fixture.detectChanges();

        expect(inputElement.selectionStart).toBe(4);
        expect(inputElement.value).toBe('123 456');
    });

    it('should change formValue separator.2', fakeAsync(() => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue('10.2');
        tick();
        expect(inputTarget.value).toBe('10.20');
        requestAnimationFrame(() => {
            expect(component.form.value).toBe('10.20');
        });
    }));

    it('should change formValue separator.3', fakeAsync(() => {
        component.mask.set('separator.3');
        component.leadZero.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue('10.2');
        tick();
        expect(inputTarget.value).toBe('10.200');
        requestAnimationFrame(() => {
            expect(component.form.value).toBe('10.200');
        });
    }));

    it('separator.8 should return number value', fakeAsync(() => {
        component.mask.set('separator.8');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');

        equal('12,34', '12,34', fixture);
        tick();
        requestAnimationFrame(() => {
            expect(component.form.value).toBe(12.34);
        });
    }));

    it('should display value in input with decimalMarker , and leadZero with separator.2', fakeAsync(() => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        component.decimalMarker.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(0.4);
        tick();
        expect(inputTarget.value).toBe('0,40');

        component.form.setValue(10.4);
        tick();
        expect(inputTarget.value).toBe('10,40');

        component.form.setValue(100.4);
        tick();
        expect(inputTarget.value).toBe('100,40');

        component.form.setValue(1000.4);
        tick();
        expect(inputTarget.value).toBe('1 000,40');
    }));

    it('should display value in input with decimalMarker , and leadZero with separator.3', fakeAsync(() => {
        component.mask.set('separator.3');
        component.leadZero.set(true);
        component.decimalMarker.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(0.4);
        tick();
        expect(inputTarget.value).toBe('0,400');

        component.form.setValue(20.4);
        tick();
        expect(inputTarget.value).toBe('20,400');

        component.form.setValue(200.4);
        tick();
        expect(inputTarget.value).toBe('200,400');

        component.form.setValue(2000.4);
        tick();
        expect(inputTarget.value).toBe('2 000,400');
    }));

    it('should display value in input with decimalMarker , and leadZero with separator.3', fakeAsync(() => {
        component.mask.set('separator.3');
        component.leadZero.set(true);
        component.decimalMarker.set(',');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(0.3);
        tick();
        expect(inputTarget.value).toBe('0,300');

        component.form.setValue(30.4);
        tick();
        expect(inputTarget.value).toBe('30,400');

        component.form.setValue(300.4);
        tick();
        expect(inputTarget.value).toBe('300,400');

        component.form.setValue(3000.4);
        tick();
        expect(inputTarget.value).toBe('3.000,400');
    }));

    it('should display value in input with decimalMarker , and leadZero with separator.2', fakeAsync(() => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        component.decimalMarker.set(',');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(0.3);
        tick();
        expect(inputTarget.value).toBe('0,30');

        component.form.setValue(30.4);
        tick();
        expect(inputTarget.value).toBe('30,40');

        component.form.setValue(300.4);
        tick();
        expect(inputTarget.value).toBe('300,40');

        component.form.setValue(3000.4);
        tick();
        expect(inputTarget.value).toBe('3.000,40');
    }));

    it('should not allow add two zeros to inputValue', () => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        component.decimalMarker.set(',');
        component.thousandSeparator.set('.');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-00', '-0,0', fixture);
    });

    it('should not allow add two zeros to inputValue', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        component.thousandSeparator.set(',');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-00', '-0.0', fixture);
    });

    it('should not allow add two zeros to inputValue', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        component.thousandSeparator.set('.');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-00', '-0,0', fixture);
    });

    it('should not allow add two zeros to inputValue', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        component.thousandSeparator.set(' ');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-00', '-0,0', fixture);
    });

    it('should allow minus after change it to true', () => {
        component.mask.set('separator.2');
        component.allowNegativeNumbers.set(false);
        fixture.detectChanges();

        equal('-1234', '1 234', fixture);
        component.allowNegativeNumbers.set(true);
        equal('-1234', '-1 234', fixture);
    });

    it('should change value in formControl mask separator.2', () => {
        component.mask.set('separator.2');
        component.allowNegativeNumbers.set(true);
        component.specialCharacters.set([...initialConfig.specialCharacters]);
        fixture.detectChanges();

        equal('-1234.10', '-1 234.10', fixture);
        expect(component.form.value).toBe('-1234.10');
    });

    it('should change value in formControl mask separator.3', () => {
        component.mask.set('separator.3');
        component.allowNegativeNumbers.set(true);
        component.specialCharacters.set([...initialConfig.specialCharacters]);
        fixture.detectChanges();

        equal('-1234.567', '-1 234.567', fixture);
        expect(component.form.value).toBe('-1234.567');
    });

    it('should change value in formControl mask separator.1', () => {
        component.mask.set('separator.1');
        component.allowNegativeNumbers.set(true);
        component.specialCharacters.set([...initialConfig.specialCharacters]);
        fixture.detectChanges();

        equal('-1234.9', '-1 234.9', fixture);
        expect(component.form.value).toBe('-1234.9');
    });

    it('should change value in formControl mask separator.0', () => {
        component.mask.set('separator.0');
        component.allowNegativeNumbers.set(true);
        component.specialCharacters.set([...initialConfig.specialCharacters]);
        fixture.detectChanges();

        equal('-1234', '-1 234', fixture);
        expect(component.form.value).toBe('-1234');
    });

    it('should change value if user star from zero separator.0', () => {
        component.mask.set('separator.0');
        fixture.detectChanges();

        equal('03', '3', fixture);
        equal('034', '34', fixture);
    });

    it('should change value if user star from zero separator.1', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set('.');
        fixture.detectChanges();

        equal('03', '0.3', fixture);
        equal('034', '0.3', fixture);
        equal('.3', '0.3', fixture);
        equal('.34', '0.3', fixture);
    });

    it('should change value if user star from zero separator.1', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set(',');
        fixture.detectChanges();

        equal('03', '0,3', fixture);
        equal('034', '0,3', fixture);
        equal(',3', '0,3', fixture);
        equal(',34', '0,3', fixture);
    });

    it('should change value if user star from zero separator.2', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        fixture.detectChanges();

        equal('03', '0.3', fixture);
        equal('034', '0.34', fixture);
        equal('.3', '0.3', fixture);
        equal('.34', '0.34', fixture);
    });

    it('should change value if user star from zero separator.2', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        fixture.detectChanges();

        equal('03', '0,3', fixture);
        equal('034', '0,34', fixture);
        equal(',3', '0,3', fixture);
        equal(',34', '0,34', fixture);
    });

    it('should change value if user star from zero separator.3', () => {
        component.mask.set('separator.3');
        component.decimalMarker.set('.');
        fixture.detectChanges();

        equal('03', '0.3', fixture);
        equal('034', '0.34', fixture);
        equal('.3', '0.3', fixture);
        equal('.34', '0.34', fixture);
        equal('.345', '0.345', fixture);
    });

    it('should change value if user star from zero separator.3', () => {
        component.mask.set('separator.3');
        component.decimalMarker.set(',');
        fixture.detectChanges();

        equal('03', '0,3', fixture);
        equal('034', '0,34', fixture);
        equal(',3', '0,3', fixture);
        equal(',34', '0,34', fixture);
        equal(',345', '0,345', fixture);
    });

    it('should change value if user star from zero separator.0 with allowNegativeNumber', () => {
        component.mask.set('separator.0');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-3', fixture);
        equal('-034', '-34', fixture);
    });

    it('should change value if user star from zero separator.1 with allowNegativeNumber', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.3', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.3', fixture);
    });

    it('should change value if user star from zero separator.1 with allowNegativeNumber decimalMarker= ,', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,3', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,3', fixture);
    });

    it('should change value if user star from zero separator.2 with allowNegativeNumber', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.34', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.34', fixture);
    });

    it('should change value if user star from zero separator.2 with allowNegativeNumber', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,34', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,34', fixture);
    });

    it('should change value if user star from zero separator.3 with allowNegativeNumber', () => {
        component.mask.set('separator.3');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.34', fixture);
        equal('-0345', '-0.345', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.34', fixture);
        equal('-.345', '-0.345', fixture);
    });

    it('should change value if user star from zero separator.3 with allowNegativeNumber', () => {
        component.mask.set('separator.3');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,34', fixture);
        equal('-0345', '-0,345', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,34', fixture);
        equal('-,345', '-0,345', fixture);
    });

    it('should change value if user star from zero separator.1 with allowNegativeNumber leadZero decimalMarker= ,', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        component.leadZero.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,3', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,3', fixture);
    });

    it('should change value if user star from zero separator.1 with allowNegativeNumber leadZero decimalMarker= ,', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        component.leadZero.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.3', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.3', fixture);
    });

    it('should change value if user star from zero separator.1 with allowNegativeNumber leadZero decimalMarker= ,', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        component.leadZero.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,34', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,34', fixture);
    });

    it('should change value if user star from zero separator.2 with allowNegativeNumber leadZero decimalMarker= ,', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        component.leadZero.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.34', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.34', fixture);
    });

    it('should change value if user star from zero separator.3 with allowNegativeNumber leadZero decimalMarker= ,', () => {
        component.mask.set('separator.3');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        component.leadZero.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,34', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,34', fixture);
        equal('-,345', '-0,345', fixture);
    });

    it('should change value if user star from zero separator.3 with allowNegativeNumber leadZero decimalMarker= ,', () => {
        component.mask.set('separator.3');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        component.leadZero.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.34', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.34', fixture);
        equal('-.345', '-0.345', fixture);
    });

    it('separator.2 thousandSeparator = . should display correct value if decimalMarker is array 12345.67', fakeAsync(() => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1255.78);
        tick();
        fixture.detectChanges();
        requestAnimationFrame(() => {
            expect(inputTarget.value).toBe('1.255,78');
        });
    }));

    it('separator.3 thousandSeparator = . should display correct value if decimalMarker is array 12345.67', fakeAsync(() => {
        component.mask.set('separator.3');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1255.78);
        tick();
        requestAnimationFrame(() => {
            expect(inputTarget.value).toBe('1.255,78');
        });
    }));

    it('separator.1 thousandSeparator = . should display correct value if decimalMarker is array 12345.67', fakeAsync(() => {
        component.thousandSeparator.set('.');
        component.mask.set('separator.1');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1255.78);
        tick();
        requestAnimationFrame(() => {
            expect(inputTarget.value).toBe('1.255,78');
        });
    }));

    it('separator.2 thousandSeparator = , should display correct value if decimalMarker is array 12345.67', fakeAsync(() => {
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1255.78);
        tick();

        expect(inputTarget.value).toBe('1,255.78');
    }));

    it('separator.3 thousandSeparator = , should display correct value if decimalMarker is array 12345.67', fakeAsync(() => {
        component.mask.set('separator.3');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1255.78);
        tick();

        expect(inputTarget.value).toBe('1,255.78');
    }));

    it('separator.1 thousandSeparator = , should display correct value if decimalMarker is array 12345.67', fakeAsync(() => {
        component.mask.set('separator.1');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1255.78);
        tick();

        expect(inputTarget.value).toBe('1,255.7');
    }));

    it('separator.2 thousandSeparator = . leadZero should display correct value if decimalMarker is array 12345.67', fakeAsync(() => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.leadZero.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1255.78);
        tick();
        requestAnimationFrame(() => {
            expect(inputTarget.value).toBe('1.255,78');
        });
    }));

    it('separator.3 thousandSeparator = . leadZero should display correct value if decimalMarker is array 12345.67', fakeAsync(() => {
        component.mask.set('separator.3');
        component.thousandSeparator.set('.');
        component.leadZero.set(true);

        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1255.78);
        tick();
        requestAnimationFrame(() => {
            expect(inputTarget.value).toBe('1.255,780');
        });
    }));

    it('separator.1 thousandSeparator = . leadZero  should display correct value if decimalMarker is array 12345.67', fakeAsync(() => {
        component.thousandSeparator.set('.');
        component.mask.set('separator.1');
        component.leadZero.set(true);

        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(1255.78);
        tick();
        requestAnimationFrame(() => {
            expect(inputTarget.value).toBe('1.255,78');
        });
    }));

    it('should work when decimalMarker have default value separator.2', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        fixture.detectChanges();

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1,234', fixture);
    });

    it('should work when decimalMarker have default value separator.3', () => {
        component.mask.set('separator.3');
        component.thousandSeparator.set(',');
        fixture.detectChanges();

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1,234', fixture);
    });

    it('should work when decimalMarker have default value separator.1', () => {
        component.mask.set('separator.3');
        component.thousandSeparator.set(',');
        fixture.detectChanges();

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1,234', fixture);
    });

    it('should not delete decimalMarker ,', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        const inputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '1,23';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(4, 4);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '1,2';
        inputElement.setSelectionRange(3, 3);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '1,';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).toBe('1,');
    });

    it('should not delete decimalMarker .', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        const inputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '12.23';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(4, 4);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '12.2';
        inputElement.setSelectionRange(3, 3);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '12.';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).toBe('12.');
    });

    it('should change position when click backspace thousandSeparator = .', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        component.thousandSeparator.set('.');
        const inputElement = fixture.nativeElement.querySelector('input');
        inputElement.value = '1.234.567,89';

        expect(inputElement.value).toBe('1.234.567,89');

        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(2, 2);
        expect(inputElement.selectionStart).toBe(2);

        const backspaceEvent = new KeyboardEvent('keydown', {
            key: 'Backspace',
            code: 'Backspace',
        });
        inputElement.dispatchEvent(backspaceEvent);

        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).toBe('1.234.567,89');
        expect(inputElement.selectionStart).toBe(1);
    });

    it('should change position when click backspace thousandSeparator = ,', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        component.thousandSeparator.set(',');
        const inputElement = fixture.nativeElement.querySelector('input');
        inputElement.value = '1,234,567.89';

        expect(inputElement.value).toBe('1,234,567.89');

        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(2, 2);
        expect(inputElement.selectionStart).toBe(2);

        const backspaceEvent = new KeyboardEvent('keydown', {
            key: 'Backspace',
            code: 'Backspace',
        });
        inputElement.dispatchEvent(backspaceEvent);

        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).toBe('1,234,567.89');
        expect(inputElement.selectionStart).toBe(1);
    });

    it('should change position when click backspace thousandSeparator = ', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        component.thousandSeparator.set(' ');
        const inputElement = fixture.nativeElement.querySelector('input');
        inputElement.value = '1 234 567.89';

        expect(inputElement.value).toBe('1 234 567.89');

        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(2, 2);
        expect(inputElement.selectionStart).toBe(2);

        const backspaceEvent = new KeyboardEvent('keydown', {
            key: 'Backspace',
            code: 'Backspace',
        });
        inputElement.dispatchEvent(backspaceEvent);

        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).toBe('1 234 567.89');
        expect(inputElement.selectionStart).toBe(1);
    });

    it('should show correct value with separator.9', fakeAsync(() => {
        component.mask.set('separator.9');
        component.decimalMarker.set('.');
        component.leadZero.set(true);
        component.separatorLimit.set('10');
        fixture.detectChanges();

        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);

        equal('1', '1', fixture);
        equal('12', '12', fixture);

        component.form.setValue(10.1);
        tick();
        fixture.detectChanges();
        expect(inputTarget.value).toBe('10.100000000');
    }));

    it('should show correct value with separator.10', fakeAsync(() => {
        component.mask.set('separator.10');
        component.decimalMarker.set('.');
        component.leadZero.set(true);
        component.separatorLimit.set('10');
        fixture.detectChanges();

        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);

        equal('1', '1', fixture);
        equal('12', '12', fixture);

        component.form.setValue(10.1);
        tick();
        fixture.detectChanges();
        expect(inputTarget.value).toBe('10.1000000000');
    }));

    it('should support big numbers with separator', () => {
        component.mask.set('separator');

        equal('12345678910111215', '12 345 678 910 111 215', fixture);
        expect(component.form.value).toBe('12345678910111215');
        equal('12345678910111215.9999', '12 345 678 910 111 215.9999', fixture);
        expect(component.form.value).toBe('12345678910111215.9999');
    });

    it('should support big numbers with separator 2', () => {
        component.mask.set('separator.2');

        equal('12345678910111215', '12 345 678 910 111 215', fixture);
        expect(component.form.value).toBe('12345678910111215');
        equal('12345678910111215.9999', '12 345 678 910 111 215.99', fixture);
        expect(component.form.value).toBe('12345678910111215.99');
    });

    it('should support big numbers with separator 2 thousand =.', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');

        equal('12345678910111215', '12.345.678.910.111.215', fixture);
        expect(component.form.value).toBe('12345678910111215');
        equal('12345678910111215,99', '12.345.678.910.111.215,99', fixture);
        expect(component.form.value).toBe('12345678910111215.99');
    });

    it('should support big numbers with separator 2 thousand =,', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');

        equal('12345678910111215', '12,345,678,910,111,215', fixture);
        expect(component.form.value).toBe('12345678910111215');
        equal('12345678910111215.9999', '12,345,678,910,111,215.99', fixture);
        expect(component.form.value).toBe('12345678910111215.99');
    });

    it('should show default state after reset control separator.2', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');

        equal('1234', '1,234', fixture);
        component.form.reset();
        expect(component.form.dirty).toBe(false);
        expect(component.form.pristine).toBe(true);
    });

    it('should show default state after reset control separator.0', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set(',');

        equal('1234', '1,234', fixture);
        component.form.reset();
        expect(component.form.dirty).toBe(false);
        expect(component.form.pristine).toBe(true);
    });

    it('should show default state after reset control separator.2 and leadZero', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        component.leadZero.set(true);

        equal('1234', '1,234', fixture);
        component.form.reset();
        expect(component.form.dirty).toBe(false);
        expect(component.form.pristine).toBe(true);
    });
});
