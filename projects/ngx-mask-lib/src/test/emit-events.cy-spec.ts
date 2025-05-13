import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { signal } from '@angular/core';

describe('Directive: Mask (emit-events)', () => {
    it('should emit event only when mask is correct', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('00 00 00'),
            },
        });

        cy.get('#masked').type('1dd').type('dd');
        cy.get('#pre').should('have.text', '2');

        cy.get('#masked').type('121212').type('dd');
        cy.get('#pre').should('have.text', '7');
    });

    it('should emit event only when mask is correct with hiddenINput', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('XX-XX-XX'),
                hiddenInput: signal(true),
            },
        });

        cy.get('#masked').type('1dd').type('dd');
        cy.get('#pre').should('have.text', '2');

        cy.get('#masked').type('121212').type('dd');
        cy.get('#pre').should('have.text', '7');
    });

    it('should add trailing zero when mask="separator.1" and leadZero="true"', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.1'),
                leadZero: signal(true),
            },
        });

        cy.get('#masked').type('9').blur().should('have.value', '9.0');
    });

    it('should keep trailing decimal when mask="separator.1" and leadZero="true"', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.1'),
                leadZero: signal(true),
            },
        });

        cy.get('#masked').type('7.7').blur().should('have.value', '7.7');
    });

    it('should emit event only when mask is correct with suffix separator2', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                leadZero: signal(true),
                suffix: signal(' $'),
            },
        });

        cy.get('#masked').type('10').blur().should('have.value', '10.00 $');
        cy.get('#pre').should('have.text', '3');
    });

    it('should emit event only when mask is correct with suffix separator.3', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.3'),
                leadZero: signal(true),
                suffix: signal(' $'),
            },
        });

        cy.get('#masked').type('10.0').blur().should('have.value', '10.000 $');
        cy.get('#pre').should('have.text', '5');
    });

    it('should emit event only when mask is correct with separator2', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                leadZero: signal(true),
            },
        });

        cy.get('#masked').type('10').blur().should('have.value', '10.00');
        cy.get('#pre').should('have.text', '3');
    });

    it('should emit event only when mask is correct with separator.3', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.3'),
                leadZero: signal(true),
            },
        });

        cy.get('#masked').type('10').blur().should('have.value', '10.000');
        cy.get('#pre').should('have.text', '3');
    });

    it('should emit event only when mask is correct with SS000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('SS000'),
            },
        });

        cy.get('#masked').type('SS11111DDDD11').blur().should('have.value', 'SS111');
        cy.get('#pre').should('have.text', '6');
    });

    it("inputTransformFn should not break if it's null", () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('00000||00000-0000'),
                inputTransformFn: signal(null),
            },
        });

        cy.get('#masked').type('123456789').blur().should('have.value', '12345-6789');
        cy.get('#pre').should('have.text', '10');
    });

    it('inputTransformFn should not change input form status', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('Hh:m0'),
                dropSpecialCharacters: signal(false),
                inputTransformFn: signal((value: unknown): string => {
                    if (typeof value !== 'object') {
                        return String(value);
                    }
                    const date = new Date('12-12-2012 11:14:01');
                    return `${String(date.getHours()).padStart(2, '0')}${String(
                        date.getMinutes()
                    ).padStart(2, '0')}`;
                }),
                outputTransformFn: signal((value: string | number | undefined | null) => {
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
                }),
            },
        })
            .wait(10)
            .then((wrapper) => {
                wrapper.component.form.reset();
            });

        cy.get('#pristine').should('have.text', 'true');
        cy.get('#pre').should('have.text', '2');
    });
});
