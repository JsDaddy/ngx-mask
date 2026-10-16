import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

@Component({
    selector: 'ngxd-emit-count-ng-model',
    imports: [FormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <input
            [mask]="mask()"
            [leadZero]="leadZero()"
            [ngModel]="value()"
            (ngModelChange)="onModelChange($event)" />
    `,
})
class NgModelEmitCountComponent {
    public readonly mask = signal('0000');
    public readonly leadZero = signal(false);
    public readonly value = signal<string | null>(null);
    public readonly emitted: unknown[] = [];

    public onModelChange(value: unknown): void {
        this.emitted.push(value);
    }
}

/**
 * How many times a programmatic write is echoed back to the form. The directive pushes a value
 * back only when the mask changed it (normalised or re-typed it); a write the mask leaves
 * unchanged is not echoed, so the form emits exactly once for it (or not at all for `ngModel`).
 */
describe('Directive: emit count per programmatic write', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
    });

    describe('reactive forms: form.valueChanges per setValue', () => {
        let fixture: ComponentFixture<TestMaskComponent>;
        let component: TestMaskComponent;
        let emitted: unknown[];

        beforeEach(() => {
            fixture = TestBed.createComponent(TestMaskComponent);
            component = fixture.componentInstance;
            emitted = [];
            fixture.detectChanges();
        });

        it('0000: setValue(1234) emits valueChanges once', async () => {
            component.mask.set('0000');
            fixture.detectChanges();
            component.form.valueChanges.subscribe((value) => emitted.push(value));

            component.form.setValue('1234');
            fixture.detectChanges();
            await fixture.whenStable();

            // Only setValue's own emission: the mask leaves the written value unchanged.
            expect(emitted).toEqual(['1234']);
            expect(component.form.pristine).equal(true);
        });

        it('0000: setValue(1234) as a number emits valueChanges once', async () => {
            component.mask.set('0000');
            fixture.detectChanges();
            component.form.valueChanges.subscribe((value) => emitted.push(value));

            component.form.setValue(1234);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(emitted).toEqual([1234]);
        });

        it('0000: setValue(12345) still pushes the normalised value back', async () => {
            component.mask.set('0000');
            fixture.detectChanges();
            component.form.valueChanges.subscribe((value) => emitted.push(value));

            component.form.setValue('12345');
            fixture.detectChanges();
            await fixture.whenStable();

            // The echo writes the normalised value into the control, so both emissions carry it.
            expect(emitted).toEqual(['1234', '1234']);
            expect(component.form.pristine).equal(true);
        });

        it('00-00: setValue(12-34) still pushes the normalised value back', async () => {
            component.mask.set('00-00');
            component.dropSpecialCharacters.set(true);
            fixture.detectChanges();
            component.form.valueChanges.subscribe((value) => emitted.push(value));

            component.form.setValue('12-34');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(emitted).toEqual(['1234', '1234']);
        });

        it('00-00: setValue(1234) emits valueChanges once', async () => {
            component.mask.set('00-00');
            component.dropSpecialCharacters.set(true);
            fixture.detectChanges();
            component.form.valueChanges.subscribe((value) => emitted.push(value));

            component.form.setValue('1234');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(emitted).toEqual(['1234']);
        });

        it('separator.2 + leadZero: setValue(10.2) emits the normalised value, then setValue', async () => {
            component.mask.set('separator.2');
            component.leadZero.set(true);
            fixture.detectChanges();
            component.form.valueChanges.subscribe((value) => emitted.push(value));

            component.form.setValue('10.2');
            fixture.detectChanges();
            await fixture.whenStable();

            // The echo already carries the leadZero-normalised value when setValue emits.
            expect(emitted).toEqual(['10.20', '10.20']);
        });
    });

    describe('template-driven forms: (ngModelChange) per model write', () => {
        let fixture: ComponentFixture<NgModelEmitCountComponent>;
        let component: NgModelEmitCountComponent;

        beforeEach(async () => {
            fixture = TestBed.createComponent(NgModelEmitCountComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('0000: writing 1234 does not emit ngModelChange', async () => {
            component.value.set('1234');
            fixture.detectChanges();
            await fixture.whenStable();

            // Angular never emits ngModelChange for a model write, and the mask leaves it unchanged.
            expect(component.emitted).toEqual([]);
        });

        it('0000: writing 12345 emits the normalised value once', async () => {
            component.value.set('12345');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.emitted).toEqual(['1234']);
        });

        it('separator.2 + leadZero: writing 10.2 emits ngModelChange once', async () => {
            component.mask.set('separator.2');
            component.leadZero.set(true);
            fixture.detectChanges();
            await fixture.whenStable();
            component.emitted.length = 0;

            component.value.set('10.2');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.emitted).toEqual(['10.20']);
        });
    });
});
