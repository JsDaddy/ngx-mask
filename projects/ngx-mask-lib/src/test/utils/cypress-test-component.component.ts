import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'jsdaddy-open-source-test',
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
    @Input() public mask = '';

    @Input() public hiddenInput = false;

    @Input() public prefix = '';

    public form: FormControl = new FormControl('');
}
