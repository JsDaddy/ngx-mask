import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { signal } from '@angular/core';

describe('Directive: Mask (Delete)', () => {
    it('should place cursor in right place mask (000) 000-0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('(000) 000-0000'),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked').click().should('have.prop', 'selectionStart', 1);
    });

    it('should place cursor in right place mask ((000)) 000-0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('((000)) 000-0000'),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked').click().should('have.prop', 'selectionStart', 2);
    });

    it('should place cursor in right place mask 000 000-0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('000 000-0000'),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked').click().should('have.prop', 'selectionStart', 0);
    });

    it('should place cursor in right place mask (000) 000-0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('(000) 000-0000'),
                showMaskTyped: signal(true),
                prefix: signal('+380 '),
            },
        });

        cy.get('#masked').click().should('have.prop', 'selectionStart', 6);
    });
});
