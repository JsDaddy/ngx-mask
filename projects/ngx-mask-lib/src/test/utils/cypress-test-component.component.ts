import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'mask-cypress-test-mask',
	template: `
		<input
			id="masked"
			[formControl]="form"
			[mask]="mask"
			[hiddenInput]="hiddenInput"
			[prefix]="prefix"
		/>
	`,
})
export class CypressTestMaskComponent {
	@Input() public mask!: string | null;

	@Input() public hiddenInput: boolean = false;

	@Input() public prefix: string = '';

	public form: FormControl = new FormControl('');
}
