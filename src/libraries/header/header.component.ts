import { Component, inject } from '@angular/core';
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { AssetPipe } from '../asset/asset.pipe';
import { ColorPipe } from '../color/color.pipe';
import { HidePipe } from '../hide/hide.pipe';
import { VisitBtnComponent } from '../visit-btn/visit-btn.component';
import { IHeaderITem } from '../header-interface/header.interface';
import { TrackByService } from '../track-by/track-by.service';

@Component({
    selector: 'ngx-mask-demo-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [
        NgOptimizedImage,
        NgForOf,
        NgIf,
        NgClass,
        AssetPipe,
        ColorPipe,
        HidePipe,
        VisitBtnComponent,
    ],
})
export class HeaderComponent {
    public headerDoc: IHeaderITem[] = [
        {
            title: 'Ngx-Mask',
            link: 'https://jsdaddy.github.io/ngx-mask/',
        },
        {
            title: 'Ngx-CopyPaste',
            link: 'https://jsdaddy.github.io/ngx-copypaste/',
        },
        {
            title: 'Ngx-Loader-Indicator',
            link: 'https://jsdaddy.github.io/ngx-loader-indicator/',
        },
    ];
    public readonly trackByPath = inject(TrackByService).trackBy('title');
    public showNav = false;
    public checkIsActive = window.location.href;

    public toggleNavBlock(): void {
        this.showNav = !this.showNav;
    }
}
