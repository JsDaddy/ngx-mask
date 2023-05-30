import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { IConfig, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'jsdaddy-test',
    templateUrl: './jsdaddy-test.component.html',
    styleUrls: ['./jsdaddy-test.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HighlightModule,
        NgxMaskDirective,
        NgxMaskPipe,
    ],
})
export class JsdaddyTestComponent {
    public ssnValue = '222222222';

    public readonly SSN_MASK = 'AAA - AA - 0000';
    public SSN_PATTERNS: IConfig['patterns'] = {
        0: { pattern: new RegExp('\\d') },
        A: { pattern: new RegExp('\\d'), symbol: '●' },
    };
}
