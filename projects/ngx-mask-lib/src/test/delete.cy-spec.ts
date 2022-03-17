import { mount } from '@jscutlery/cypress-angular/mount';
import { CypressTestMaskComponent } from './utils/cypress-test-component.component';
import { CypressTestMaskModule } from './utils/cypress-test.module';

describe('Directive: Mask (Delete)', () => {
	it('should delete character in input', () => {
		mount(CypressTestMaskComponent, {
			inputs: {
				mask: '00/00/0000',
			},
			imports: [CypressTestMaskModule],
		});

		cy.get('input#masked')
			.type('12/34/5678')
			.focus()
			.setSelectionRange(1, 1)
			.type('{backspace}')
			.should('have.value', '23/45/678');
	});

	it('should not delete special mask character', () => {
		mount(CypressTestMaskComponent, {
			inputs: {
				mask: '00/00/0000',
			},
			imports: [CypressTestMaskModule],
		});

		cy.get('input#masked')
			.type('12/34/5678')
			.setSelectionRange(3, 3)
			.type('{backspace}')
			.should('have.value', '12/34/5678')
			.should('have.prop', 'selectionStart', 2);
	});

	it('should delete secure character', () => {
		mount(CypressTestMaskComponent, {
			inputs: {
				mask: 'XXX/X0/0000',
				hiddenInput: true,
			},
			imports: [CypressTestMaskModule],
		});

		cy.get('input#masked')
			.type('123/45/6789')
			.setSelectionRange(3, 3)
			.type('{backspace}')
			.should('have.value', '***/*6/789')
			.should('have.prop', 'selectionStart', 2);
	});

	it('should not delete prefix', () => {
		mount(CypressTestMaskComponent, {
			inputs: {
				mask: '(00) 00',
				prefix: '+1 ',
			},
			imports: [CypressTestMaskModule],
		});

		cy.get('input#masked')
			.type('1234')
			.setSelectionRange(3, 3)
			.type('{backspace}')
			.should('have.value', '+1 (12) 34')
			.should('have.prop', 'selectionStart', 3);
	});

	it('should delete selection', () => {
		mount(CypressTestMaskComponent, {
			inputs: {
				mask: '000 000 000',
			},
			imports: [CypressTestMaskModule],
		});

		cy.get('input#masked')
			.type('123456789')
			.setSelectionRange(4, 7)
			.type('{backspace}')
			.should('have.value', '123 789')
			.should('have.prop', 'selectionStart', 3);
	});
});
