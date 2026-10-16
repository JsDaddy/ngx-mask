import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

describe('Directive: Mask (Delete)', () => {
    it('cursor should correct delete with ViewEncapsulation.ShadowDom showMaskTyped=true', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '(000) 000-0000' });

        await m.type('#masked', '1231231234');
        m.focus('#masked');
        await m.type('#masked', '{Backspace}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('(123) 123-12');
    });

    it('should delete character in input', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '00/00/0000' });

        await m.type('#masked', '12/34/5678');
        m.focus('#masked');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('12/34/567');
    });

    it('should not delete special mask character', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '00/00/0000' });

        await m.type('#masked', '12/34/5678');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('12/34/567');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(9);
    });

    it('should delete secure character', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'XXX/X0/0000', hiddenInput: true });

        await m.type('#masked', '123/45/6789');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('***/*5/678');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(10);
    });

    it('should delete selection', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '000 000 000' });

        await m.type('#masked', '123456789');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('123 456 78');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(10);
    });
    it('should delete prefix', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '000 000 000', prefix: '+7' });

        await m.type('#masked', '1');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('');
    });
    it('should delete suffix', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '000 000 000', suffix: '$' });

        await m.type('#masked', '1');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('');
    });

    it('should delete specialCharacter from allow few mask', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '(00) 00000000||+00 (00) 00000000' });

        await m.type('#masked', '123');
        await expect.poll(() => m.get('#masked').value).toBe('(12) 3');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(4);
        await expect.poll(() => m.get('#masked').value).toBe('(12) ');
        await m.type('#masked', '{ArrowRight}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
    });

    it('should return value from ctrl+V', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '9999999999999' });

        await m.type('#masked', '15');
        await expect.poll(() => m.get('#masked').value).toBe('15');
        m.selectAll('#masked');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('');
        await m.setValue('#masked', '15');
        await expect.poll(() => m.text('#pre1')).toBe('15');
    });

    it('should not delete special character from backspace', async () => {
        const patterns = {
            '0': { pattern: /\d/ },
            '9': { pattern: /\d/, optional: true },
            A: { pattern: /[a-zA-Z0-9]/ },
            L: { pattern: /[a-z]/ },
            S: { pattern: /[a-zA-Z]/ },
            U: { pattern: /[A-Z]/ },
            X: { pattern: /\d/, symbol: '*' },
            d: { pattern: /\d/ },
            h: { pattern: /\d/ },
            s: { pattern: /\d/ },
            D: { pattern: /D/ }, // custom: The D on the mask can only be the D character
            H: { pattern: /H/ }, // custom: the H on the mask can only be the H character
            M: { pattern: /M/ }, // custom: the M on the mask can only be the M character
            '\\S': { pattern: /\S/ }, // custom: the S on the mask can only be the S character. Escape it to prevent digits from being removed from the value
        };
        const specialCharacters = [
            '-',
            '/',
            '(',
            ')',
            '.',
            ':',
            ' ',
            '+',
            ',',
            '@',
            '[',
            ']',
            '"',
            "'",
            'D',
            'H',
            'M',
            '\\S',
        ];
        const m = await mount(MaskHarnessComponent, {
            mask: '00D : 00H : 00M : 00S',
            shownMaskExpression: '00D : 00H : 00M : 00S',
            showMaskTyped: true,
            dropSpecialCharacters: false,
            leadZeroDateTime: true,
            placeHolderCharacter: '',
            patterns: patterns,
            specialCharacters: specialCharacters,
        });
        await m.type('#masked', '12345678');
        await expect.poll(() => m.get('#masked').value).toBe('12D : 34H : 56M : 78S');
        await m.type('#masked', '{ArrowRight}'.repeat(1));
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('12D : 34H : 56M : 78S');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('12D : 34H : 56M : 78S');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('12D : 34H : 56M : 78S');
    });

    it('should backspace with showMaskTyped and prefix', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '(000) 000-0000',
            prefix: '+7 ',
            showMaskTyped: true,
        });

        await m.type('#masked', '1234567890');
        await expect.poll(() => m.get('#masked').value).toBe('+7 (123) 456-7890');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(16);
        await expect.poll(() => m.get('#masked').value).toBe('+7 (123) 456-789_');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(15);
        await expect.poll(() => m.get('#masked').value).toBe('+7 (123) 456-78__');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(14);
        await expect.poll(() => m.get('#masked').value).toBe('+7 (123) 456-7___');
        await m.type('#masked', '{Backspace}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(12);
        await expect.poll(() => m.get('#masked').value).toBe('+7 (123) 456-____');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(11);
        await expect.poll(() => m.get('#masked').value).toBe('+7 (123) 45_-____');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(10);
        await expect.poll(() => m.get('#masked').value).toBe('+7 (123) 4__-____');
        await m.type('#masked', '{Backspace}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(7);
        await expect.poll(() => m.get('#masked').value).toBe('+7 (123) ___-____');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(6);
        await expect.poll(() => m.get('#masked').value).toBe('+7 (12_) ___-____');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
        await expect.poll(() => m.get('#masked').value).toBe('+7 (1__) ___-____');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
        await expect.poll(() => m.get('#masked').value).toBe('+7 (___) ___-____');
    });

    it('should backspace with showMaskTyped and prefix', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '00 000 00 00',
            prefix: '+32 ',
            showMaskTyped: true,
        });

        await m.type('#masked', '1234567890');
        await expect.poll(() => m.get('#masked').value).toBe('+32 12 345 67 89');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(15);
        await expect.poll(() => m.get('#masked').value).toBe('+32 12 345 67 8_');
        await m.type('#masked', '{Backspace}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(13);
        await expect.poll(() => m.get('#masked').value).toBe('+32 12 345 67 __');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(12);
        await expect.poll(() => m.get('#masked').value).toBe('+32 12 345 6_ __');
        await m.type('#masked', '{Backspace}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(10);
        await expect.poll(() => m.get('#masked').value).toBe('+32 12 345 __ __');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(9);
        await expect.poll(() => m.get('#masked').value).toBe('+32 12 34_ __ __');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(8);
        await expect.poll(() => m.get('#masked').value).toBe('+32 12 3__ __ __');
        await m.type('#masked', '{Backspace}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(6);
        await expect.poll(() => m.get('#masked').value).toBe('+32 12 ___ __ __');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
        await expect.poll(() => m.get('#masked').value).toBe('+32 1_ ___ __ __');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(4);
        await expect.poll(() => m.get('#masked').value).toBe('+32 __ ___ __ __');
    });

    it('should backspace with showMaskTyped and leadZeroDateTime', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'M0-d0-0000',
            leadZeroDateTime: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '12310000');
        await expect.poll(() => m.get('#masked').value).toBe('12-31-0000');
        await m.type('#masked', '{Backspace}'.repeat(10));
        await expect.poll(() => m.get('#masked').value).toBe('__-__-____');
    });

    it('should backspace with showMaskTyped and leadZeroDateTime', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'M0/d0/0000',
            leadZeroDateTime: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '12310000');
        await expect.poll(() => m.get('#masked').value).toBe('12/31/0000');
        await m.type('#masked', '{Backspace}'.repeat(10));
        await expect.poll(() => m.get('#masked').value).toBe('__/__/____');
    });

    it('should backspace with showMaskTyped and leadZeroDateTime', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'M0:d0:0000',
            leadZeroDateTime: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '12310000');
        await expect.poll(() => m.get('#masked').value).toBe('12:31:0000');
        await m.type('#masked', '{Backspace}'.repeat(10));
        await expect.poll(() => m.get('#masked').value).toBe('__:__:____');
    });

    it('should backspace with mask Hh:m0', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'Hh:m0', showMaskTyped: true });

        await m.type('#masked', '1234');
        await expect.poll(() => m.get('#masked').value).toBe('12:34');
        await m.type('#masked', '{Backspace}'.repeat(5));
        await expect.poll(() => m.get('#masked').value).toBe('__:__');
    });

    it('should backspace with mask Hh:m0 and leadZeroDateTime', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'Hh:m0',
            showMaskTyped: true,
            leadZeroDateTime: true,
        });

        await m.type('#masked', '344');
        await expect.poll(() => m.get('#masked').value).toBe('03:44');
        await m.type('#masked', '{Backspace}'.repeat(5));
        await expect.poll(() => m.get('#masked').value).toBe('__:__');
    });

    it('separator with suffix should replace cursor in right place with thousandSeparator ,', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            suffix: ' EUR',
            thousandSeparator: ',',
        });

        await m.type('#masked', '123000');
        await expect.poll(() => m.get('#masked').value).toBe('123,000 EUR');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
    });

    it('separator with suffix should replace cursor in right place with thousandSeparator .', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            suffix: ' EUR',
            thousandSeparator: '.',
        });

        await m.type('#masked', '123000');
        await expect.poll(() => m.get('#masked').value).toBe('123.000 EUR');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
    });
});
