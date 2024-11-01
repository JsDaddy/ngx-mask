import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { CypressTestMaskModule } from './utils/cypress-test.module';

describe('Directive: Mask (Delete)', () => {
    it('should place cursor in right place mask (000) 000-0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '(000) 000-0000',
                showMaskTyped: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').click().should('have.prop', 'selectionStart', 1);
    });

    it('should place cursor in right place mask ((000)) 000-0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '((000)) 000-0000',
                showMaskTyped: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').click().should('have.prop', 'selectionStart', 2);
    });

    it('should place cursor in right place mask 000 000-0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '000 000-0000',
                showMaskTyped: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').click().should('have.prop', 'selectionStart', 0);
    });
});
