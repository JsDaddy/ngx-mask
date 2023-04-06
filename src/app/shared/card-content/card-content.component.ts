import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'ngx-mask-demo-card-content',
    templateUrl: './card-content.component.html',
    styleUrls: ['./card-content.component.scss'],
    standalone: true,
    imports: [NgClass],
})
export class CardContentComponent {
    @Input() public color!: string;
    @Input() public title!: string;
    @Input() public value!: string;
}
