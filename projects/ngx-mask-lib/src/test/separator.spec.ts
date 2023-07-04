import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal, typeTest } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Separator: Mask', () => {
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

    it('separator for empty', () => {
        component.mask = 'separator';
        equal('', '', fixture);
    });

    it('separator for 100', () => {
        component.mask = 'separator';
        equal('100', '100', fixture);
    });

    it('separator for -100', () => {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;
        equal('-100', '-100', fixture);
    });

    it('separator for 1000', () => {
        component.mask = 'separator';
        equal('1000', '1 000', fixture);
    });

    it('separator for -1000', () => {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;
        equal('-1000', '-1 000', fixture);
    });

    it('separator for 10000', () => {
        component.mask = 'separator';
        equal('10000', '10 000', fixture);
    });

    it('separator for -10000', () => {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;
        equal('-10000', '-10 000', fixture);
    });

    it('separator for -100000', () => {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;
        equal('-100000', '-100 000', fixture);
    });

    it('separator for 100000', () => {
        component.mask = 'separator';
        equal('100000', '100 000', fixture);
    });

    it('separator for 1000000', () => {
        component.mask = 'separator';
        equal('1000000', '1 000 000', fixture);
    });

    it('separator for -1000000', () => {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;
        equal('-1000000', '-1 000 000', fixture);
    });

    it('should limit separator to 1000', () => {
        component.mask = 'separator';
        component.separatorLimit = '1000';
        equal('1000000', '1 000', fixture);
    });

    it('separator precision 2 for 1000000.00', () => {
        component.mask = 'separator.2';
        equal('1000000.00', '1 000 000.00', fixture);
    });

    it('separator precision 2 for -1000000.00', () => {
        component.mask = 'separator.2';
        component.allowNegativeNumbers = true;
        equal('-1000000.00', '-1 000 000.00', fixture);
    });

    it('should limit separator with precision 2 to 10000', () => {
        component.mask = 'separator.2';
        component.separatorLimit = '10000';
        equal('1000000.00', '10 000.00', fixture);
    });
    it('should limit separator with precision 2 to 10 000', () => {
        component.mask = 'separator.2';
        component.separatorLimit = '10 000';
        equal('1000000.00', '10 000.00', fixture);
    });

    it('separator precision 0 for 1000000.00', () => {
        component.mask = 'separator.0';
        equal('1000000.00', '1 000 000', fixture);
    });

    it('separator precision 2 with 0 after point for 1000000.00', () => {
        component.mask = 'separator.2';
        equal('1000000.20', '1 000 000.20', fixture);
    });

    it('separator.2 with suffix', () => {
        component.mask = 'separator.2';
        component.suffix = '₽';
        equal('50', '50₽', fixture);
        equal('123 4', '1 234₽', fixture);
        equal('50.50', '50.50₽', fixture);
    });

    it('separator for letters', () => {
        component.mask = 'separator';
        equal('a', '', fixture);
        equal('1a', '1', fixture);
        equal('1000a', '1 000', fixture);
        equal('1000/', '1 000', fixture);
    });

    it('separator thousandSeparator . for 1000000', () => {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        equal('1000000', '1.000.000', fixture);
    });

    it('should not add any sperator if thousandSeparator set as empty string', () => {
        component.mask = 'separator';
        component.thousandSeparator = '';
        equal('1000000', '1000000', fixture);
    });

    it('should not accept more than one minus signal at the beginning of input for separator thousandSeparator . for --1000', () => {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        component.allowNegativeNumbers = true;
        equal('--1000', '-1.000', fixture);
    });

    it('should not accept more than one minus signal for separator thousandSeparator . for -100-0000', () => {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        component.allowNegativeNumbers = true;
        equal('-100-0000', '-1.000.000', fixture);
    });

    it('should limit separator thousandSeparator . to 100000', () => {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        component.separatorLimit = '100000';
        equal('1000000', '100.000', fixture);
    });

    it('should limit separator thousandSeparator . to -100000', () => {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        component.separatorLimit = '100000';
        component.allowNegativeNumbers = true;
        equal('-1000000', '-100.000', fixture);
    });

    it('separator thousandSeparator . precision 2 for 1000000.00', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
        equal('1000000,00', '1.000.000,00', fixture);
    });

    it('separator thousandSeparator . precision 2 for -1000000.00', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
        component.allowNegativeNumbers = true;
        equal('-1000000,00', '-1.000.000,00', fixture);
    });

    it('separator thousandSeparator . precision 2 with 0 after point for 1000000.00', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
        equal('1000000,20', '1.000.000,20', fixture);
    });

    it('separator thousandSeparator . precision 0 for 1000000.00', () => {
        component.mask = 'separator.0';
        component.thousandSeparator = '.';
        equal('1000000,00', '1.000.000', fixture);
    });

    it('separator thousandSeparator , for 1000000', () => {
        component.mask = 'separator';
        component.thousandSeparator = ',';
        equal('1000000', '1,000,000', fixture);
    });

    it('separator thousandSeparator , precision 2 for 1000000.00', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        equal('1000000.00', '1,000,000.00', fixture);
    });

    it('separator thousandSeparator , precision 2 with 0 after point for 1000000.00', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        equal('1000000.20', '1,000,000.20', fixture);
    });

    it('separator thousandSeparator , precision 0 for 1000000.00', () => {
        component.mask = 'separator.0';
        component.thousandSeparator = ',';
        equal('1000000.00', '1,000,000', fixture);
    });

    it(`separator thousandSeparator ' for 1000000`, () => {
        component.mask = 'separator';
        component.thousandSeparator = `'`;
        equal('1000000', `1'000'000`, fixture);
    });

    it(`separator thousandSeparator ' precision 2 for 1000000.00`, () => {
        component.mask = 'separator.2';
        component.thousandSeparator = `'`;
        equal('1000000.00', `1'000'000.00`, fixture);
    });

    it(`separator thousandSeparator ' precision 2 with 0 after point for 1000000.00`, () => {
        component.mask = 'separator.2';
        component.thousandSeparator = `'`;
        equal('1000000.20', `1'000'000.20`, fixture);
    });

    it(`separator thousandSeparator ' precision 0 for 1000000.00`, () => {
        component.mask = 'separator.0';
        component.thousandSeparator = `'`;
        equal('1000000.00', `1'000'000`, fixture);
    });

    it('should not shift cursor for input in-between digits', () => {
        component.mask = 'separator.0';
        component.thousandSeparator = ',';
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
        component.mask = 'separator.0';
        component.thousandSeparator = '.';
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
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
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
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
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
        component.mask = 'separator';
        component.thousandSeparator = ',';
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
        component.mask = 'separator';
        component.thousandSeparator = '.';
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
        component.mask = 'separator.0';
        component.thousandSeparator = ',';
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
        component.mask = 'separator.0';
        component.thousandSeparator = '.';
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
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
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
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
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
        component.mask = 'separator.0';
        component.thousandSeparator = ',';
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
        component.mask = 'separator';
        component.thousandSeparator = ',';
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
        component.mask = 'separator.8';
        component.specialCharacters = [',', '.'];
        component.allowNegativeNumbers = true;
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
        component.mask = 'separator.2';
        component.decimalMarker = ',';
        equal('1000000,00', '1 000 000,00', fixture);
    });

    it('separator precision 2 with thousandSeparator (.) decimalMarker (,) for 12345.67', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
        component.decimalMarker = ',';
        equal('12.345,67', '12.345,67', fixture);
    });

    it('separator precision 2 with thousandSeparator (.) decimalMarker (,) for 12345.67', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
        component.decimalMarker = ',';
        equal('12345,67', '12.345,67', fixture);
    });

    it('check formControl value to be number when decimalMarker is comma', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ' ';
        component.decimalMarker = ',';

        typeTest('12 345,67', fixture);
        expect(component.form.value).toBe('12345.67');
    });

    it('check formControl value to be number when decimalMarker is array', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ' ';
        component.decimalMarker = ['.', ','];

        typeTest('12 345,67', fixture);
        expect(component.form.value).toBe('12345.67');

        typeTest('123 456.78', fixture);
        expect(component.form.value).toBe('123456.78');
    });

    it('right handle character after first 0 value', () => {
        component.mask = 'separator';
        component.decimalMarker = ',';
        equal('0', '0', fixture);
        equal('0,', '0,', fixture);
        equal('0 ', '0', fixture);
        equal('01', '0', fixture);
        equal('0s', '0', fixture);
        equal('0@', '0', fixture);
        // TODO(inepipenko): strange thet return 0.
        // equal('0.', '0', fixture);
        component.decimalMarker = '.';
        equal('0', '0', fixture);
        equal('0.', '0.', fixture);
        equal('0 ', '0', fixture);
        equal('01', '0', fixture);
        equal('0s', '0', fixture);
        equal('0@', '0', fixture);
        equal('0,', '0', fixture);
        component.decimalMarker = ['.', ','];
        equal('0', '0', fixture);
        equal('0.', '0.', fixture);
        equal('0,', '0,', fixture);
        equal('0 ', '0', fixture);
        equal('01', '0', fixture);
        equal('0s', '0', fixture);
        equal('0@', '0', fixture);
    });

    it('should display zeros at the end separator2', fakeAsync(() => {
        component.mask = 'separator.2';
        component.leadZero = true;
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
        component.mask = 'separator.2';
        component.leadZero = true;
        component.thousandSeparator = ',';
        component.decimalMarker = '.';
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
        component.mask = 'separator.3';
        component.leadZero = true;
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
        component.mask = 'separator.3';
        component.leadZero = true;
        component.thousandSeparator = ',';
        component.decimalMarker = '.';
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
        component.mask = 'separator.2';
        component.leadZero = true;
        component.thousandSeparator = '.';
        component.decimalMarker = ',';
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
        component.mask = 'separator.3';
        component.leadZero = true;
        component.thousandSeparator = '.';
        component.decimalMarker = ',';
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
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        component.decimalMarker = '.';

        equal('999999999999999', '999,999,999,999,999', fixture);
        expect(component.form.value).toBe('999999999999999');

        equal('999999999999999.9', '999,999,999,999,999.9', fixture);
        expect(component.form.value).toBe('999999999999999.9');

        equal('999999999999999.99', '999,999,999,999,999.99', fixture);
        expect(component.form.value).toBe('999999999999999.99');
    });

    it('should display only 9 separator.3', () => {
        component.mask = 'separator.3';
        component.thousandSeparator = ',';
        component.decimalMarker = '.';

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
        component.mask = 'separator.2';
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
        component.mask = 'separator.2';
        component.leadZero = true;
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue('10.2');
        tick();
        expect(inputTarget.value).toBe('10.20');
        expect(component.form.value).toBe('10.20');
    }));

    it('should change formValue separator.3', fakeAsync(() => {
        component.mask = 'separator.3';
        component.leadZero = true;
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue('10.2');
        tick();
        expect(inputTarget.value).toBe('10.200');
        expect(component.form.value).toBe('10.200');
    }));
});
