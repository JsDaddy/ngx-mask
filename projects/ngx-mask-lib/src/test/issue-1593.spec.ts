import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';
import { expect, vi } from 'vitest';

// Issue #1593: deleting the integer part of a separator value must keep the decimal
// part (mirroring #1516 semantics) AND keep the caret adjacent to the deletion point
// instead of jumping to the end/start.
describe('Directive: Mask (issue #1593 delete integer part)', () => {
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
        inputTarget.value = inputTarget.value.slice(0, selStart) + inputTarget.value.slice(selEnd);
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
