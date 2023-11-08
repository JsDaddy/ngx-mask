import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    Input,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { AsyncPipe, JsonPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HighlightModule } from 'ngx-highlightjs';
import { IComDoc, IMaskOptions, TExample } from '@open-source/accordion/content.interfaces';
import { AssetPipe } from '@libraries/asset/asset.pipe';
import { IsEmptyPipe } from '@open-source/is-empty/is-empty.pipe';
import { ColorPipe } from '@open-source/color/color.pipe';
import { CardContentComponent } from '../shared/card-content/card-content.component';
import { TrackByService } from '@libraries/track-by/track-by.service';
import { Observable } from 'rxjs';
import { ScrollService } from '@open-source/scroll/scroll.service';
import { OpenSourcePath } from '@open-source/path/open-source.path';
import { AccordionService } from '@open-source/accordion/accordion.service';

@Component({
    selector: 'jsdaddy-open-source-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: true,
    providers: [ScrollService, AccordionService],
    imports: [
        JsonPipe,
        NgFor,
        NgIf,
        NgClass,
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
        AsyncPipe,
    ],
})
export class OptionsComponent implements OnInit, AfterViewInit {
    @Input() public cardDocs!: IComDoc[];
    @Input() public cardExamples!: (TExample<IMaskOptions> | { _pipe: string })[];

    @ViewChildren('cards') public cards!: QueryList<ElementRef>;

    public readonly phone = '123456789';
    public readonly trackByPath = inject(TrackByService).trackBy('id');
    public readonly activeCardId$: Observable<number> = inject(ScrollService).activeCard$;
    public readonly openSourceOptionsPath = OpenSourcePath.OPTIONS;

    private readonly scrollService = inject(ScrollService);
    private readonly accordionService = inject(AccordionService);

    public testValue = null;

    private mask = '00D : 00H : 00M : 00S';

    public form = new FormGroup({
        ngxMaskInputTest: new FormControl<string>('01:02:03:04'),
    });

    // public patterns = {
    //     '0': { pattern: /\d/ },
    //     '9': { pattern: /\d/, optional: true },
    //     A: { pattern: /[a-zA-Z0-9]/ },
    //     L: { pattern: /[a-z]/ },
    //     S: { pattern: /[a-zA-Z]/ },
    //     U: { pattern: /[A-Z]/ },
    //     X: { pattern: /\d/, symbol: '*' },
    //     d: { pattern: /\d/ },
    //     h: { pattern: /\d/ },
    //     s: { pattern: /\d/ },
    //     D: { pattern: /D/ }, // custom: The D on the mask can only be the D character
    //     H: { pattern: /H/ }, // custom: the H on the mask can only be the H character
    //     M: { pattern: /M/ }, // custom: the M on the mask can only be the M character
    //     '\\S': { pattern: /\S/ }, // custom: the S on the mask can only be the S character. Escape it to prevent digits from being removed from the value
    // };

    protected maskConfig = {
        mask: this.mask,
        options: {
            shownMaskExpression: this.mask,
            placeHolderCharacter: '',
            showMaskTyped: true,
            dropSpecialCharacters: false,
            leadZeroDateTime: true,
            // The default specialCharacters + custom
            specialCharacters: [
                '-',
                '/',
                '(',
                ')',
                '.',
                ':',
                ' ',
                '+',
                ',',
                '@',
                '[',
                ']',
                '"',
                "'",
                'D', // custom
                'H', // custom
                'M', // custom
                '\\S', // custom
            ],
            // The default patterns + custom
            patterns: {
                '0': { pattern: /\d/ },
                '9': { pattern: /\d/, optional: true },
                A: { pattern: /[a-zA-Z0-9]/ },
                L: { pattern: /[a-z]/ },
                S: { pattern: /[a-zA-Z]/ },
                U: { pattern: /[A-Z]/ },
                X: { pattern: /\d/, symbol: '*' },
                d: { pattern: /\d/ },
                h: { pattern: /\d/ },
                s: { pattern: /\d/ },
                D: { pattern: /D/ }, // custom: The D on the mask can only be the D character
                H: { pattern: /H/ }, // custom: the H on the mask can only be the H character
                M: { pattern: /M/ }, // custom: the M on the mask can only be the M character
                '\\S': { pattern: /\S/ }, // custom: the S on the mask can only be the S character. Escape it to prevent digits from being removed from the value
            },
        },
    };

    // public mask = 'separator.2';
    // public negative = false;

    // public changeIt() {
    //     this.negative = true;
    //     // this.mask = 'separator.3';
    // }

    // public patterns = {
    //     '0': {
    //         pattern: new RegExp('\\d'),
    //     },
    // };
    // public control = new FormControl('string with space');
    // public mask$ = new BehaviorSubject('f*');
    //
    // public patterns = {
    //     f: {
    //         pattern: /[a-zA-Z0-9 ]/,
    //     },
    //     F: {
    //         pattern: /[а-яА-Яa-zA-Z0-9 ]/,
    //     },
    // };
    public ngOnInit() {
        // setTimeout(() => {
        //     this.mask$.next('F*');
        // }, 1000);
    }

    // public MASK_PATTERN = {
    //     A: { pattern: new RegExp('[0-9A-Za-z]') },
    //     '0': { pattern: new RegExp('[0-9]') },
    //     D: { pattern: new RegExp('[a-zA-Z]') },
    // };
    //
    // public firstCustom = 'AAAA A';
    // public secondCustomMask = 'DD00 AA';

    // public formControl = new FormControl('', Validators.required);

    public ngAfterViewInit(): void {
        this.scrollService.onScroll(this.cards);
        this.accordionService.onChangeAccordion(this.cards);
    }
}
