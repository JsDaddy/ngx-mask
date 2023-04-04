import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { IListItem } from '../../../assets/content/content.interfaces';
import { RouterLink } from '@angular/router';
import { NgClass, NgForOf, NgOptimizedImage, NgStyle } from '@angular/common';
import { AssetPipe } from '../asset/asset.pipe';
import { HidePipe } from '../asset/hide.pipe';
import { VisitBtnComponent } from '../buttons/visit-btn/visit-btn.component';
import { ColorPipe } from '../asset/color.pipe';

@Component({
    selector: 'ngx-mask-demo-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss'],
    imports: [
        RouterLink,
        NgClass,
        NgForOf,
        NgStyle,
        NgOptimizedImage,
        AssetPipe,
        HidePipe,
        VisitBtnComponent,
        ColorPipe,
    ],
    standalone: true,
})
export class AccordionComponent implements OnInit, AfterViewInit {
    public showNav = true;
    public chosenItem!: number;
    public chosenList!: number;

    @Input() public lists!: IListItem[];
    @Output() public itemAccordion = new EventEmitter<number>();
    @Output() public itemInAccordion = new EventEmitter<number>();
    @ViewChildren('accordion', { read: ElementRef }) public accordion!: QueryList<ElementRef>;
    @ViewChildren('panel', { read: ElementRef }) public panel!: QueryList<ElementRef>;

    public ngOnInit(): void {
        this.chosenItem = 1;
        this.chosenList = 1;
    }

    public ngAfterViewInit(): void {
        this.openFirstAccordion();
    }

    public openFirstAccordion(): void {
        this.accordion.first.nativeElement.classList.toggle('active');
        const panel = this.accordion.first.nativeElement.nextElementSibling;
        panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + 'px';
    }

    public showNavBlock(): void {
        this.showNav = !this.showNav;
    }

    public switchDoc(index: number): void {
        this.itemAccordion.emit(index);
    }

    public handleClick(idItem: number, scrollTo: string | undefined): void {
        this.chosenItem = idItem;
        this.itemInAccordion.emit(idItem);
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
}
