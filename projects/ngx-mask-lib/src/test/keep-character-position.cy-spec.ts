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

        // Note: before the #1544/#1489 fix the digit typed at the adjacent ") " special
        // characters was silently dropped, so this test used to expect '(012) 45_-_890'
        // (the '3' was eaten and the 11th digit slid in). Now all ten digits are kept and
        // the 11th one is rejected, so the same backspaces blank different slots.
        cy.get('#masked')
            .type('01234567890')
            .should('have.value', '(012) 345-6789')
            .type('{leftArrow}'.repeat(3))
            .type('{backspace}'.repeat(3))
            .should('have.value', '(012) 34_-_789');
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

    // #1545 keepCharacterPositions must work without showMaskTyped
    it('should keep position on middle deletion without showMaskTyped mask: M0/d0/0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('M0/d0/0000'),
                keepCharacterPositions: signal(true),
            },
        });

        cy.get('#masked')
            .type('12142020')
            .should('have.value', '12/14/2020')
            .type('{leftArrow}'.repeat(5))
            .type('{backspace}')
            .should('have.value', '12/1_/2020')
            .type('4')
            .should('have.value', '12/14/2020');
    });

    // #1543 leadZeroDateTime + keepCharacterPositions: re-typing into the gap must not shift
    it('should restore deleted month digit with leadZeroDateTime mask: M0-d0-0000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('M0-d0-0000'),
                keepCharacterPositions: signal(true),
                leadZeroDateTime: signal(true),
            },
        });

        cy.get('#masked')
            .type('5052025')
            .should('have.value', '05-05-2025')
            .type('{leftArrow}'.repeat(8))
            .type('{backspace}')
            .should('have.value', '0_-05-2025')
            .type('5')
            .should('have.value', '05-05-2025');
    });

    // #1544 / #1489 (adjacent special characters): 4th digit must not be dropped
    it('should not drop digit typed before adjacent special characters mask: (999) 999-9999', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('(999) 999-9999'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('1234')
            .should('have.value', '(123) 4__-____')
            .type('567890123')
            .should('have.value', '(123) 456-7890')
            .should('have.prop', 'selectionStart', 14);
    });

    // #1527 selection replacement must keep the mask layout
    it('should keep layout when replacing a selected segment mask: 000-000-000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('000-000-000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('111222333')
            .should('have.value', '111-222-333')
            .then(($el) => {
                ($el[0] as HTMLInputElement).setSelectionRange(4, 7);
            })
            .type('4')
            .should('have.value', '111-4__-333')
            .should('have.prop', 'selectionStart', 5);
    });

    // #1527 (comment) selection + DEL must blank the segment, not corrupt the layout
    it('should blank selected segment on del mask: 000-000-000', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('000-000-000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('111222333')
            .should('have.value', '111-222-333')
            .then(($el) => {
                ($el[0] as HTMLInputElement).setSelectionRange(4, 7);
            })
            .type('{del}')
            .should('have.value', '111-___-333');
    });

    // #1632 retype into a backspace-cleared slot must fill from the first typed digit
    it('should replace only month when editing month part with backspace', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('d0/M0/0000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
                dropSpecialCharacters: signal(false),
            },
        });

        cy.get('#masked')
            .type('05062025')
            .should('have.value', '05/06/2025')
            .then(($input) => {
                ($input[0] as HTMLInputElement).setSelectionRange(5, 5); // 05/06|/2025
            })
            .type('{backspace}{backspace}12')
            .should('have.value', '05/12/2025');
    });

    // #1489 (case 1): mask starting with a special character, ctrl+a then type
    it('should keep first typed symbol after select-all when mask starts with special char', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: signal('(000) 000-0000'),
                keepCharacterPositions: signal(true),
                showMaskTyped: signal(true),
            },
        });

        cy.get('#masked')
            .type('1234567890')
            .should('have.value', '(123) 456-7890')
            .type('{selectall}')
            .type('9')
            .should('have.value', '(9__) ___-____')
            .should('have.prop', 'selectionStart', 2);
    });
});
