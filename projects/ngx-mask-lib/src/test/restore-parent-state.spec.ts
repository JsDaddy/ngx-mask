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
                [leadZero]="leadZero()"
                [thousandSeparator]="thousandSeparator()"
                [decimalMarker]="decimalMarker()"
                formControlName="amount" />
            <input id="note" formControlName="note" />
        </form>
    `,
})
class ParentStateComponent {
    public readonly leadZero = signal(false);
    public readonly thousandSeparator = signal<' ' | '.'>(' ');
    public readonly decimalMarker = signal<'.' | ','>('.');
    public readonly group = new FormGroup({
        amount: new FormControl<number | null>(null),
        note: new FormControl(''),
    });
}

@Component({
    selector: 'ngxd-restore-nested-parent-state',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <form [formGroup]="outer">
            <div formGroupName="inner">
                <input id="amount" mask="separator.2" [leadZero]="true" formControlName="amount" />
            </div>
        </form>
    `,
})
class NestedParentStateComponent {
    public readonly outer = new FormGroup({
        inner: new FormGroup({ amount: new FormControl<number | null>(null) }),
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

    it('keeps a group the application marked dirty after a reconfiguration', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.detectChanges();
        const { group } = fixture.componentInstance;
        group.controls.amount.setValue(1234.5);
        fixture.detectChanges();
        group.markAsDirty();

        await reconfigure(fixture);

        expect(group.controls.amount.pristine).toBe(true);
        expect(group.dirty).toBe(true);
    });

    it('keeps a group the application marked touched after a reconfiguration', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.detectChanges();
        const { group } = fixture.componentInstance;
        group.controls.amount.setValue(1234.5);
        fixture.detectChanges();
        group.markAsTouched();

        await reconfigure(fixture);

        expect(group.controls.amount.untouched).toBe(true);
        expect(group.touched).toBe(true);
    });
});

describe('Directive: parent state kept on a programmatic write', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideNgxMask()] });
    });

    it('keeps a group the application marked dirty', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.componentInstance.leadZero.set(true);
        fixture.detectChanges();
        const { group } = fixture.componentInstance;
        group.markAsDirty();

        group.controls.amount.setValue(5);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(group.controls.amount.pristine).toBe(true);
        expect(group.dirty).toBe(true);
    });

    it('keeps a group the application marked touched', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.componentInstance.leadZero.set(true);
        fixture.detectChanges();
        const { group } = fixture.componentInstance;
        group.markAsTouched();

        group.controls.amount.setValue(5);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(group.controls.amount.untouched).toBe(true);
        expect(group.touched).toBe(true);
    });

    it('leaves a pristine nested group pristine and untouched', async () => {
        const fixture = TestBed.createComponent(NestedParentStateComponent);
        fixture.detectChanges();
        const { outer } = fixture.componentInstance;

        outer.controls.inner.controls.amount.setValue(5);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('#amount').value).toBe('5.00');
        expect(outer.controls.inner.controls.amount.pristine).toBe(true);
        expect(outer.controls.inner.pristine).toBe(true);
        expect(outer.pristine).toBe(true);
        expect(outer.untouched).toBe(true);
    });

    it('keeps an explicitly dirty and touched grandparent while the inner group is restored', async () => {
        const fixture = TestBed.createComponent(NestedParentStateComponent);
        fixture.detectChanges();
        const { outer } = fixture.componentInstance;
        outer.markAsDirty();
        outer.markAsTouched();
        outer.controls.inner.markAsPristine({ onlySelf: true });
        outer.controls.inner.markAsUntouched({ onlySelf: true });

        outer.controls.inner.controls.amount.setValue(5);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(outer.controls.inner.controls.amount.pristine).toBe(true);
        expect(outer.controls.inner.pristine).toBe(true);
        expect(outer.dirty).toBe(true);
        expect(outer.touched).toBe(true);
    });
});
