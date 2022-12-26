import { Component, Input } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MatCardModule } from '@angular/material/card';
import { JsonPipe, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { MatInputModule } from '@angular/material/input';
import { IComDoc, IMaskOptions, TExample } from '../../assets/content/content.interfaces';

@Component({
    selector: 'ngx-mask-demo-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: true,
    imports: [
        NgStyle,
        JsonPipe,
        NgForOf,
        NgIf,
        NgTemplateOutlet,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        HighlightModule,
        NgxMaskDirective,
        NgxMaskPipe,
    ],
    providers: [],
})
export class OptionsComponent {
    @Input()
    public docs!: IComDoc[];

    @Input()
    public examples!: (TExample<IMaskOptions> | { _pipe: string })[];

    @Input()
    public choose!: number;

    public phone = '123456789';

    public customPatterns = { '0': { pattern: new RegExp('[a-zA-Z]') } };

    public checkChoose(input: number, curr: number): boolean {
        return input === curr;
    }
}
