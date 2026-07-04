import { Component } from '@angular/core';
import { AssetPipe } from '@shared/asset/asset.pipe';
import { OpenSourcePath } from '@shared/path/open-source.path';
import { NgOptimizedImage } from '@angular/common';
import { AnchorLabelPipe } from '@shared/anchor/anchor-label.pipe';

@Component({
    selector: 'ngxd-visit-btn',
    templateUrl: './visit-btn.component.html',
    styleUrl: './visit-btn.component.scss',
    standalone: true,
    imports: [AssetPipe, NgOptimizedImage, AnchorLabelPipe],
})
export class VisitBtnComponent {
    public readonly repositoryLink = 'https://github.com/NepipenkoIgor/ngx-mask';
    public readonly openSourceVisitBtnPath = OpenSourcePath.VISIT_BTN;
}
