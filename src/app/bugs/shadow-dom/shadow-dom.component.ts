import { Component, ViewEncapsulation } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'mask-shadow-dom',
    templateUrl: './shadow-dom.component.html',
    standalone: true,
    imports: [NgxMaskDirective],
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class ShadowDomComponent {}
