import { initEnv, mount } from 'cypress-angular-unit-test';
import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from '../lib/ngx-mask.module';

describe('Directive: Mask (Delete)', () => {
  beforeEach(() => {
    initEnv(CypressTestMaskComponent, {
      imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskModule.forRoot()],
    });
  });

  it('should delete character in input', () => {
    mount(CypressTestMaskComponent, {
      mask: '00/00/0000',
      hiddenInput: true,
      prefix: '',
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
      mask: '00/00/0000',
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
      mask: 'XXX/X0/0000',
      hiddenInput: true,
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
      mask: '(00) 00',
      prefix: '+1 ',
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
      mask: '000 000 000',
    });

    const inputTarget = cy.get('input');
    inputTarget.type('123456789');
    inputTarget.setSelectionRange(4, 7);
    inputTarget.type('{backspace}');

    inputTarget.should('have.value', '123 789');
    inputTarget.should('have.prop', 'selectionStart', 3);
  });
});
