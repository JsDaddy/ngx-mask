import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { NgxMaskOptions } from 'ngx-mask';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { mount } from './utils/browser-harness';

// Deliberately a bare input: nothing is bound, so every setting must come from `provideNgxMask`.
// (`MaskHarnessComponent` binds every input from the config, which hides this class of bug.)
@Component({
    selector: 'ngxd-bare-mask',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    template: `<input id="masked" mask="000" [formControl]="form" />`,
})
class BareMaskComponent {
    public form = new FormControl('123');
}

// Bare input with a bound MASK only: every other setting must come from `provideNgxMask`.
@Component({
    selector: 'ngxd-bare-dynamic-mask',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    template: `<input id="masked" [mask]="mask()" [formControl]="form" />`,
})
class BareDynamicMaskComponent {
    public mask = input('');
    public form = new FormControl('');
}

function configure(config: NgxMaskOptions): void {
    TestBed.configureTestingModule({ providers: [provideNgxMask(config)] });
}

describe('provideNgxMask - global config reaches the directive (bare input)', () => {
    it('global prefix: Backspace inside the prefix moves the caret to the prefix boundary', async () => {
        configure({ prefix: '+7 ' });
        const m = await mount(BareMaskComponent);
        const input = m.get('#masked');
        expect(input.value).toBe('+7 123');

        m.select('#masked', 1, 1);
        input.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'Backspace',
                code: 'Backspace',
                bubbles: true,
                cancelable: true,
            })
        );

        expect(input.selectionStart).toBe(3);
        expect(input.value).toBe('+7 123');
    });

    it('global suffix: a caret placed behind the suffix is clamped in front of it', async () => {
        configure({ suffix: ' $$' });
        const m = await mount(BareMaskComponent);
        const input = m.get('#masked');
        expect(input.value).toBe('123 $$');

        m.select('#masked', 6, 6);
        input.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Shift', code: 'ShiftLeft', bubbles: true })
        );

        expect(input.selectionStart).toBe(3);
    });

    it('global keepCharacterPositions + showMaskTyped: Backspace blanks a slot instead of shifting', async () => {
        configure({ keepCharacterPositions: true, showMaskTyped: true });
        const m = await mount(BareDynamicMaskComponent, { mask: '000-000.00' });

        await m.type('#masked', '12345678');
        await expect.poll(() => m.get('#masked').value).toBe('123-456.78');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}'.repeat(3));
        await expect.poll(() => m.get('#masked').value).toBe('123-___.78');
    });

    it('default config, multi-mask: Backspace after special characters keeps the caret right (7 ArrowLeft)', async () => {
        configure({});
        const m = await mount(BareDynamicMaskComponent, {
            mask: '(000) 000-0000||+000000000000000',
        });

        await m.type('#masked', '1234567890');
        await expect.poll(() => m.get('#masked').value).toBe('(123) 456-7890');
        await m.type('#masked', '{ArrowLeft}'.repeat(7));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
    });

    it('default config, multi-mask: Backspace after a shorter mask switch lands on the right caret', async () => {
        configure({});
        const m = await mount(BareDynamicMaskComponent, {
            mask: '(00) 00000000||+00 (00) 00000000',
        });

        await m.type('#masked', '111');
        await expect.poll(() => m.get('#masked').value).toBe('(11) 1');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(4);
    });

    it('global leadZeroDateTime: a day over 31 is padded and the caret skips the separator', async () => {
        configure({ leadZeroDateTime: true });
        const m = await mount(BareDynamicMaskComponent, { mask: 'd0/M0/0000' });

        await m.type('#masked', '33');
        await expect.poll(() => m.get('#masked').value).toBe('03/03');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
    });

    it('global apm: typing 00 into Hh:m0:s0 is kept without leadZeroDateTime', async () => {
        configure({ apm: true });
        const m = await mount(BareDynamicMaskComponent, { mask: 'Hh:m0:s0' });

        await m.type('#masked', '00');
        await expect.poll(() => m.get('#masked').value).toBe('00');
    });

    it('global apm with leadZeroDateTime: typing 00 into Hh:m0:s0 gives the hour 01', async () => {
        configure({ apm: true, leadZeroDateTime: true });
        const m = await mount(BareDynamicMaskComponent, { mask: 'Hh:m0:s0' });

        await m.type('#masked', '00');
        await expect.poll(() => m.get('#masked').value).toBe('01');
    });
});
