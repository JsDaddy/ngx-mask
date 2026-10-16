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
 * Probe for how many times a programmatic write is echoed back to the form (D2.4). The
 * counts asserted here document today's behaviour; they are not a statement of intent.
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

        it('0000: setValue(1234) emits valueChanges twice', async () => {
            component.mask.set('0000');
            fixture.detectChanges();
            component.form.valueChanges.subscribe((value) => emitted.push(value));

            component.form.setValue('1234');
            fixture.detectChanges();
            await fixture.whenStable();

            // One emission is setValue's own, the other is the directive echoing the masked value.
            expect(emitted).toEqual(['1234', '1234']);
        });

        it('separator.2 + leadZero: setValue(10.2) emits valueChanges twice', async () => {
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

        it('0000: writing 1234 emits ngModelChange once', async () => {
            component.value.set('1234');
            fixture.detectChanges();
            await fixture.whenStable();

            // Angular never emits ngModelChange for a model write: this one is the directive's echo.
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
