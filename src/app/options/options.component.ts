import { Component, Input } from '@angular/core';
import {
    JsonPipe,
    NgClass,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    NgTemplateOutlet,
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HighlightModule } from 'ngx-highlightjs';
import { IComDoc, IMaskOptions, TExample } from '../../assets/content/content.interfaces';
import { AssetPipe } from '../shared/asset/asset.pipe';
import { IsEmptyPipe } from '../shared/asset/is-empty.pipe';

@Component({
    selector: 'ngx-mask-demo-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: true,
    imports: [
        JsonPipe,
        NgForOf,
        NgIf,
        NgTemplateOutlet,
        FormsModule,
        ReactiveFormsModule,
        HighlightModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgOptimizedImage,
        AssetPipe,
        NgClass,
        IsEmptyPipe,
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

    public customPatterns = { '0': { pattern: new RegExp('[a-zA-Z]') } };

    public checkChoose(input: number, curr: number): boolean {
        return input === curr;
    }
}
