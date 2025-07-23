import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal, Paste } from './utils/test-functions.component';
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
});
