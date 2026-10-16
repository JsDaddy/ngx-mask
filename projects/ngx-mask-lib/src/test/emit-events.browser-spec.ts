import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

describe('Directive: Mask (emit-events)', () => {
    it('should emit event only when mask is correct', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '00 00 00' });

        await m.type('#masked', '1dd');
        await m.type('#masked', 'dd');
        await expect.poll(() => m.text('#pre')).toBe('1');

        await m.type('#masked', '121212');
        await m.type('#masked', 'dd');
        await expect.poll(() => m.text('#pre')).toBe('6');
    });

    it('should emit event only when mask is correct with hiddenINput', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'XX-XX-XX', hiddenInput: true });

        await m.type('#masked', '1dd');
        await m.type('#masked', 'dd');
        await expect.poll(() => m.text('#pre')).toBe('1');

        await m.type('#masked', '121212');
        await m.type('#masked', 'dd');
        await expect.poll(() => m.text('#pre')).toBe('6');
    });

    it('should add trailing zero when mask="separator.1" and leadZero="true"', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.1', leadZero: true });

        await m.type('#masked', '9');
        await m.blur('#masked');
        await expect.poll(() => m.get('#masked').value).toBe('9.0');
    });

    it('should keep trailing decimal when mask="separator.1" and leadZero="true"', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.1', leadZero: true });

        await m.type('#masked', '7.7');
        await m.blur('#masked');
        await expect.poll(() => m.get('#masked').value).toBe('7.7');
    });

    it('should emit event only when mask is correct with suffix separator2', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            leadZero: true,
            suffix: ' $',
        });

        await m.type('#masked', '10');
        await expect.poll(() => m.text('#pre')).toBe('2');
        // the leadZero padding applied on blur is one more (valid) value change
        await m.blur('#masked');
        await expect.poll(() => m.get('#masked').value).toBe('10.00 $');
        await expect.poll(() => m.text('#pre')).toBe('3');
    });

    it('should emit event only when mask is correct with suffix separator.3', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.3',
            leadZero: true,
            suffix: ' $',
        });

        await m.type('#masked', '10.0');
        await expect.poll(() => m.text('#pre')).toBe('4');
        // the leadZero padding applied on blur is one more (valid) value change
        await m.blur('#masked');
        await expect.poll(() => m.get('#masked').value).toBe('10.000 $');
        await expect.poll(() => m.text('#pre')).toBe('5');
    });

    it('should emit event only when mask is correct with separator2', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.2', leadZero: true });

        await m.type('#masked', '10');
        await expect.poll(() => m.text('#pre')).toBe('2');
        // the leadZero padding applied on blur is one more (valid) value change
        await m.blur('#masked');
        await expect.poll(() => m.get('#masked').value).toBe('10.00');
        await expect.poll(() => m.text('#pre')).toBe('3');
    });

    it('should emit event only when mask is correct with separator.3', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.3', leadZero: true });

        await m.type('#masked', '10');
        await expect.poll(() => m.text('#pre')).toBe('2');
        // the leadZero padding applied on blur is one more (valid) value change
        await m.blur('#masked');
        await expect.poll(() => m.get('#masked').value).toBe('10.000');
        await expect.poll(() => m.text('#pre')).toBe('3');
    });

    it('should emit event only when mask is correct with SS000', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'SS000' });

        await m.type('#masked', 'SS11111DDDD11');
        await m.blur('#masked');
        await expect.poll(() => m.get('#masked').value).toBe('SS111');
        await expect.poll(() => m.text('#pre')).toBe('5');
    });

    it("inputTransformFn should not break if it's null", async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: '00000||00000-0000',
            inputTransformFn: null,
        });

        await m.type('#masked', '123456789');
        await m.blur('#masked');
        await expect.poll(() => m.get('#masked').value).toBe('12345-6789');
        await expect.poll(() => m.text('#pre')).toBe('9');
    });

    it('inputTransformFn should not change input form status', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'Hh:m0',
            dropSpecialCharacters: false,
            inputTransformFn: (value: unknown): string => {
                if (typeof value !== 'object') {
                    return String(value);
                }
                const date = new Date('12-12-2012 11:14:01');
                return `${String(date.getHours()).padStart(2, '0')}${String(
                    date.getMinutes()
                ).padStart(2, '0')}`;
            },
            outputTransformFn: (value: string | number | undefined | null) => {
                if (value) {
                    const fetch = new Date('12-12-2012 11:14:01');
                    const values = String(value).split(':');
                    if (values.length >= 2) {
                        const hour = Number(values[0]);
                        const minuts = Number(values[1]);
                        fetch.setHours(hour);
                        fetch.setMinutes(minuts);
                    }
                    fetch.setSeconds(0);
                    return fetch.toString();
                }
                return;
            },
        });
        await m.settle();
        m.component.form.reset();
        await m.settle();

        await expect.poll(() => m.text('#pristine')).toBe('true');
        await expect.poll(() => m.text('#pre')).toBe('1');
    });
});
