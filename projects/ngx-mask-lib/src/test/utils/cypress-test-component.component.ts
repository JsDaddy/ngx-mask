import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'ngx-mask-demo-test',
    template: `
        <input
            id="masked"
            [formControl]="form"
            [mask]="mask"
            [hiddenInput]="hiddenInput"
            [prefix]="prefix" />
    `,
})
export class CypressTestMaskComponent {
    @Input() public mask!: string | null;

    @Input() public hiddenInput = false;

    @Input() public prefix = '';

    public form: FormControl = new FormControl('');
}
