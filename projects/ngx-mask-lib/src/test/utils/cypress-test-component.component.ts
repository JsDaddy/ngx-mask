import { Component, Input, NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';

@Component({
	selector: 'mask-cypress-test-mask',
	template: `
		<input
			id="maska"
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

@NgModule({
	imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskModule.forRoot()],
	declarations: [CypressTestMaskComponent],
	exports: [CypressTestMaskComponent],
})
export class CypressTestMaskModule {}
