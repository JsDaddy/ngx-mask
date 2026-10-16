import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { beforeEach, describe, expect, it } from 'vitest';

@Component({
    selector: 'ngxd-restore-parent-state',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <form [formGroup]="group">
            <input
                id="amount"
                mask="separator.2"
                [thousandSeparator]="thousandSeparator()"
                [decimalMarker]="decimalMarker()"
                formControlName="amount" />
            <input id="note" formControlName="note" />
        </form>
    `,
})
class ParentStateComponent {
    public readonly thousandSeparator = signal<' ' | '.'>(' ');
    public readonly decimalMarker = signal<'.' | ','>('.');
    public readonly group = new FormGroup({
        amount: new FormControl<number | null>(null),
        note: new FormControl(''),
    });
}

describe('Directive: pristine state restored after a separator reconfiguration', () => {
    const reconfigure = async (
        fixture: ReturnType<typeof TestBed.createComponent<ParentStateComponent>>
    ): Promise<void> => {
        fixture.componentInstance.thousandSeparator.set('.');
        fixture.componentInstance.decimalMarker.set(',');
        fixture.detectChanges();
        await fixture.whenStable();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideNgxMask()] });
    });

    it('leaves the parent group pristine and untouched', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.detectChanges();
        fixture.componentInstance.group.controls.amount.setValue(1234.5);
        fixture.detectChanges();

        await reconfigure(fixture);

        const { group } = fixture.componentInstance;
        expect(fixture.nativeElement.querySelector('#amount').value).toBe('1.234,5');
        expect(group.controls.amount.pristine).toBe(true);
        expect(group.pristine).toBe(true);
        expect(group.untouched).toBe(true);
    });

    it('keeps the group dirty while a sibling control is dirty', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.detectChanges();
        fixture.componentInstance.group.controls.amount.setValue(1234.5);
        fixture.componentInstance.group.controls.note.markAsDirty();
        fixture.detectChanges();

        await reconfigure(fixture);

        const { group } = fixture.componentInstance;
        expect(group.controls.amount.pristine).toBe(true);
        expect(group.dirty).toBe(true);
    });
});
