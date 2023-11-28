import { Component } from '@angular/core';
import { OptDocs, OptExamples } from 'src/assets/content/optional';
import { lists } from 'src/assets/content/lists';
import { SepDocs, SepExamples } from 'src/assets/content/separators';
import { ComDocs, ComExamples } from 'src/assets/content/common-cases';
import { OthDocs, OthExamples } from 'src/assets/content/other';
import { OptionsComponent } from './options/options.component';
import { HeaderComponent } from '@open-source/header/header.component';
import {
    IComDoc,
    IListItem,
    IMaskOptions,
    TExample,
} from '@open-source/accordion/content.interfaces';
import { SubHeaderComponent } from '@open-source/sub-header/sub-header.component';
import { AccordionComponent } from '@open-source/accordion/accordion.component';
import { FooterComponent } from '@open-source/footer/footer.component';
import { LinkPath } from '@libraries/link/link.path';
import {
    FormatAndParserExamples,
    ParserAndFormatterDocs,
} from '../assets/content/parser-and-formatter';

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
    FooterComponent
],
})
export class AppComponent {
    public card: {
        docs: IComDoc[];
        examples: (TExample<IMaskOptions> | { _pipe: string })[];
    } = {
        docs: ComDocs,
        examples: ComExamples,
    };
    public lists: IListItem[] = lists;
    public githubMaskLink = LinkPath.NGX_MASK;
    public title = 'Ngx-Mask';
    public subtitle = 'Angular plugin to make masks on form fields and html elements';
    public chips = ['Angular', 'TypeScript', 'Web', 'Input', 'Pipe', 'Show-Masks'];

    public switchCard(cardId: number): void {
        switch (cardId) {
            case 1:
                this.card.docs = ComDocs;
                this.card.examples = ComExamples;
                break;
            case 2:
                this.card.docs = OptDocs;
                this.card.examples = OptExamples;
                break;
            case 3:
                this.card.docs = SepDocs;
                this.card.examples = SepExamples;
                break;
            case 4:
                this.card.docs = OthDocs;
                this.card.examples = OthExamples;
                break;
            case 5:
                this.card.docs = ParserAndFormatterDocs;
                this.card.examples = FormatAndParserExamples;
                break;
            default:
                break;
        }
    }
}
