import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'jsdaddy-open-source-test',
    template: `
        <input
            id="masked"
            [formControl]="form"
            [mask]="mask"
            [prefix]="prefix"
            [suffix]="suffix"
            [hiddenInput]="hiddenInput" />
    `,
})
export class CypressTestMaskComponent {
    @Input() public mask = '';

    @Input() public hiddenInput = false;

    @Input() public prefix = '';

    @Input() public suffix = '';

    public form: FormControl = new FormControl('');
}
