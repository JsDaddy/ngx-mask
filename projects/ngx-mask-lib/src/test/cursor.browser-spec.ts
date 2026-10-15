import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

describe('Test Date Hh:m0', () => {
    it('Test value Hh:m0', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'Hh:m0' });

        await m.type('#masked', '2020');
        await expect.poll(() => m.get('#masked').value).toBe('20:20');
        await m.clear('#masked');
        await m.type('#masked', '77');
        await expect.poll(() => m.get('#masked').value).toBe('7:7');
        await m.clear('#masked');
        await m.type('#masked', '777');
        await expect.poll(() => m.get('#masked').value).toBe('7:7');
        await m.clear('#masked');
        await m.type('#masked', '1212');
        await expect.poll(() => m.get('#masked').value).toBe('12:12');
        await m.clear('#masked');
    });
    it('Mask Hh:m0 check cursor', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'Hh:m0' });
        await m.type('#masked', '77');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
        await m.clear('#masked');
        await m.type('#masked', '117');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(4);
    });

    it('Mask Hh:m0:s0 check cursor', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'Hh:m0:s0' });
        await m.type('#masked', '77');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
        await m.clear('#masked');
        await m.type('#masked', '1177');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(6);
    });

    it('Mask d0/m0/0000 check cursor', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'd0/m0/0000' });
        await m.type('#masked', '77');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
        await expect.poll(() => m.get('#masked').value).toBe('7/7');
        await m.clear('#masked');
        await m.type('#masked', '777');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
        await expect.poll(() => m.get('#masked').value).toBe('7/7/7');
        await m.clear('#masked');
        await m.type('#masked', '1177');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(6);
        await expect.poll(() => m.get('#masked').value).toBe('11/7/7');
    });

    it('Mask M0/d0/0000 check cursor', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'M0/d0/0000' });
        await m.type('#masked', '88');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
        await expect.poll(() => m.get('#masked').value).toBe('8/8');
        await m.clear('#masked');
        await m.type('#masked', '777');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
        await expect.poll(() => m.get('#masked').value).toBe('7/7/7');
        await m.clear('#masked');
        await m.type('#masked', '1177');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(6);
        await expect.poll(() => m.get('#masked').value).toBe('11/7/7');
    });

    it('Mask 0000/M0/d0 check cursor', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '0000/M0/d0' });
        await m.type('#masked', '999999');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(8);
        await m.clear('#masked');
        await m.type('#masked', '3377118');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(9);
    });

    it('Mask Hh:m0:s0 check cursor', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'Hh:m0:s0' });
        await m.type('#masked', '910');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(4);
        await expect.poll(() => m.get('#masked').value).toBe('9:10');
        await m.clear('#masked');
        await m.type('#masked', '91031');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(7);
        await expect.poll(() => m.get('#masked').value).toBe('9:10:31');
    });

    it('Mask (00) 90000-0000 check cursor and value', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '(00) 00009-0000' });
        await m.type('#masked', '910');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(6);
        await expect.poll(() => m.get('#masked').value).toBe('(91) 0');
        await m.type('#masked', '2');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(7);
        await expect.poll(() => m.get('#masked').value).toBe('(91) 02');
        await m.type('#masked', '2');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(8);
        await expect.poll(() => m.get('#masked').value).toBe('(91) 022');
        await m.type('#masked', '3');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(9);
        await expect.poll(() => m.get('#masked').value).toBe('(91) 0223');
        await m.type('#masked', '2');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(10);
        await expect.poll(() => m.get('#masked').value).toBe('(91) 02232');
        await m.type('#masked', '5');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(12);
        await expect.poll(() => m.get('#masked').value).toBe('(91) 02232-5');
        await m.type('#masked', '5');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(13);
        await expect.poll(() => m.get('#masked').value).toBe('(91) 02232-55');
        await m.type('#masked', '5');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(14);
        await expect.poll(() => m.get('#masked').value).toBe('(91) 02232-555');
        await m.type('#masked', '2');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(15);
        await expect.poll(() => m.get('#masked').value).toBe('(91) 02232-5552');
    });

    it('Mask 099.09 check cursor and value', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '099.09' });
        await m.type('#masked', '910');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
        await expect.poll(() => m.get('#masked').value).toBe('910');
        await m.type('#masked', '2');
        await expect.poll(() => m.get('#masked').value).toBe('910.2');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
        await m.type('#masked', '3');
        await expect.poll(() => m.get('#masked').value).toBe('910.23');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(6);
        await m.clear('#masked');
    });

    it('Mask d0/M0/0000 should set cursor on right position', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'd0/M0/0000', leadZeroDateTime: true });
        await m.type('#masked', '33');
        await expect.poll(() => m.get('#masked').value).toBe('03/03');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
    });

    it('Mask d0/M0/0000 should set cursor on right position', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'd0/M0/0000', leadZeroDateTime: true });

        await m.type('#masked', '913');
        await expect.poll(() => m.get('#masked').value).toBe('09/01/3');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(7);
    });

    it('Mask M0/00 should set cursor on right position (#1488 issue repro)', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'M0/00',
            leadZeroDateTime: true,
            showMaskTyped: true,
        });
        await m.type('#masked', '3');
        await expect.poll(() => m.get('#masked').value).toBe('03/__');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
    });

    it('Mask Hh:m0 should set cursor on right position with showMaskTyped (#1488)', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'Hh:m0',
            leadZeroDateTime: true,
            showMaskTyped: true,
        });
        await m.type('#masked', '77');
        await expect.poll(() => m.get('#masked').value).toBe('07:07');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
    });

    it('Mask should work with showMaskTyped 000/00000 with prefix', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '000/00000',
            prefix: '+38 ',
            showMaskTyped: true,
        });

        await m.type('#masked', '123');
        await expect.poll(() => m.get('#masked').value).toBe('+38 123/_____');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(7);
    });

    it('Mask should work with showMaskTyped 000/00000', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '000/00000', showMaskTyped: false });

        await m.type('#masked', '123');
        await expect.poll(() => m.get('#masked').value).toBe('123');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
    });
});

describe('Test caret with prefix + leadZero separator mask (#1572)', () => {
    it('typing a bare decimal marker should keep the caret after the marker', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            prefix: '$',
            leadZero: true,
            decimalMarker: '.',
        });

        // The bare marker is not a number: the model gets null and actualValue is
        // reset, which used to clamp the caret BEFORE the decimal ('$|.').
        await m.type('#masked', '.');
        await expect.poll(() => m.get('#masked').value).toBe('$.');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(2);
    });

    it('typing digits then the decimal marker should keep the caret after the marker', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            prefix: '$',
            leadZero: true,
            decimalMarker: '.',
        });

        await m.type('#masked', '3.');
        await expect.poll(() => m.get('#masked').value).toBe('$3.');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
    });
});
