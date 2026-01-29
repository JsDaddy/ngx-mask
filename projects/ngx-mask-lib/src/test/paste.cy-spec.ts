import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { signal } from '@angular/core';

describe('Directive: Mask (paste)', () => {
    it('should strip spaces when pasting into mask with 0 (required digit)', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('00000000000000'),
            },
        });

        cy.get('#masked')
            .invoke('val', '123 456 789 123 45')
            .trigger('input')
            .should('have.value', '12345678912345');
    });

    it('should strip spaces when pasting into mask with 9 (optional digit)', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('99999999999999'),
            },
        });

        cy.get('#masked')
            .invoke('val', '123 456 789 123 45')
            .trigger('input')
            .should('have.value', '12345678912345');
    });

    it('should handle paste with spaces in mixed mask 00-00-00', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('00-00-00'),
            },
        });

        cy.get('#masked')
            .invoke('val', '12 34 56')
            .trigger('input')
            .should('have.value', '12-34-56');
    });

    it('should handle paste with spaces in mixed mask 99-99-99', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('99-99-99'),
            },
        });

        cy.get('#masked')
            .invoke('val', '12 34 56')
            .trigger('input')
            .should('have.value', '12-34-56');
    });

    it('should handle paste with leading spaces', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('00000000000000'),
            },
        });

        cy.get('#masked')
            .invoke('val', '  123456789')
            .trigger('input')
            .should('have.value', '123456789');
    });

    it('should handle paste with trailing spaces', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('00000000000000'),
            },
        });

        cy.get('#masked')
            .invoke('val', '123456789  ')
            .trigger('input')
            .should('have.value', '123456789');
    });

    it('should handle paste with multiple consecutive spaces', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('00000000000000'),
            },
        });

        cy.get('#masked')
            .invoke('val', '123   456   789')
            .trigger('input')
            .should('have.value', '123456789');
    });

    it('should handle paste with multiple consecutive spaces for optional mask', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('99999999999999'),
            },
        });

        cy.get('#masked')
            .invoke('val', '123   456   789')
            .trigger('input')
            .should('have.value', '123456789');
    });
});
