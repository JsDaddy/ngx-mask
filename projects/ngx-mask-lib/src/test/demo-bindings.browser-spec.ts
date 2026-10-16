import { mount } from './utils/browser-harness';
import { userEvent } from 'vitest/browser';
import { DemoBindingsHarnessComponent } from './utils/demo-bindings-harness.component';

describe('Demo bindings: every option the demo binds, in a real browser', () => {
    describe('Valid date start with years (0000.M0.d0)', () => {
        const ex = { _mask: '0000.M0.d0' };

        it('types 20231215 key by key', async () => {
            const m = await mount(DemoBindingsHarnessComponent, { ex });
            await m.type('#masked', '20231215');
            await expect.poll(() => m.get('#masked').value).toBe('2023.12.15');
            expect(m.component.form.value).toBe('20231215');
        });

        // One `insertText` input event carrying the whole string (autofill, a drop, the Browser
        // pane's insertText): it was processed like a keystroke, and the month window read from
        // the mask cursor, which runs behind a bare digit string by the emitted separator
        // ('20231215' -> '2023.1.21').
        it('takes 20231215 inserted in one go', async () => {
            const m = await mount(DemoBindingsHarnessComponent, { ex });
            await userEvent.fill(m.get('#masked'), '20231215');
            await m.settle();
            await expect.poll(() => m.get('#masked').value).toBe('2023.12.15');
            expect(m.component.form.value).toBe('20231215');
        });
    });
});
