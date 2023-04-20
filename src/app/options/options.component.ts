import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import {
    JsonPipe,
    NgClass,
    NgFor,
    NgIf,
    NgOptimizedImage,
    NgTemplateOutlet,
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HighlightModule } from 'ngx-highlightjs';
import { IComDoc, IMaskOptions, TExample } from '@open-source/accordion/content.interfaces';
import { AssetPipe } from '@libraries/asset/asset.pipe';
import { IsEmptyPipe } from '@open-source/is-empty/is-empty.pipe';
import { ColorPipe } from '@open-source/color/color.pipe';
import { CardContentComponent } from '../shared/card-content/card-content.component';
import { TrackByService } from '@libraries/track-by/track-by.service';
import { ScrollService } from '@open-source/service/scroll.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

@Component({
    selector: 'jsdaddy-open-source-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: true,
    providers: [ScrollService],
    imports: [
        JsonPipe,
        NgFor,
        NgIf,
        NgClass,
        NgOptimizedImage,
        NgTemplateOutlet,
        FormsModule,
        ReactiveFormsModule,
        HighlightModule,
        NgxMaskDirective,
        NgxMaskPipe,
        AssetPipe,
        IsEmptyPipe,
        ColorPipe,
        CardContentComponent,
        RouterLinkActive,
        RouterLink,
    ],
})
export class OptionsComponent implements OnInit, OnDestroy, AfterViewInit {
    public phone = '123456789';
    public choose = 1;
    public readonly trackByPath = inject(TrackByService).trackBy('text');
    private scroll!: Subscription;
    private readonly scrollService = inject(ScrollService);
    private readonly route = inject(Router);
    @Input() public docs!: IComDoc[];
    @Input() public examples!: (TExample<IMaskOptions> | { _pipe: string })[];
    @ViewChildren('cards') public cardIds!: QueryList<ElementRef>;

    public constructor(public cd: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.scroll = fromEvent(document, 'scroll')
            .pipe(debounceTime(100))
            .subscribe(() => {
                const scrollIdCard = this.cardIds.find((e) =>
                    this.scrollService.isInViewport(e.nativeElement)
                )?.nativeElement.id;
                if (this.choose !== +scrollIdCard) {
                    this.choose = +scrollIdCard;
                    this.route.navigate(['/'], {
                        fragment: scrollIdCard,
                    });
                }
            });
    }

    public ngAfterViewInit(): void {
        this.cardIds.changes.subscribe((elementRef) => {
            this.route.navigate(['/'], {
                fragment: '1',
            });
            const anchor: HTMLElement | null = document.getElementById(
                elementRef.first.nativeElement.id
            );
            if (anchor) {
                anchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }

    public ngOnDestroy(): void {
        this.scroll.unsubscribe();
    }
}
