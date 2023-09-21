import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'jsdaddy-open-source-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public test = new FormControl('0.4');
    public phone = '';

    public hide = true;

    public hiden() {
        this.hide = !this.hide;
    }
    public disabled() {
        this.test.disable();
    }

    public setValue() {
        this.test.setValue('12345');
    }
}
