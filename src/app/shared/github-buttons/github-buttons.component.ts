import { Component, inject, input } from '@angular/core';
import { AssetPipe } from '@shared/asset/asset.pipe';
import { GithubStarsService } from '@shared/github/github-stars.service';
import { NgOptimizedImage } from '@angular/common';
import { AnchorLabelPipe } from '@shared/anchor/anchor-label.pipe';

@Component({
    selector: 'ngxd-github-buttons[title]',
    templateUrl: './github-buttons.component.html',
    styleUrl: './github-buttons.component.scss',
    standalone: true,
    imports: [AssetPipe, NgOptimizedImage, AnchorLabelPipe],
})
export class GithubButtonsComponent {
    public title = input.required<string>();

    public readonly githubProfileLink = 'https://github.com/NepipenkoIgor/';
    public readonly countOfStarsOnGithub = inject(GithubStarsService).allStars;
}
