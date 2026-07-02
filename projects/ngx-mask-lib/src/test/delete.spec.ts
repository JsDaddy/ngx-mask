import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';
import { expect, vi } from 'vitest';

describe('Directive: Mask (Delete)', () => {
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

    it('delete character in input', () => {
        component.mask.set('00/00/0000');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '2/34/5678';
        inputTarget.selectionStart = 1;
        inputTarget.selectionEnd = 1;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).equal('23/45/678');
        expect(inputTarget.selectionStart).equal(1);
    });

    it('delete special character in input', () => {
        component.mask.set('00/00/0000');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '12/34/5678';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).equal('12/34/5678');
        expect(inputTarget.selectionStart).equal(2);
    });

    it('delete special character in secure input', () => {
        component.mask.set('XXX/X0/0000');
        component.hiddenInput.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '123/45/6789';
        inputTarget.selectionStart = 7;
        inputTarget.selectionEnd = 7;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        debugElement.triggerEventHandler('ngModelChange', { target: inputTarget });

        expect(inputTarget.value).equal('***/*5/6789');
        expect(inputTarget.selectionStart).equal(6);
    });

    it('delete special character on 1 position', () => {
        component.mask.set('[00]');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '[12]';
        inputTarget.selectionStart = 1;
        inputTarget.selectionEnd = 1;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.selectionStart).equal(1);
    });

    it('delete suffix with backspace and delete', () => {
        component.mask.set('A{5}');
        component.suffix.set('.com');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '123.com';
        inputTarget.selectionStart = 4;
        inputTarget.selectionEnd = 4;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 46,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.selectionStart).equal(3);

        inputTarget.selectionStart = 4;
        inputTarget.selectionEnd = 4;

        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.selectionStart).equal(3);
    });

    it('prefix shouldn`t be deleted', () => {
        component.mask.set('00 00');
        component.prefix.set('+1');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '+100 00';
        inputTarget.selectionStart = 1;
        inputTarget.selectionEnd = 1;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,

            preventDefault: () => {
                void 0;
            },
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.selectionStart).equal(2);
    });

    it('prefix shouldn`t be deleted', () => {
        component.mask.set('00 00');
        component.prefix.set('+1 ');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '+1 00 00';
        inputTarget.selectionStart = 1;
        inputTarget.selectionEnd = 1;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,

            preventDefault: () => {
                void 0;
            },
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.selectionStart).equal(3);
    });

    it('prefix shouldn`t be deleted', () => {
        component.mask.set('(00) 00');
        component.prefix.set('+1');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '+1(00) 00';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,

            preventDefault: () => {
                void 0;
            },
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.selectionStart).equal(2);
    });

    it('prefix shouldn`t be deleted', () => {
        component.mask.set('(00) 00');
        component.prefix.set('+1 ');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '+1 (00) 00';
        inputTarget.selectionStart = 4;
        inputTarget.selectionEnd = 4;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,

            preventDefault: () => {
                void 0;
            },
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.selectionStart).equal(3);
    });

    it('date mask should show keep right value d0/M0/0000', () => {
        component.mask.set('d0/M0/0000');
        const inputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '4/4/4444';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(8, 8);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4/4/444';
        inputElement.setSelectionRange(7, 7);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4/4/44';
        inputElement.setSelectionRange(6, 6);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4/4/4';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).equal('4/4/4');
    });

    it('date mask should show keep right value d0:M0:0000', () => {
        component.mask.set('d0:M0:0000');
        const inputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '4:4:4444';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(8, 8);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4:4:444';
        inputElement.setSelectionRange(7, 7);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4:4:44';
        inputElement.setSelectionRange(6, 6);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4:4:4';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).equal('4:4:4');
    });

    it('date mask should show keep right value d0-M0-0000', () => {
        component.mask.set('d0-M0-0000');
        const inputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '4-4-4444';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(8, 8);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4-4-444';
        inputElement.setSelectionRange(7, 7);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4-4-44';
        inputElement.setSelectionRange(6, 6);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4-4-4';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).equal('4-4-4');
    });

    it('should keep remaining zeros when deleting first digit of 500 (separator.2) (issue #1355)', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        // typed 500, cursor after 5, backspace deletes the 5 -> native value is '00'
        inputTarget.value = '00';
        inputTarget.selectionStart = 0;
        inputTarget.selectionEnd = 0;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).equal('00');
    });

    it('should keep remaining zeros when deleting first digit of 100,000 (issue #1578)', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        // displayed 100,000, cursor after 1, backspace deletes the 1 -> native value is '00,000'
        inputTarget.value = '00,000';
        inputTarget.selectionStart = 0;
        inputTarget.selectionEnd = 0;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).equal('00,000');
    });

    it('should keep remaining zeros when deleting first digit of 1,000,000 (issue #1578)', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        // displayed 1,000,000, cursor after 1, backspace deletes the 1 -> native value is ',000,000'
        inputTarget.value = ',000,000';
        inputTarget.selectionStart = 0;
        inputTarget.selectionEnd = 0;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).equal('000,000');
    });

    it('should strip leading zero when a non-zero digit remains after deletion (505,000 -> 05,000)', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        // displayed 505,000, cursor after first 5, backspace -> native value is '05,000'
        inputTarget.value = '05,000';
        inputTarget.selectionStart = 0;
        inputTarget.selectionEnd = 0;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).equal('5,000');
    });

    it('should keep single zero when deleting last remaining non-zero digit', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        // displayed 0.5, cursor at end, backspace deletes the 5 -> native value is '0.'
        inputTarget.value = '0.';
        inputTarget.selectionStart = 2;
        inputTarget.selectionEnd = 2;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).equal('0.');
    });
});
