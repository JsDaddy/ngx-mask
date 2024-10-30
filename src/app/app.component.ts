import { Component, signal } from '@angular/core';
import { OptDocs, OptExamples } from 'src/assets/content/optional';
import { lists } from 'src/assets/content/lists';
import { SepDocs, SepExamples } from 'src/assets/content/separators';
import { ComDocs, ComExamples } from 'src/assets/content/common-cases';
import { OthDocs, OthExamples } from 'src/assets/content/other';
import { OptionsComponent } from './options/options.component';
import { HeaderComponent } from '@open-source/header/header.component';
import type { ComDoc, ListItem, MaskOptions, TExample } from '@open-source/accordion/content.types';
import { SubHeaderComponent } from '@open-source/sub-header/sub-header.component';
import { AccordionComponent } from '@open-source/accordion/accordion.component';
import { FooterComponent } from '@open-source/footer/footer.component';
import { LinkPath } from '@libraries/link/link.path';
import {
    FormatAndParserExamples,
    ParserAndFormatterDocs,
} from '../assets/content/parser-and-formatter';
import { VersionToken } from '@libraries/version/version.token';

declare const VERSION: string;

@Component({
    selector: 'jsdaddy-open-source-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
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
    public docs = signal<ComDoc[]>(ComDocs);
    public examples = signal<(TExample<MaskOptions> | { _pipe: string })[]>(ComExamples);

    public readonly lists: ListItem[] = lists;
    public readonly githubMaskLink = LinkPath.NGX_MASK;
    public readonly title = 'Ngx-Mask';
    public readonly subtitle = 'Angular plugin to make masks on form fields and html elements';
    public readonly chips = ['Angular', 'TypeScript', 'Web', 'Input', 'Pipe', 'Show-Masks'];

    private readonly selectedCardId = signal<number>(1);

    public switchCard(cardId: number): void {
        if (this.selectedCardId() === cardId) {
            return;
        }
        this.selectedCardId.set(cardId);

        switch (cardId) {
            case 2:
                this.docs.set(OptDocs);
                this.examples.set(OptExamples);
                break;
            case 3:
                this.docs.set(SepDocs);
                this.examples.set(SepExamples);
                break;
            case 4:
                this.docs.set(OthDocs);
                this.examples.set(OthExamples);
                break;
            case 5:
                this.docs.set(ParserAndFormatterDocs);
                this.examples.set(FormatAndParserExamples);
                break;
            default:
                this.docs.set(ComDocs);
                this.examples.set(ComExamples);
                break;
        }
    }
}
