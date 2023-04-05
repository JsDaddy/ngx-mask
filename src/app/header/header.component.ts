import { Component } from '@angular/core';
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { AssetPipe } from '../shared/asset/asset.pipe';
import { ColorPipe } from '../shared/asset/color.pipe';
import { HidePipe } from '../shared/asset/hide.pipe';
import { VisitBtnComponent } from '../shared/buttons/visit-btn/visit-btn.component';
import { IHeaderITem } from '../../assets/content/header.interface';

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

    public showNav = false;

    public checkIsActive = window.location.href;

    public toggleNavBlock(): void {
        this.showNav = !this.showNav;
    }
}
