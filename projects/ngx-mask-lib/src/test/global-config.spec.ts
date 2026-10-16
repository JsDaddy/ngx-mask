import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { NgxMaskOptions } from 'ngx-mask';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { expect } from 'vitest';

// Bare inputs: nothing is bound, so the effective settings can only come from `provideNgxMask`.
// (`TestMaskComponent` / `MaskHarnessComponent` bind every input, which hides this class of bug.)
@Component({
    selector: 'ngxd-bare-mask-2',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<input mask="00" [formControl]="form" />`,
})
class BareTwoDigitsComponent {
    public form = new FormControl<string | null>(null);
}

function configure(config: NgxMaskOptions): void {
    TestBed.configureTestingModule({ providers: [provideNgxMask(config)] });
}

describe('provideNgxMask - global config is the effective config of a bare input', () => {
    it('global prefix counts towards the validated length (dropSpecialCharacters: false)', async () => {
        configure({ prefix: '$', dropSpecialCharacters: false });
        const fixture = TestBed.createComponent(BareTwoDigitsComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        // '$' + 2 digits is complete, '$' + 1 digit is not
        fixture.componentInstance.form.setValue('$12');
        expect(fixture.componentInstance.form.errors).toBeNull();

        fixture.componentInstance.form.setValue('$1');
        await fixture.whenStable();
        expect(fixture.componentInstance.form.errors).not.toBeNull();
    });
});
