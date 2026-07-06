import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'ngxd-card-content[title][color][value]',
    templateUrl: './card-content.component.html',
    styleUrls: ['./card-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardContentComponent {
    public readonly color = input.required<string>();
    public readonly title = input.required<string>();
    public readonly value = input.required<string>();
}
