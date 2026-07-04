import { Component, inject, input, signal } from '@angular/core';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { VisitBtnComponent } from '@shared/visit-btn/visit-btn.component';
import type { HeaderITem } from './header.type';
import { AssetPipe } from '@shared/asset/asset.pipe';
import { BodyStylesService } from '@shared/body-styles/body-styles.service';
import { LinkPath } from '@shared/link/link.path';
import { OpenSourcePath } from '@shared/path/open-source.path';
import { AnchorLabelPipe } from '@shared/anchor/anchor-label.pipe';

@Component({
    selector: 'ngxd-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    standalone: true,
    imports: [AssetPipe, VisitBtnComponent, NgOptimizedImage, AnchorLabelPipe, NgTemplateOutlet],
    providers: [BodyStylesService],
})
export class HeaderComponent {
    public activeLink = input<string>();

    public showNav = signal(false);
    public headerItems: HeaderITem[] = [
        {
            title: 'Ngx-Mask',
            link: LinkPath.NGX_MASK,
        },
        {
            title: 'Ngx-CopyPaste',
            link: LinkPath.NGX_COPYPASTE,
        },
        {
            title: 'Ngx-Loader-Indicator',
            link: LinkPath.NGX_LOADER,
        },
    ];

    public readonly bodyStylesService = inject(BodyStylesService);
    public readonly openSourceHeaderPath = OpenSourcePath.HEADER;

    public toggleNavBlock(): void {
        this.showNav.update((val) => !val);
        this.bodyStylesService.setOverflowYBodyHtml(this.showNav());
    }
}
