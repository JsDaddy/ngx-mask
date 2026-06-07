import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'jsdaddy-open-source-card-content[title][color][value]',
    templateUrl: './card-content.component.html',
    styleUrls: ['./card-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
})
export class CardContentComponent {
    public color = input.required<string>();
    public title = input.required<string>();
    public value = input.required<string>();
}
