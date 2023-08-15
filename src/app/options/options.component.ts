import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    Input,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { AsyncPipe, JsonPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
export class OptionsComponent implements AfterViewInit {
    @Input() public cardDocs!: IComDoc[];
    @Input() public cardExamples!: (TExample<IMaskOptions> | { _pipe: string })[];

    @ViewChildren('cards') public cards!: QueryList<ElementRef>;

    public readonly phone = '123456789';
    public readonly trackByPath = inject(TrackByService).trackBy('id');
    public readonly activeCardId$: Observable<number> = inject(ScrollService).activeCard$;
    public readonly openSourceOptionsPath = OpenSourcePath.OPTIONS;

    private readonly scrollService = inject(ScrollService);
    private readonly accordionService = inject(AccordionService);

    public ngAfterViewInit(): void {
        this.scrollService.onScroll(this.cards);
        this.accordionService.onChangeAccordion(this.cards);
    }


    public testValue = 'andrey';
    public testValue1 = 'andrey';

    // public testValue1 = new FormControl('');

    public toUpeerCase = (value: string): string => value.toUpperCase();
    public toLowerCase = (value: string): string => value.toLowerCase();

    public replaceValue = (value: string): string => value.replace(/A/g, 'G');
    public replaceValue1 = (value: number): string => {
        console.log(typeof value)
        // value = value.toString();
        if (value && !String(value).includes('.')) {
            return Number(value).toFixed(2);
        }
        return  value.toString();
    }




    public testValue2 = 0;
    public toFixede = (value: string): number => {
        if (value.toString().includes('.')) {
            const numberValue = parseFloat(value);
            const formattedValue = Number(numberValue.toFixed(2));
            return formattedValue;
            // return Number(Number(value)).toFixed(2)
        }
        return Number(value);
    };



public transformerFn = (value: number) => value + 2;
    // public _format = (value: Date) => {
    //     return +`${String(value.getHours()).padStart(2, '0')}${String(value.getMinutes()).padStart(2, '0')}`
    // }


    public testControl = new FormControl('', [Validators.required, Validators.min(1)]);

    public amount: string = '10.99';

    public saveAfterDot = (value: string): string => {
        if (value) {
            const decimalPart = this.amount.split('.')[1];
            console.log(decimalPart)
            return value + `.${decimalPart}`;
        }
        return  value;
    }





    public typeOfValue(value: unknown): string {
        return typeof(value)
    }

    public numberValue = (value: string): number => Number(value);



    public parser = (value: string) => {
        const fetch = new Date();
        const values = value.split(':');
        if (values.length >= 2) {
            const hour = Number(values[0]);
            const minuts = Number(values[1]);
            fetch.setHours(hour);
            fetch.setMinutes(minuts);
        }
        fetch.setSeconds(0);
        return fetch;
    }

    public value = '';

    public date = (value: string) => {
        // eslint-disable-next-line no-param-reassign
        value = `${new Date().getHours()}${new Date().getMinutes()}`;
        return value;
    };

    public someNumber = null;
}


