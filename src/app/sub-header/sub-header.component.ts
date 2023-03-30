import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ChipsComponent } from '../shared/chips/chips.component';
import { AssetPipe } from '../shared/asset/asset.pipe';

@Component({
    selector: 'ngx-mask-sub-header',
    templateUrl: './sub-header.component.html',
    styleUrls: ['./sub-header.component.scss'],
    standalone: true,
    imports: [ChipsComponent, AssetPipe, NgOptimizedImage],
})
export class SubHeaderComponent {
    public title = 'Ngx-Mask';
    public subtitle = 'Angular plugin to make masks on form fields and html elements';
    public chips = ['Angular', 'TypeScript', 'Web', 'Input', 'Pipe', 'Show-Masks'];
}
