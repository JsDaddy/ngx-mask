import { CypressTestMaskModule } from './utils/cypress-test.module';
import { CypressTestMaskComponent } from './utils/cypress-test-component.component';

describe('Test Date Hh:m0', () => {
    it('Mask separator.2 check cursor with value 100.0', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator.2',
                decimalMarker: '.',
                thousandSeparator: ',',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                decimalMarker: '.',
                thousandSeparator: ',',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                decimalMarker: '.',
                thousandSeparator: ',',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                decimalMarker: ',',
                thousandSeparator: '.',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                decimalMarker: ',',
                thousandSeparator: '.',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                decimalMarker: ',',
                thousandSeparator: '.',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                thousandSeparator: '.',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                thousandSeparator: ',',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                separatorLimit: '10',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                separatorLimit: '100',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                thousandSeparator: ',',
                separatorLimit: '1000',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                thousandSeparator: ',',
                prefix: '$ ',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                thousandSeparator: '.',
                prefix: '$ ',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.6',
                decimalMarker: '.',
                thousandSeparator: ',',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                decimalMarker: '.',
                thousandSeparator: ',',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                decimalMarker: '.',
                thousandSeparator: ',',
                allowNegativeNumbers: true,
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.3',
                decimalMarker: '.',
                thousandSeparator: ',',
                allowNegativeNumbers: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('-0.014')
            .should('have.value', '-0.014')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '-0.14')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '-14');
    });

    it('should correct work after backspace separator.3 leadZero allowNegative', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator.3',
                allowNegativeNumbers: true,
                leadZero: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('-0.1')
            .should('have.value', '-0.1')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '-1')
            .type('{backspace}')
            .should('have.value', '-');
    });

    it('should correct work after backspace separator', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator',
                leadZero: true,
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator',
                allowNegativeNumbers: true,
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator',
                leadZero: true,
                allowNegativeNumbers: true,
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                thousandSeparator: '.',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                thousandSeparator: ',',
            },
            imports: [CypressTestMaskModule],
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
                mask: 'separator.2',
                thousandSeparator: ' ',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('50004')
            .should('have.value', '50 004')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}')
            .should('have.value', '4');
    });
});
