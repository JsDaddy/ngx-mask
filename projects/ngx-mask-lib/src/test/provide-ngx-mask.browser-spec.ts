import { Component } from '@angular/core';
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
});
