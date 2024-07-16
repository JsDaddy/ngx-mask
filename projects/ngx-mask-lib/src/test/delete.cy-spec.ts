import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { CypressTestMaskModule } from './utils/cypress-test.module';
// import { FormControl } from '@angular/forms';

describe('Directive: Mask (Delete)', () => {
    // it('cursor should correct delete with ViewEncapsulation.ShadowDom showMaskTyped=true', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '(000) 000-0000',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('1231231234')
    //         .focus()
    //         .type('{backspace}')
    //         .type('{backspace}')
    //         .should('have.value', '(123) 123-12');
    // });
    //
    // it('should delete character in input', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '00/00/0000',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('12/34/5678')
    //         .focus()
    //         .type('{backspace}')
    //         .should('have.value', '12/34/567');
    // });
    //
    // it('should not delete special mask character', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '00/00/0000',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('12/34/5678')
    //         .type('{backspace}')
    //         .should('have.value', '12/34/567')
    //         .should('have.prop', 'selectionStart', 9);
    // });
    //
    // it('should delete secure character', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: 'XXX/X0/0000',
    //             hiddenInput: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('123/45/6789')
    //         .type('{backspace}')
    //         .should('have.value', '***/*5/678')
    //         .should('have.prop', 'selectionStart', 10);
    // });
    //
    // it('should delete selection', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '000 000 000',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('123456789')
    //         .type('{backspace}')
    //         .should('have.value', '123 456 78')
    //         .should('have.prop', 'selectionStart', 10);
    // });
    // it('should delete prefix', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '000 000 000',
    //             prefix: '+7',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked').type('1').type('{backspace}').should('have.value', '');
    // });
    // it('should delete suffix', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '000 000 000',
    //             suffix: '$',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked').type('1').type('{backspace}').should('have.value', '');
    // });
    //
    // it('should delete specialCharacter from allow few mask', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '(00) 00000000||+00 (00) 00000000',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('123')
    //         .should('have.value', '(12) 3')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 5)
    //         .should('have.value', '(12) ')
    //         .type('{rightArrow}')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 4);
    // });
    //
    // it('should return value from ctrl+V', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '9999999999999',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('15')
    //         .should('have.value', '15')
    //         .type('{selectall}')
    //         .type('{backspace}')
    //         .should('have.value', '')
    //         .invoke('val', '15')
    //         .trigger('input');
    //     cy.get('#pre1').should('have.text', '15');
    // });
    //
    // it('should not delete special character from backspace', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             form: new FormControl('12345678'),
    //             mask: '00D : 00H : 00M : 00S',
    //             shownMaskExpression: '00D : 00H : 00M : 00S',
    //             showMaskTyped: true,
    //             dropSpecialCharacters: false,
    //             leadZeroDateTime: true,
    //             placeHolderCharacter: '',
    //             patterns: {
    //                 '0': { pattern: /\d/ },
    //                 '9': { pattern: /\d/, optional: true },
    //                 A: { pattern: /[a-zA-Z0-9]/ },
    //                 L: { pattern: /[a-z]/ },
    //                 S: { pattern: /[a-zA-Z]/ },
    //                 U: { pattern: /[A-Z]/ },
    //                 X: { pattern: /\d/, symbol: '*' },
    //                 d: { pattern: /\d/ },
    //                 h: { pattern: /\d/ },
    //                 s: { pattern: /\d/ },
    //                 D: { pattern: /D/ }, // custom: The D on the mask can only be the D character
    //                 H: { pattern: /H/ }, // custom: the H on the mask can only be the H character
    //                 M: { pattern: /M/ }, // custom: the M on the mask can only be the M character
    //                 '\\S': { pattern: /\S/ }, // custom: the S on the mask can only be the S character. Escape it to prevent digits from being removed from the value
    //             },
    //             specialCharacters: [
    //                 '-',
    //                 '/',
    //                 '(',
    //                 ')',
    //                 '.',
    //                 ':',
    //                 ' ',
    //                 '+',
    //                 ',',
    //                 '@',
    //                 '[',
    //                 ']',
    //                 '"',
    //                 "'",
    //                 'D',
    //                 'H',
    //                 'M',
    //                 '\\S',
    //             ],
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //     cy.get('#masked')
    //         .type('{rightArrow}'.repeat(1))
    //         .type('{leftArrow}'.repeat(3))
    //         .type('{backspace}')
    //         .should('have.value', '12D : 34H : 56M : 78S')
    //         .type('{leftArrow}'.repeat(2))
    //         .type('{backspace}')
    //         .should('have.value', '12D : 34H : 56M : 78S')
    //         .type('{leftArrow}'.repeat(2))
    //         .type('{backspace}')
    //         .should('have.value', '12D : 34H : 56M : 78S');
    // });
    //
    // it('should backspace with showMaskTyped and prefix', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '(000) 000-0000',
    //             prefix: '+7 ',
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('1234567890')
    //         .should('have.value', '+7 (123) 456-7890')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 16)
    //         .should('have.value', '+7 (123) 456-789_')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 15)
    //         .should('have.value', '+7 (123) 456-78__')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 14)
    //         .should('have.value', '+7 (123) 456-7___')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 12)
    //         .should('have.value', '+7 (123) 456-____')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 11)
    //         .should('have.value', '+7 (123) 45_-____')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 10)
    //         .should('have.value', '+7 (123) 4__-____')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 7)
    //         .should('have.value', '+7 (123) ___-____')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 6)
    //         .should('have.value', '+7 (12_) ___-____')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 5)
    //         .should('have.value', '+7 (1__) ___-____')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 3)
    //         .should('have.value', '+7 (___) ___-____');
    // });
    //
    // it('should backspace with showMaskTyped and prefix', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: '00 000 00 00',
    //             prefix: '+32 ',
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('1234567890')
    //         .should('have.value', '+32 12 345 67 89')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 15)
    //         .should('have.value', '+32 12 345 67 8_')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 13)
    //         .should('have.value', '+32 12 345 67 __')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 12)
    //         .should('have.value', '+32 12 345 6_ __')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 10)
    //         .should('have.value', '+32 12 345 __ __')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 9)
    //         .should('have.value', '+32 12 34_ __ __')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 8)
    //         .should('have.value', '+32 12 3__ __ __')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 6)
    //         .should('have.value', '+32 12 ___ __ __')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 5)
    //         .should('have.value', '+32 1_ ___ __ __')
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 4)
    //         .should('have.value', '+32 __ ___ __ __');
    // });
    //
    // it('should backspace with separator and prefix', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: 'separator.2',
    //             thousandSeparator: ',',
    //             prefix: '$ ',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('1234567890')
    //         .should('have.value', '$ 1,234,567,890')
    //         .type('{leftArrow}'.repeat(3))
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 10);
    // });
    //
    // it('should backspace with separator and prefix', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: 'separator.2',
    //             thousandSeparator: '.',
    //             prefix: '$ ',
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('1234567890')
    //         .should('have.value', '$ 1.234.567.890')
    //         .type('{leftArrow}'.repeat(3))
    //         .type('{backspace}')
    //         .should('have.prop', 'selectionStart', 10);
    // });
    //
    // it('should backspace with showMaskTyped and leadZeroDateTime', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: 'M0-d0-0000',
    //             leadZeroDateTime: true,
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('12310000')
    //         .should('have.value', '12-31-0000')
    //         .type('{backspace}'.repeat(8))
    //         .should('have.value', '__-__-____');
    // });
    //
    // it('should backspace with showMaskTyped and leadZeroDateTime', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: 'M0/d0/0000',
    //             leadZeroDateTime: true,
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('12310000')
    //         .should('have.value', '12/31/0000')
    //         .type('{backspace}'.repeat(8))
    //         .should('have.value', '__/__/____');
    // });
    //
    // it('should backspace with showMaskTyped and leadZeroDateTime', () => {
    //     cy.mount(CypressTestMaskComponent, {
    //         componentProperties: {
    //             mask: 'M0:d0:0000',
    //             leadZeroDateTime: true,
    //             showMaskTyped: true,
    //         },
    //         imports: [CypressTestMaskModule],
    //     });
    //
    //     cy.get('#masked')
    //         .type('12310000')
    //         .should('have.value', '12:31:0000')
    //         .type('{backspace}'.repeat(8))
    //         .should('have.value', '__:__:____');
    // });

    it('should correct work after backspace separator.6 decimalMarker . thousandSeparator ,', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator.6',
                decimalMarker: '.',
                thousandSeparator: ',',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('0.000001')
            .should('have.value', '0.000001')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '0.00001')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '0.0001')
            .type('{backspace}')
            .should('have.value', '1');
    });

    it('should correct work after backspace separator.2 decimalMarker . thousandSeparator ,', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator.2',
                decimalMarker: '.',
                thousandSeparator: ',',
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('0.01')
            .should('have.value', '0.01')
            .type('{leftArrow}')
            .type('{backspace}')
            .should('have.value', '0.1')
            .type('{leftArrow}')
            .type('{backspace}')
            .should('have.value', '1');
    });

    it('should correct work after backspace separator.2 decimalMarker . thousandSeparator , allowNegative', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator.2',
                decimalMarker: '.',
                thousandSeparator: ',',
                allowNegativeNumbers: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('-0.01')
            .should('have.value', '-0.01')
            .type('{leftArrow}')
            .type('{backspace}')
            .should('have.value', '-0.1')
            .type('{leftArrow}')
            .type('{backspace}')
            .should('have.value', '-1');
    });

    it('should correct work after backspace separator.3 decimalMarker . thousandSeparator , allowNegative', () => {
        cy.mount(CypressTestMaskComponent, {
            componentProperties: {
                mask: 'separator.3',
                decimalMarker: '.',
                thousandSeparator: ',',
                allowNegativeNumbers: true,
            },
            imports: [CypressTestMaskModule],
        });

        cy.get('#masked')
            .type('-0.014')
            .should('have.value', '-0.014')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '-0.14')
            .type('{leftArrow}'.repeat(2))
            .type('{backspace}')
            .should('have.value', '-14');
    });
});
