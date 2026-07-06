import { Component, input } from '@angular/core';

@Component({
    selector: 'ngxd-sub-header',
    templateUrl: './sub-header.component.html',
    styleUrl: './sub-header.component.scss',
    standalone: true,
})
export class SubHeaderComponent {
    public subtitle = input<string>();
}
