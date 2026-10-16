import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

// Turning showMaskTyped on while the field is focused re-clicks it once the mask skeleton is
// written, which parks the caret on the first editable slot (or after the typed digits).
describe('Directive: Mask (showMaskTyped switched on while focused)', () => {
    it('puts the caret after the typed digits of (000) 000-0000', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '(000) 000-0000' });
        await m.type('#masked', '12');

        m.fixture.componentRef.setInput('showMaskTyped', true);
        await m.settle();

        await expect.poll(() => m.get('#masked').value).toBe('(12_) ___-____');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
    });

    it('puts the caret behind the prefix of an empty 000-000', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '000-000', prefix: '+7 ' });
        m.focus('#masked');

        m.fixture.componentRef.setInput('showMaskTyped', true);
        await m.settle();

        await expect.poll(() => m.get('#masked').value).toBe('+7 ___-___');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
    });

    it('puts the caret on the first slot of an empty (000) 000-0000', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '(000) 000-0000' });
        m.focus('#masked');

        m.fixture.componentRef.setInput('showMaskTyped', true);
        await m.settle();

        await expect.poll(() => m.get('#masked').value).toBe('(___) ___-____');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(1);
    });
});
