import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

@Component({
    selector: 'ngxd-reconfig-group',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    providers: [provideNgxMask()],
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
class ReconfigGroupComponent {
    public readonly leadZero = signal(false);
    public readonly thousandSeparator = signal<' ' | '.'>(' ');
    public readonly decimalMarker = signal<'.' | ','>('.');
    public readonly group = new FormGroup({
        amount: new FormControl<number | null>(null),
        note: new FormControl(''),
    });
}

describe('Separator: changing the separators after typing (real browser)', () => {
    const swap = async (m: Awaited<ReturnType<typeof mount<MaskHarnessComponent>>>) => {
        m.fixture.componentRef.setInput('thousandSeparator', '.');
        m.fixture.componentRef.setInput('decimalMarker', ',');
        await m.settle();
    };

    it('keeps the typed number when the separators swap', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: ' ',
            decimalMarker: '.',
        });
        await m.type('#masked', '1234.5');
        expect(m.get('#masked').value).toBe('1 234.5');

        await swap(m);

        expect(m.get('#masked').value).toBe('1.234,5');
        expect(m.component.form.value).toBe(1234.5);
    });

    it.each([
        ['prefix', 'Rs. ', '', 'Rs. 1 234.5', 'Rs. 1.234,5'],
        ['suffix', '', ' kg', '1 234.5 kg', '1.234,5 kg'],
        ['prefix and suffix', 'Rs. ', ' kg', 'Rs. 1 234.5 kg', 'Rs. 1.234,5 kg'],
    ])('keeps the typed number with a %s', async (_name, prefix, suffix, before, after) => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: ' ',
            decimalMarker: '.',
            prefix,
            suffix,
        });
        await m.type('#masked', '1234.5');
        expect(m.get('#masked').value).toBe(before);
        expect(m.component.form.value).toBe(1234.5);

        await swap(m);

        expect(m.get('#masked').value).toBe(after);
        expect(m.component.form.value).toBe(1234.5);
    });

    it('keeps the sign of a negative number swapped back and forth', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            allowNegativeNumbers: true,
            thousandSeparator: ',',
            decimalMarker: '.',
        });
        await m.type('#masked', '-1234.5');
        expect(m.get('#masked').value).toBe('-1,234.5');

        await swap(m);
        expect(m.get('#masked').value).toBe('-1.234,5');
        expect(m.component.form.value).toBe(-1234.5);

        m.fixture.componentRef.setInput('thousandSeparator', ',');
        m.fixture.componentRef.setInput('decimalMarker', '.');
        await m.settle();
        expect(m.get('#masked').value).toBe('-1,234.5');
        expect(m.component.form.value).toBe(-1234.5);
    });

    describe('dirty and touched state', () => {
        const reconfigure = async (
            m: Awaited<ReturnType<typeof mount<ReconfigGroupComponent>>>
        ): Promise<void> => {
            m.component.thousandSeparator.set('.');
            m.component.decimalMarker.set(',');
            await m.settle();
        };

        it('leaves a clean group pristine and untouched', async () => {
            const m = await mount(ReconfigGroupComponent);
            m.component.group.controls.amount.setValue(1234.5);
            await m.settle();

            await reconfigure(m);

            const { group } = m.component;
            expect(m.get('#amount').value).toBe('1.234,5');
            expect(group.controls.amount.pristine).toBe(true);
            expect(group.pristine).toBe(true);
            expect(group.untouched).toBe(true);
        });

        it('keeps a group the application marked dirty', async () => {
            const m = await mount(ReconfigGroupComponent);
            const { group } = m.component;
            group.controls.amount.setValue(1234.5);
            await m.settle();
            group.markAsDirty();

            await reconfigure(m);

            expect(group.controls.amount.pristine).toBe(true);
            expect(group.dirty).toBe(true);
        });

        it('keeps a control the user blurred touched', async () => {
            const m = await mount(ReconfigGroupComponent);
            const { group } = m.component;
            group.controls.amount.setValue(1234.5);
            await m.settle();
            m.focus('#amount');
            await m.blur('#amount');
            expect(group.controls.amount.touched).toBe(true);

            await reconfigure(m);

            expect(m.get('#amount').value).toBe('1.234,5');
            expect(group.controls.amount.touched).toBe(true);
            expect(group.controls.amount.pristine).toBe(true);
            expect(group.touched).toBe(true);
        });

        it('keeps the group dirty while a sibling is dirty', async () => {
            const m = await mount(ReconfigGroupComponent);
            const { group } = m.component;
            group.controls.amount.setValue(1234.5);
            group.controls.note.markAsDirty();
            await m.settle();

            await reconfigure(m);

            expect(group.controls.amount.pristine).toBe(true);
            expect(group.dirty).toBe(true);
        });

        it('keeps the control dirty after the user typed in it', async () => {
            const m = await mount(ReconfigGroupComponent);
            await m.type('#amount', '1234.5');
            expect(m.component.group.controls.amount.dirty).toBe(true);

            await reconfigure(m);

            expect(m.get('#amount').value).toBe('1.234,5');
            expect(m.component.group.controls.amount.dirty).toBe(true);
            expect(m.component.group.dirty).toBe(true);
        });
    });
});

