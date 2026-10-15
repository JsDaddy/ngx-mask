import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

describe('Directive: Mask (paste)', () => {
    it('should strip spaces when pasting into mask with 0 (required digit)', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '00000000000000' });

        await m.setValue('#masked', '123 456 789 123 45');
        await expect.poll(() => m.get('#masked').value).toBe('12345678912345');
    });

    it('should strip spaces when pasting into mask with 9 (optional digit)', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '99999999999999' });

        await m.setValue('#masked', '123 456 789 123 45');
        await expect.poll(() => m.get('#masked').value).toBe('12345678912345');
    });

    it('should handle paste with spaces in mixed mask 00-00-00', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '00-00-00' });

        await m.setValue('#masked', '12 34 56');
        await expect.poll(() => m.get('#masked').value).toBe('12-34-56');
    });

    it('should handle paste with spaces in mixed mask 99-99-99', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '99-99-99' });

        await m.setValue('#masked', '12 34 56');
        await expect.poll(() => m.get('#masked').value).toBe('12-34-56');
    });

    it('should handle paste with leading spaces', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '00000000000000' });

        await m.setValue('#masked', '  123456789');
        await expect.poll(() => m.get('#masked').value).toBe('123456789');
    });

    it('should handle paste with trailing spaces', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '00000000000000' });

        await m.setValue('#masked', '123456789  ');
        await expect.poll(() => m.get('#masked').value).toBe('123456789');
    });

    it('should handle paste with multiple consecutive spaces', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '00000000000000' });

        await m.setValue('#masked', '123   456   789');
        await expect.poll(() => m.get('#masked').value).toBe('123456789');
    });

    it('should handle paste with multiple consecutive spaces for optional mask', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '99999999999999' });

        await m.setValue('#masked', '123   456   789');
        await expect.poll(() => m.get('#masked').value).toBe('123456789');
    });
});
