import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'ngx-mask-demo-test',
    styles: [
        'code { border: 1px solid #ddd; background-color: #eee; padding: 0 5px; border-radius: 3px; }',
    ],
    template: `
        <div>
            <label>
                <input type="radio" [formControl]="radio" value="de" />
                DE
            </label>
            <label>
                <input type="radio" [formControl]="radio" value="ch" />
                CH
            </label>

            <input
                id="masked"
                [formControl]="form"
                [mask]="mask"
                [hiddenInput]="false"
                [triggerOnMaskChange]="true"
                prefix="" />
        </div>
        <div>
            <span>Mask:&nbsp;</span><code class="mask">{{ mask }}</code>
            <br />
            <span>Form Value:&nbsp;</span><code class="formvalue">{{ form.value }}</code>
        </div>
    `,
})
export class CypressTestTriggerOnMaskChangeComponent implements OnInit, OnDestroy {
    public mask = '';

    public form: FormControl = new FormControl('');

    public radio: FormControl = new FormControl('de');

    private destroyed = new Subject<void>();

    public ngOnInit(): void {
        this.radio.valueChanges.pipe(takeUntil(this.destroyed)).subscribe((value) => {
            this.mask = value === 'de' ? '' : '00 000 00 00';
        });
    }

    public ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
    }
}
