import { Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'mask-shadow-dom',
	templateUrl: './shadow-dom.component.html',
	styleUrls: ['./shadow-dom.component.scss'],
	encapsulation: ViewEncapsulation.ShadowDom,
})
export class ShadowDomComponent {}
