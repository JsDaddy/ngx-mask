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

@Component({
    selector: 'jsdaddy-open-source-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [OptionsComponent, HeaderComponent, SubHeaderComponent, AccordionComponent],
})
export class AppComponent {
    public inputVal: {
        docs: IComDoc[];
        examples: (TExample<IMaskOptions> | { _pipe: string })[];
    } = {
        docs: ComDocs,
        examples: ComExamples,
    };
    public showNav = false;
    public chosenItem = 1;
    public lists: IListItem[] = lists;
    public title = 'Ngx-Mask';
    public subtitle = 'Angular plugin to make masks on form fields and html elements';
    public chips = ['Angular', 'TypeScript', 'Web', 'Input', 'Pipe', 'Show-Masks'];

    public switchDoc(idList: number): void {
        switch (idList) {
            case 1:
                this.inputVal.docs = ComDocs;
                this.inputVal.examples = ComExamples;
                break;
            case 2:
                this.inputVal.docs = OptDocs;
                this.inputVal.examples = OptExamples;
                break;
            case 3:
                this.inputVal.docs = SepDocs;
                this.inputVal.examples = SepExamples;
                break;
            case 4:
                this.inputVal.docs = OthDocs;
                this.inputVal.examples = OthExamples;
                break;
            default:
                break;
        }
    }

    public chosenItemS(itemId: number): void {
        this.chosenItem = itemId;
    }
}
