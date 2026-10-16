import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import type { DemoExample } from './utils/demo-bindings-harness.component';
import { DemoBindingsHarnessComponent } from './utils/demo-bindings-harness.component';
import { typeTest } from './utils/test-functions.component';

/**
 * One directive instance reconfigured at runtime, as the demo does when a sidebar group switch
 * reuses a card (`@for ... track $index`): mount example `from`, switch every input to example
 * `to`, then type. The result must be the one a directive mounted with `to` gives; state derived
 * from the previous configuration must not leak into the new one.
 */
describe('Runtime reconfiguration: switching every input of a mounted mask', () => {
    const switchExample = async (
        from: DemoExample,
        to: DemoExample
    ): Promise<ComponentFixture<DemoBindingsHarnessComponent>> => {
        const fixture = TestBed.createComponent(DemoBindingsHarnessComponent);
        fixture.componentRef.setInput('ex', from);
        await fixture.whenStable();
        fixture.componentRef.setInput('ex', to);
        await fixture.whenStable();
        return fixture;
    };

    it('restores the special characters a separator mask dropped', async () => {
        const fixture = await switchExample({ _mask: 'separator.0' }, { _mask: '0000.M0.d0' });

        expect(typeTest('20231215', fixture)).toBe('2023.12.15');
        expect(fixture.componentInstance.form.value).toBe('20231215');
    });

    it('restores the minus allowNegativeNumbers took out of the special characters', async () => {
        const fixture = await switchExample(
            { _mask: 'separator', _allowNegativeNumbers: true, _decimalMarker: '.' },
            { _mask: '000-000' }
        );

        expect(typeTest('123456', fixture)).toBe('123-456');
        expect(fixture.componentInstance.form.value).toBe('123456');
    });

    it('restores the decimal marker a dot thousandSeparator forced', async () => {
        const fixture = await switchExample(
            { _mask: 'separator.2', _thousandSeparator: '.' },
            { _mask: 'separator.2' }
        );

        expect(typeTest('1234.56', fixture)).toBe('1 234.56');
        expect(fixture.componentInstance.form.value).toBe(1234.56);
    });

    it('emits a string once the mask leaves the separator family', async () => {
        const fixture = await switchExample({ _mask: 'separator.0' }, { _mask: '0000' });

        expect(typeTest('1234', fixture)).toBe('1234');
        expect(fixture.componentInstance.form.value).toBe('1234');
    });

    it('emits a number once the mask enters the separator family', async () => {
        const fixture = await switchExample({ _mask: '0000' }, { _mask: 'separator.0' });

        expect(typeTest('1234', fixture)).toBe('1 234');
        expect(fixture.componentInstance.form.value).toBe(1234);
    });

    it('emits the first edit after a switch that rendered an empty showMaskTyped skeleton', async () => {
        const fixture = await switchExample(
            { _mask: 'separator.2', _thousandSeparator: '.' },
            { _mask: '000-000-000', _showMaskTyped: true }
        );

        expect(typeTest('1', fixture)).toBe('1__-___-___');
        expect(fixture.componentInstance.form.value).toBe('1');
    });
});
