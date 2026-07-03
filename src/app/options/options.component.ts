import {
    ChangeDetectionStrategy,
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
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { initialConfig, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HighlightModule } from 'ngx-highlightjs';
import { AssetPipe } from '@libraries/asset/asset.pipe';
import { IsEmptyPipe } from '@open-source/is-empty/is-empty.pipe';
import { CardContentComponent } from '../shared/card-content/card-content.component';
import { ScrollService } from '@open-source/scroll/scroll.service';
import { AccordionService } from '@open-source/accordion/accordion.service';
import { OpenSourcePath } from '@open-source/path/open-source.path';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ScrollService, AccordionService],
    imports: [
        NgTemplateOutlet,
        FormsModule,
        ReactiveFormsModule,
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
    public readonly cardDocs = input<ComDoc[]>();
    public readonly cardExamplesConfig = input<(TExampleConfig<MaskOptions> | { _pipe: string })[]>(
        [],
        {
            alias: 'cardExamples',
        }
    );

    protected readonly cardExamples = signal<(TExample<MaskOptions> | { _pipe: string })[]>([]);

    protected readonly cards = viewChildren<string, ElementRef<HTMLElement>>('cards', {
        read: ElementRef,
    });

    protected readonly phone = '123456789';
    protected readonly openSourceOptionsPath = OpenSourcePath.OPTIONS;
    protected readonly specialCharacters = initialConfig.specialCharacters;
    protected readonly outputTransformFn = initialConfig.outputTransformFn;
    protected readonly inputTransformFn = initialConfig.inputTransformFn;

    private readonly scrollService = inject(ScrollService);
    private readonly accordionService = inject(AccordionService);
    private readonly injector = inject(Injector);

    protected readonly activeCardId = this.scrollService.activeCard;

    public constructor() {
        effect(() => {
            const configs = this.cardExamplesConfig();
            if (!configs) {
                untracked(() => this.cardExamples.set([]));
                return;
            }

            untracked(() => {
                const runtimeExamples = configs.map((config) => {
                    if ('_pipe' in config) {
                        return config;
                    }
                    const initialValue = config.control.initialValue;
                    const formControl = new FormControl<string | null>(initialValue);
                    const modelSignal = signal<string | null>(initialValue);
                    const signalFormModel = signal({ value: initialValue });

                    const signalForm = runInInjectionContext(this.injector, () =>
                        form(signalFormModel)
                    );

                    return {
                        ...config,
                        control: {
                            formControl,
                            model: modelSignal,
                            signalForm,
                        },
                    } as TExample<MaskOptions>;
                });

                this.cardExamples.set(runtimeExamples);
            });
        });

        effect(() => {
            this.scrollService.onScroll(this.cards());
            this.accordionService.onChangeAccordion(this.cards());
        });
    }
}
