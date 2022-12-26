import { Component, OnInit } from '@angular/core';
import { OptDocs, OptExamples } from 'src/assets/content/optional';
import { lists } from 'src/assets/content/lists';
import { SepDocs, SepExamples } from 'src/assets/content/separators';
import { ComDocs, ComExamples } from 'src/assets/content/commonCases';
import { OthDocs, OthExamples } from 'src/assets/content/other';
import { OptionsComponent } from './options/options.component';
import { HeaderComponent } from './header/header.component';
import { NgForOf, NgStyle } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { IComDoc, IListItem, IMaskOptions, TExample } from '../assets/content/content.interfaces';

@Component({
    selector: 'ngx-mask-demo-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        NgStyle,
        NgForOf,
        RouterLink,
        MatButtonModule,
        MatListModule,
        MatExpansionModule,
        MatSidenavModule,
        OptionsComponent,
        HeaderComponent,
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

    public handleClick(idItem: number, scrollTo: string | undefined): void {
        this.chosenItem = idItem;
        setTimeout(() => {
            if (!scrollTo) {
                return;
            }
            const anchor: HTMLElement | null = document.getElementById(scrollTo);
            if (anchor) {
                anchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }

    public ngOnInit(): void {
        this.inputVal = {
            docs: ComDocs,
            examples: ComExamples,
        };
        this.chosenItem = 1;
        this.chosenList = 1;
        this.lists = lists;
    }
}
