import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

describe('Directive: Mask (Delete)', () => {
    it('should place cursor in right place mask (000) 000-0000', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '(000) 000-0000',
            showMaskTyped: true,
        });

        await m.click('#masked');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(1);
    });

    it('should place cursor in right place mask ((000)) 000-0000', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '((000)) 000-0000',
            showMaskTyped: true,
        });

        await m.click('#masked');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(2);
    });

    it('should place cursor in right place mask 000 000-0000', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '000 000-0000', showMaskTyped: true });

        await m.click('#masked');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(0);
    });

    it('should place cursor in right place mask (000) 000-0000', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '(000) 000-0000',
            showMaskTyped: true,
            prefix: '+380 ',
        });

        await m.click('#masked');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(6);
    });
});
