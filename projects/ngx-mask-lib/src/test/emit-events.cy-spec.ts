import { CypressTestMaskModule } from './utils/cypress-test.module';
import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
describe('Directive: Mask (emit-events)', () => {
    it('should emit event only when mask is correct', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '00 00 00',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('1dd').type('dd');
        cy.get('#pre').should('have.text', '2');

        cy.get('#masked').type('121212').type('dd');
        cy.get('#pre').should('have.text', '7');
    });

    it('should emit event only when mask is correct with hiddenINput', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'XX-XX-XX',
                hiddenInput: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('1dd').type('dd');
        cy.get('#pre').should('have.text', '2');

        cy.get('#masked').type('121212').type('dd');
        cy.get('#pre').should('have.text', '7');
    });

    it('should emit event only when mask is correct with suffix separator2', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator.2',
                leadZero: true,
                suffix: ' $',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('10').blur().should('have.value', '10.00 $');
        cy.get('#pre').should('have.text', '3');
    });

    it('should emit event only when mask is correct with suffix separator.3', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator.3',
                leadZero: true,
                suffix: ' $',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('10.0').blur().should('have.value', '10.000 $');
        cy.get('#pre').should('have.text', '5');
    });

    it('should emit event only when mask is correct with separator2', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator.2',
                leadZero: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('10').blur().should('have.value', '10.00');
        cy.get('#pre').should('have.text', '3');
    });

    it('should emit event only when mask is correct with separator.3', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator.3',
                leadZero: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('10').blur().should('have.value', '10.000');
        cy.get('#pre').should('have.text', '3');
    });

    it('should emit event only when mask is correct with SS000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'SS000',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('SS11111DDDD11').blur().should('have.value', 'SS111');
        cy.get('#pre').should('have.text', '6');
    });
});
