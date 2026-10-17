import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import type { DemoExample, DemoModel } from './utils/demo-bindings-harness.component';
import { DemoBindingsHarnessComponent } from './utils/demo-bindings-harness.component';
import { typeTest } from './utils/test-functions.component';

/**
 * One directive instance reconfigured at runtime, as apps that rebind `[mask]` and related inputs
 * at runtime do: mount example `from`, switch every input to example `to`, then type. The result
 * must be the one a directive mounted with `to` gives; state derived from the previous
 * configuration must not leak into the new one.
 */
describe('Runtime reconfiguration: switching every input of a mounted mask', () => {
    const switchExample = async (
        from: DemoExample,
        to: DemoExample,
        initialValue: DemoModel = ''
    ): Promise<ComponentFixture<DemoBindingsHarnessComponent>> => {
        const fixture = TestBed.createComponent(DemoBindingsHarnessComponent);
        fixture.componentRef.setInput('ex', from);
        fixture.componentRef.setInput('initialValue', initialValue);
        await fixture.whenStable();
        fixture.componentRef.setInput('ex', to);
        await fixture.whenStable();
        return fixture;
    };
    const display = (fixture: ComponentFixture<DemoBindingsHarnessComponent>): string =>
        (fixture.nativeElement.querySelector('input') as HTMLInputElement).value;

    it('restores the special characters a separator mask dropped', async () => {
        const fixture = await switchExample({ _mask: 'separator.0' }, { _mask: '0000.M0.d0' });

        expect(typeTest('20231215', fixture)).toBe('2023.12.15');
        // the write under the separator mask made the model numeric (see 'emission type')
        expect(fixture.componentInstance.form.value).toBe(20231215);
    });

    it('restores the minus allowNegativeNumbers took out of the special characters', async () => {
        const fixture = await switchExample(
            { _mask: 'separator', _allowNegativeNumbers: true, _decimalMarker: '.' },
            { _mask: '000-000' }
        );

        expect(typeTest('123456', fixture)).toBe('123-456');
        expect(fixture.componentInstance.form.value).toBe(123456);
    });

    it('restores the decimal marker a dot thousandSeparator forced', async () => {
        const fixture = await switchExample(
            { _mask: 'separator.2', _thousandSeparator: '.' },
            { _mask: 'separator.2' }
        );

        expect(typeTest('1234.56', fixture)).toBe('1 234.56');
        expect(fixture.componentInstance.form.value).toBe(1234.56);
    });

    it('emits the first edit after a switch that rendered an empty showMaskTyped skeleton', async () => {
        const fixture = await switchExample(
            { _mask: 'separator.2', _thousandSeparator: '.' },
            { _mask: '000-000-000', _showMaskTyped: true }
        );

        expect(typeTest('1', fixture)).toBe('1__-___-___');
        expect(fixture.componentInstance.form.value).toBe(1);
    });

    /**
     * The emission type is decided by the last programmatic write: a number write, or any write
     * under a separator mask, emits numbers; a non-empty string write emits strings. A runtime mask
     * change does not change it.
     */
    describe('emission type: a runtime mask change keeps it, the last write decides', () => {
        it('separator.0 -> plain digits: still a number', async () => {
            const fixture = await switchExample({ _mask: 'separator.0' }, { _mask: '0000' });

            expect(typeTest('1234', fixture)).toBe('1234');
            expect(fixture.componentInstance.form.value).toBe(1234);
        });

        it('plain digits -> separator.0: still a string', async () => {
            const fixture = await switchExample({ _mask: '0000' }, { _mask: 'separator.0' });

            expect(typeTest('1234', fixture)).toBe('1 234');
            expect(fixture.componentInstance.form.value).toBe('1234');
        });

        it('separator.2 with a number model -> percent: still a number', async () => {
            const fixture = await switchExample({ _mask: 'separator.2' }, { _mask: 'percent' }, 12);

            expect(typeTest('12', fixture)).toBe('12');
            expect(fixture.componentInstance.form.value).toBe(12);
        });

        it('plain digits with a number model -> separator.0 -> plain digits: still a number', async () => {
            const fixture = await switchExample({ _mask: '0000' }, { _mask: 'separator.0' }, 1234);
            fixture.componentRef.setInput('ex', { _mask: '0000' });
            await fixture.whenStable();

            expect(typeTest('12', fixture)).toBe('12');
            expect(fixture.componentInstance.form.value).toBe(12);
        });

        it('separator.2 with a number model -> no mask -> separator.2: still a number', async () => {
            const fixture = await switchExample({ _mask: 'separator.2' }, { _mask: '' }, 1234.5);
            // no mask shows the raw value: the decimal point is part of it, not a special
            // character of the separator mask it was produced by
            expect(display(fixture)).toBe('1234.5');
            expect(fixture.componentInstance.form.value).toBe(1234.5);

            fixture.componentRef.setInput('ex', { _mask: 'separator.2' });
            await fixture.whenStable();

            expect(typeTest('77', fixture)).toBe('77');
            expect(fixture.componentInstance.form.value).toBe(77);
        });

        it('no mask -> separator.0: still a string', async () => {
            const fixture = await switchExample({}, { _mask: 'separator.0' });

            expect(typeTest('1234', fixture)).toBe('1 234');
            expect(fixture.componentInstance.form.value).toBe('1234');
        });
    });
});
