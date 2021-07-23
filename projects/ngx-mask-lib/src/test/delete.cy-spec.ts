import { mount } from '@jscutlery/cypress-angular/mount';
import { CypressTestMaskComponent, CypressTestMaskModule } from './utils/cypress-test-component.component';

describe('Directive: Mask (Delete)', () => {
  it('should delete character in input', () => {
    mount(CypressTestMaskComponent, {
      inputs: {
        mask: '00/00/0000',
      },
      imports: [CypressTestMaskModule],
    });

    const inputTarget = cy.get('input');
    inputTarget.type('12/34/5678');
    inputTarget.focus();
    inputTarget.setSelectionRange(1, 1);
    inputTarget.type('{backspace}');

    inputTarget.should('have.value', '23/45/678');
  });

  it('should not delete special mask character', () => {
    mount(CypressTestMaskComponent, {
      inputs: {
        mask: '00/00/0000',
      },
      imports: [CypressTestMaskModule],
    });

    const inputTarget = cy.get('input');
    inputTarget.type('12/34/5678');
    inputTarget.setSelectionRange(3, 3);
    inputTarget.type('{backspace}');

    inputTarget.should('have.value', '12/34/5678');
    inputTarget.should('have.prop', 'selectionStart', 2);
  });

  it('should delete secure character', () => {
    mount(CypressTestMaskComponent, {
      inputs: {
        mask: 'XXX/X0/0000',
        hiddenInput: true,
      },
      imports: [CypressTestMaskModule],
    });

    const inputTarget = cy.get('input');
    inputTarget.type('123/45/6789');
    inputTarget.setSelectionRange(3, 3);
    inputTarget.type('{backspace}');

    inputTarget.should('have.value', '***/*6/789');
    inputTarget.should('have.prop', 'selectionStart', 2);
  });

  it('should not delete prefix', () => {
    mount(CypressTestMaskComponent, {
      inputs: {
        mask: '(00) 00',
        prefix: '+1 ',
      },
      imports: [CypressTestMaskModule],
    });

    const inputTarget = cy.get('input');
    inputTarget.type('1234');
    inputTarget.setSelectionRange(3, 3);
    inputTarget.type('{backspace}');

    inputTarget.should('have.value', '+1 (12) 34');
    inputTarget.should('have.prop', 'selectionStart', 3);
  });

  it('should delete selection', () => {
    mount(CypressTestMaskComponent, {
      inputs: {
        mask: '000 000 000',
      },
      imports: [CypressTestMaskModule],
    });

    const inputTarget = cy.get('input');
    inputTarget.type('123456789');
    inputTarget.setSelectionRange(4, 7);
    inputTarget.type('{backspace}');

    inputTarget.should('have.value', '123 789');
    inputTarget.should('have.prop', 'selectionStart', 3);
  });
});
