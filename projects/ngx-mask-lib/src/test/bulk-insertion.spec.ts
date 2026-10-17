import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';

import { TestMaskComponent } from './utils/test-component.component';
import { typeTest } from './utils/test-functions.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';

// One edit that inserts several characters (autofill, a drop, dictation, a predictive or
// spellcheck replacement) fires a single insertText input event and no paste event. When the
// run ends the value it is formatted as a paste; a run inserted in the middle of the value keeps
// the keystroke path and its caret. Browser twin: bulk-insertion.browser-spec.ts.
describe('Directive: Mask (bulk insertion)', () => {
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

    function input(): HTMLInputElement {
        return fixture.nativeElement.querySelector('input');
    }

    /** Splice `data` into the value at the selection, as the browser does, then fire `input`. */
    function insertText(data: string): void {
        const el = input();
        const start = el.selectionStart ?? el.value.length;
        const end = el.selectionEnd ?? start;
        el.value = el.value.slice(0, start) + data + el.value.slice(end);
        el.setSelectionRange(start + data.length, start + data.length);
        el.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data }));
        fixture.detectChanges();
    }

    it('keeps the caret after a run inserted in the middle of the value', async () => {
        component.mask.set('0000-0000');
        fixture.detectChanges();
        component.form.setValue('12345');
        fixture.detectChanges();
        await fixture.whenStable();
        const el = input();
        expect(el.value).toBe('1234-5');

        el.focus();
        el.setSelectionRange(1, 1);
        insertText('99');

        expect(el.value).toBe('1992-345');
        expect(component.form.value).toBe('1992345');
        // right after the inserted run, not at the end of the value
        expect(el.selectionStart).toBe(3);
    });

    it('takes a whole value inserted over the selected value of a hiddenInput field', () => {
        component.mask.set('XXXX');
        component.hiddenInput.set(true);
        fixture.detectChanges();
        expect(typeTest('12', fixture)).toBe('**');
        const el = input();
        el.focus();

        el.setSelectionRange(0, el.value.length);
        insertText('1234');

        expect(el.value).toBe('****');
        expect(component.form.value).toBe('1234');
    });

    it('formats a run inserted in front of the untouched keepCharacterPositions skeleton', async () => {
        component.mask.set('000-000');
        component.showMaskTyped.set(true);
        component.keepCharacterPositions.set(true);
        fixture.detectChanges();
        await fixture.whenStable();
        const el = input();
        el.focus();
        el.setSelectionRange(0, 0);
        expect(el.value).toBe('___-___');

        insertText('123');

        expect(el.value).toBe('123-___');
        expect(component.form.value).toBe('123');
    });
});
