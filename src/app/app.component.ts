import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'mask-demo-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [MatToolbarModule, MatGridListModule, RouterOutlet],
})
export class AppComponent {}
