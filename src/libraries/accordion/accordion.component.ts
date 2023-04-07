import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { NgClass, NgForOf, NgOptimizedImage, NgStyle } from '@angular/common';
import { IListItem } from '../../assets/content/content.interfaces';
import { AssetPipe } from '../asset/asset.pipe';
import { HidePipe } from '../hide/hide.pipe';
import { VisitBtnComponent } from '../visit-btn/visit-btn.component';
import { ColorPipe } from '../color/color.pipe';
import { TrackByService } from '../track-by/track-by.service';

@Component({
    selector: 'ngx-mask-demo-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss'],
    imports: [
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
export class AccordionComponent implements AfterViewInit {
    public showNav = true;
    public chosenItem = 1;
    public chosenList = 1;
    public readonly trackByPath = inject(TrackByService).trackBy('id');

    @Input() public lists!: IListItem[];
    @Output() public itemAccordion = new EventEmitter<number>();
    @Output() public itemInAccordion = new EventEmitter<number>();
    @ViewChildren('accordion', { read: ElementRef }) public accordion!: QueryList<ElementRef>;

    public ngAfterViewInit(): void {
        this.openFirstAccordion();
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
        if (!scrollTo) {
            return;
        }
        const anchor: HTMLElement | null = document.getElementById(scrollTo);
        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    public toggle(index: number): void {
        this.accordion.forEach((_el, i) => {
            index !== i
                ? this.accordion.get(i)?.nativeElement.classList.remove('active')
                : this.accordion.get(index)?.nativeElement.classList.toggle('active');
        });
    }

    public openFirstAccordion(): void {
        this.accordion.first.nativeElement.classList.toggle('active');
    }
}
