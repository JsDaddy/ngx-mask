import { CypressTestTriggerOnMaskChangeComponent } from './utils/cypress-test-trigger-on-mask-change.component';

describe('Directive: Mask (Trigger on mask change) [Cypress]', () => {
    it('should put back initial value if mask is toggled', async () => {
        cy.mount(CypressTestTriggerOnMaskChangeComponent);

        cy.get('#masked').type('7912345678').should('have.value', '7912345678');
        cy.get('.formvalue').should('have.text', '7912345678');

        cy.get('input[value="ch"]').click();
        cy.get('input#masked').should('have.value', '79 123 45 67');
        cy.get('.formvalue').should('have.text', '791234567');

        cy.get('input[value="de"]').click();
        cy.get('input#masked').should('have.value', '7912345678');
        cy.get('.formvalue').should('have.text', '7912345678');
    });
});
