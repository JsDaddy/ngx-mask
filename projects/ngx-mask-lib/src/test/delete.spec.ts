import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';
import { typeTest } from './utils/test-functions.component';
import { expect, vi } from 'vitest';
import { createHarness } from './utils/characterization-harness';

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

    it('should keep decimal marker when deleting all leading integer digits (issue #1516)', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        component.leadZero.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        // displayed 12,34 — user selects '12' and deletes it -> native value is ',34'
        inputTarget.value = ',34';
        inputTarget.selectionStart = 0;
        inputTarget.selectionEnd = 0;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).equal(',34');
    });

    it('should keep dot decimal marker when deleting all leading integer digits (issue #1516)', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        // displayed 12.34 — user selects '12' and deletes it -> native value is '.34'
        inputTarget.value = '.34';
        inputTarget.selectionStart = 0;
        inputTarget.selectionEnd = 0;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).equal('.34');
    });

    // #1632: retyping into a slot just cleared by two backspaces must fill from the
    // FIRST typed digit, not drop it.
    it('should fill both digits of a backspace-cleared month slot with keepCharacterPositions (issue #1632)', () => {
        component.mask.set('d0/M0/0000');
        component.keepCharacterPositions.set(true);
        component.showMaskTyped.set(true);
        component.dropSpecialCharacters.set(false);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue('05/06/2025');
        fixture.detectChanges();

        // caret placed right after the month: 05/06|/2025
        inputTarget.selectionStart = 5;
        inputTarget.selectionEnd = 5;

        // backspace #1: clears the second month digit -> 05/0_/2025, caret at 4
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        inputTarget.value = inputTarget.value.slice(0, 4) + inputTarget.value.slice(5);
        inputTarget.selectionStart = inputTarget.selectionEnd = 4;
        debugElement.triggerEventHandler('input', {
            target: inputTarget,
            inputType: 'deleteContentBackward',
        });

        // backspace #2: clears the first month digit -> 05/__/2025, caret at 3
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        inputTarget.value = inputTarget.value.slice(0, 3) + inputTarget.value.slice(4);
        inputTarget.selectionStart = inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', {
            target: inputTarget,
            inputType: 'deleteContentBackward',
        });

        expect(inputTarget.value).equal('05/__/2025');

        // type '1' then '2' into the cleared month slot
        for (const char of ['1', '2']) {
            const pos = inputTarget.selectionStart as number;
            debugElement.triggerEventHandler('keydown', { key: char, target: inputTarget });
            inputTarget.value =
                inputTarget.value.slice(0, pos) + char + inputTarget.value.slice(pos);
            inputTarget.selectionStart = inputTarget.selectionEnd = pos + 1;
            debugElement.triggerEventHandler('input', {
                target: inputTarget,
                inputType: 'insertText',
                data: char,
            });
        }

        expect(inputTarget.value).equal('05/12/2025');
    });

    // Issue #1593: deleting the integer part of a separator value must keep the decimal
    // part (mirroring #1516 semantics) AND keep the caret adjacent to the deletion point
    // instead of jumping to the end/start.
    describe('delete integer part keeps decimal part and caret (#1593)', () => {
        function backspaceTo(postEditValue: string, caretAfterDelete: number): HTMLInputElement {
            const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
            const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
            fixture.detectChanges();

            inputTarget.value = postEditValue;
            inputTarget.selectionStart = caretAfterDelete;
            inputTarget.selectionEnd = caretAfterDelete;
            debugElement.triggerEventHandler('keydown', {
                code: 'Backspace',
                key: 'Backspace',
                keyCode: 8,
                target: inputTarget,
            });
            debugElement.triggerEventHandler('input', { target: inputTarget });
            return inputTarget;
        }

        it('should keep decimal part and caret after selection-deleting the whole integer block', () => {
            component.mask.set('separator.2');
            component.thousandSeparator.set('.');
            component.decimalMarker.set(',');
            // displayed 1.234,56 — user selects '1.234' and deletes it
            const inputTarget = backspaceTo(',56', 0);

            expect(inputTarget.value).equal(',56');
            expect(inputTarget.selectionStart).equal(0);
        });

        it('should keep decimal part and caret after selection-deleting the whole integer block (leadZero)', () => {
            component.mask.set('separator.2');
            component.thousandSeparator.set('.');
            component.decimalMarker.set(',');
            component.leadZero.set(true);
            // displayed 1.234,56 — user selects '1.234' and deletes it
            const inputTarget = backspaceTo(',56', 0);

            expect(inputTarget.value).equal(',56');
            expect(inputTarget.selectionStart).equal(0);
        });

        it('should keep decimal part and caret after deleting the single integer digit (issue #1593 repro)', () => {
            component.mask.set('separator.2');
            component.thousandSeparator.set(',');
            component.decimalMarker.set('.');
            // displayed 1.23 — user backspaces the '1'
            const inputTarget = backspaceTo('.23', 0);

            expect(inputTarget.value).equal('.23');
            expect(inputTarget.selectionStart).equal(0);
        });

        it('should keep decimal part and caret after selection-deleting a middle integer chunk', () => {
            component.mask.set('separator.2');
            component.thousandSeparator.set('.');
            component.decimalMarker.set(',');
            const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
            const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
            fixture.detectChanges();

            // displayed 1.234,56 — user selects '234' and presses Backspace. keydown fires
            // BEFORE the deletion (the directive may extend the selection over adjacent
            // special characters), then the browser removes the (possibly extended)
            // selection and fires input.
            inputTarget.value = '1.234,56';
            inputTarget.selectionStart = 2;
            inputTarget.selectionEnd = 5;
            debugElement.triggerEventHandler('keydown', {
                code: 'Backspace',
                key: 'Backspace',
                keyCode: 8,
                target: inputTarget,
            });
            const selStart = inputTarget.selectionStart as number;
            const selEnd = inputTarget.selectionEnd as number;
            inputTarget.value =
                inputTarget.value.slice(0, selStart) + inputTarget.value.slice(selEnd);
            inputTarget.selectionStart = selStart;
            inputTarget.selectionEnd = selStart;
            debugElement.triggerEventHandler('input', { target: inputTarget });

            expect(inputTarget.value).equal('1,56');
            expect(inputTarget.selectionStart).equal(1);
        });

        it('should allow typing a digit right after deleting the whole integer block', () => {
            component.mask.set('separator.2');
            component.thousandSeparator.set(',');
            component.decimalMarker.set('.');
            const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
            const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
            fixture.detectChanges();

            // displayed 1.23 — user backspaces the '1' -> '.23'
            inputTarget.value = '.23';
            inputTarget.selectionStart = 0;
            inputTarget.selectionEnd = 0;
            debugElement.triggerEventHandler('keydown', {
                code: 'Backspace',
                key: 'Backspace',
                keyCode: 8,
                target: inputTarget,
            });
            debugElement.triggerEventHandler('input', { target: inputTarget });

            expect(inputTarget.value).equal('.23');

            // user then types '3' at the caret -> expected 3.23, not 323
            const caret = inputTarget.selectionStart as number;
            inputTarget.value = `${inputTarget.value.slice(0, caret)}3${inputTarget.value.slice(caret)}`;
            inputTarget.selectionStart = caret + 1;
            inputTarget.selectionEnd = caret + 1;
            debugElement.triggerEventHandler('keydown', {
                code: 'Digit3',
                key: '3',
                keyCode: 51,
                target: inputTarget,
            });
            debugElement.triggerEventHandler('input', { target: inputTarget });

            expect(inputTarget.value).equal('3.23');
        });
    });

    describe('Backspace on the last digit with a prefix and dropSpecialCharacters=false', () => {
        // A real Backspace at the end of the field: keydown, the browser removes one character,
        // then input.
        const backspaceAtEnd = (): void => {
            const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
            const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
            const caret = inputTarget.value.length - 1;
            debugElement.triggerEventHandler('keydown', {
                code: 'Backspace',
                key: 'Backspace',
                keyCode: 8,
                target: inputTarget,
            });
            inputTarget.value = inputTarget.value.slice(0, caret);
            inputTarget.selectionStart = caret;
            inputTarget.selectionEnd = caret;
            debugElement.triggerEventHandler('input', { target: inputTarget });
        };

        beforeEach(() => {
            component.mask.set('000');
            component.prefix.set('$');
            component.dropSpecialCharacters.set(false);
            const inputTarget: HTMLInputElement = fixture.debugElement.query(By.css('input'))
                .nativeElement as HTMLInputElement;
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        });

        it('empties the field when instantPrefix is off (the default)', () => {
            fixture.detectChanges();
            expect(typeTest('12', fixture)).equal('$12');

            backspaceAtEnd();
            expect(fixture.nativeElement.querySelector('input').value).equal('$1');
            backspaceAtEnd();

            expect(fixture.nativeElement.querySelector('input').value).equal('');
            expect(component.form.value).equal('');
        });

        it('keeps only the prefix when instantPrefix is on', () => {
            component.instantPrefix.set(true);
            fixture.detectChanges();
            expect(typeTest('12', fixture)).equal('$12');

            backspaceAtEnd();
            backspaceAtEnd();

            expect(fixture.nativeElement.querySelector('input').value).equal('$');
            expect(component.form.value).equal('');
        });
    });
});

