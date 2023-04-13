import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
    selector: 'jsdaddy-open-source-card-content[title][color][value]',
    templateUrl: './card-content.component.html',
    styleUrls: ['./card-content.component.scss'],
    standalone: true,
    imports: [NgClass, NgStyle],
})
export class CardContentComponent {
    @Input() public color!: string;
    @Input() public title!: string;
    @Input() public value!: string;
}
