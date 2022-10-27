import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'mask-shadow-dom',
    templateUrl: './shadow-dom.component.html',
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class ShadowDomComponent {}
