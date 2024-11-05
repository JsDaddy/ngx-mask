import { Component, effect, ElementRef, inject, input, viewChildren } from '@angular/core';
import { JsonPipe, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { initialConfig, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HighlightModule } from 'ngx-highlightjs';
import { AssetPipe } from '@libraries/asset/asset.pipe';
import { IsEmptyPipe } from '@open-source/is-empty/is-empty.pipe';
import { ColorPipe } from '@open-source/color/color.pipe';
import { CardContentComponent } from '../shared/card-content/card-content.component';
import { ScrollService } from '@open-source/scroll/scroll.service';
import { AccordionService } from '@open-source/accordion/accordion.service';
import { OpenSourcePath } from '@open-source/path/open-source.path';
import { toSignal } from '@angular/core/rxjs-interop';
import type { ComDoc, MaskOptions, TExample } from '@open-source/accordion/content.types';

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
    public cardDocs = input<ComDoc[]>();
    public cardExamples = input<(TExample<MaskOptions> | { _pipe: string })[]>();

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

    public formControl = new FormControl('123 456 789 999 999 9');

    public onClick() {
        this.formControl.setValue('978-1-93624-386-0');
    }

    public testValue1 = 100.12;
    public formControl1 = new FormControl('', Validators.required);
    public testValue2 = 100.12;
    public mask = 'separator.2';
    public thousand = '.';
    public input = '60.04';
    public input1 = '-60.04';
    public updateValueWithLeadZero(value: any) {
        this.testValue1 = parseFloat(value);
    }

    public updateValueWithoutLeadZero(value: any) {
        this.testValue2 = parseFloat(value);
    }

    public fill() {
        this.thousand = ',';
    }
}
