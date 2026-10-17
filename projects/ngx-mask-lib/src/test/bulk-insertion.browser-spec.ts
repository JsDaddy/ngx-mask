import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

type Mounted = Awaited<ReturnType<typeof mount<MaskHarnessComponent>>>;

const MASKS: [string, string, string, Record<string, unknown>][] = [
    ['0000-00-00', '20231215', '2023-12-15', {}],
    ['0000.M0.d0', '20231215', '2023.12.15', {}],
    ['(000) 000-0000', '5551234567', '(555) 123-4567', {}],
    ['Hh:m0', '1230', '12:30', {}],
    ['separator.2', '1234567.89', '1 234 567.89', { thousandSeparator: ' ', decimalMarker: '.' }],
    ['XXX-XX-0000', '123456789', '***-**-6789', { hiddenInput: true }],
];

const focus = (m: Mounted): HTMLInputElement => {
    const el = m.get('#masked');
    el.focus();
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return el;
};

/** Splice `data` into the value at the selection, as the browser does, then fire `input`. */
const insert = (
    el: HTMLInputElement,
    data: string,
    inputType: string,
    eventData: string | null = data
): void => {
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    el.value = el.value.slice(0, start) + data + el.value.slice(end);
    el.setSelectionRange(start + data.length, start + data.length);
    el.dispatchEvent(
        new InputEvent('input', { bubbles: true, inputType, data: eventData, isComposing: false })
    );
};

describe('Bulk insertion: one edit that inserts several characters (real browser)', () => {
    describe.each(MASKS)('mask %s', (mask, raw, display, inputs) => {
        const mk = (): Promise<Mounted> => mount(MaskHarnessComponent, { mask, ...inputs });

        it('formats like per-key typing when one insertText carries the whole value', async () => {
            const typed = await mk();
            await typed.type('#masked', raw);

            const m = await mk();
            const el = focus(m);
            insert(el, raw, 'insertText');
            await m.settle();

            expect(el.value).toBe(display);
            expect(el.value).toBe(typed.get('#masked').value);
            expect(m.component.form.value).toEqual(typed.component.form.value);
            // the caret follows the formatted value, not the raw run
            expect(el.selectionStart).toBe(display.length);
        });

        it('formats a CJK commit (composition, compositionend, insertText) as typed', async () => {
            const m = await mk();
            const el = focus(m);
            el.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
            el.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: raw }));
            insert(el, raw, 'insertText');
            await m.settle();

            expect(el.value).toBe(display);
        });

        it('formats an Android keyCode 229 composition sequence as typed', async () => {
            const m = await mk();
            const el = focus(m);
            el.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
            for (const ch of raw) {
                el.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        bubbles: true,
                        key: 'Unidentified',
                        keyCode: 229,
                    })
                );
                insert(el, ch, 'insertCompositionText');
            }
            el.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: raw }));
            await m.settle();

            expect(el.value).toBe(display);
        });

        it('formats a paste event followed by insertFromPaste', async () => {
            const m = await mk();
            const el = focus(m);
            el.dispatchEvent(new Event('paste', { bubbles: true }));
            insert(el, raw, 'insertFromPaste', null);
            await m.settle();

            expect(el.value).toBe(display);
        });
    });

    it('keeps the typed digits when an autocorrect replaces the selected word', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '(000) 000-0000' });
        await m.type('#masked', '55');
        const el = m.get('#masked');
        el.setSelectionRange(0, el.value.length);
        insert(el, '5551', 'insertText');
        await m.settle();

        expect(el.value).toBe('(555) 1');
        expect(m.component.form.value).toBe('5551');
        expect(el.selectionStart).toBe(7);
    });

    it('formats a bulk insertText appended after typed digits', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '0000-00-00' });
        await m.type('#masked', '2023-');
        insert(m.get('#masked'), '1215', 'insertText');
        await m.settle();

        expect(m.get('#masked').value).toBe('2023-12-15');
        expect(m.component.form.value).toBe('20231215');
    });

    // dictation or a predictive replacement in the middle of the value: not a paste, so the
    // caret stays right after the inserted run instead of jumping to the end
    it('keeps the caret after a run inserted in the middle of the value', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '0000-0000' });
        await m.type('#masked', '12345');
        const el = m.get('#masked');
        expect(el.value).toBe('1234-5');

        m.select('#masked', 1, 1);
        insert(el, '99', 'insertText');
        await m.settle();

        expect(el.value).toBe('1992-345');
        expect(m.component.form.value).toBe('1992345');
        expect(el.selectionStart).toBe(3);
    });

    it('takes a whole value inserted over the selected value of a hiddenInput field', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'XXXX', hiddenInput: true });
        await m.type('#masked', '12');
        const el = m.get('#masked');
        expect(el.value).toBe('**');

        m.selectAll('#masked');
        insert(el, '1234', 'insertText');
        await m.settle();

        expect(el.value).toBe('****');
        expect(m.component.form.value).toBe('1234');
    });

    it('formats a run inserted in front of the untouched keepCharacterPositions skeleton', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '000-000',
            showMaskTyped: true,
            keepCharacterPositions: true,
        });
        const el = focus(m);
        m.select('#masked', 0, 0);
        expect(el.value).toBe('___-___');

        insert(el, '123', 'insertText');
        await m.settle();

        expect(el.value).toBe('123-___');
        expect(m.component.form.value).toBe('123');
    });
});

@Component({
    selector: 'ngxd-global-separators',
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask({ thousandSeparator: '.', decimalMarker: ',' })],
    template: `<input id="masked" [formControl]="form" [mask]="mask()" />`,
})
class GlobalSeparatorsComponent {
    public readonly mask = input('separator.2');
    public readonly form = new FormControl<unknown>(null);
}

describe('Runtime mask change keeps the configured separators (real browser)', () => {
    it('keeps the global thousandSeparator and decimalMarker across mask switches', async () => {
        const m = await mount(GlobalSeparatorsComponent, { mask: 'separator.2' });
        await m.type('#masked', '1234,5');
        expect(m.get('#masked').value).toBe('1.234,5');

        for (const mask of ['0000', 'separator.3', 'separator.0', 'separator.2']) {
            m.fixture.componentRef.setInput('mask', mask);
            await m.settle();
            await m.clear('#masked');
            await m.type('#masked', mask.startsWith('separator') ? '1234,5' : '1234');
            if (mask === 'separator.0') {
                expect(m.get('#masked').value).toBe('12.345');
            } else if (mask === '0000') {
                expect(m.get('#masked').value).toBe('1234');
            } else {
                expect(m.get('#masked').value).toBe('1.234,5');
            }
        }
        expect(m.component.form.value).toBe(1234.5);
    });

    it('keeps a bound decimalMarker when the thousandSeparator changes', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: ' ',
            decimalMarker: ',',
        });
        await m.type('#masked', '1234,5');
        expect(m.get('#masked').value).toBe('1 234,5');

        m.fixture.componentRef.setInput('thousandSeparator', '.');
        await m.settle();
        expect(m.get('#masked').value).toBe('1.234,5');

        await m.type('#masked', '6');
        expect(m.get('#masked').value).toBe('1.234,56');
        expect(m.component.form.value).toBe(1234.56);

        m.fixture.componentRef.setInput('thousandSeparator', ' ');
        await m.settle();
        expect(m.get('#masked').value).toBe('1 234,56');
    });
});
