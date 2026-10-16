import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

// Test component with initial value - simple mask
@Component({
    selector: 'ngxd-test-initial-value',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="dirty">{{ form.dirty }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestInitialValueComponent {
    public mask = '0000';
    public form = new FormControl('1234');
}

// Test component with initial value and separator
@Component({
    selector: 'ngxd-test-separator-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input
            id="masked"
            [formControl]="form"
            [mask]="mask"
            [leadZero]="leadZero"
            [thousandSeparator]="thousandSeparator" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestSeparatorInitialComponent {
    public mask = 'separator.2';
    public leadZero = true;
    public thousandSeparator = ',';
    public form = new FormControl('1234.56');
}

// Test component with phone mask initial value
@Component({
    selector: 'ngxd-test-phone-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestPhoneInitialComponent {
    public mask = '(000) 000-0000';
    public form = new FormControl('1234567890');
}

// Test component with date mask initial value
@Component({
    selector: 'ngxd-test-date-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestDateInitialComponent {
    public mask = '00/00/0000';
    public form = new FormControl('12252023');
}

// Test component with time mask initial value
@Component({
    selector: 'ngxd-test-time-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestTimeInitialComponent {
    public mask = '00:00:00';
    public form = new FormControl('123045');
}

// Test component with IP address mask initial value
@Component({
    selector: 'ngxd-test-ip-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestIpInitialComponent {
    public mask = '099.099.099.099';
    public form = new FormControl('192168001001');
}

// Test component with percent mask initial value
@Component({
    selector: 'ngxd-test-percent-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestPercentInitialComponent {
    public mask = 'percent';
    public form = new FormControl('75');
}

// Test component with CPF mask initial value
@Component({
    selector: 'ngxd-test-cpf-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestCpfInitialComponent {
    public mask = '000.000.000-00';
    public form = new FormControl('12345678901');
}

// Test component with optional digits mask initial value
@Component({
    selector: 'ngxd-test-optional-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestOptionalInitialComponent {
    public mask = '9999';
    public form = new FormControl('12');
}

// Test component with letters mask initial value
@Component({
    selector: 'ngxd-test-letters-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestLettersInitialComponent {
    public mask = 'AAAA';
    public form = new FormControl('ABCD');
}

// Test component with alphanumeric mask initial value
@Component({
    selector: 'ngxd-test-alphanumeric-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestAlphanumericInitialComponent {
    public mask = 'A0A0A0';
    public form = new FormControl('A1B2C3');
}

// Test component with prefix initial value
@Component({
    selector: 'ngxd-test-prefix-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [prefix]="prefix" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestPrefixInitialComponent {
    public mask = '0000';
    public prefix = '$ ';
    public form = new FormControl('1234');
}

// Test component with suffix initial value
@Component({
    selector: 'ngxd-test-suffix-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [suffix]="suffix" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestSuffixInitialComponent {
    public mask = '0000';
    public suffix = ' USD';
    public form = new FormControl('1234');
}

// Test component with showMaskTyped initial value
@Component({
    selector: 'ngxd-test-show-mask-typed-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestShowMaskTypedInitialComponent {
    public mask = '(000) 000-0000';
    public showMaskTyped = true;
    public form = new FormControl('1234567890');
}

// Test component with dropSpecialCharacters false initial value
@Component({
    selector: 'ngxd-test-keep-special-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input
            id="masked"
            [formControl]="form"
            [mask]="mask"
            [dropSpecialCharacters]="dropSpecialCharacters" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestKeepSpecialInitialComponent {
    public mask = '(000) 000-0000';
    public dropSpecialCharacters = false;
    public form = new FormControl('(123) 456-7890');
}

// Test component with credit card mask initial value
@Component({
    selector: 'ngxd-test-credit-card-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestCreditCardInitialComponent {
    public mask = '0000 0000 0000 0000';
    public form = new FormControl('1234567890123456');
}

// Test component with SSN mask initial value
@Component({
    selector: 'ngxd-test-ssn-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestSsnInitialComponent {
    public mask = '000-00-0000';
    public form = new FormControl('123456789');
}

// Test component with ZIP code mask initial value
@Component({
    selector: 'ngxd-test-zip-initial',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="pristine">{{ form.pristine }}</pre>
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestZipInitialComponent {
    public mask = '00000-0000';
    public form = new FormControl('123456789');
}

describe('Directive: Mask (dirty state)', () => {
    it('should not mark form as dirty on initial load with empty value', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '0000' });

        await expect.poll(() => m.text('#pristine')).toBe('true');
    });

    it('should not mark form as dirty on initial load with separator mask', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.2' });

        await expect.poll(() => m.text('#pristine')).toBe('true');
    });

    it('should not mark form as dirty on initial load with separator mask and leadZero', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.2', leadZero: true });

        // Wait for any async operations (requestAnimationFrame)
        await m.settle();
        await expect.poll(() => m.text('#pristine')).toBe('true');
    });

    it('should not mark form as dirty on initial load with prefix', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '0000', prefix: '$' });

        await expect.poll(() => m.text('#pristine')).toBe('true');
    });

    it('should not mark form as dirty on initial load with suffix', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '0000', suffix: ' USD' });

        await expect.poll(() => m.text('#pristine')).toBe('true');
    });

    it('should mark form as dirty after user input', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '0000' });

        await expect.poll(() => m.text('#pristine')).toBe('true');
        await m.type('#masked', '1234');
        await expect.poll(() => m.text('#pristine')).toBe('false');
    });

    it('should not mark form as dirty when setValue is called programmatically', async () => {
        const m = await mount(MaskHarnessComponent, { mask: '0000' });
        m.component.form.setValue('1234');
        await m.settle();

        await m.settle();
        await expect.poll(() => m.text('#pristine')).toBe('true');
        await expect.poll(() => m.get('#masked').value).toBe('1234');
    });

    it('should not mark form as dirty when setValue is called with separator mask', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.2' });
        m.component.form.setValue('1234.56');
        await m.settle();

        await m.settle();
        await expect.poll(() => m.text('#pristine')).toBe('true');
    });

    it('should not mark form as dirty when setValue is called with separator mask and leadZero', async () => {
        const m = await mount(MaskHarnessComponent, { mask: 'separator.2', leadZero: true });
        m.component.form.setValue('1234');
        await m.settle();

        await m.settle();
        await expect.poll(() => m.text('#pristine')).toBe('true');
    });

    it('should not mark form as dirty when component has initial value in FormControl', async () => {
        const m = await mount(TestInitialValueComponent);

        await m.settle();
        await expect.poll(() => m.text('#pristine')).toBe('true');
        await expect.poll(() => m.get('#masked').value).toBe('1234');
    });

    it('should not mark form as dirty when component has initial value with separator mask', async () => {
        const m = await mount(TestSeparatorInitialComponent);

        await m.settle();
        await expect.poll(() => m.text('#pristine')).toBe('true');
    });

    // Tests for all mask types on initial load with values
    describe('All mask types on initial load with values', () => {
        it('should not mark form as dirty with phone mask initial value', async () => {
            const m = await mount(TestPhoneInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('(123) 456-7890');
        });

        it('should not mark form as dirty with date mask initial value', async () => {
            const m = await mount(TestDateInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('12/25/2023');
        });

        it('should not mark form as dirty with time mask initial value', async () => {
            const m = await mount(TestTimeInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('12:30:45');
        });

        it('should not mark form as dirty with IP address mask initial value', async () => {
            const m = await mount(TestIpInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('192.168.001.001');
        });

        it('should not mark form as dirty with percent mask initial value', async () => {
            const m = await mount(TestPercentInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('75');
        });

        it('should not mark form as dirty with CPF mask initial value', async () => {
            const m = await mount(TestCpfInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('123.456.789-01');
        });

        it('should not mark form as dirty with optional digits mask initial value', async () => {
            const m = await mount(TestOptionalInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('12');
        });

        it('should not mark form as dirty with letters mask initial value', async () => {
            const m = await mount(TestLettersInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('ABCD');
        });

        it('should not mark form as dirty with alphanumeric mask initial value', async () => {
            const m = await mount(TestAlphanumericInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('A1B2C3');
        });

        it('should not mark form as dirty with prefix initial value', async () => {
            const m = await mount(TestPrefixInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('$ 1234');
        });

        it('should not mark form as dirty with suffix initial value', async () => {
            const m = await mount(TestSuffixInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('1234 USD');
        });

        it('should not mark form as dirty with showMaskTyped initial value', async () => {
            const m = await mount(TestShowMaskTypedInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('(123) 456-7890');
        });

        it('should not mark form as dirty with dropSpecialCharacters false initial value', async () => {
            const m = await mount(TestKeepSpecialInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('(123) 456-7890');
        });

        it('should not mark form as dirty with credit card mask initial value', async () => {
            const m = await mount(TestCreditCardInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('1234 5678 9012 3456');
        });

        it('should not mark form as dirty with SSN mask initial value', async () => {
            const m = await mount(TestSsnInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('123-45-6789');
        });

        it('should not mark form as dirty with ZIP code mask initial value', async () => {
            const m = await mount(TestZipInitialComponent);

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('12345-6789');
        });
    });

    // Tests for all mask types with programmatic setValue
    describe('All mask types with programmatic setValue', () => {
        it('should not mark form as dirty when setValue with phone mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '(000) 000-0000' });
            m.component.form.setValue('1234567890');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('(123) 456-7890');
        });

        it('should not mark form as dirty when setValue with date mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '00/00/0000' });
            m.component.form.setValue('12252023');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('12/25/2023');
        });

        it('should not mark form as dirty when setValue with time mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '00:00:00' });
            m.component.form.setValue('123045');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('12:30:45');
        });

        it('should not mark form as dirty when setValue with IP mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '099.099.099.099' });
            m.component.form.setValue('192168001001');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('192.168.001.001');
        });

        it('should not mark form as dirty when setValue with percent mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'percent' });
            m.component.form.setValue('75');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty when setValue with CPF mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '000.000.000-00' });
            m.component.form.setValue('12345678901');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('123.456.789-01');
        });

        it('should not mark form as dirty when setValue with optional digits mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '9999' });
            m.component.form.setValue('12');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('12');
        });

        it('should not mark form as dirty when setValue with letters mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'AAAA' });
            m.component.form.setValue('ABCD');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('ABCD');
        });

        it('should not mark form as dirty when setValue with alphanumeric mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'A0A0A0' });
            m.component.form.setValue('A1B2C3');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('A1B2C3');
        });

        it('should not mark form as dirty when setValue with prefix', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '0000', prefix: '$ ' });
            m.component.form.setValue('1234');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('$ 1234');
        });

        it('should not mark form as dirty when setValue with suffix', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '0000', suffix: ' USD' });
            m.component.form.setValue('1234');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('1234 USD');
        });

        it('should not mark form as dirty when setValue with credit card mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '0000 0000 0000 0000' });
            m.component.form.setValue('1234567890123456');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('1234 5678 9012 3456');
        });

        it('should not mark form as dirty when setValue with SSN mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '000-00-0000' });
            m.component.form.setValue('123456789');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('123-45-6789');
        });

        it('should not mark form as dirty when setValue with ZIP code mask', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '00000-0000' });
            m.component.form.setValue('123456789');
            await m.settle();

            await m.settle();
            await expect.poll(() => m.text('#pristine')).toBe('true');
            await expect.poll(() => m.get('#masked').value).toBe('12345-6789');
        });
    });

    // Tests for all mask types on initial load with empty values
    describe('All mask types on initial load with empty values', () => {
        it('should not mark form as dirty with phone mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '(000) 000-0000' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with date mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '00/00/0000' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with time mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '00:00:00' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with IP mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '099.099.099.099' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with percent mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'percent' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with CPF mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '000.000.000-00' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with optional digits mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '9999' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with letters mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'AAAA' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with alphanumeric mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: 'A0A0A0' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with credit card mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '0000 0000 0000 0000' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with SSN mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '000-00-0000' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });

        it('should not mark form as dirty with ZIP code mask empty', async () => {
            const m = await mount(MaskHarnessComponent, { mask: '00000-0000' });

            await expect.poll(() => m.text('#pristine')).toBe('true');
        });
    });
});
