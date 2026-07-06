import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { signal, Component, model } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

// Test component with showMaskTyped and initial FormControl value
@Component({
    selector: 'ngxd-test-show-mask-typed-formcontrol',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ form.value }}</pre>
        <pre id="pristine">{{ form.pristine }}</pre>
    `,
})
class TestShowMaskTypedFormControlComponent {
    public mask = '(000) 000-0000';
    public showMaskTyped = true;
    public form = new FormControl('1234567890');
}

// Test component with showMaskTyped and initial ngModel value
@Component({
    selector: 'ngxd-test-show-mask-typed-ngmodel',
    standalone: true,
    imports: [NgxMaskDirective, FormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [(ngModel)]="inputValue" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ inputValue }}</pre>
    `,
})
class TestShowMaskTypedNgModelComponent {
    public mask = '(000) 000-0000';
    public showMaskTyped = true;
    public inputValue = '1234567890';
}

// Test component with showMaskTyped and initial model() signal value
@Component({
    selector: 'ngxd-test-show-mask-typed-model-signal',
    standalone: true,
    imports: [NgxMaskDirective, FormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [(ngModel)]="inputValue" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ inputValue() }}</pre>
    `,
})
class TestShowMaskTypedModelSignalComponent {
    public mask = '(000) 000-0000';
    public showMaskTyped = true;
    public inputValue = model('1234567890');
}

// Test component with showMaskTyped from application-level config
@Component({
    selector: 'ngxd-test-show-mask-typed-app-config',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask({ showMaskTyped: true })],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="value">{{ form.value }}</pre>
        <pre id="pristine">{{ form.pristine }}</pre>
    `,
})
class TestShowMaskTypedAppConfigComponent {
    public mask = '(000) 000-0000';
    public form = new FormControl('1234567890');
}

// Test component with showMaskTyped from application-level config with ngModel
@Component({
    selector: 'ngxd-test-show-mask-typed-app-config-ngmodel',
    standalone: true,
    imports: [NgxMaskDirective, FormsModule],
    providers: [provideNgxMask({ showMaskTyped: true })],
    template: `
        <input id="masked" [(ngModel)]="inputValue" [mask]="mask" />
        <pre id="value">{{ inputValue }}</pre>
    `,
})
class TestShowMaskTypedAppConfigNgModelComponent {
    public mask = '(000) 000-0000';
    public inputValue = '1234567890';
}

// Test component with showMaskTyped and simple mask (0000)
@Component({
    selector: 'ngxd-test-show-mask-typed-simple',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ form.value }}</pre>
        <pre id="pristine">{{ form.pristine }}</pre>
    `,
})
class TestShowMaskTypedSimpleComponent {
    public mask = '0000';
    public showMaskTyped = true;
    public form = new FormControl('1234');
}

// Test component with showMaskTyped and number value (as string to avoid conversion issues)
@Component({
    selector: 'ngxd-test-show-mask-typed-number',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestShowMaskTypedNumberComponent {
    public mask = '00000';
    public showMaskTyped = true;
    public form = new FormControl('65432');
}

// Test component with showMaskTyped and date mask
@Component({
    selector: 'ngxd-test-show-mask-typed-date',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestShowMaskTypedDateComponent {
    public mask = '00/00/0000';
    public showMaskTyped = true;
    public form = new FormControl('12252023');
}

// Test component with showMaskTyped and credit card mask
@Component({
    selector: 'ngxd-test-show-mask-typed-credit-card',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestShowMaskTypedCreditCardComponent {
    public mask = '0000 0000 0000 0000';
    public showMaskTyped = true;
    public form = new FormControl('1234567890123456');
}

// Test component with showMaskTyped and separator mask
@Component({
    selector: 'ngxd-test-show-mask-typed-separator',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input
            id="masked"
            [formControl]="form"
            [mask]="mask"
            [showMaskTyped]="showMaskTyped"
            [thousandSeparator]="thousandSeparator" />
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestShowMaskTypedSeparatorComponent {
    public mask = 'separator.2';
    public showMaskTyped = true;
    public thousandSeparator = ',';
    public form = new FormControl('1234.56');
}

// Test component with showMaskTyped and prefix
@Component({
    selector: 'ngxd-test-show-mask-typed-prefix',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input
            id="masked"
            [formControl]="form"
            [mask]="mask"
            [showMaskTyped]="showMaskTyped"
            [prefix]="prefix" />
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestShowMaskTypedPrefixComponent {
    public mask = '0000';
    public showMaskTyped = true;
    public prefix = '+1 ';
    public form = new FormControl('1234');
}

// Test component that simulates programmatic setValue after init with showMaskTyped
@Component({
    selector: 'ngxd-test-show-mask-typed-set-value',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ form.value }}</pre>
        <pre id="pristine">{{ form.pristine }}</pre>
    `,
})
class TestShowMaskTypedSetValueComponent {
    public mask = '(000) 000-0000';
    public showMaskTyped = true;
    public form = new FormControl('');
}

