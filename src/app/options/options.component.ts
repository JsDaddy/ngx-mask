import {
    Component,
    ElementRef,
    inject,
    Input,
    QueryList,
    Renderer2,
    ViewChildren,
} from '@angular/core';
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
import { ScrollService } from '@open-source/service/scroll.service';
import { Router } from '@angular/router';

@Component({
    selector: 'jsdaddy-open-source-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: true,
    providers: [ScrollService],
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
})
export class OptionsComponent {
    public phone = '123456789';
    public readonly trackByPath = inject(TrackByService).trackBy('text');
    private readonly scrollService = inject(ScrollService);
    private readonly renderer = inject(Renderer2);
    private readonly route = inject(Router);
    @Input() public docs!: IComDoc[];
    @Input() public examples!: (TExample<IMaskOptions> | { _pipe: string })[];
    @Input() public choose!: number;
    @ViewChildren('cards') public cardIds!: QueryList<ElementRef>;

    public constructor() {
        this.renderer.listen('window', 'scroll', this.scrollCard.bind(this));
    }

    public checkChoose(input: number, curr: number): boolean {
        return input === curr;
    }

    public scrollCard(): void {
        const detectedElms: string[] = [];
        this.cardIds.forEach((elm) => {
            if (this.scrollService.isInViewport(elm.nativeElement)) {
                detectedElms.push(elm.nativeElement.id);
                this.route.navigate(['/'], { fragment: detectedElms[1] });
            }
        });
    }
}
