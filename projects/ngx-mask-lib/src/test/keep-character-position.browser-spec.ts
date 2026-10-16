import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

describe('Directive: Mask (Delete)', () => {
    it('should replace character to _ mask: (000) 000-0000', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '(000) 000-0000',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        // Note: before the #1544/#1489 fix the digit typed at the adjacent ") " special
        // characters was silently dropped, so this test used to expect '(012) 45_-_890'
        // (the '3' was eaten and the 11th digit slid in). Now all ten digits are kept and
        // the 11th one is rejected, so the same backspaces blank different slots.
        await m.type('#masked', '01234567890');
        await expect.poll(() => m.get('#masked').value).toBe('(012) 345-6789');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}'.repeat(3));
        await expect.poll(() => m.get('#masked').value).toBe('(012) 34_-_789');
    });

    it('should replace character to _ mask: S0S S0S', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'S0S AAA',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '2');
        await expect.poll(() => m.get('#masked').value).toBe('___ ___');
        await m.type('#masked', 'A0AB1B');
        await expect.poll(() => m.get('#masked').value).toBe('A0A B1B');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}'.repeat(4));
        await expect.poll(() => m.get('#masked').value).toBe('___ B1B');
    });

    it('should replace character to _ mask: 000-000.00', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '000-000.00',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '12345678');
        await expect.poll(() => m.get('#masked').value).toBe('123-456.78');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}'.repeat(3));
        await expect.poll(() => m.get('#masked').value).toBe('123-___.78');
    });

    it('should replace character to _ mask: 0000 0000 0000 0000', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '0000 0000 0000 0000',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '1234 5678 1234 5678');
        await expect.poll(() => m.get('#masked').value).toBe('1234 5678 1234 5678');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}'.repeat(4));
        await expect.poll(() => m.get('#masked').value).toBe('1234 5678 ____ 5678');
        await m.type('#masked', '{ArrowLeft}'.repeat(1));
        await m.type('#masked', '{Backspace}'.repeat(4));
        await expect.poll(() => m.get('#masked').value).toBe('1234 ____ ____ 5678');
    });

    it('should replace character to _ mask: 00/00/0000', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '00/00/0000',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '12345678');
        await expect.poll(() => m.get('#masked').value).toBe('12/34/5678');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}'.repeat(4));
        await expect.poll(() => m.get('#masked').value).toBe('1_/__/5678');
    });

    it('should replace character to _ mask: (000)000-0000, prefix +38', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '(000)000-0000',
            keepCharacterPositions: true,
            showMaskTyped: true,
            prefix: '+38 ',
        });

        await m.type('#masked', '063 12345678');
        await expect.poll(() => m.get('#masked').value).toBe('+38 (063)123-4567');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}'.repeat(5));
        await expect.poll(() => m.get('#masked').value).toBe('+38 (06_)___-4567');
    });

    it('should replace character to _ mask: 0 000, prefix $', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '0 000',
            keepCharacterPositions: true,
            showMaskTyped: true,
            prefix: '$ ',
        });

        await m.type('#masked', '1234');
        await expect.poll(() => m.get('#masked').value).toBe('$ 1 234');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}'.repeat(2));
        await expect.poll(() => m.get('#masked').value).toBe('$ _ 234');
    });

    it('should replace character to _ mask: 0000, prefix foo/', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '0000',
            keepCharacterPositions: true,
            showMaskTyped: true,
            prefix: 'foo/',
        });

        await m.type('#masked', '1234');
        await expect.poll(() => m.get('#masked').value).toBe('foo/1234');
        await m.type('#masked', '{Backspace}'.repeat(3));
        await expect.poll(() => m.get('#masked').value).toBe('foo/1___');
    });

    it('should replace character to _ mask: AAA-AAA-AAA', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'AAA-AAA-AAA',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', 'TESTING12');
        await expect.poll(() => m.get('#masked').value).toBe('TES-TIN-G12');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}'.repeat(2));
        await expect.poll(() => m.get('#masked').value).toBe('TES-__N-G12');
    });

    it('should replace character to _ mask: 0 000 suffix $', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '0 000',
            keepCharacterPositions: true,
            showMaskTyped: true,
            suffix: ' $',
        });

        await m.type('#masked', '1234');
        await expect.poll(() => m.get('#masked').value).toBe('1 234 $');
        await m.type('#masked', '{ArrowLeft}'.repeat(1));
        await m.type('#masked', '{Backspace}'.repeat(2));
        await expect.poll(() => m.get('#masked').value).toBe('1 __4 $');
    });

    it('should replace character to _ mask: 00/00/000 suffix test', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '00/00/000',
            keepCharacterPositions: true,
            showMaskTyped: true,
            suffix: ' test',
        });

        await m.type('#masked', '1234567');
        await expect.poll(() => m.get('#masked').value).toBe('12/34/567 test');
        await m.type('#masked', '{ArrowLeft}'.repeat(4));
        await m.type('#masked', '{Backspace}'.repeat(2));
        await expect.poll(() => m.get('#masked').value).toBe('12/__/567 test');
    });

    it('should delete character from del', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '000-000-000',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '123456789');
        await m.type('#masked', '{ArrowLeft}'.repeat(11));
        await m.type('#masked', '{Delete}'.repeat(11));
        await expect.poll(() => m.get('#masked').value).toBe('___-___-___');

        await m.clear('#masked');
        await m.type('#masked', '123456789');
        await m.type('#masked', '{ArrowLeft}'.repeat(4));
        await m.type('#masked', '{Delete}');
        await expect.poll(() => m.get('#masked').value).toBe('123-456-789');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(8);
    });

    it('should delete character from del', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '0000 0000 0000 0000',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '1234567891011121');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Delete}');
        await expect.poll(() => m.get('#masked').value).toBe('1234 5678 9101 1121');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(15);
    });

    // #1545 keepCharacterPositions must work without showMaskTyped
    it('should keep position on middle deletion without showMaskTyped mask: M0/d0/0000', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'M0/d0/0000',
            keepCharacterPositions: true,
        });

        await m.type('#masked', '12142020');
        await expect.poll(() => m.get('#masked').value).toBe('12/14/2020');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('12/1_/2020');
        await m.type('#masked', '4');
        await expect.poll(() => m.get('#masked').value).toBe('12/14/2020');
    });

    // #1543 leadZeroDateTime + keepCharacterPositions: re-typing into the gap must not shift
    it('should restore deleted month digit with leadZeroDateTime mask: M0-d0-0000', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'M0-d0-0000',
            keepCharacterPositions: true,
            leadZeroDateTime: true,
        });

        await m.type('#masked', '5052025');
        await expect.poll(() => m.get('#masked').value).toBe('05-05-2025');
        await m.type('#masked', '{ArrowLeft}'.repeat(8));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0_-05-2025');
        await m.type('#masked', '5');
        await expect.poll(() => m.get('#masked').value).toBe('05-05-2025');
    });

    // #1544 / #1489 (adjacent special characters): 4th digit must not be dropped
    it('should not drop digit typed before adjacent special characters mask: (999) 999-9999', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '(999) 999-9999',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '1234');
        await expect.poll(() => m.get('#masked').value).toBe('(123) 4__-____');
        await m.type('#masked', '567890123');
        await expect.poll(() => m.get('#masked').value).toBe('(123) 456-7890');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(14);
    });

    // #1527 selection replacement must keep the mask layout
    it('should keep layout when replacing a selected segment mask: 000-000-000', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '000-000-000',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '111222333');
        await expect.poll(() => m.get('#masked').value).toBe('111-222-333');
        m.select('#masked', 4, 7);
        await m.type('#masked', '4');
        await expect.poll(() => m.get('#masked').value).toBe('111-4__-333');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
    });

    // #1527 (comment) selection + DEL must blank the segment, not corrupt the layout
    it('should blank selected segment on del mask: 000-000-000', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '000-000-000',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '111222333');
        await expect.poll(() => m.get('#masked').value).toBe('111-222-333');
        m.select('#masked', 4, 7);
        await m.type('#masked', '{Delete}');
        await expect.poll(() => m.get('#masked').value).toBe('111-___-333');
    });

    // #1632 retype into a backspace-cleared slot must fill from the first typed digit
    it('should replace only month when editing month part with backspace', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'd0/M0/0000',
            keepCharacterPositions: true,
            showMaskTyped: true,
            dropSpecialCharacters: false,
        });

        await m.type('#masked', '05062025');
        await expect.poll(() => m.get('#masked').value).toBe('05/06/2025');
        m.select('#masked', 5, 5);
        await m.type('#masked', '{Backspace}{Backspace}12');
        await expect.poll(() => m.get('#masked').value).toBe('05/12/2025');
    });

    // #1489 (case 1): mask starting with a special character, ctrl+a then type
    it('should keep first typed symbol after select-all when mask starts with special char', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '(000) 000-0000',
            keepCharacterPositions: true,
            showMaskTyped: true,
        });

        await m.type('#masked', '1234567890');
        await expect.poll(() => m.get('#masked').value).toBe('(123) 456-7890');
        m.selectAll('#masked');
        await m.type('#masked', '9');
        await expect.poll(() => m.get('#masked').value).toBe('(9__) ___-____');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(2);
    });
});
