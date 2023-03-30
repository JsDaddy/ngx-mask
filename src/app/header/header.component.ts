import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AssetPipe } from '../shared/asset/asset.pipe';

@Component({
    selector: 'ngx-mask-demo-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [AssetPipe, NgOptimizedImage],
})
export class HeaderComponent {}