// Test component simulating custom input with NG_VALUE_ACCESSOR wrapper
@Component({
    selector: 'ngxd-test-custom-input-wrapper',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask({ showMaskTyped: true })],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" />
        <pre id="value">{{ form.value }}</pre>
        <pre id="pristine">{{ form.pristine }}</pre>
    `,
})
class TestCustomInputWrapperComponent {
    public mask = '(000) 000-0000';
    public form = new FormControl('1234567890');
}

// Test component with async initial value (simulating data from API)
@Component({
    selector: 'ngxd-test-async-initial-value',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestAsyncInitialValueComponent {
    public mask = '(000) 000-0000';
    public showMaskTyped = true;
    public form = new FormControl('');

    public constructor() {
        // Simulate async data load
        setTimeout(() => {
            this.form.setValue('9876543210');
        }, 50);
    }
}

// Test component with patchValue instead of setValue
@Component({
    selector: 'ngxd-test-patch-value',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ form.value }}</pre>
        <pre id="pristine">{{ form.pristine }}</pre>
    `,
})
class TestPatchValueComponent {
    public mask = '(000) 000-0000';
    public showMaskTyped = true;
    public form = new FormControl('');
}

// Test component with simple value binding (value = '65432')
@Component({
    selector: 'ngxd-test-simple-value-binding',
    standalone: true,
    imports: [NgxMaskDirective, FormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [(ngModel)]="value" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ value }}</pre>
    `,
})
class TestSimpleValueBindingComponent {
    public mask = '00000';
    public showMaskTyped = true;
    public value = '65432';
}

// Test component with IP mask and showMaskTyped
@Component({
    selector: 'ngxd-test-ip-mask',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestIpMaskComponent {
    public mask = 'IP';
    public showMaskTyped = true;
    // IP mask expects raw digits, dots are special characters
    public form = new FormControl('192168001001');
}

// Test component with CPF/CNPJ mask and showMaskTyped
@Component({
    selector: 'ngxd-test-cpf-cnpj-mask',
    standalone: true,
    imports: [NgxMaskDirective, ReactiveFormsModule],
    providers: [provideNgxMask()],
    template: `
        <input id="masked" [formControl]="form" [mask]="mask" [showMaskTyped]="showMaskTyped" />
        <pre id="value">{{ form.value }}</pre>
    `,
})
class TestCpfCnpjMaskComponent {
    public mask = 'CPF_CNPJ';
    public showMaskTyped = true;
    public form = new FormControl('12345678901');
}

describe('Directive: Mask (showMaskTyped with initial values)', () => {
    describe('showMaskTyped with FormControl initial value', () => {
        it('should display initial value correctly with phone mask', () => {
            cy.mount(TestShowMaskTypedFormControlComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '(123) 456-7890');
            cy.get('#value').should('have.text', '1234567890');
        });

        it('should not mark form as dirty with initial value', () => {
            cy.mount(TestShowMaskTypedFormControlComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
        });

        it('should display initial value correctly with simple mask', () => {
            cy.mount(TestShowMaskTypedSimpleComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '1234');
            cy.get('#value').should('have.text', '1234');
        });

        it('should display initial value correctly with number value', () => {
            cy.mount(TestShowMaskTypedNumberComponent);

            cy.wait(100);
            // Number values are converted to string and masked; 65432 with mask 00000
            cy.get('#masked').should('have.value', '65432');
            cy.get('#value').should('have.text', '65432');
        });

        it('should display initial value correctly with date mask', () => {
            cy.mount(TestShowMaskTypedDateComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '12/25/2023');
            cy.get('#value').should('have.text', '12252023');
        });

        it('should display initial value correctly with credit card mask', () => {
            cy.mount(TestShowMaskTypedCreditCardComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '1234 5678 9012 3456');
            cy.get('#value').should('have.text', '1234567890123456');
        });

        it('should display initial value correctly with separator mask', () => {
            cy.mount(TestShowMaskTypedSeparatorComponent);

            cy.wait(100);
            // Separator mask with showMaskTyped shows the value with decimal places
            cy.get('#masked').invoke('val').should('contain', '1,234.56');
        });

        it('should display initial value correctly with prefix', () => {
            cy.mount(TestShowMaskTypedPrefixComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '+1 1234');
            cy.get('#value').should('have.text', '1234');
        });
    });

    describe('showMaskTyped with ngModel initial value', () => {
        it('should display initial value correctly with ngModel', () => {
            cy.mount(TestShowMaskTypedNgModelComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '(123) 456-7890');
            cy.get('#value').should('have.text', '1234567890');
        });
    });

    describe('showMaskTyped with model() signal', () => {
        it('should display initial value correctly with model signal', () => {
            cy.mount(TestShowMaskTypedModelSignalComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '(123) 456-7890');
            cy.get('#value').should('have.text', '1234567890');
        });
    });

    describe('showMaskTyped from application-level config', () => {
        it('should display initial value correctly with app-level showMaskTyped', () => {
            cy.mount(TestShowMaskTypedAppConfigComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '(123) 456-7890');
            cy.get('#value').should('have.text', '1234567890');
        });

        it('should not mark form as dirty with app-level showMaskTyped', () => {
            cy.mount(TestShowMaskTypedAppConfigComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
        });

        it('should display initial value correctly with app-level config and ngModel', () => {
            cy.mount(TestShowMaskTypedAppConfigNgModelComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '(123) 456-7890');
            cy.get('#value').should('have.text', '1234567890');
        });
    });

    describe('showMaskTyped with programmatic setValue', () => {
        it('should display value correctly after programmatic setValue', () => {
            cy.mount(TestShowMaskTypedSetValueComponent).then((wrapper) => {
                wrapper.component.form.setValue('9876543210');
            });

            cy.wait(100);
            cy.get('#masked').should('have.value', '(987) 654-3210');
            cy.get('#value').should('have.text', '9876543210');
        });

        it('should not mark form as dirty after programmatic setValue', () => {
            cy.mount(TestShowMaskTypedSetValueComponent).then((wrapper) => {
                wrapper.component.form.setValue('9876543210');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
        });
    });

    describe('showMaskTyped with dynamic setValue using CypressTestMaskComponent', () => {
        it('should display value correctly when setValue is called with showMaskTyped', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('(000) 000-0000'),
                    showMaskTyped: signal(true),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('1234567890');
            });

            cy.wait(100);
            cy.get('#masked').should('have.value', '(123) 456-7890');
            cy.get('#pre1').should('have.text', '1234567890');
        });

        it('should not mark form as dirty when setValue with showMaskTyped', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('(000) 000-0000'),
                    showMaskTyped: signal(true),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('1234567890');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
        });

        it('should display value correctly when setValue with simple mask and showMaskTyped', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('0000'),
                    showMaskTyped: signal(true),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('6543');
            });

            cy.wait(100);
            cy.get('#masked').should('have.value', '6543');
            cy.get('#pre1').should('have.text', '6543');
        });

        it('should display value correctly when setValue with date mask and showMaskTyped', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('00/00/0000'),
                    showMaskTyped: signal(true),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('12252023');
            });

            cy.wait(100);
            cy.get('#masked').should('have.value', '12/25/2023');
            cy.get('#pre1').should('have.text', '12252023');
        });

        it('should display value correctly when setValue with credit card mask and showMaskTyped', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('0000 0000 0000 0000'),
                    showMaskTyped: signal(true),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('1234567890123456');
            });

            cy.wait(100);
            cy.get('#masked').should('have.value', '1234 5678 9012 3456');
            cy.get('#pre1').should('have.text', '1234567890123456');
        });
    });

    describe('showMaskTyped interaction with empty and filled values', () => {
        it('should show mask placeholder when focused on empty field', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('(000) 000-0000'),
                    showMaskTyped: signal(true),
                },
            });

            cy.get('#masked').click();
            cy.get('#masked').should('have.value', '(___) ___-____');
        });

        it('should clear mask placeholder and show only value when blurred', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('(000) 000-0000'),
                    showMaskTyped: signal(true),
                },
            });

            cy.get('#masked').click().type('123').blur();
            cy.get('#masked').should('have.value', '(123) ___-____');
        });
    });

    describe('showMaskTyped with custom input wrapper (simulating NG_VALUE_ACCESSOR)', () => {
        it('should display initial value correctly with app-level config', () => {
            cy.mount(TestCustomInputWrapperComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '(123) 456-7890');
            cy.get('#value').should('have.text', '1234567890');
        });

        it('should not mark form as dirty with initial value', () => {
            cy.mount(TestCustomInputWrapperComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
        });
    });

    describe('showMaskTyped with async initial value (API simulation)', () => {
        it('should display value correctly after async setValue', () => {
            cy.mount(TestAsyncInitialValueComponent);

            cy.wait(200);
            cy.get('#masked').should('have.value', '(987) 654-3210');
            cy.get('#value').should('have.text', '9876543210');
        });
    });

    describe('showMaskTyped with patchValue', () => {
        it('should display value correctly after patchValue', () => {
            cy.mount(TestPatchValueComponent).then((wrapper) => {
                wrapper.component.form.patchValue('1234567890');
            });

            cy.wait(100);
            cy.get('#masked').should('have.value', '(123) 456-7890');
            cy.get('#value').should('have.text', '1234567890');
        });

        it('should not mark form as dirty after patchValue', () => {
            cy.mount(TestPatchValueComponent).then((wrapper) => {
                wrapper.component.form.patchValue('1234567890');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
        });
    });

    describe('showMaskTyped with simple value binding', () => {
        it('should display value correctly with simple value = "65432"', () => {
            cy.mount(TestSimpleValueBindingComponent);

            cy.wait(100);
            cy.get('#masked').should('have.value', '65432');
            cy.get('#value').should('have.text', '65432');
        });
    });

    describe('showMaskTyped with special masks', () => {
        it('should display IP address correctly with showMaskTyped', () => {
            cy.mount(TestIpMaskComponent);

            cy.wait(100);
            // IP mask formats the input with dots
            cy.get('#masked').invoke('val').should('contain', '192.168.001.001');
        });

        it('should display CPF correctly with showMaskTyped', () => {
            cy.mount(TestCpfCnpjMaskComponent);

            cy.wait(100);
            cy.get('#masked').invoke('val').should('contain', '123.456.789-01');
        });
    });

    describe('showMaskTyped value should not be wiped', () => {
        it('should preserve value when form is initialized with value', () => {
            cy.mount(TestShowMaskTypedFormControlComponent);

            // Check immediately
            cy.get('#value').should('have.text', '1234567890');
            // Check after delay
            cy.wait(200);
            cy.get('#value').should('have.text', '1234567890');
            cy.get('#masked').should('have.value', '(123) 456-7890');
        });

        it('should preserve value in ngModel when initialized with value', () => {
            cy.mount(TestShowMaskTypedNgModelComponent);

            // Check immediately
            cy.get('#value').should('have.text', '1234567890');
            // Check after delay
            cy.wait(200);
            cy.get('#value').should('have.text', '1234567890');
            cy.get('#masked').should('have.value', '(123) 456-7890');
        });

        it('should preserve value in model() signal when initialized with value', () => {
            cy.mount(TestShowMaskTypedModelSignalComponent);

            // Check immediately
            cy.get('#value').should('have.text', '1234567890');
            // Check after delay
            cy.wait(200);
            cy.get('#value').should('have.text', '1234567890');
            cy.get('#masked').should('have.value', '(123) 456-7890');
        });

        it('should preserve value with app-level config when initialized with value', () => {
            cy.mount(TestShowMaskTypedAppConfigComponent);

            // Check immediately
            cy.get('#value').should('have.text', '1234567890');
            // Check after delay
            cy.wait(200);
            cy.get('#value').should('have.text', '1234567890');
            cy.get('#masked').should('have.value', '(123) 456-7890');
        });
    });
});
