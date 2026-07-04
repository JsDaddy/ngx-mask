import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { OptDocs, OptExamples } from 'src/assets/content/optional';
import { lists } from 'src/assets/content/lists';
import { SepDocs, SepExamples } from 'src/assets/content/separators';
import { ComDocs, ComExamples } from 'src/assets/content/common-cases';
import { OthDocs, OthExamples } from 'src/assets/content/other';
import { OptionsComponent } from './options/options.component';
import { HeaderComponent } from '@shared/header/header.component';
import type {
    ComDoc,
    ListItem,
    MaskOptions,
    TExampleConfig,
} from '@shared/accordion/content.types';
import { SubHeaderComponent } from '@shared/sub-header/sub-header.component';
import { AccordionComponent } from '@shared/accordion/accordion.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { LinkPath } from '@shared/link/link.path';
import {
    FormatAndParserExamples,
    ParserAndFormatterDocs,
} from '../assets/content/parser-and-formatter';
import { VersionToken } from '@shared/version/version.token';

declare const VERSION: string;

type CardContent = {
    docs: ComDoc[];
    examples: (TExampleConfig<MaskOptions> | { _pipe: string })[];
};

const CARD_CONTENT: Readonly<Record<number, CardContent>> = {
    1: { docs: ComDocs, examples: ComExamples },
    2: { docs: OptDocs, examples: OptExamples },
    3: { docs: SepDocs, examples: SepExamples },
    4: { docs: OthDocs, examples: OthExamples },
    5: { docs: ParserAndFormatterDocs, examples: FormatAndParserExamples },
};

const DEFAULT_CARD_CONTENT: CardContent = { docs: ComDocs, examples: ComExamples };

@Component({
    selector: 'ngxd-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        OptionsComponent,
        HeaderComponent,
        SubHeaderComponent,
        AccordionComponent,
        FooterComponent,
    ],
    providers: [{ provide: VersionToken, useValue: VERSION }],
})
export class AppComponent {
    private readonly selectedCardId = signal<number>(1);

    private readonly selectedCardContent = computed<CardContent>(
        () => CARD_CONTENT[this.selectedCardId()] ?? DEFAULT_CARD_CONTENT
    );

    protected readonly docs = computed<ComDoc[]>(() => this.selectedCardContent().docs);
    protected readonly examples = computed<(TExampleConfig<MaskOptions> | { _pipe: string })[]>(
        () => this.selectedCardContent().examples
    );

    protected readonly lists: ListItem[] = lists;
    protected readonly githubMaskLink = LinkPath.NGX_MASK;
    protected readonly title = 'Ngx-Mask';
    protected readonly subtitle = 'Angular plugin to make masks on form fields and html elements';
    protected readonly chips = ['Angular', 'TypeScript', 'Web', 'Input', 'Pipe', 'Show-Masks'];

    protected switchCard(cardId: number): void {
        this.selectedCardId.set(cardId);
    }
}
