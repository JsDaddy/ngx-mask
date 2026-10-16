import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

describe('Directive: setValue called inside a valueChanges subscriber, #1691 (real browser)', () => {
    describe('programmatic writes', () => {
        it('shows the nested write on a fixed mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '0000' });
            let nested = false;
            m.component.form.valueChanges.subscribe((value) => {
                if (value === '1234' && !nested) {
                    nested = true;
                    m.component.form.setValue('99999');
                }
            });

            m.component.form.setValue('12345');
            await m.settle();

            expect(m.component.form.value).toBe('9999');
            expect(m.get('#masked').value).toBe('9999');
        });

        it('shows the innermost of two nested writes with showMaskTyped', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '00-00', showMaskTyped: true });
            m.component.form.valueChanges.subscribe((value) => {
                if (value === '8888') {
                    m.component.form.setValue('9999', { emitEvent: false });
                } else if (value !== '9999') {
                    m.component.form.setValue('8888');
                }
            });

            m.component.form.setValue('4321');
            await m.settle();

            expect(m.component.form.value).toBe('9999');
            expect(m.get('#masked').value).toBe('99-99');
        });

        it('clamps a separator.2 value written by a subscriber', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'separator.2' });
            m.component.form.valueChanges.subscribe((value) => {
                if (Number(value) > 100) {
                    m.component.form.setValue(100);
                }
            });

            m.component.form.setValue(500);
            await m.settle();

            expect(m.component.form.value).toBe(100);
            expect(m.get('#masked').value).toBe('100');
        });

        it('still renders a plain write after a nested one', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '0000' });
            let nested = false;
            const subscription = m.component.form.valueChanges.subscribe((value) => {
                if (value === '1234' && !nested) {
                    nested = true;
                    m.component.form.setValue('99999');
                }
            });
            m.component.form.setValue('12345');
            await m.settle();
            subscription.unsubscribe();

            m.component.form.setValue('5678');
            await m.settle();

            expect(m.get('#masked').value).toBe('5678');
            expect(m.component.form.value).toBe('5678');
        });
    });

    describe('while typing', () => {
        it('shows 100 when the user types 500 and a subscriber clamps to 100', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'separator.2' });
            m.component.form.valueChanges.subscribe((value) => {
                if (Number(value) > 100) {
                    m.component.form.setValue(100);
                }
            });

            await m.type('#masked', '500');

            expect(m.get('#masked').value).toBe('100');
            expect(m.component.form.value).toBe(100);
        });

        it('shows the value a subscriber writes on a fixed mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '0000' });
            let writing = false;
            m.component.form.valueChanges.subscribe(() => {
                if (!writing) {
                    writing = true;
                    m.component.form.setValue('9999');
                    writing = false;
                }
            });

            await m.type('#masked', '4321');

            expect(m.component.form.value).toBe('9999');
            expect(m.get('#masked').value).toBe('9999');
        });

        it('ends on the innermost of two nested writes with showMaskTyped', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '00-00', showMaskTyped: true });
            m.component.form.valueChanges.subscribe((value) => {
                if (value === '8888') {
                    m.component.form.setValue('9999', { emitEvent: false });
                } else if (value !== '9999') {
                    m.component.form.setValue('8888');
                }
            });

            await m.type('#masked', '4321');

            expect(m.component.form.value).toBe('9999');
            expect(m.get('#masked').value).toBe('99-99');
        });
    });

    describe('with leadZero on a separator mask', () => {
        it('runs the deferred normalisation of the latest write only', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'separator.2', leadZero: true });
            const emitted: unknown[] = [];
            m.component.form.valueChanges.subscribe((value) => {
                emitted.push(value);
                if (Number(value) > 100) {
                    m.component.form.setValue(100);
                }
            });

            m.component.form.setValue(500);
            await m.settle();

            expect(m.get('#masked').value).toBe('100.00');
            expect(m.component.form.value).toBe('100.00');
            expect(emitted).toEqual(['500.00', '100.00', '100.00', '100.00']);
        });

        it('keeps a user edit made before the deferred normalisation runs', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'separator.2', leadZero: true });

            m.component.form.setValue('10.2');
            // Let the write's own microtask land, as it always does before a user event; the
            // render that runs the deferred normalisation is still pending.
            await Promise.resolve();
            await m.setValue('#masked', '7');

            expect(m.get('#masked').value).toBe('7');
            // What typing 7 alone emits with leadZero.
            expect(m.component.form.value).toBe('7.00');
        });
    });
});
