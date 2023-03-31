import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { NgClass, NgForOf, NgOptimizedImage } from '@angular/common';
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

@Component({
    selector: 'ngx-mask-demo-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        NgForOf,
        RouterLink,
        OptionsComponent,
        HeaderComponent,
        NgOptimizedImage,
        AssetPipe,
        SubHeaderComponent,
        NgClass,
    ],
})
export class AppComponent implements OnInit, AfterViewInit {
    public inputVal!: {
        docs: IComDoc[];
        examples: (TExample<IMaskOptions> | { _pipe: string })[];
    };

    public chosenItem!: number;

    public chosenList!: number;

    public lists!: IListItem[];

    @ViewChildren('accordion', { read: ElementRef }) public accordion!: QueryList<ElementRef>;

    @ViewChildren('panel', { read: ElementRef }) public panel!: QueryList<ElementRef>;

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

    public toggle(index: number): void {
        this.accordion.get(index)?.nativeElement.classList.toggle('active');
        const panel = this.panel.get(index)?.nativeElement;
        panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + 'px';
        const accordionsArray = this.accordion.toArray().map((el) => el.nativeElement.classList);
        accordionsArray.map((el, i) => {
            if (index !== i && el.contains('active')) {
                this.accordion.get(i)?.nativeElement.classList.remove('active');
                const closePanel = this.panel.get(i)?.nativeElement;
                closePanel.style.maxHeight = null;
            }
        });
    }

    public openFirstAccordion(): void {
        this.accordion.first.nativeElement.classList.toggle('active');
        const panel = this.accordion.first.nativeElement.nextElementSibling;
        panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + 'px';
    }

    public ngAfterViewInit() {
        this.openFirstAccordion();
    }
}
