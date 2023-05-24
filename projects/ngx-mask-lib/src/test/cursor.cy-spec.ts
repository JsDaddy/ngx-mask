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
                mask: '(00) 90000-0000',
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
});
