import { Component, inject, Input } from '@angular/core';
import { NgForOf } from '@angular/common';
import { TrackByService } from '../track-by/track-by.service';

@Component({
    selector: 'ngx-mask-demo-chips',
    templateUrl: './chips.component.html',
    styleUrls: ['./chips.component.scss'],
    standalone: true,
    imports: [NgForOf],
})
export class ChipsComponent {
    @Input() public chips!: string[];
    public readonly trackByPath = inject(TrackByService).trackBy('text');
}
