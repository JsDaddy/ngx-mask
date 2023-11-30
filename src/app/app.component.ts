import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'jsdaddy-open-source-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    // public card: {
    //     docs: IComDoc[];
    //     examples: (TExample<IMaskOptions> | { _pipe: string })[];
    // } = {
    //     docs: ComDocs,
    //     examples: ComExamples,
    // };
    // public lists: IListItem[] = lists;
    // public githubMaskLink = LinkPath.NGX_MASK;
    // public title = 'Ngx-Mask';
    // public subtitle = 'Angular plugin to make masks on form fields and html elements';
    // public chips = ['Angular', 'TypeScript', 'Web', 'Input', 'Pipe', 'Show-Masks'];
    // public switchCard(cardId: number): void {
    //     switch (cardId) {
    //         case 1:
    //             this.card.docs = ComDocs;
    //             this.card.examples = ComExamples;
    //             break;
    //         case 2:
    //             this.card.docs = OptDocs;
    //             this.card.examples = OptExamples;
    //             break;
    //         case 3:
    //             this.card.docs = SepDocs;
    //             this.card.examples = SepExamples;
    //             break;
    //         case 4:
    //             this.card.docs = OthDocs;
    //             this.card.examples = OthExamples;
    //             break;
    //         case 5:
    //             this.card.docs = ParserAndFormatterDocs;
    //             this.card.examples = FormatAndParserExamples;
    //             break;
    //         default:
    //             break;
    //     }
    // }

    public test = new FormControl('1234');
    public phone = '123133';

    public hide = true;

    public hiden() {
        this.hide = !this.hide;
    }
    public disabled() {
        this.test.disable();
    }

    public setValue() {
        this.test.setValue('12345');
    }
}
