import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { NgxMaskOptions } from 'ngx-mask';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { expect } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';

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

describe('apm input is mirrored into the service (falsy values included)', () => {
    it('[apm]="false" overrides a global apm: true', () => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask({ apm: true })],
        });
        const fixture = TestBed.createComponent(TestMaskComponent);
        const component = fixture.componentInstance;
        component.mask.set('Hh:m0');
        component.apm.set(false);
        fixture.detectChanges();

        // 24-hour clock: 13 is a valid hour (with apm it would be split into '1:3')
        equal('1323', '13:23', fixture);
    });

    it('switching [apm] from true to false at runtime takes effect', () => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        const fixture = TestBed.createComponent(TestMaskComponent);
        const component = fixture.componentInstance;
        component.mask.set('Hh:m0');
        component.apm.set(true);
        fixture.detectChanges();
        equal('1323', '1:32', fixture);

        component.apm.set(false);
        fixture.detectChanges();

        equal('1323', '13:23', fixture);
    });
});

@Component({
    selector: 'ngxd-bare-separator',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<input mask="separator.2" [formControl]="form" />`,
})
class BareSeparatorComponent {
    public form = new FormControl<string | number | null>(null);
}

describe('provideNgxMask - dropSpecialCharacters: false skips the precision pass of writeValue', () => {
    // Same outcome as an explicit [dropSpecialCharacters]="false" binding: no leadZero padding.
    for (const written of ['10.2', 10.2]) {
        it(`leaves a written ${typeof written} ${written} unpadded despite global leadZero`, async () => {
            configure({ leadZero: true, dropSpecialCharacters: false, decimalMarker: '.' });
            const fixture = TestBed.createComponent(BareSeparatorComponent);
            fixture.detectChanges();
            await fixture.whenStable();

            fixture.componentInstance.form.setValue(written);
            await fixture.whenStable();
            await new Promise((resolve) => requestAnimationFrame(resolve));
            const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
            expect(`${input.value} | ${fixture.componentInstance.form.value}`).toBe('10.2 | 10.2');
        });
    }
});
