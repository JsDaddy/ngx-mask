import { Component } from '@angular/core';

@Component({
    selector: 'jsdaddy-open-source-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
})
export class OptionsComponent {
    // export class OptionsComponent implements AfterViewInit {
    // @Input() public cardDocs!: IComDoc[];
    // @Input() public cardExamples!: (TExample<IMaskOptions> | { _pipe: string })[];
    //
    // @ViewChildren('cards') public cards!: QueryList<ElementRef>;
    //
    // public readonly phone = '123456789';
    // public readonly trackByPath = inject(TrackByService).trackBy('id');
    // public readonly activeCardId$: Observable<number> = inject(ScrollService).activeCard$;
    // public readonly openSourceOptionsPath = OpenSourcePath.OPTIONS;
    //
    // private readonly scrollService = inject(ScrollService);
    // private readonly accordionService = inject(AccordionService);
    // public ngAfterViewInit(): void {
    //     this.scrollService.onScroll(this.cards);
    //     this.accordionService.onChangeAccordion(this.cards);
    // }
}
