import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

@Component({
    selector: 'ngxd-model-echo-test',
    imports: [FormsModule, NgxMaskDirective],
    providers: [provideNgxMask()],
    template: `
        <input
            id="masked"
            [mask]="mask()"
            [triggerOnMaskChange]="triggerOnMaskChange()"
            [ngModel]="value()"
            (ngModelChange)="onModelChange($event)" />
    `,
})
class ModelEchoComponent {
    public readonly mask = signal('0000');
    public readonly triggerOnMaskChange = signal(false);
    public readonly value = signal<string | null>('');
    public readonly emitted: unknown[] = [];

    public onModelChange(value: string): void {
        this.emitted.push(value);
        this.value.set(value);
    }
}

describe('Directive: programmatic writes in a real browser (form echo)', () => {
    describe('reactive forms', () => {
        it('emits valueChanges once for a setValue the mask leaves unchanged', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '0000' });
            const emitted: unknown[] = [];
            m.component.form.valueChanges.subscribe((value) => emitted.push(value));

            m.component.form.setValue('1234');
            await m.settle();

            expect(emitted).toEqual(['1234']);
            expect(m.get('#masked').value).toBe('1234');
            expect(m.component.form.pristine).toBe(true);
        });

        it('pushes the normalised value back when the mask changes the written one', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '0000' });
            const emitted: unknown[] = [];
            m.component.form.valueChanges.subscribe((value) => emitted.push(value));

            m.component.form.setValue('12345');
            await m.settle();

            expect(m.get('#masked').value).toBe('1234');
            expect(m.component.form.value).toBe('1234');
            expect(emitted.at(-1)).toBe('1234');
        });

        it('keeps a typed value masked and emitted once per keystroke', async () => {
            const m = await mount(MaskHarnessComponent, {
                mask: '00-00',
                dropSpecialCharacters: true,
            });
            const emitted: unknown[] = [];
            m.component.form.valueChanges.subscribe((value) => emitted.push(value));

            await m.type('#masked', '1234');

            expect(m.get('#masked').value).toBe('12-34');
            expect(m.component.form.value).toBe('1234');
            expect(emitted).toEqual(['1', '12', '123', '1234']);
        });

        it('replaces a boxed {value, disable} write with the plain value and does not leak the box', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '000' });

            m.component.form.setValue({ value: 123, disable: true });
            await m.settle();

            expect(m.component.form.value).toBe(123);
            expect(m.text('#pre1')).toBe('123');
            expect(m.get('#masked').value).toBe('123');
        });

        it('replaces a boxed string write with the plain value', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '000' });

            m.component.form.setValue({ value: '123', disable: false });
            await m.settle();

            expect(m.component.form.value).toBe('123');
            expect(m.get('#masked').value).toBe('123');
        });
    });

    describe('template-driven forms', () => {
        it('does not emit ngModelChange for a model write the mask leaves unchanged', async () => {
            const m = await mount(ModelEchoComponent);

            m.component.value.set('1234');
            await m.settle();

            expect(m.get('#masked').value).toBe('1234');
            expect(m.component.emitted).toEqual([]);
        });

        it('emits the normalised value once for a model write the mask changes', async () => {
            const m = await mount(ModelEchoComponent);

            m.component.value.set('12345');
            await m.settle();

            expect(m.get('#masked').value).toBe('1234');
            expect(m.component.emitted).toEqual(['1234']);
            expect(m.component.value()).toBe('1234');
        });

        it('shows the shrunk value but keeps the model when triggerOnMaskChange is false', async () => {
            const m = await mount(ModelEchoComponent);
            m.component.value.set('56789');
            m.component.mask.set('00000');
            await m.settle();
            m.component.emitted.length = 0;

            m.component.mask.set('000');
            await m.settle();

            expect(m.get('#masked').value).toBe('567');
            expect(m.component.emitted).toEqual([]);
            expect(m.component.value()).toBe('56789');
        });

        it('writes the shrunk value back to the model when triggerOnMaskChange is true', async () => {
            const m = await mount(ModelEchoComponent);
            m.component.triggerOnMaskChange.set(true);
            m.component.value.set('56789');
            m.component.mask.set('00000');
            await m.settle();
            m.component.emitted.length = 0;

            m.component.mask.set('000');
            await m.settle();

            expect(m.get('#masked').value).toBe('567');
            expect(m.component.emitted).toEqual(['567']);
            expect(m.component.value()).toBe('567');
        });
    });

    describe('IP and CPF/CNPJ verdicts follow the active mask', () => {
        it('drops the IP error once [mask] is switched to a mask the value satisfies', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'IP' });

            await m.type('#masked', '1234');
            expect(m.component.form.hasError('mask')).toBe(true);

            m.fixture.componentRef.setInput('mask', '0000');
            await m.settle();

            expect(m.component.form.errors).toBeNull();
        });

        it('drops the CPF/CNPJ error once [mask] is switched to a mask the value satisfies', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'CPF_CNPJ' });

            await m.type('#masked', '123');
            expect(m.component.form.hasError('mask')).toBe(true);

            m.fixture.componentRef.setInput('mask', '000');
            await m.settle();

            expect(m.component.form.errors).toBeNull();
        });

        it('keeps the IP error while IP stays the active mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'IP' });

            await m.type('#masked', '1234');
            await m.blur('#masked');

            expect(m.component.form.hasError('mask')).toBe(true);
        });

        it('reports a valid IP without an error', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'IP' });

            await m.type('#masked', '192.168.1.78');

            expect(m.get('#masked').value).toBe('192.168.1.78');
            expect(m.component.form.errors).toBeNull();
        });
    });

    describe('thousandSeparator made of replacement-pattern or regex-special characters', () => {
        const separators = ['$', '$&', "$'", '^', '*', '(', '|', '+'];

        it.each(separators)(
            'renders 1234567 literally with thousandSeparator %s when typed',
            async (separator) => {
                const m = await mount(MaskHarnessComponent, {
                    mask: 'separator',
                    thousandSeparator: separator,
                });

                await m.type('#masked', '1234567');

                expect(m.get('#masked').value).toBe(`1${separator}234${separator}567`);
            }
        );

        it.each(separators)(
            'renders a written 1234567 literally with thousandSeparator %s',
            async (separator) => {
                const m = await mount(MaskHarnessComponent, {
                    mask: 'separator',
                    thousandSeparator: separator,
                });

                m.component.form.setValue(1234567);
                await m.settle();

                expect(m.get('#masked').value).toBe(`1${separator}234${separator}567`);
            }
        );
    });

    describe('invalid separator characters', () => {
        it.each([['@'], ['#'], ['!'], ['%'], ['a'], ['z']])(
            'does not accept %s while typing a separator mask',
            async (char) => {
                const m = await mount(MaskHarnessComponent, { mask: 'separator.2' });

                await m.type('#masked', `12${char}34`);

                expect(m.get('#masked').value).toBe('1,234');
            }
        );

        it('accepts the configured thousand separator and decimal marker', async () => {
            const m = await mount(MaskHarnessComponent, {
                mask: 'separator.2',
                thousandSeparator: ',',
                decimalMarker: '.',
            });

            await m.type('#masked', '1234.56');

            expect(m.get('#masked').value).toBe('1,234.56');
        });
    });
});
