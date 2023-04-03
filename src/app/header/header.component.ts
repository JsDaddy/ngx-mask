import { Component, OnInit } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { AssetPipe } from '../shared/asset/asset.pipe';
import { ColorPipe } from '../shared/asset/color.pipe';
import { HidePipe } from '../shared/asset/hide.pipe';
import { HideService } from '../shared/services/hide.service';

@Component({
    selector: 'ngx-mask-demo-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [NgOptimizedImage, AssetPipe, NgClass, ColorPipe, HidePipe],
})
export class HeaderComponent implements OnInit {
    public constructor(private hideService: HideService) {}

    public showNav!: boolean;

    public ngOnInit(): void {
        this.showNavBlock();
    }

    public showNavBlock(): void {
        this.showNav = this.hideService.showHeaderButtons;
        this.hideService.showHeaderBlock();
        console.log(this.hideService.showHeaderButtons);
    }
}
