import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { scan, startWith } from 'rxjs';

@Component({
    selector: 'jsdaddy-open-source-test',
    template: `
        <input
            id="masked"
            [formControl]="form"
            [mask]="mask"
            [prefix]="prefix"
            [suffix]="suffix"
            [leadZero]="leadZero"
            [showMaskTyped]="showMaskTyped"
            [decimalMarker]="decimalMarker"
            [thousandSeparator]="thousandSeparator"
            [keepCharacterPositions]="keepCharacterPositions"
            [hiddenInput]="hiddenInput" />

        <pre id="pre">{{ counter$ | async }}</pre>
        <pre id="pre1">{{ form.value }}</pre>
    `,
})
export class CypressTestMaskComponent {
    @Input() public mask = '';

    @Input() public hiddenInput = false;

    @Input() public prefix = '';

    @Input() public suffix = '';

    @Input() public leadZero = false;

    @Input() public showMaskTyped = false;

    @Input() public decimalMarker = '.';

    @Input() public thousandSeparator = ',';

    @Input() public keepCharacterPositions = false;

    public form: FormControl = new FormControl('');

    public readonly counter$ = this.form.valueChanges.pipe(
        startWith(0),
        // eslint-disable-next-line no-param-reassign
        scan((_, __, index) => ++index)
    );
}
