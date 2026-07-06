import { Component, input } from '@angular/core';
import { ChipComponent } from '@shared/chip/chip.component';
import { GithubButtonsComponent } from '@shared/github-buttons/github-buttons.component';

@Component({
    selector: 'ngxd-sub-header',
    templateUrl: './sub-header.component.html',
    styleUrl: './sub-header.component.scss',
    standalone: true,
    imports: [ChipComponent, GithubButtonsComponent],
})
export class SubHeaderComponent {
    public title = input<string>();
    public subtitle = input<string>();
    public chips = input<string[]>();
}
