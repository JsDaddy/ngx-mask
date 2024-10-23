import { Component, effect, ElementRef, inject, input, viewChildren } from '@angular/core';
import { JsonPipe, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initialConfig, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HighlightModule } from 'ngx-highlightjs';
import { IComDoc, IMaskOptions, TExample } from '@open-source/accordion/content.interfaces';
import { AssetPipe } from '@libraries/asset/asset.pipe';
import { IsEmptyPipe } from '@open-source/is-empty/is-empty.pipe';
import { ColorPipe } from '@open-source/color/color.pipe';
import { CardContentComponent } from '../shared/card-content/card-content.component';
import { ScrollService } from '@open-source/scroll/scroll.service';
import { AccordionService } from '@open-source/accordion/accordion.service';
import { OpenSourcePath } from '@open-source/path/open-source.path';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'jsdaddy-open-source-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: true,
    providers: [ScrollService, AccordionService],
    imports: [
        JsonPipe,
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
        NgOptimizedImage,
    ],
})
export class OptionsComponent {
    public cardDocs = input<IComDoc[]>();
    public cardExamples = input<(TExample<IMaskOptions> | { _pipe: string })[]>();

    public cards = viewChildren<string, ElementRef<HTMLElement>>('cards', {
        read: ElementRef,
    });

    public readonly phone = '123456789';
    public readonly openSourceOptionsPath = OpenSourcePath.OPTIONS;
    public readonly specialCharacters = initialConfig.specialCharacters;
    public readonly outputTransformFn = initialConfig.outputTransformFn;
    public readonly inputTransformFn = initialConfig.inputTransformFn;

    private readonly scrollService = inject(ScrollService);
    private readonly accordionService = inject(AccordionService);

    public readonly activeCardId = toSignal(this.scrollService.activeCard$);

    public constructor() {
        effect(() => {
            this.scrollService.onScroll(this.cards());
            this.accordionService.onChangeAccordion(this.cards());
        });
    }
}
