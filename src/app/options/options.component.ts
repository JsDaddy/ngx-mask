import {
    Component,
    effect,
    ElementRef,
    inject,
    Injector,
    input,
    runInInjectionContext,
    signal,
    untracked,
    viewChildren,
} from '@angular/core';
import { JsonPipe, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { initialConfig, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HighlightModule } from 'ngx-highlightjs';
import { AssetPipe } from '@libraries/asset/asset.pipe';
import { IsEmptyPipe } from '@open-source/is-empty/is-empty.pipe';
import { CardContentComponent } from '../shared/card-content/card-content.component';
import { ScrollService } from '@open-source/scroll/scroll.service';
import { AccordionService } from '@open-source/accordion/accordion.service';
import { OpenSourcePath } from '@open-source/path/open-source.path';
import { toSignal } from '@angular/core/rxjs-interop';
import type {
    ComDoc,
    MaskOptions,
    TExample,
    TExampleConfig,
} from '@open-source/accordion/content.types';

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
        FormField,
        HighlightModule,
        NgxMaskDirective,
        NgxMaskPipe,
        AssetPipe,
        IsEmptyPipe,
        CardContentComponent,
        NgOptimizedImage,
    ],
})
export class OptionsComponent {
    public cardDocs = input<ComDoc[]>();
    public cardExamplesConfig = input<(TExampleConfig<MaskOptions> | { _pipe: string })[]>([], {
        //eslint-disable-next-line @angular-eslint/no-input-rename
        alias: 'cardExamples',
    });

    /**
     * Runtime examples with FieldTrees.
     * Updated via effect when cardExamplesConfig changes.
     */
    public cardExamples = signal<(TExample<MaskOptions> | { _pipe: string })[]>([]);

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
    private readonly injector = inject(Injector);

    public readonly activeCardId = toSignal(this.scrollService.activeCard$);

    public constructor() {
        // Effect to create FieldTrees when config changes
        // This runs in injection context (constructor)
        effect(() => {
            const configs = this.cardExamplesConfig();
            if (!configs) {
                untracked(() => this.cardExamples.set([]));
                return;
            }

            untracked(() => {
                runInInjectionContext(this.injector, () => {
                    const runtimeExamples = configs.map((config) => {
                        if ('_pipe' in config) {
                            return config;
                        }
                        // Create FieldTree from config (form() requires injection context)
                        const modelSignal = signal<string | null>(config.control.initialValue);
                        return {
                            ...config,
                            control: {
                                form: form(modelSignal),
                                model: config.control.model,
                            },
                        } as TExample<MaskOptions>;
                    });

                    this.cardExamples.set(runtimeExamples);
                });
            });
        });

        effect(() => {
            this.scrollService.onScroll(this.cards());
            this.accordionService.onChangeAccordion(this.cards());
        });
    }
}
