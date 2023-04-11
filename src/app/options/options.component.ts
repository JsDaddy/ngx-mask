import { Component, inject, Input } from '@angular/core';
import {
    JsonPipe,
    NgClass,
    NgFor,
    NgIf,
    NgOptimizedImage,
    NgTemplateOutlet,
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HighlightModule } from 'ngx-highlightjs';
import { IComDoc, IMaskOptions, TExample } from '@open-source/accordion/content.interfaces';
import { AssetPipe } from '@libraries/asset/asset.pipe';
import { IsEmptyPipe } from '@open-source/is-empty/is-empty.pipe';
import { ColorPipe } from '@open-source/color/color.pipe';
import { CardContentComponent } from '../shared/card-content/card-content.component';
import { TrackByService } from '@libraries/track-by/track-by.service';

@Component({
    selector: 'jsdaddy-open-source-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: true,
    imports: [
        JsonPipe,
        NgFor,
        NgIf,
        NgClass,
        NgOptimizedImage,
        NgTemplateOutlet,
        FormsModule,
        ReactiveFormsModule,
        HighlightModule,
        NgxMaskDirective,
        NgxMaskPipe,
        AssetPipe,
        IsEmptyPipe,
        ColorPipe,
        CardContentComponent,
    ],
    providers: [],
})
export class OptionsComponent {
    @Input()
    public docs!: IComDoc[];

    @Input()
    public examples!: (TExample<IMaskOptions> | { _pipe: string })[];

    @Input()
    public choose!: number;
    public phone = '123456789';
    public readonly trackByPath = inject(TrackByService).trackBy('text');
    public customPatterns = { '0': { pattern: new RegExp('[a-zA-Z]') } };

    public checkChoose(input: number, curr: number): boolean {
        return input === curr;
    }
}
