import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    input,
    signal,
    ViewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ControlValueAccessor } from '@angular/forms';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
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

type ParentStateFixture = ReturnType<typeof TestBed.createComponent<ParentStateComponent>>;

/** Focus loss on the amount input: the only way the directive touches its control. */
const blurAmount = (fixture: ParentStateFixture): void => {
    fixture.nativeElement.querySelector('#amount').dispatchEvent(new Event('blur'));
    fixture.detectChanges();
};

describe('Directive: control state kept on a separator reconfiguration', () => {
    const reconfigure = async (fixture: ParentStateFixture): Promise<void> => {
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

    it('keeps a control the user blurred touched after a reconfiguration', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.detectChanges();
        const { group } = fixture.componentInstance;
        group.controls.amount.setValue(1234.5);
        fixture.detectChanges();
        blurAmount(fixture);
        expect(group.controls.amount.touched).toBe(true);

        await reconfigure(fixture);

        expect(group.controls.amount.touched).toBe(true);
        expect(group.controls.amount.pristine).toBe(true);
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

    it('keeps a control the user blurred touched', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.componentInstance.leadZero.set(true);
        fixture.detectChanges();
        const { group } = fixture.componentInstance;
        blurAmount(fixture);
        expect(group.controls.amount.touched).toBe(true);

        group.controls.amount.setValue(5);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(group.controls.amount.touched).toBe(true);
        expect(group.controls.amount.pristine).toBe(true);
        expect(group.touched).toBe(true);
    });

    it('keeps the touched state the application sets right after the write', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.componentInstance.leadZero.set(true);
        fixture.detectChanges();
        const { group } = fixture.componentInstance;

        group.patchValue({ amount: 5 });
        group.markAllAsTouched();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('#amount').value).toBe('5.00');
        expect(group.controls.amount.touched).toBe(true);
        expect(group.controls.note.touched).toBe(true);
        expect(group.touched).toBe(true);
    });

    it('keeps the dirty state the application sets right after the write', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.componentInstance.leadZero.set(true);
        fixture.detectChanges();
        const { group } = fixture.componentInstance;

        group.controls.amount.setValue(5);
        group.markAllAsDirty();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(group.controls.amount.dirty).toBe(true);
        expect(group.controls.note.dirty).toBe(true);
        expect(group.dirty).toBe(true);
    });

    it('keeps a sibling the application marked dirty on its own', async () => {
        const fixture = TestBed.createComponent(ParentStateComponent);
        fixture.componentInstance.leadZero.set(true);
        fixture.detectChanges();
        const { group } = fixture.componentInstance;
        group.controls.note.markAsDirty({ onlySelf: true });

        group.controls.amount.setValue(5);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(group.controls.note.dirty).toBe(true);
        expect(group.controls.amount.pristine).toBe(true);
        expect(group.pristine).toBe(true);
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

    it('keeps an explicitly dirty and touched grandparent while the inner group stays pristine', async () => {
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

@Component({
    selector: 'ngxd-update-on-state',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<input mask="separator.2" [leadZero]="true" [formControl]="amount" />`,
})
class UpdateOnStateComponent {
    public amount = new FormControl<string | null>(null);
}

describe('Directive: programmatic write to a control that updates on blur or submit', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideNgxMask()] });
    });

    it.each(['blur', 'submit'] as const)(
        'puts the leadZero value in the model at once and keeps an updateOn %s control pristine',
        async (updateOn) => {
            const fixture = TestBed.createComponent(UpdateOnStateComponent);
            const amount = new FormControl<string | null>(null, { updateOn });
            fixture.componentInstance.amount = amount;
            fixture.detectChanges();

            amount.setValue('10.2');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.nativeElement.querySelector('input').value).toBe('10.20');
            expect(amount.value).toBe('10.20');
            expect(amount.pristine).toBe(true);
        }
    );
});

/** A custom control that hands its whole ControlValueAccessor contract to the inner mask. */
@Component({
    selector: 'ngxd-forwarding-mask-input',
    imports: [NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => ForwardingMaskInputComponent),
        },
    ],
    template: `<input [mask]="mask()" [leadZero]="leadZero()" />`,
})
class ForwardingMaskInputComponent implements ControlValueAccessor {
    public readonly mask = input.required<string>();
    public readonly leadZero = input(false);
    @ViewChild(NgxMaskDirective, { static: true })
    private readonly _maskDirective!: NgxMaskDirective;

    public writeValue(value: unknown): void {
        this._maskDirective.writeValue(value);
    }

    public registerOnChange(fn: (value: unknown) => void): void {
        this._maskDirective.registerOnChange(fn);
    }

    public registerOnTouched(fn: () => void): void {
        this._maskDirective.registerOnTouched(fn);
    }
}

/** A custom control that implements the contract itself around a masked input with no form binding. */
@Component({
    selector: 'ngxd-plain-mask-input',
    imports: [NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => PlainMaskInputComponent),
        },
    ],
    template: `<input #field mask="0000" [value]="value()" (input)="relay(field.value)" />`,
})
class PlainMaskInputComponent implements ControlValueAccessor {
    public readonly value = signal<string | null>(null);
    private _onChange?: (value: unknown) => void;

    public writeValue(value: string | null): void {
        this.value.set(value);
    }

    public registerOnChange(fn: (value: unknown) => void): void {
        this._onChange = fn;
    }

    public relay(value: unknown): void {
        this._onChange?.(value);
    }

    public registerOnTouched(): void {
        // Not needed by these specs.
    }
}

/** A custom control whose masked input is bound to a FormControl of its own. */
@Component({
    selector: 'ngxd-own-control-mask-input',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => OwnControlMaskInputComponent),
        },
    ],
    template: `<input mask="0000" [formControl]="inner" (input)="relay(inner.value)" />`,
})
class OwnControlMaskInputComponent implements ControlValueAccessor {
    public readonly inner = new FormControl<string | null>(null);
    private _onChange?: (value: unknown) => void;

    public writeValue(value: string | null): void {
        this.inner.setValue(value);
    }

    public registerOnChange(fn: (value: unknown) => void): void {
        this._onChange = fn;
    }

    public relay(value: unknown): void {
        this._onChange?.(value);
    }

    public registerOnTouched(): void {
        // Not needed by these specs.
    }
}

@Component({
    selector: 'ngxd-wrapped-mask-host',
    imports: [
        ReactiveFormsModule,
        ForwardingMaskInputComponent,
        PlainMaskInputComponent,
        OwnControlMaskInputComponent,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <form [formGroup]="group">
            <ngxd-forwarding-mask-input id="code" mask="0000" formControlName="code" />
            <ngxd-plain-mask-input id="plain" formControlName="plain" />
            <ngxd-own-control-mask-input id="own" formControlName="own" />
        </form>
        <ngxd-forwarding-mask-input
            id="amount"
            mask="separator.2"
            [leadZero]="true"
            [formControl]="amount" />
    `,
})
class WrappedMaskHostComponent {
    public readonly group = new FormGroup({
        code: new FormControl<string | null>(null),
        plain: new FormControl<string | null>(null),
        own: new FormControl<string | null>(null),
    });
    public readonly amount = new FormControl<string | null>(null);
}

describe('Directive: control state of a custom control around the mask', () => {
    const renderHost = (): ReturnType<typeof TestBed.createComponent<WrappedMaskHostComponent>> => {
        const fixture = TestBed.createComponent(WrappedMaskHostComponent);
        fixture.detectChanges();
        return fixture;
    };
    const writeAndSettle = async (
        fixture: ReturnType<typeof renderHost>,
        write: () => void
    ): Promise<void> => {
        write();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    };
    const inputOf = (fixture: ReturnType<typeof renderHost>, id: string): HTMLInputElement =>
        fixture.nativeElement.querySelector(`#${id} input`);

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideNgxMask()] });
    });

    it('updates the control of a wrapper that forwards its accessor without dirtying it', async () => {
        const fixture = renderHost();
        const { group } = fixture.componentInstance;

        await writeAndSettle(fixture, () => group.controls.code.setValue('12345'));

        expect(inputOf(fixture, 'code').value).toBe('1234');
        expect(group.controls.code.value).toBe('1234');
        expect(group.controls.code.pristine).toBe(true);
        expect(group.pristine).toBe(true);
    });

    it('normalises a leadZero write through a forwarding wrapper without dirtying it', async () => {
        const fixture = renderHost();
        const { amount } = fixture.componentInstance;

        await writeAndSettle(fixture, () => amount.setValue('10.2'));

        expect(inputOf(fixture, 'amount').value).toBe('10.20');
        expect(amount.value).toBe('10.20');
        expect(amount.pristine).toBe(true);
    });

    it('leaves the control of a wrapper whose plain inner input it does not feed alone', async () => {
        const fixture = renderHost();
        const { group } = fixture.componentInstance;

        await writeAndSettle(fixture, () => group.controls.plain.setValue('12345'));

        expect(inputOf(fixture, 'plain').value).toBe('1234');
        expect(group.controls.plain.value).toBe('12345');
        expect(group.controls.plain.pristine).toBe(true);
    });

    it('updates the inner control of a wrapper, not the wrapper control', async () => {
        const fixture = renderHost();
        const { group } = fixture.componentInstance;
        const inner = fixture.debugElement.query(
            (el) => el.componentInstance instanceof OwnControlMaskInputComponent
        ).componentInstance.inner as FormControl<string | null>;

        await writeAndSettle(fixture, () => group.controls.own.setValue('12345'));

        expect(inputOf(fixture, 'own').value).toBe('1234');
        expect(inner.value).toBe('1234');
        expect(inner.pristine).toBe(true);
        expect(group.controls.own.value).toBe('12345');
        expect(group.controls.own.pristine).toBe(true);
    });
});
