import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { signal } from '@angular/core';
import type { NgxMaskConfig } from 'ngx-mask';

describe('Test Date Hh:m0', () => {
    it('Mask separator.2 check cursor with value 100.0', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal('.'),
                thousandSeparator: signal(','),
            },
        });
        cy.get('#masked')
            .type('1000')
            .type('{leftArrow}')
            .type('.')
            .should('have.value', '100.0')
            .should('have.prop', 'selectionStart', 4);
    });

    it('Mask separator.2 check cursor with value 1.00', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal('.'),
                thousandSeparator: signal(','),
            },
        });
        cy.get('#masked')
            .type('1000')
            .type('{leftArrow}'.repeat(3))
            .type('.')
            .should('have.value', '1.00')
            .should('have.prop', 'selectionStart', 2);
    });

    it('Mask separator.2 check cursor with value 123456789.20', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal('.'),
                thousandSeparator: signal(','),
            },
        });
        cy.get('#masked')
            .type('123456789.20')
            .type('{leftArrow}'.repeat(4))
            .type('.')
            .should('have.value', '12,345,678.9')
            .should('have.prop', 'selectionStart', 11);
    });

    it('Mask separator.2 check cursor with value 100.0', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal(','),
                thousandSeparator: signal('.'),
            },
        });
        cy.get('#masked')
            .type('1000')
            .type('{leftArrow}')
            .type(',')
            .should('have.value', '100,0')
            .should('have.prop', 'selectionStart', 4);
    });

    it('Mask separator.2 check cursor with value 1.00', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal(','),
                thousandSeparator: signal('.'),
            },
        });
        cy.get('#masked')
            .type('1000')
            .type('{leftArrow}'.repeat(3))
            .type(',')
            .should('have.value', '1,00')
            .should('have.prop', 'selectionStart', 2);
    });

    it('Mask separator.2 check cursor with value 123456789.20', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal(','),
                thousandSeparator: signal('.'),
            },
        });
        cy.get('#masked')
            .type('123456789,20')
            .type('{leftArrow}'.repeat(4))
            .type(',')
            .should('have.value', '12.345.678,9')
            .should('have.prop', 'selectionStart', 11);
    });

    it('when decimalMarker doenst set should have right position cursor thousandSeparator = .', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                thousandSeparator: signal('.'),
            },
        });

        cy.get('#masked')
            .type('12345678,00')

            .should('have.value', '12.345.678,00')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}'.repeat(3))
            .should('have.value', '12.345,00');
    });

    it('when decimalMarker doenst set should have right position cursor thousandSeparator = ,', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                thousandSeparator: signal(','),
            },
        });

        cy.get('#masked')
            .type('12345678.00')

            .should('have.value', '12,345,678.00')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}'.repeat(3))
            .should('have.value', '12,345.00');
    });

    it('should place cursor after backspace with separatorLimit = 10 in correct position', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                separatorLimit: signal('10'),
            },
        });

        cy.get('#masked')
            .type('12.10')
            .should('have.value', '12.10')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '12')
            .should('have.prop', 'selectionStart', 2);
    });

    it('should place cursor after backspace with separatorLimit = 100 in correct position', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                separatorLimit: signal('100'),
            },
        });

        cy.get('#masked')
            .type('123.10')
            .should('have.value', '123.10')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '123')
            .should('have.prop', 'selectionStart', 3);
    });

    it('should place cursor after backspace with separatorLimit = 1000 in correct position', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                thousandSeparator: signal(','),
                separatorLimit: signal('1000'),
            },
        });

        cy.get('#masked')
            .type('1234.10')
            .should('have.value', '1,234.10')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '1,234')
            .should('have.prop', 'selectionStart', 5);
    });

    it('should backspace with separator and prefix', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                thousandSeparator: signal(','),
                prefix: signal('$ '),
            },
        });

        cy.get('#masked')
            .type('1234567890')
            .should('have.value', '$ 1,234,567,890')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}')
            .should('have.prop', 'selectionStart', 11);
    });

    it('should backspace with separator and prefix', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                thousandSeparator: signal('.'),
                prefix: signal('$ '),
            },
        });

        cy.get('#masked')
            .type('1234567890')
            .should('have.value', '$ 1.234.567.890')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}')
            .should('have.prop', 'selectionStart', 11);
    });

    it('should correct work after backspace separator.6 decimalMarker . thousandSeparator ,', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.6'),
                decimalMarker: signal('.'),
                thousandSeparator: signal(','),
            },
        });

        cy.get('#masked')
            .type('0.000001')
            .should('have.value', '0.000001')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '0.00001')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '0.0001')
            .type('{backspace}')
            .should('have.value', '1');
    });

    it('should correct work after backspace separator.2 decimalMarker . thousandSeparator ,', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal('.'),
                thousandSeparator: signal(','),
            },
        });

        cy.get('#masked')
            .type('0.01')
            .should('have.value', '0.01')
            .type('{leftArrow}')
            .type('{backspace}')
            .should('have.value', '0.1')
            .type('{leftArrow}')
            .type('{backspace}')
            .should('have.value', '1');
    });

    it('should correct work after backspace separator.2 decimalMarker . thousandSeparator , allowNegative', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal('.'),
                thousandSeparator: signal(','),
                allowNegativeNumbers: signal(true),
            },
        });

        cy.get('#masked')
            .type('-0.01')
            .should('have.value', '-0.01')
            .type('{leftArrow}')
            .type('{backspace}')
            .should('have.value', '-0.1')
            .type('{leftArrow}')
            .type('{backspace}')
            .should('have.value', '-1');
    });

    it('should correct work after backspace separator.3 decimalMarker . thousandSeparator , allowNegative', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.3'),
                decimalMarker: signal('.'),
                thousandSeparator: signal(','),
                allowNegativeNumbers: signal(true),
            },
        });

        cy.get('#masked')
            .type('-0.014')
            .should('have.value', '-0.014')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '-0.14')
            .type('{leftArrow}')
            .type('{backspace}')
            .should('have.value', '-14');
    });

    it('should correct work after backspace separator.3 leadZero allowNegative', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.3'),
                allowNegativeNumbers: signal(true),
                leadZero: signal(true),
            },
        });

        cy.get('#masked')
            .type('-0.1')
            .should('have.value', '-0.1')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '-1')
            .type('{rightArrow}')
            .type('{backspace}')
            .should('have.value', '-');
    });

    it('should correct work after backspace separator', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator'),
            },
        });

        cy.get('#masked')
            .type('0.33')
            .should('have.value', '0.33')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '33');
    });

    it('should correct work after backspace separator leadZero', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator'),
                leadZero: signal(true),
            },
        });

        cy.get('#masked')
            .type('0.33')
            .should('have.value', '0.33')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '33');
    });

    it('should correct work after backspace separator allowNegativeNumbers', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator'),
                allowNegativeNumbers: signal(true),
            },
        });

        cy.get('#masked')
            .type('-0.33')
            .should('have.value', '-0.33')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '-33');
    });

    it('should correct work after backspace separator leadZero', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator'),
                leadZero: signal(true),
                allowNegativeNumbers: signal(true),
            },
        });

        cy.get('#masked')
            .type('-0.33')
            .should('have.value', '-0.33')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '-33');
    });

    it('should correct work after backspace separator.2 when first digit .', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                thousandSeparator: signal('.'),
            },
        });

        cy.get('#masked')
            .type('50004')
            .should('have.value', '50.004')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}')
            .should('have.value', '4');
    });

    it('should correct work after backspace separator.2 when first digit ,', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                thousandSeparator: signal(','),
            },
        });

        cy.get('#masked')
            .type('50004')
            .should('have.value', '50,004')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}')
            .should('have.value', '4');
    });

    it('should correct work after backspace separator.2 when first digit whitespace', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                thousandSeparator: signal(' '),
            },
        });

        cy.get('#masked')
            .type('50004')
            .should('have.value', '50 004')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}')
            .should('have.value', '4');
    });

    it('should correct work after backspace separator.2 when first digit 0', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
            },
        });

        cy.get('#masked')
            .type('50.05')
            .should('have.value', '50.05')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}')
            .should('have.value', '5.05');
    });

    it('should correct work after backspace separator.2 when first digit 0', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
            },
        });

        cy.get('#masked')
            .type('0.05')
            .should('have.value', '0.05')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}')
            .should('have.value', '5');
    });

    it('should correct work after backspace separator.2 when after first digit 0', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal(','),
                thousandSeparator: signal(' '),
            },
        });

        cy.get('#masked')
            .type('1 000 000,05')
            .should('have.value', '1 000 000,05')
            .type('{leftArrow}'.repeat(11))
            .type('{backspace}')
            .should('have.value', '0,05');

        cy.get('#masked').clear();

        cy.get('#masked')
            .type('60,05')
            .should('have.value', '60,05')
            .type('{leftArrow}'.repeat(4))
            .type('{backspace}')
            .should('have.value', '0,05');
    });

    it('should correct work after backspace separator.2 when after first digit 0', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal('.'),
                thousandSeparator: signal(' '),
            },
        });

        cy.get('#masked')
            .type('200.05')
            .should('have.value', '200.05')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}')
            .should('have.value', '0.05');
    });

    it('should correct work after backspace separator.2 with default values', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal(['.', ','] as NgxMaskConfig['decimalMarker']),
                thousandSeparator: signal(' '),
            },
        });

        cy.get('#masked')
            .type('1000000,35')
            .should('have.value', '1 000 000,35')
            .type('{leftArrow}'.repeat(11))
            .type('{backspace}')
            .should('have.value', '0,35');

        cy.get('#masked').clear();

        cy.get('#masked')
            .type('1000000.35')
            .should('have.value', '1 000 000.35')
            .type('{leftArrow}'.repeat(11))
            .type('{backspace}')
            .should('have.value', '0.35');
    });

    it('should correct work after backspace separator.2 with default values', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal(['.', ','] as NgxMaskConfig['decimalMarker']),
                thousandSeparator: signal(' '),
            },
        });

        cy.get('#masked')
            .type('60,35')
            .should('have.value', '60,35')
            .type('{leftArrow}'.repeat(4))
            .type('{backspace}')
            .should('have.value', '0,35');

        cy.get('#masked').clear();

        cy.get('#masked')
            .type('60.35')
            .should('have.value', '60.35')
            .type('{leftArrow}'.repeat(4))
            .type('{backspace}')
            .should('have.value', '0.35');
    });

    it('should correct work after backspace separator.2 with default values', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('separator.2'),
                decimalMarker: signal(['.', ','] as NgxMaskConfig['decimalMarker']),
                thousandSeparator: signal(' '),
            },
        });

        cy.get('#masked')
            .type('200,35')
            .should('have.value', '200,35')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}')
            .should('have.value', '0,35');

        cy.get('#masked').clear();

        cy.get('#masked')
            .type('200.35')
            .should('have.value', '200.35')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}')
            .should('have.value', '0.35');
    });
});
