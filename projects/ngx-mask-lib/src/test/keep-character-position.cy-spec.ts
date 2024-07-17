import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { CypressTestMaskModule } from './utils/cypress-test.module';
import { FormControl } from '@angular/forms';

describe('Directive: Mask (Delete)', () => {
    // it('should replace character to _ mask: (000) 000-0000', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '(000) 000-0000',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('01234567890')
    //         .type('{leftArrow}'.repeat(3))
    //         .type('{backspace}'.repeat(3))
    //         .should('have.value', '(012) 45_-_890');
    // });
    //
    // it('should replace character to _ mask: S0S S0S', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: 'S0S AAA',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('2')
    //         .should('have.value', '___ ___')
    //         .type('A0AB1B')
    //         .should('have.value', 'A0A B1B')
    //         .type('{leftArrow}'.repeat(3))
    //         .type('{backspace}'.repeat(4))
    //         .should('have.value', '___ B1B');
    // });
    //
    // it('should replace character to _ mask: 000-000.00', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '000-000.00',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('12345678')
    //         .should('have.value', '123-456.78')
    //         .type('{leftArrow}'.repeat(3))
    //         .type('{backspace}'.repeat(3))
    //         .should('have.value', '123-___.78');
    // });
    //
    // it('should replace character to _ mask: 0000 0000 0000 0000', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '0000 0000 0000 0000',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('1234 5678 1234 5678')
    //         .should('have.value', '1234 5678 1234 5678')
    //         .type('{leftArrow}'.repeat(5))
    //         .type('{backspace}'.repeat(4))
    //         .should('have.value', '1234 5678 ____ 5678')
    //         .type('{leftArrow}'.repeat(1))
    //         .type('{backspace}'.repeat(4))
    //         .should('have.value', '1234 ____ ____ 5678');
    // });
    //
    // it('should replace character to _ mask: 00/00/0000', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '00/00/0000',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('12345678')
    //         .should('have.value', '12/34/5678')
    //         .type('{leftArrow}'.repeat(5))
    //         .type('{backspace}'.repeat(4))
    //         .should('have.value', '1_/__/5678');
    // });
    //
    // it('should replace character to _ mask: (000)000-0000, prefix +38', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '(000)000-0000',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //             prefix: '+38 ',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('063 12345678')
    //         .should('have.value', '+38 (063)123-4567')
    //         .type('{leftArrow}'.repeat(5))
    //         .type('{backspace}'.repeat(5))
    //         .should('have.value', '+38 (06_)___-4567');
    // });
    //
    // it('should replace character to _ mask: 0 000, prefix $', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '0 000',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //             prefix: '$ ',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('1234')
    //         .should('have.value', '$ 1 234')
    //         .type('{leftArrow}'.repeat(3))
    //         .type('{backspace}'.repeat(2))
    //         .should('have.value', '$ _ 234');
    // });
    //
    // it('should replace character to _ mask: 0000, prefix foo/', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '0000',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //             prefix: 'foo/',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('1234')
    //         .should('have.value', 'foo/1234')
    //         .type('{backspace}'.repeat(3))
    //         .should('have.value', 'foo/1___');
    // });
    //
    // it('should replace character to _ mask: AAA-AAA-AAA', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: 'AAA-AAA-AAA',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('TESTING12')
    //         .should('have.value', 'TES-TIN-G12')
    //         .type('{leftArrow}'.repeat(5))
    //         .type('{backspace}'.repeat(2))
    //         .should('have.value', 'TES-__N-G12');
    // });
    //
    // it('should replace character to _ mask: 0 000 suffix $', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '0 000',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //             suffix: ' $',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('1234')
    //         .should('have.value', '1 234 $')
    //         .type('{leftArrow}'.repeat(1))
    //         .type('{backspace}'.repeat(2))
    //         .should('have.value', '1 __4 $');
    // });
    //
    // it('should replace character to _ mask: 00/00/000 suffix test', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '00/00/000',
    //             keepCharacterPositions: true,
    //             showMaskTyped: true,
    //             suffix: ' test',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('1234567')
    //         .should('have.value', '12/34/567 test')
    //         .type('{leftArrow}'.repeat(4))
    //         .type('{backspace}'.repeat(2))
    //         .should('have.value', '12/__/567 test');
    // });

    it('should replace character to _ mask: 00/00/000 suffix test', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: '00/00/0000',
                keepCharacterPositions: true,
                showMaskTyped: true,
                form: new FormControl(''),
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked').type('12345678').should('have.value', '12/34/5678');
    });
});
