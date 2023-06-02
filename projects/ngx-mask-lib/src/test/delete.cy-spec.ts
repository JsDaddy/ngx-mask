import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { CypressTestMaskModule } from './utils/cypress-test.module';

describe('Directive: Mask (Delete)', () => {
    it('cursor should correct delete with ViewEncapsulation.ShadowDom showMaskTyped=true', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '(000) 000-0000',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('1231231234')
            .focus()
            .type('{backspace}')
            .type('{backspace}')
            .should('have.value', '(123) 123-12');
    });

    it('should delete character in input', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '00/00/0000',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('12/34/5678')
            .focus()
            .type('{backspace}')
            .should('have.value', '12/34/567');
    });

    it('should not delete special mask character', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '00/00/0000',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('12/34/5678')
            .type('{backspace}')
            .should('have.value', '12/34/567')
            .should('have.prop', 'selectionStart', 9);
    });

    it('should delete secure character', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'XXX/X0/0000',
                hiddenInput: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('123/45/6789')
            .type('{backspace}')
            .should('have.value', '***/*5/678')
            .should('have.prop', 'selectionStart', 10);
    });

    it('should delete selection', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '000 000 000',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('123456789')
            .type('{backspace}')
            .should('have.value', '123 456 78')
            .should('have.prop', 'selectionStart', 10);
    });
    it('should delete prefix', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '000 000 000',
                prefix: '+7',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('1').type('{backspace}').should('have.value', '');
    });
    it('should delete prefix', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '(000) 000 000',
                prefix: '+7',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('1')
            .type('{backspace}')
            .should('have.value', '')
            .type('f')
            .should('have.value', '+7(');
    });
    it('should delete suffix', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '000 000 000',
                suffix: '$',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('1').type('{backspace}').should('have.value', '');
    });
});
