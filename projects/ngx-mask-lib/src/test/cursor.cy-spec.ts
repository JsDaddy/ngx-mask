import { CypressTestMaskModule } from './utils/cypress-test.module';
import { CypressTestMaskComponent } from './utils/cypress-test-component.component';

describe('Test Date Hh:m0', () => {
    it('Test value Hh:m0', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'Hh:m0',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('2020').should('have.value', '20:20');
        cy.get('#masked').clear();
        cy.get('#masked').type('77').should('have.value', '7:7');
        cy.get('#masked').clear();
        cy.get('#masked').type('777').should('have.value', '7:7');
        cy.get('#masked').clear();
        cy.get('#masked').type('1212').should('have.value', '12:12');
        cy.get('#masked').clear();
    });
    it('Mask Hh:m0 check cursor', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'Hh:m0',
            },
            imports: [CypressTestMaskModule],
        });
        cy.get('#masked').type('77').should('have.prop', 'selectionStart', 3);
        cy.get('#masked').clear();
        cy.get('#masked').type('117').should('have.prop', 'selectionStart', 4);
    });

    it('Mask Hh:m0:s0 check cursor', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'Hh:m0:s0',
            },
            imports: [CypressTestMaskModule],
        });
        cy.get('#masked').type('77').should('have.prop', 'selectionStart', 3);
        cy.get('#masked').clear();
        cy.get('#masked').type('1177').should('have.prop', 'selectionStart', 6);
    });

    it('Mask d0/m0/0000 check cursor', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'd0/m0/0000',
            },
            imports: [CypressTestMaskModule],
        });
        cy.get('#masked').type('77').should('have.prop', 'selectionStart', 3);
        cy.get('#masked').clear();
        cy.get('#masked').type('777').should('have.prop', 'selectionStart', 4);
        cy.get('#masked').clear();
        cy.get('#masked').type('1177').should('have.prop', 'selectionStart', 6);
    });

    it('Mask M0/d0/0000 check cursor', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'M0/d0/0000',
            },
            imports: [CypressTestMaskModule],
        });
        cy.get('#masked').type('88').should('have.prop', 'selectionStart', 3);
        cy.get('#masked').clear();
        cy.get('#masked').type('777').should('have.prop', 'selectionStart', 4);
        cy.get('#masked').clear();
        cy.get('#masked').type('1177').should('have.prop', 'selectionStart', 6);
    });

    it('Mask 0000/M0/d0 check cursor', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '0000/M0/d0',
            },
            imports: [CypressTestMaskModule],
        });
        cy.get('#masked').type('999999').should('have.prop', 'selectionStart', 8);
        cy.get('#masked').clear();
        cy.get('#masked').type('3377118').should('have.prop', 'selectionStart', 9);
    });

    it('Mask Hh:m0:s0 check cursor', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'Hh:m0:s0',
            },
            imports: [CypressTestMaskModule],
        });
        cy.get('#masked')
            .type('910')
            .should('have.prop', 'selectionStart', 4)
            .should('have.value', '9:10');
        cy.get('#masked').clear();
        cy.get('#masked')
            .type('91031')
            .should('have.prop', 'selectionStart', 7)
            .should('have.value', '9:10:31');
    });

    it('Mask (00) 90000-0000 check cursor and value', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '(00) 00009-0000',
            },
            imports: [CypressTestMaskModule],
        });
        cy.get('#masked')
            .type('910')
            .should('have.prop', 'selectionStart', 6)
            .should('have.value', '(91) 0')
            .type('2')
            .should('have.prop', 'selectionStart', 7)
            .should('have.value', '(91) 02')
            .type('2')
            .should('have.prop', 'selectionStart', 8)
            .should('have.value', '(91) 022')
            .type('3')
            .should('have.prop', 'selectionStart', 9)
            .should('have.value', '(91) 0223')
            .type('2')
            .should('have.prop', 'selectionStart', 10)
            .should('have.value', '(91) 02232')
            .type('5')
            .should('have.prop', 'selectionStart', 12)
            .should('have.value', '(91) 02232-5')
            .type('5')
            .should('have.prop', 'selectionStart', 13)
            .should('have.value', '(91) 02232-55')
            .type('5')
            .should('have.prop', 'selectionStart', 14)
            .should('have.value', '(91) 02232-555')
            .type('2')
            .should('have.prop', 'selectionStart', 15)
            .should('have.value', '(91) 02232-5552');
    });

    it('Mask 099.09 check cursor and value', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '099.09',
            },
            imports: [CypressTestMaskModule],
        });
        cy.get('#masked')
            .type('910')
            .should('have.prop', 'selectionStart', 3)
            .should('have.value', '910')
            .type('2')
            .should('have.value', '910.2')
            .should('have.prop', 'selectionStart', 5)
            .type('3')
            .should('have.value', '910.23')
            .should('have.prop', 'selectionStart', 6)
            .clear();
    });

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

    it('Mask d0/M0/0000 should set cursor on right position', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'd0/M0/0000',
                leadZeroDateTime: true,
            },
            imports: [CypressTestMaskModule],
        });
        cy.get('#masked')
            .type('33')
            .should('have.value', '03/03')
            .should('have.prop', 'selectionStart', 5);
    });

    it('Mask d0/M0/0000 should set cursor on right position', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'd0/M0/0000',
                leadZeroDateTime: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('913')
            .should('have.value', '09/01/3')
            .should('have.prop', 'selectionStart', 7);
    });

    it('Mask should work with showMaskTyped 000/00000 with prefix', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '000/00000',
                prefix: '+38 ',
                showMaskTyped: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('123')
            .should('have.value', '+38 123/_____')
            .should('have.prop', 'selectionStart', 7);
    });

    it('Mask should work with showMaskTyped 000/00000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '000/00000',
                showMaskTyped: false,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('123')
            .should('have.value', '123')
            .should('have.prop', 'selectionStart', 3);
    });

    it('dynamic mask after backspace should have right cursor position (000) 000-0000||+000000000000000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '(000) 000-0000||+000000000000000',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('123 45678901')

            .should('have.value', '+1245678901')
            .type('{backspace}')
            .should('have.prop', 'selectionStart', 13);
    });

    it('dynamic mask after backspace should have right cursor position', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '(000) 000-0000||+000000000000000',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('123 4')

            .should('have.value', '(123) 4')
            .type('{backspace}'.repeat(2))
            .should('have.prop', 'selectionStart', 4);
    });

    it('dynamic mask after backspace should have right cursor position (00) 00000000||+00 (00) 00000000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '(00) 00000000||+00 (00) 00000000',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('123')

            .should('have.value', '(12) 3')
            .type('{backspace}'.repeat(2))
            .should('have.prop', 'selectionStart', 3);
    });
});
