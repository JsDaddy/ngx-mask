import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    encapsulation: ViewEncapsulation.ShadowDom,
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
export class CypressTestMaskShadowDomComponent {
    @Input() public mask!: string | null;

    @Input() public hiddenInput = false;

    @Input() public prefix = '';

    public form: FormControl = new FormControl('');
}
