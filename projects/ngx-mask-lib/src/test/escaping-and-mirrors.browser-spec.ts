/* eslint-disable no-undefined -- `undefined` is the unset value under test */
import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

describe('Directive: special characters, nullish separators and runtime inputs (real browser)', () => {
    describe('typing a mask whose literals are regex-special characters', () => {
        it('types through "[", "(", "." and "+" literals', async () => {
            const m = await mount(MaskHarnessComponent, {
                mask: '[00] (00).00+0',
                dropSpecialCharacters: false,
            });

            await m.type('#masked', '123456');

            // The trailing "+" is only added once a seventh digit follows it.
            expect(m.get('#masked').value).toBe('[12] (34).56');
            expect(m.component.form.value).toBe('[12] (34).56');
        });

        it('drops those literals from the model by default', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '[00] (00).00+0' });

            await m.type('#masked', '1234567');

            expect(m.get('#masked').value).toBe('[12] (34).56+7');
            expect(m.component.form.value).toBe('1234567');
        });

        it('backspaces through a "." literal after a leading "+" literal without losing digits', async () => {
            const m = await mount(MaskHarnessComponent, {
                mask: '+00.00',
                dropSpecialCharacters: false,
            });

            await m.type('#masked', '1234');
            expect(m.get('#masked').value).toBe('+12.34');
            await m.type('#masked', '{Backspace}');
            await m.type('#masked', '{Backspace}');
            expect(m.get('#masked').value).toBe('+12.');
            await m.type('#masked', '{Backspace}');

            expect(m.get('#masked').value).toBe('+12');
        });

        it('shows the skeleton for regex-special literals with showMaskTyped', async () => {
            const m = await mount(MaskHarnessComponent, {
                mask: '[00] (00)',
                showMaskTyped: true,
            });

            await m.click('#masked');
            expect(m.get('#masked').value).toBe('[__] (__)');
            await m.type('#masked', '1234');

            expect(m.get('#masked').value).toBe('[12] (34)');
        });

        it('treats a custom letter special character literally while typing', async () => {
            const m = await mount(MaskHarnessComponent, {
                mask: 'w-000',
                specialCharacters: ['-', 'w'],
                dropSpecialCharacters: false,
            });

            await m.type('#masked', '123');

            expect(m.get('#masked').value).toBe('w-123');
        });
    });

    describe('click caret past letter special characters', () => {
        // "w" and "s" must be matched literally by the click handler: unescaped (`\w`, `\s`) they became a
        // character class that also swallowed the digit placeholders.
        it.each(['w', 's'])(
            'places the caret after the leading "%s-" on click at 0',
            async (letter) => {
                const m = await mount(MaskHarnessComponent, {
                    mask: `${letter}-000`,
                    specialCharacters: ['-', letter],
                    dropSpecialCharacters: false,
                });
                const input = m.get('#masked');
                input.focus();
                input.value = `${letter}-123`;
                input.setSelectionRange(0, 0);
                input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                await m.settle();

                expect(input.selectionStart).toBe(2);
            }
        );

        it('keeps the caret of a click inside the digits', async () => {
            const m = await mount(MaskHarnessComponent, {
                mask: 'w-000',
                specialCharacters: ['-', 'w'],
                dropSpecialCharacters: false,
            });
            await m.type('#masked', '123');
            expect(m.get('#masked').value).toBe('w-123');

            m.select('#masked', 3, 3);
            m.get('#masked').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await m.settle();

            expect(m.get('#masked').selectionStart).toBe(3);
        });
    });

    describe('separator with a nullish thousandSeparator', () => {
        it.each([[null], [undefined]])(
            'types a number without grouping for thousandSeparator %s',
            async (separator) => {
                const m = await mount(MaskHarnessComponent, {
                    mask: 'separator.2',
                    thousandSeparator: separator,
                });

                await m.type('#masked', '1234567.89');

                expect(m.get('#masked').value).toBe('1234567.89');
                expect(String(m.component.form.value)).toBe('1234567.89');
            }
        );

        it('groups again when a thousandSeparator is supplied at runtime', async () => {
            const m = await mount(MaskHarnessComponent, {
                mask: 'separator.2',
                thousandSeparator: null,
            });
            await m.type('#masked', '1234567');
            expect(m.get('#masked').value).toBe('1234567');

            m.fixture.componentRef.setInput('thousandSeparator', ',');
            await m.type('#masked', '8');

            expect(m.get('#masked').value).toBe('12,345,678');
        });
    });

    describe('inputs changed at runtime through component bindings', () => {
        it('applies a prefix set after the value was typed', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '00-00' });
            await m.type('#masked', '1234');

            m.fixture.componentRef.setInput('prefix', '+');
            await m.settle();
            await m.type('#masked', '{Backspace}5');

            expect(m.get('#masked').value).toBe('+12-35');
        });

        it('applies a suffix set after the value was typed', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '0000' });
            m.fixture.componentRef.setInput('suffix', ' kg');
            await m.settle();

            await m.type('#masked', '12');

            expect(m.get('#masked').value).toBe('12 kg');
            expect(m.component.form.value).toBe('12');
        });

        it('toggles dropSpecialCharacters for the next edit', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '00-00' });
            await m.type('#masked', '1234');
            expect(m.component.form.value).toBe('1234');

            m.fixture.componentRef.setInput('dropSpecialCharacters', false);
            await m.settle();
            await m.type('#masked', '{Backspace}5');

            expect(m.get('#masked').value).toBe('12-35');
            expect(m.component.form.value).toBe('12-35');
        });

        it('switches the decimalMarker used by a separator mask', async () => {
            const m = await mount(MaskHarnessComponent, {
                mask: 'separator.2',
                thousandSeparator: '.',
                decimalMarker: ',',
            });
            await m.type('#masked', '1234,5');
            expect(m.get('#masked').value).toBe('1.234,5');

            m.fixture.componentRef.setInput('decimalMarker', '.');
            m.fixture.componentRef.setInput('thousandSeparator', ',');
            await m.settle();
            await m.clear('#masked');
            await m.type('#masked', '1234.5');

            expect(m.get('#masked').value).toBe('1,234.5');
        });

        it('turns leadZero on at runtime and pads on blur', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'separator.2' });
            await m.type('#masked', '7');
            await m.blur('#masked');
            expect(m.get('#masked').value).toBe('7');

            m.fixture.componentRef.setInput('leadZero', true);
            await m.settle();
            m.focus('#masked');
            await m.blur('#masked');

            expect(m.get('#masked').value).toBe('7.00');
        });

        it('applies a separatorLimit set at runtime', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'separator.2' });
            m.fixture.componentRef.setInput('separatorLimit', '100');
            await m.settle();

            // The limit's length (3 digits) caps the integer part.
            await m.type('#masked', '5000');

            expect(m.get('#masked').value).toBe('500');
        });
    });
});
