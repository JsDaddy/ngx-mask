import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';

// Issues #1293 / #1497 — Android IME behavior.
//
// Samsung Keyboard (and some other Android IMEs) deliver every keystroke as a
// composition (`compositionstart` + input events with inputType 'insertCompositionText')
// and may not fire `compositionend` until blur, so the directive's "wait for the
// composed text" gate left the FormControl stale for the whole edit (#1293).
//
// Android keydown events report key 'Unidentified' / keyCode 229, so backspace was
// undetectable from keydown and every `_code()`-based deletion branch misfired —
// cursor jumps and "stuck" backspace (#1497). The input event's `inputType`
// ('deleteContentBackward') is the reliable deletion signal.
describe('Directive: Mask (Android IME — issues #1293, #1497)', () => {
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

    /** Android keydown: key is 'Unidentified', code is empty. */
    function androidKeydown(el: HTMLInputElement): void {
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Unidentified' }));
    }

    /** Samsung Keyboard keystroke: Unidentified keydown + insertCompositionText input. */
    function samsungType(char: string): void {
        const el = input();
        androidKeydown(el);
        const pos = el.selectionStart ?? el.value.length;
        el.value = el.value.slice(0, pos) + char + el.value.slice(pos);
        el.selectionStart = el.selectionEnd = pos + 1;
        el.dispatchEvent(new InputEvent('input', { inputType: 'insertCompositionText' }));
        fixture.detectChanges();
    }

    /** Android backspace: Unidentified keydown + deleteContentBackward input. */
    function androidBackspace(): void {
        const el = input();
        androidKeydown(el);
        const pos = el.selectionStart ?? el.value.length;
        if (pos > 0) {
            el.value = el.value.slice(0, pos - 1) + el.value.slice(pos);
            el.selectionStart = el.selectionEnd = pos - 1;
        }
        el.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward' }));
        fixture.detectChanges();
    }

    /** Plain insertText input without a preceding keydown (pure IME insertion). */
    function imeInsertText(char: string): void {
        const el = input();
        const pos = el.selectionStart ?? el.value.length;
        el.value = el.value.slice(0, pos) + char + el.value.slice(pos);
        el.selectionStart = el.selectionEnd = pos + 1;
        el.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));
        fixture.detectChanges();
    }

    it('#1293: digit mask — model updates on every insertCompositionText, before compositionend', () => {
        component.mask.set('0000');
        fixture.detectChanges();
        const el = input();
        el.focus();
        el.dispatchEvent(new Event('compositionstart'));

        samsungType('1');
        expect(component.form.value).toBe('1');
        samsungType('2');
        expect(component.form.value).toBe('12');
        samsungType('3');
        expect(component.form.value).toBe('123');
        expect(el.value).toBe('123');
        // compositionend never fires until blur on Samsung Keyboard — the model must
        // already be in sync without it.
    });

    it('#1293: digit mask with special characters — masking applied during composition', () => {
        component.mask.set('000-000');
        fixture.detectChanges();
        const el = input();
        el.focus();
        el.dispatchEvent(new Event('compositionstart'));

        for (const char of '123456') {
            samsungType(char);
        }
        expect(el.value).toBe('123-456');
        expect(component.form.value).toBe('123456');
    });

    it('#1293: late compositionend does not double-process an already handled value', () => {
        component.mask.set('000-000');
        fixture.detectChanges();
        const el = input();
        el.focus();
        el.dispatchEvent(new Event('compositionstart'));

        for (const char of '1234') {
            samsungType(char);
        }
        expect(el.value).toBe('123-4');
        expect(component.form.value).toBe('1234');

        el.dispatchEvent(new Event('compositionend'));
        fixture.detectChanges();
        expect(el.value).toBe('123-4');
        expect(component.form.value).toBe('1234');
    });

    it('letter mask — composition still waits for compositionend (IME preserved)', () => {
        component.mask.set('SSSS');
        fixture.detectChanges();
        const el = input();
        el.focus();
        el.dispatchEvent(new Event('compositionstart'));

        el.value = 'a';
        el.selectionStart = el.selectionEnd = 1;
        el.dispatchEvent(new InputEvent('input', { inputType: 'insertCompositionText' }));
        fixture.detectChanges();
        expect(component.form.value).toBe(null);

        el.value = 'ab';
        el.selectionStart = el.selectionEnd = 2;
        el.dispatchEvent(new InputEvent('input', { inputType: 'insertCompositionText' }));
        fixture.detectChanges();
        expect(component.form.value).toBe(null);

        el.dispatchEvent(new Event('compositionend'));
        fixture.detectChanges();
        expect(component.form.value).toBe('ab');
        expect(el.value).toBe('ab');
    });

    it('#1497: backspace via deleteContentBackward deletes exactly one digit per press', () => {
        component.mask.set('XXX - XX - 0000');
        fixture.detectChanges();
        const el = input();
        el.focus();

        // Type the full value Android-style (no composition — e.g. Gboard digits).
        for (const char of '123456789') {
            androidKeydown(el);
            imeInsertText(char);
        }
        expect(el.value).toBe('123 - 45 - 6789');
        expect(component.form.value).toBe('123456789');

        // Now backspace digit by digit from the end — the model must lose exactly one
        // digit per press and never get "stuck".
        const expected = ['12345678', '1234567', '123456', '12345', '1234', '123', '12', '1'];
        for (const value of expected) {
            const before = String(component.form.value ?? '');
            // Deleting across trailing special characters (' - ') may need presses that
            // only remove separator chars; allow up to 4 presses per digit.
            let presses = 0;
            while (String(component.form.value ?? '') === before && presses < 4) {
                androidBackspace();
                presses += 1;
            }
            expect(component.form.value).toBe(value);
        }
    });

    it('#1497: backspace across a separator block does not restore deleted digits', () => {
        component.mask.set('000 - 00');
        fixture.detectChanges();
        const el = input();
        el.focus();

        for (const char of '12345') {
            androidKeydown(el);
            imeInsertText(char);
        }
        expect(el.value).toBe('123 - 45');

        androidBackspace();
        expect(component.form.value).toBe('1234');
        androidBackspace();
        expect(component.form.value).toBe('123');
    });

    it('#1497: keepCharacterPositions backspace — Android matches desktop behavior', () => {
        // The whole kCP branch keys on _code() === 'Backspace', which Android keydown
        // ('Unidentified' / keyCode 229) never sets — without the inputType fallback the
        // deletion was processed as an insertion. Desktop truth (verified with a real
        // Backspace keydown): display '123-4_6', model '12346', caret 5.
        component.keepCharacterPositions.set(true);
        component.mask.set('000-000');
        fixture.detectChanges();
        const el = input();
        el.focus();

        for (const char of '123456') {
            androidKeydown(el);
            imeInsertText(char);
        }
        expect(el.value).toBe('123-456');

        // Backspace the '5' (caret after it, index 6) Android-style.
        el.setSelectionRange(6, 6);
        androidBackspace();
        expect(el.value).toBe('123-4_6');
        expect(component.form.value).toBe('12346');
        expect(el.selectionStart).toBe(5);
    });

    it('insertText after a backspace clears the stale deletion code (no keydown case)', () => {
        component.mask.set('0000');
        fixture.detectChanges();
        const el = input();
        el.focus();

        for (const char of '12') {
            androidKeydown(el);
            imeInsertText(char);
        }
        androidBackspace();
        expect(component.form.value).toBe('1');

        // Pure IME insertion without any keydown: must not be processed as backspace.
        imeInsertText('3');
        expect(component.form.value).toBe('13');
        expect(el.value).toBe('13');
    });

    it('desktop behavior unchanged: plain input events without inputType still work', () => {
        component.mask.set('000-000');
        fixture.detectChanges();
        const el = input();
        el.focus();

        el.dispatchEvent(new KeyboardEvent('keydown', { key: '1', code: 'Digit1' }));
        el.value = '1';
        el.selectionStart = el.selectionEnd = 1;
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.form.value).toBe('1');
    });
});
