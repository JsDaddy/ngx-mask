import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AsyncPipe, JsonPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { HighlightModule } from 'ngx-highlightjs';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AssetPipe } from '@libraries/asset/asset.pipe';
import { IsEmptyPipe } from '@open-source/is-empty/is-empty.pipe';
import { ColorPipe } from '@open-source/color/color.pipe';
import { CardContentComponent } from '../shared/card-content/card-content.component';

@Component({
    selector: 'jsdaddy-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.css'],
    standalone: true,
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
export class TestComponent {
    public mask = 'B*';
    public prefix = 'foo/';
    public patterns = { B: { pattern: new RegExp('.') } };
    public tr = 155151.9555;
    public tr1 = '';
    public tr2 = '';
    public form: FormGroup;
    public constructor(fb: FormBuilder) {
        this.form = fb.group({
            test1: [this.tr1, Validators.required],
            test2: [this.tr2, Validators.required],
        });
    }
}
