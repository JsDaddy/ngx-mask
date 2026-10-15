import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

describe('Test Date Hh:m0', () => {
    it('dynamic mask after backspace should have right cursor position (000) 000-0000||+000000000000000', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '(000) 000-0000||+000000000000000' });

        await m.type('#masked', '11111111111');
        await expect.poll(() => m.get('#masked').value).toBe('+11111111111');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('(111) 111-1111');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(14);
    });

    it('dynamic mask after backspace should have right cursor position', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '(000) 000-0000||+000000000000000' });

        await m.type('#masked', '1234567890');
        await expect.poll(() => m.get('#masked').value).toBe('(123) 456-7890');
        await m.type('#masked', '{ArrowLeft}'.repeat(7));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
    });

    it('dynamic mask after backspace should have right cursor position (00) 00000000||+00 (00) 00000000', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '(00) 00000000||+00 (00) 00000000' });

        await m.type('#masked', '111');
        await expect.poll(() => m.get('#masked').value).toBe('(11) 1');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(4);
    });

    it('dynamic mask after backspace should have right cursor position 00) 000-00-00||00) 000-00-00; 0 (000) 000-00-00', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '00) 000-00-00||00) 000-00-00; 0 (000) 000-00-00',
            showMaskTyped: true,
            dropSpecialCharacters: false,
            prefix: '8 (0',
            specialCharacters: ['(', ')', '-', ';', '.', ' '],
        });

        await m.type('#masked', '123456789 11');
        await expect
            .poll(() => m.get('#masked').value)
            .toBe('8 (012) 345-67-89; 1 (1__) ___-__-__');
        await m.type('#masked', '{ArrowLeft}'.repeat(6));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(16);
        await expect
            .poll(() => m.get('#masked').value)
            .toBe('8 (012) 345-67-81; 1 (___) ___-__-__');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(17);
        await expect.poll(() => m.get('#masked').value).toBe('8 (012) 345-67-11');
    });
});