describe('Separator: changing the separators right after a leadZero write (real browser)', () => {
    it('keeps the written number in the display and in the model', async () => {
        const m = await mount(ReconfigGroupComponent);
        m.component.leadZero.set(true);
        await m.settle();
        const { amount } = m.component.group.controls;

        amount.setValue(1234.5);
        m.component.thousandSeparator.set('.');
        m.component.decimalMarker.set(',');
        await m.settle();

        expect(m.get('#amount').value).toBe('1.234,50');
        expect(amount.value).toBe('1234.50');
        expect(amount.pristine).toBe(true);
    });
});

describe('Separator: a leadZero write keeps the form state (real browser)', () => {
    const mountWithLeadZero = async () => {
        const m = await mount(ReconfigGroupComponent);
        m.component.leadZero.set(true);
        await m.settle();
        return m;
    };

    it('keeps the touched state the application sets right after the write', async () => {
        const m = await mountWithLeadZero();
        const { group } = m.component;

        group.patchValue({ amount: 5 });
        group.markAllAsTouched();
        await m.settle();

        expect(m.get('#amount').value).toBe('5.00');
        expect(group.controls.amount.touched).toBe(true);
        expect(group.controls.note.touched).toBe(true);
        expect(group.touched).toBe(true);
    });

    it('keeps the dirty state the application sets right after the write', async () => {
        const m = await mountWithLeadZero();
        const { group } = m.component;

        group.controls.amount.setValue(5);
        group.markAllAsDirty();
        await m.settle();

        expect(group.controls.amount.dirty).toBe(true);
        expect(group.controls.note.dirty).toBe(true);
        expect(group.dirty).toBe(true);
    });

    it('keeps a sibling the application marked dirty on its own', async () => {
        const m = await mountWithLeadZero();
        const { group } = m.component;
        group.controls.note.markAsDirty({ onlySelf: true });

        group.controls.amount.setValue(5);
        await m.settle();

        expect(m.get('#amount').value).toBe('5.00');
        expect(group.controls.note.dirty).toBe(true);
        expect(group.controls.amount.pristine).toBe(true);
        expect(group.pristine).toBe(true);
    });

    it('keeps a control the user blurred touched', async () => {
        const m = await mountWithLeadZero();
        const { group } = m.component;
        m.focus('#amount');
        await m.blur('#amount');
        expect(group.controls.amount.touched).toBe(true);

        group.controls.amount.setValue(5);
        await m.settle();

        expect(m.get('#amount').value).toBe('5.00');
        expect(group.controls.amount.touched).toBe(true);
        expect(group.controls.amount.pristine).toBe(true);
        expect(group.touched).toBe(true);
    });
});