describe('Directive: Mask (Delete inside the prefix)', () => {
    const setUp = async (keepCharacterPositions: boolean) => {
        const harness = createHarness();
        harness.component.mask.set('000-000');
        harness.component.prefix.set('+7 ');
        harness.component.keepCharacterPositions.set(keepCharacterPositions);
        harness.component.showMaskTyped.set(keepCharacterPositions);
        await harness.settle();
        await harness.write('123456');
        return harness;
    };

    for (const keepCharacterPositions of [false, true]) {
        for (const caret of [0, 1, 2]) {
            it(`should prevent Delete with the caret at ${caret} (keepCharacterPositions ${keepCharacterPositions})`, async () => {
                const harness = await setUp(keepCharacterPositions);
                const snap = await harness.edit({ start: caret, end: caret, key: 'Delete' });
                expect(snap).toEqual({
                    value: '+7 123-456',
                    caret: 3,
                    model: '123456',
                    prevented: true,
                });
            });
        }
    }
});

describe('Directive: Mask (Delete where the prefix and suffix guards stay as they were)', () => {
    type Row = {
        name: string;
        config: Record<string, unknown>;
        initial: string;
        typed?: string;
        action: { start: number; key: string };
        expected: { value: string; caret: number; model: unknown; prevented: boolean };
    };

    const kcp = { keepCharacterPositions: true, showMaskTyped: true };
    const rows: Row[] = [
        {
            // a caret at 1 is onInput's first-character case, which lands the edit one slot off
            name: 'a one-character prefix on a keepCharacterPositions decimal mask',
            config: { ...kcp, mask: '0000.00', prefix: '$' },
            initial: '123456',
            action: { start: 1, key: 'Delete' },
            expected: { value: '$1234.56', caret: 1, model: '123456', prevented: true },
        },
        {
            name: 'a one-character prefix on a keepCharacterPositions phone mask',
            config: { ...kcp, mask: '(000) 000-0000', prefix: '$' },
            initial: '0123456789',
            action: { start: 1, key: 'Delete' },
            expected: { value: '$(012) 345-6789', caret: 1, model: '0123456789', prevented: true },
        },
        {
            name: 'a one-character prefix on a plain mask',
            config: { mask: '0000', prefix: '$' },
            initial: '1234',
            action: { start: 1, key: 'Delete' },
            expected: { value: '$1234', caret: 1, model: '1234', prevented: true },
        },
        {
            name: 'a mask that opens with a separator, keepCharacterPositions',
            config: { ...kcp, mask: '(000) 000 00 00', prefix: '+7 ' },
            initial: '1234567890',
            action: { start: 3, key: 'Delete' },
            expected: {
                value: '+7 (123) 456 78 90',
                caret: 3,
                model: '1234567890',
                prevented: true,
            },
        },
        {
            name: 'a mask that opens with a separator, plain',
            config: { mask: '(000) 000 00 00', prefix: '+7 ' },
            initial: '1234567890',
            action: { start: 3, key: 'Delete' },
            expected: {
                value: '+7 (123) 456 78 90',
                caret: 3,
                model: '1234567890',
                prevented: true,
            },
        },
        {
            name: 'a number mask with a multi-character prefix',
            config: { mask: 'separator.2', prefix: '+7 ' },
            initial: '1234.56',
            action: { start: 3, key: 'Delete' },
            expected: { value: '+7 1 234.56', caret: 3, model: 1234.56, prevented: true },
        },
        {
            name: 'a number mask with a one-character prefix',
            config: { mask: 'separator.2', prefix: '$' },
            initial: '1234.56',
            action: { start: 1, key: 'Delete' },
            expected: { value: '$1 234.56', caret: 1, model: 1234.56, prevented: true },
        },
        {
            // the sign sits in front of the prefix, so the caret at prefix.length is not the first slot
            name: 'a negative number behind a prefix',
            config: { mask: 'separator.2', prefix: '$', allowNegativeNumbers: true },
            initial: '-1234.56',
            action: { start: 1, key: 'Delete' },
            expected: { value: '-$1 234.56', caret: 1, model: -1234.56, prevented: true },
        },
        {
            // the display of a hiddenInput mask carries no suffix: the digit after the caret is real
            name: 'a hiddenInput display without the suffix',
            config: { mask: '000-000', suffix: ' kg', hiddenInput: true, showMaskTyped: true },
            initial: '',
            typed: '1234',
            action: { start: 4, key: 'Delete' },
            expected: { value: '123-___', caret: 3, model: '123', prevented: false },
        },
        {
            // a number mask keeps its own handling in front of the suffix
            name: 'a number mask with a suffix',
            config: { mask: 'separator.2', prefix: '$', suffix: ' USD', showMaskTyped: true },
            initial: '1234.56',
            action: { start: 12, key: 'Delete' },
            expected: { value: '$1 234.56_._ USD', caret: 9, model: 1234.56, prevented: false },
        },
    ];

    for (const row of rows) {
        it(`should leave Delete as it was: ${row.name}`, async () => {
            const harness = createHarness();
            for (const [key, value] of Object.entries(row.config)) {
                (harness.component as unknown as Record<string, { set: (v: unknown) => void }>)[
                    key
                ]?.set(value);
            }
            await harness.settle();
            await harness.write(row.initial);
            if (row.typed) {
                harness.el.setSelectionRange(0, 0);
                await harness.type(row.typed);
            }
            const { start, key } = row.action;
            expect(await harness.edit({ start, end: start, key })).toEqual(row.expected);
        });
    }
});
