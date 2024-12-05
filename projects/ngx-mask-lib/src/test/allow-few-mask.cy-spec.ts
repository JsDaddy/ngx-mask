import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { signal } from '@angular/core';

describe('Test Date Hh:m0', () => {
    it('dynamic mask after backspace should have right cursor position (000) 000-0000||+000000000000000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('(000) 000-0000||+000000000000000'),
            },
        });

        cy.get('#masked').type('11111111111').should('have.value', '+11111111111');
        cy.get('#masked')
            .type('{backspace}')
            .should('have.value', '(111) 111-1111')
            .should('have.prop', 'selectionStart', 14);
    });

    it('dynamic mask after backspace should have right cursor position', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('(000) 000-0000||+000000000000000'),
            },
        });

        cy.get('#masked')
            .type('1234567890')

            .should('have.value', '(123) 456-7890')
            .type('{leftArrow}'.repeat(7))
            .type('{backspace}')
            .should('have.prop', 'selectionStart', 5);
    });

    it('dynamic mask after backspace should have right cursor position (00) 00000000||+00 (00) 00000000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('(00) 00000000||+00 (00) 00000000'),
            },
        });

        cy.get('#masked').type('111').should('have.value', '(11) 1');
        cy.get('#masked').type('{backspace}').should('have.prop', 'selectionStart', 4);
    });

    it('dynamic mask after backspace should have right cursor position 00) 000-00-00||00) 000-00-00; 0 (000) 000-00-00', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('00) 000-00-00||00) 000-00-00; 0 (000) 000-00-00'),
                showMaskTyped: signal(true),
                dropSpecialCharacters: signal(false),
                prefix: signal('8 (0'),
                specialCharacters: signal(['(', ')', '-', ';', '.', ' ']),
            },
        });

        cy.get('#masked')
            .type('123456789 11')
            .should('have.value', '8 (012) 345-67-89; 1 (1__) ___-__-__')
            .type('{leftArrow}'.repeat(6))
            .type('{backspace}')
            .should('have.prop', 'selectionStart', 16)
            .should('have.value', '8 (012) 345-67-81; 1 (___) ___-__-__')
            .type('{backspace}')
            .should('have.prop', 'selectionStart', 17)
            .should('have.value', '8 (012) 345-67-11');
    });
});
