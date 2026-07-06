import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { signal, Component } from '@angular/core';
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
    it('should not mark form as dirty on initial load with empty value', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('0000'),
            },
        });

        cy.get('#pristine').should('have.text', 'true');
    });

    it('should not mark form as dirty on initial load with separator mask', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
            },
        });

        cy.get('#pristine').should('have.text', 'true');
    });

    it('should not mark form as dirty on initial load with separator mask and leadZero', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                leadZero: signal(true),
            },
        });

        // Wait for any async operations (requestAnimationFrame)
        cy.wait(100);
        cy.get('#pristine').should('have.text', 'true');
    });

    it('should not mark form as dirty on initial load with prefix', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('0000'),
                prefix: signal('$'),
            },
        });

        cy.get('#pristine').should('have.text', 'true');
    });

    it('should not mark form as dirty on initial load with suffix', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('0000'),
                suffix: signal(' USD'),
            },
        });

        cy.get('#pristine').should('have.text', 'true');
    });

    it('should mark form as dirty after user input', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('0000'),
            },
        });

        cy.get('#pristine').should('have.text', 'true');
        cy.get('#masked').type('1234');
        cy.get('#pristine').should('have.text', 'false');
    });

    it('should not mark form as dirty when setValue is called programmatically', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('0000'),
            },
        }).then((wrapper) => {
            wrapper.component.form.setValue('1234');
        });

        cy.wait(100);
        cy.get('#pristine').should('have.text', 'true');
        cy.get('#masked').should('have.value', '1234');
    });

    it('should not mark form as dirty when setValue is called with separator mask', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
            },
        }).then((wrapper) => {
            wrapper.component.form.setValue('1234.56');
        });

        cy.wait(100);
        cy.get('#pristine').should('have.text', 'true');
    });

    it('should not mark form as dirty when setValue is called with separator mask and leadZero', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                leadZero: signal(true),
            },
        }).then((wrapper) => {
            wrapper.component.form.setValue('1234');
        });

        cy.wait(200);
        cy.get('#pristine').should('have.text', 'true');
    });

    it('should not mark form as dirty when component has initial value in FormControl', () => {
        cy.mount(TestInitialValueComponent);

        cy.wait(100);
        cy.get('#pristine').should('have.text', 'true');
        cy.get('#masked').should('have.value', '1234');
    });

    it('should not mark form as dirty when component has initial value with separator mask', () => {
        cy.mount(TestSeparatorInitialComponent);

        cy.wait(200);
        cy.get('#pristine').should('have.text', 'true');
    });

    // Tests for all mask types on initial load with values
    describe('All mask types on initial load with values', () => {
        it('should not mark form as dirty with phone mask initial value', () => {
            cy.mount(TestPhoneInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '(123) 456-7890');
        });

        it('should not mark form as dirty with date mask initial value', () => {
            cy.mount(TestDateInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '12/25/2023');
        });

        it('should not mark form as dirty with time mask initial value', () => {
            cy.mount(TestTimeInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '12:30:45');
        });

        it('should not mark form as dirty with IP address mask initial value', () => {
            cy.mount(TestIpInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '192.168.001.001');
        });

        it('should not mark form as dirty with percent mask initial value', () => {
            cy.mount(TestPercentInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '75');
        });

        it('should not mark form as dirty with CPF mask initial value', () => {
            cy.mount(TestCpfInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '123.456.789-01');
        });

        it('should not mark form as dirty with optional digits mask initial value', () => {
            cy.mount(TestOptionalInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '12');
        });

        it('should not mark form as dirty with letters mask initial value', () => {
            cy.mount(TestLettersInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', 'ABCD');
        });

        it('should not mark form as dirty with alphanumeric mask initial value', () => {
            cy.mount(TestAlphanumericInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', 'A1B2C3');
        });

        it('should not mark form as dirty with prefix initial value', () => {
            cy.mount(TestPrefixInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '$ 1234');
        });

        it('should not mark form as dirty with suffix initial value', () => {
            cy.mount(TestSuffixInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '1234 USD');
        });

        it('should not mark form as dirty with showMaskTyped initial value', () => {
            cy.mount(TestShowMaskTypedInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '(123) 456-7890');
        });

        it('should not mark form as dirty with dropSpecialCharacters false initial value', () => {
            cy.mount(TestKeepSpecialInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '(123) 456-7890');
        });

        it('should not mark form as dirty with credit card mask initial value', () => {
            cy.mount(TestCreditCardInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '1234 5678 9012 3456');
        });

        it('should not mark form as dirty with SSN mask initial value', () => {
            cy.mount(TestSsnInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '123-45-6789');
        });

        it('should not mark form as dirty with ZIP code mask initial value', () => {
            cy.mount(TestZipInitialComponent);

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '12345-6789');
        });
    });

    // Tests for all mask types with programmatic setValue
    describe('All mask types with programmatic setValue', () => {
        it('should not mark form as dirty when setValue with phone mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('(000) 000-0000'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('1234567890');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '(123) 456-7890');
        });

        it('should not mark form as dirty when setValue with date mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('00/00/0000'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('12252023');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '12/25/2023');
        });

        it('should not mark form as dirty when setValue with time mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('00:00:00'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('123045');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '12:30:45');
        });

        it('should not mark form as dirty when setValue with IP mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('099.099.099.099'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('192168001001');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '192.168.001.001');
        });

        it('should not mark form as dirty when setValue with percent mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('percent'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('75');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty when setValue with CPF mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('000.000.000-00'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('12345678901');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '123.456.789-01');
        });

        it('should not mark form as dirty when setValue with optional digits mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('9999'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('12');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '12');
        });

        it('should not mark form as dirty when setValue with letters mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('AAAA'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('ABCD');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', 'ABCD');
        });

        it('should not mark form as dirty when setValue with alphanumeric mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('A0A0A0'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('A1B2C3');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', 'A1B2C3');
        });

        it('should not mark form as dirty when setValue with prefix', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('0000'),
                    prefix: signal('$ '),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('1234');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '$ 1234');
        });

        it('should not mark form as dirty when setValue with suffix', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('0000'),
                    suffix: signal(' USD'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('1234');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '1234 USD');
        });

        it('should not mark form as dirty when setValue with credit card mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('0000 0000 0000 0000'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('1234567890123456');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '1234 5678 9012 3456');
        });

        it('should not mark form as dirty when setValue with SSN mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('000-00-0000'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('123456789');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '123-45-6789');
        });

        it('should not mark form as dirty when setValue with ZIP code mask', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('00000-0000'),
                },
            }).then((wrapper) => {
                wrapper.component.form.setValue('123456789');
            });

            cy.wait(100);
            cy.get('#pristine').should('have.text', 'true');
            cy.get('#masked').should('have.value', '12345-6789');
        });
    });

    // Tests for all mask types on initial load with empty values
    describe('All mask types on initial load with empty values', () => {
        it('should not mark form as dirty with phone mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('(000) 000-0000'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with date mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('00/00/0000'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with time mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('00:00:00'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with IP mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('099.099.099.099'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with percent mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('percent'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with CPF mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('000.000.000-00'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with optional digits mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('9999'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with letters mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('AAAA'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with alphanumeric mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('A0A0A0'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with credit card mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('0000 0000 0000 0000'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with SSN mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('000-00-0000'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });

        it('should not mark form as dirty with ZIP code mask empty', () => {
            cy.mount(CypressTestMaskComponent, {
                componentProperties: {
                    mask: signal('00000-0000'),
                },
            });

            cy.get('#pristine').should('have.text', 'true');
        });
    });
});
