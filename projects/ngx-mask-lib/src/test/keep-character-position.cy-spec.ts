import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { signal } from '@angular/core';

describe('Directive: Mask (Delete)', () => {
    it('should replace character to _ mask: (000) 000-0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('(000) 000-0000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('01234567890')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}'.repeat(3))
            .should('have.value', '(012) 45_-_890');
    });

    it('should replace character to _ mask: S0S S0S', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('S0S AAA'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('2')
            .should('have.value', '___ ___')
            .type('A0AB1B')
            .should('have.value', 'A0A B1B')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}'.repeat(4))
            .should('have.value', '___ B1B');
    });

    it('should replace character to _ mask: 000-000.00', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('000-000.00'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('12345678')
            .should('have.value', '123-456.78')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}'.repeat(3))
            .should('have.value', '123-___.78');
    });

    it('should replace character to _ mask: 0000 0000 0000 0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('0000 0000 0000 0000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('1234 5678 1234 5678')
            .should('have.value', '1234 5678 1234 5678')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}'.repeat(4))
            .should('have.value', '1234 5678 ____ 5678')
            .type('{leftArrow}'.repeat(1))
            .type('{backspace}'.repeat(4))
            .should('have.value', '1234 ____ ____ 5678');
    });

    it('should replace character to _ mask: 00/00/0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('00/00/0000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('12345678')
            .should('have.value', '12/34/5678')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}'.repeat(4))
            .should('have.value', '1_/__/5678');
    });

    it('should replace character to _ mask: (000)000-0000, prefix +38', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('(000)000-0000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
                prefix: signal('+38 '),
            },
        });

        cy.get('#masked')
            .type('063 12345678')
            .should('have.value', '+38 (063)123-4567')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}'.repeat(5))
            .should('have.value', '+38 (06_)___-4567');
    });

    it('should replace character to _ mask: 0 000, prefix $', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('0 000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
                prefix: signal('$ '),
            },
        });

        cy.get('#masked')
            .type('1234')
            .should('have.value', '$ 1 234')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}'.repeat(2))
            .should('have.value', '$ _ 234');
    });

    it('should replace character to _ mask: 0000, prefix foo/', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('0000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
                prefix: signal('foo/'),
            },
        });

        cy.get('#masked')
            .type('1234')
            .should('have.value', 'foo/1234')
            .type('{backspace}'.repeat(3))
            .should('have.value', 'foo/1___');
    });

    it('should replace character to _ mask: AAA-AAA-AAA', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('AAA-AAA-AAA'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('TESTING12')
            .should('have.value', 'TES-TIN-G12')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}'.repeat(2))
            .should('have.value', 'TES-__N-G12');
    });

    it('should replace character to _ mask: 0 000 suffix $', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('0 000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
                suffix: signal(' $'),
            },
        });

        cy.get('#masked')
            .type('1234')
            .should('have.value', '1 234 $')
            .type('{leftArrow}'.repeat(1))
            .type('{backspace}'.repeat(2))
            .should('have.value', '1 __4 $');
    });

    it('should replace character to _ mask: 00/00/000 suffix test', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('00/00/000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
                suffix: signal(' test'),
            },
        });

        cy.get('#masked')
            .type('1234567')
            .should('have.value', '12/34/567 test')
            .type('{leftArrow}'.repeat(4))
            .type('{backspace}'.repeat(2))
            .should('have.value', '12/__/567 test');
    });

    it('should delete character from del', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('000-000-000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('123456789')
            .type('{leftArrow}'.repeat(11))
            .type('{del}'.repeat(11))
            .should('have.value', '___-___-___');

        cy.get('#masked').clear();
        cy.get('#masked')
            .type('123456789')
            .type('{leftArrow}'.repeat(4))
            .type('{del}')
            .should('have.value', '123-456-789')
            .should('have.prop', 'selectionStart', 8);
    });

    it('should delete character from del', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('0000 0000 0000 0000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('1234567891011121')
            .type('{leftArrow}'.repeat(5))
            .type('{del}')
            .should('have.value', '1234 5678 9101 1121')
            .should('have.prop', 'selectionStart', 15);
    });
});
