import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ChipsComponent } from '../chips/chips.component';
import { AssetPipe } from '../asset/asset.pipe';

@Component({
    selector: 'ngx-mask-demo-sub-header',
    templateUrl: './sub-header.component.html',
    styleUrls: ['./sub-header.component.scss'],
    standalone: true,
    imports: [NgOptimizedImage, ChipsComponent, AssetPipe],
})
export class SubHeaderComponent {
    @Input() public title!: string;

    @Input() public subtitle!: string;

    @Input() public chips!: string[];
}
