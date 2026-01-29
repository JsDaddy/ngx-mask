import type { OnDestroy, OnInit } from '@angular/core';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'jsdaddy-open-source-test',
    standalone: true,
    imports: [ReactiveFormsModule, NgxMaskDirective],
    styles: [
        'code { border: 1px solid #ddd; background-color: #eee; padding: 0 5px; border-radius: 3px; }',
    ],
    template: `
        <div>
            <label for="radio-de">DE</label>
            <input id="radio-de" type="radio" [formControl]="radio" value="de" />

            <label for="radio-ch">CH</label>
            <input id="radio-ch" type="radio" [formControl]="radio" value="ch" />

            <input
                id="masked"
                [formControl]="form"
                [mask]="mask()"
                [hiddenInput]="false"
                [triggerOnMaskChange]="true"
                prefix="" />
        </div>
        <div>
            <span>Mask:&nbsp;</span><code class="mask">{{ mask() }}</code>
            <br />
            <span>Form Value:&nbsp;</span><code class="formvalue">{{ form.value }}</code>
        </div>
    `,
})
export class CypressTestTriggerOnMaskChangeComponent implements OnInit, OnDestroy {
    public mask = signal('');

    public form: FormControl = new FormControl('');

    public radio: FormControl = new FormControl('de');

    private subscription: { unsubscribe: () => void } | null = null;

    public ngOnInit(): void {
        this.subscription = this.radio.valueChanges.subscribe((value) => {
            this.mask.set(value === 'de' ? '' : '00 000 00 00');
        });
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
