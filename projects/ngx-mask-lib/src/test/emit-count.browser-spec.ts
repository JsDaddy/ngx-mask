import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
    selector: 'ngxd-emit-count-initial',
    imports: [FormsModule, NgxMaskDirective],
    providers: [provideNgxMask()],
    template: `
        <input
            mask="separator.2"
            [leadZero]="true"
            [ngModel]="value()"
            (ngModelChange)="emitted.push($event)" />
    `,
})
class InitialNgModelComponent {
    public readonly value = signal<string | number>('');
    public readonly emitted: unknown[] = [];
}

const frames = (count: number): Promise<void> =>
    new Promise((resolve) => {
        const step = (left: number): void =>
            left === 0 ? resolve() : void requestAnimationFrame(() => step(left - 1));
        step(count);
    });

describe('Directive: initial [ngModel] value with separator.2 + leadZero (real browser)', () => {
    // Release note: the duplicate ngModelChange echo of the initial leadZero-normalised value is gone.
    it.each([['5.1'], [5.1], [7.1], [7]])(
        'emits ngModelChange once for the initial value %s',
        async (initial) => {
            const fixture = TestBed.createComponent(InitialNgModelComponent);
            fixture.componentInstance.value.set(initial);
            fixture.autoDetectChanges();
            await fixture.whenStable();
            await frames(3);
            await fixture.whenStable();

            expect(fixture.componentInstance.emitted.length).toBe(1);
        }
    );
});
