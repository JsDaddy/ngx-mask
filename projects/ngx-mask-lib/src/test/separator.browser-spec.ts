import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';
import type { NgxMaskConfig } from 'ngx-mask';

describe('Test Date Hh:m0', () => {
    it('Mask separator.2 check cursor with value 100.0', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: '.',
            thousandSeparator: ',',
        });
        await m.type('#masked', '1000');
        await m.type('#masked', '{ArrowLeft}');
        await m.type('#masked', '.');
        await expect.poll(() => m.get('#masked').value).toBe('100.0');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(4);
    });

    it('Mask separator.2 check cursor with value 1.00', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: '.',
            thousandSeparator: ',',
        });
        await m.type('#masked', '1000');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '.');
        await expect.poll(() => m.get('#masked').value).toBe('1.00');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(2);
    });

    it('Mask separator.2 check cursor with value 123456789.20', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: '.',
            thousandSeparator: ',',
        });
        // Caret lands mid-integer (between '78' and '9,20'), right before the existing
        // decimal marker. Typing another '.' here is a duplicate decimal marker: issue
        // #1250 — it must be rejected as a no-op instead of being accepted as a new
        // marker and mangling the value ('123,456,789.20' -> '12,345,678.9', silently
        // dropping the '20' fraction digits). The previous expectation ('12,345,678.9')
        // encoded that bug.
        await m.type('#masked', '123456789.20');
        await m.type('#masked', '{ArrowLeft}'.repeat(4));
        await m.type('#masked', '.');
        await expect.poll(() => m.get('#masked').value).toBe('123,456,789.20');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(10);
    });

    it('Mask separator.2 check cursor with value 100.0', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: ',',
            thousandSeparator: '.',
        });
        await m.type('#masked', '1000');
        await m.type('#masked', '{ArrowLeft}');
        await m.type('#masked', ',');
        await expect.poll(() => m.get('#masked').value).toBe('100,0');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(4);
    });

    it('Mask separator.2 check cursor with value 1.00', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: ',',
            thousandSeparator: '.',
        });
        await m.type('#masked', '1000');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', ',');
        await expect.poll(() => m.get('#masked').value).toBe('1,00');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(2);
    });

    it('Mask separator.2 check cursor with value 123456789.20', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: ',',
            thousandSeparator: '.',
        });
        // Same duplicate-decimal-marker case as above (issue #1250), mirrored with
        // comma as decimalMarker / dot as thousandSeparator. The previous expectation
        // ('12.345.678,9') encoded the pre-fix mangling bug.
        await m.type('#masked', '123456789,20');
        await m.type('#masked', '{ArrowLeft}'.repeat(4));
        await m.type('#masked', ',');
        await expect.poll(() => m.get('#masked').value).toBe('123.456.789,20');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(10);
    });

    it('when decimalMarker doenst set should have right position cursor thousandSeparator = .', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: '.',
        });

        await m.type('#masked', '12345678,00');
        await expect.poll(() => m.get('#masked').value).toBe('12.345.678,00');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}'.repeat(3));
        await expect.poll(() => m.get('#masked').value).toBe('12.345,00');
    });

    it('when decimalMarker doenst set should have right position cursor thousandSeparator = ,', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: ',',
        });

        await m.type('#masked', '12345678.00');
        await expect.poll(() => m.get('#masked').value).toBe('12,345,678.00');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}'.repeat(3));
        await expect.poll(() => m.get('#masked').value).toBe('12,345.00');
    });

    it('should place cursor after backspace with separatorLimit = 10 in correct position', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.2', separatorLimit: '10' });

        await m.type('#masked', '12.10');
        await expect.poll(() => m.get('#masked').value).toBe('12.10');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('12');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(2);
    });

    it('should place cursor after backspace with separatorLimit = 100 in correct position', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.2', separatorLimit: '100' });

        await m.type('#masked', '123.10');
        await expect.poll(() => m.get('#masked').value).toBe('123.10');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('123');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(3);
    });

    it('should place cursor after backspace with separatorLimit = 1000 in correct position', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: ',',
            separatorLimit: '1000',
        });

        await m.type('#masked', '1234.10');
        await expect.poll(() => m.get('#masked').value).toBe('1,234.10');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('1,234');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(5);
    });

    it('should backspace with separator and prefix', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: ',',
            prefix: '$ ',
        });

        await m.type('#masked', '1234567890');
        await expect.poll(() => m.get('#masked').value).toBe('$ 1,234,567,890');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(11);
    });

    it('should backspace with separator and prefix', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: '.',
            prefix: '$ ',
        });

        await m.type('#masked', '1234567890');
        await expect.poll(() => m.get('#masked').value).toBe('$ 1.234.567.890');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').selectionStart).toBe(11);
    });

    it('should correct work after backspace separator.6 decimalMarker . thousandSeparator ,', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.6',
            decimalMarker: '.',
            thousandSeparator: ',',
        });

        await m.type('#masked', '0.000001');
        await expect.poll(() => m.get('#masked').value).toBe('0.000001');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0.00001');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0.0001');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('1');
    });

    it('should correct work after backspace separator.2 decimalMarker . thousandSeparator ,', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: '.',
            thousandSeparator: ',',
        });

        await m.type('#masked', '0.01');
        await expect.poll(() => m.get('#masked').value).toBe('0.01');
        await m.type('#masked', '{ArrowLeft}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0.1');
        await m.type('#masked', '{ArrowLeft}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('.1');
    });

    it('should correct work after backspace separator.2 decimalMarker . thousandSeparator , allowNegative', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: '.',
            thousandSeparator: ',',
            allowNegativeNumbers: true,
        });

        await m.type('#masked', '-0.01');
        await expect.poll(() => m.get('#masked').value).toBe('-0.01');
        await m.type('#masked', '{ArrowLeft}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('-0.1');
        await m.type('#masked', '{ArrowLeft}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('-1');
    });

    it('should correct work after backspace separator.3 decimalMarker . thousandSeparator , allowNegative', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.3',
            decimalMarker: '.',
            thousandSeparator: ',',
            allowNegativeNumbers: true,
        });

        await m.type('#masked', '-0.014');
        await expect.poll(() => m.get('#masked').value).toBe('-0.014');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('-0.14');
        await m.type('#masked', '{ArrowLeft}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('-14');
    });

    it('should correct work after backspace separator.3 leadZero allowNegative', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.3',
            allowNegativeNumbers: true,
            leadZero: true,
        });

        await m.type('#masked', '-0.1');
        await expect.poll(() => m.get('#masked').value).toBe('-0.1');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('-1');
        await m.type('#masked', '{ArrowRight}');
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('-');
    });

    it('should correct work after backspace separator', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator' });

        await m.type('#masked', '0.33');
        await expect.poll(() => m.get('#masked').value).toBe('0.33');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('33');
    });

    it('should correct work after backspace separator leadZero', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator', leadZero: true });

        await m.type('#masked', '0.33');
        await expect.poll(() => m.get('#masked').value).toBe('0.33');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('33');
    });

    it('should correct work after backspace separator allowNegativeNumbers', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator',
            allowNegativeNumbers: true,
        });

        await m.type('#masked', '-0.33');
        await expect.poll(() => m.get('#masked').value).toBe('-0.33');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('-33');
    });

    it('should correct work after backspace separator leadZero', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator',
            leadZero: true,
            allowNegativeNumbers: true,
        });

        await m.type('#masked', '-0.33');
        await expect.poll(() => m.get('#masked').value).toBe('-0.33');
        await m.type('#masked', '{ArrowLeft}'.repeat(2));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('-33');
    });

    it('should correct work after backspace separator.2 when first digit .', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: '.',
        });

        await m.type('#masked', '50004');
        await expect.poll(() => m.get('#masked').value).toBe('50.004');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('4');
    });

    it('should correct work after backspace separator.2 when first digit ,', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: ',',
        });

        await m.type('#masked', '50004');
        await expect.poll(() => m.get('#masked').value).toBe('50,004');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('4');
    });

    it('should correct work after backspace separator.2 when first digit whitespace', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            thousandSeparator: ' ',
        });

        await m.type('#masked', '50004');
        await expect.poll(() => m.get('#masked').value).toBe('50 004');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('4');
    });

    it('should correct work after backspace separator.2 when first digit 0', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.2' });

        await m.type('#masked', '50.05');
        await expect.poll(() => m.get('#masked').value).toBe('50.05');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('5.05');
    });

    it('should correct work after backspace separator.2 when first digit 0', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.2' });

        await m.type('#masked', '0.05');
        await expect.poll(() => m.get('#masked').value).toBe('0.05');
        await m.type('#masked', '{ArrowLeft}'.repeat(3));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('.05');
    });

    it('should correct work after backspace separator.2 when after first digit 0', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: ',',
            thousandSeparator: ' ',
        });

        await m.type('#masked', '1 000 000,05');
        await expect.poll(() => m.get('#masked').value).toBe('1 000 000,05');
        await m.type('#masked', '{ArrowLeft}'.repeat(11));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0,05');

        await m.clear('#masked');

        await m.type('#masked', '60,05');
        await expect.poll(() => m.get('#masked').value).toBe('60,05');
        await m.type('#masked', '{ArrowLeft}'.repeat(4));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0,05');
    });

    it('should correct work after backspace separator.2 when after first digit 0', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: '.',
            thousandSeparator: ' ',
        });

        await m.type('#masked', '200.05');
        await expect.poll(() => m.get('#masked').value).toBe('200.05');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0.05');
    });

    it('should correct work after backspace separator.2 with default values', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: ['.', ','] as NgxMaskConfig['decimalMarker'],
            thousandSeparator: ' ',
        });

        await m.type('#masked', '1000000,35');
        await expect.poll(() => m.get('#masked').value).toBe('1 000 000,35');
        await m.type('#masked', '{ArrowLeft}'.repeat(11));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0,35');

        await m.clear('#masked');

        await m.type('#masked', '1000000.35');
        await expect.poll(() => m.get('#masked').value).toBe('1 000 000.35');
        await m.type('#masked', '{ArrowLeft}'.repeat(11));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0.35');
    });

    it('should correct work after backspace separator.2 with default values', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: ['.', ','] as NgxMaskConfig['decimalMarker'],
            thousandSeparator: ' ',
        });

        await m.type('#masked', '60,35');
        await expect.poll(() => m.get('#masked').value).toBe('60,35');
        await m.type('#masked', '{ArrowLeft}'.repeat(4));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0,35');

        await m.clear('#masked');

        await m.type('#masked', '60.35');
        await expect.poll(() => m.get('#masked').value).toBe('60.35');
        await m.type('#masked', '{ArrowLeft}'.repeat(4));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0.35');
    });

    it('should correct work after backspace separator.2 with default values', async () => {
        const m = await mount(MaskHarnessComponent, {
            mask: 'separator.2',
            decimalMarker: ['.', ','] as NgxMaskConfig['decimalMarker'],
            thousandSeparator: ' ',
        });

        await m.type('#masked', '200,35');
        await expect.poll(() => m.get('#masked').value).toBe('200,35');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0,35');

        await m.clear('#masked');

        await m.type('#masked', '200.35');
        await expect.poll(() => m.get('#masked').value).toBe('200.35');
        await m.type('#masked', '{ArrowLeft}'.repeat(5));
        await m.type('#masked', '{Backspace}');
        await expect.poll(() => m.get('#masked').value).toBe('0.35');
    });
});
