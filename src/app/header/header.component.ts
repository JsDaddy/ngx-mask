import { Component } from '@angular/core';
import { AssetPipe } from '../shared/asset/asset.pipe';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'ngx-mask-demo-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [AssetPipe, NgOptimizedImage],
})
export class HeaderComponent {}
