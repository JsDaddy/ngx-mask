import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'jsdaddy-test',
    templateUrl: './jsdaddy-test.component.html',
    styleUrls: ['./jsdaddy-test.component.css'],
    standalone: true,
    imports: [CommonModule, NgxMaskDirective, NgxMaskPipe, ReactiveFormsModule],
})
export class JsdaddyTestComponent {
    public test1 = new FormControl('', Validators.required);
    public test2 = new FormControl('', Validators.required);
    public test3 = new FormControl('', Validators.required);
    public patterns = { B: { pattern: new RegExp('.') } };
    public mask = 'B*';
}
