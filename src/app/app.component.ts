import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OptDocs, OptExamples } from 'src/assets/content/optional';
import { lists } from 'src/assets/content/lists';
import { SepDocs, SepExamples } from 'src/assets/content/separators';
import { ComDocs, ComExamples } from 'src/assets/content/commonCases';
import { OthDocs, OthExamples } from 'src/assets/content/other';
import { OptionsComponent } from './options/options.component';
import { HeaderComponent } from './header/header.component';
import { IComDoc, IListItem, IMaskOptions, TExample } from '../assets/content/content.interfaces';
import { AssetPipe } from './shared/asset/asset.pipe';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { HidePipe } from './shared/asset/hide.pipe';
import { ColorPipe } from './shared/asset/color.pipe';
import { VisitBtnComponent } from './shared/buttons/visit-btn/visit-btn.component';
import { AccordionComponent } from './shared/accordion/accordion.component';

@Component({
    selector: 'ngx-mask-demo-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        NgIf,
        NgForOf,
        NgOptimizedImage,
        RouterLink,
        OptionsComponent,
        HeaderComponent,
        AssetPipe,
        SubHeaderComponent,
        HidePipe,
        ColorPipe,
        VisitBtnComponent,
        AccordionComponent,
    ],
})
export class AppComponent implements OnInit {
    public inputVal!: {
        docs: IComDoc[];
        examples: (TExample<IMaskOptions> | { _pipe: string })[];
    };

    public chosenItem!: number;
    public chosenList!: number;
    public lists!: IListItem[];
    public title = 'Ngx-Mask';
    public subtitle = 'Angular plugin to make masks on form fields and html elements';
    public chips = ['Angular', 'TypeScript', 'Web', 'Input', 'Pipe', 'Show-Masks'];

    public ngOnInit(): void {
        this.inputVal = {
            docs: ComDocs,
            examples: ComExamples,
        };
        this.lists = lists;
    }

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
        this.chosenList = idList;
    }

    public chosenItemS(itemId: number): void {
        this.chosenItem = itemId;
    }
}
