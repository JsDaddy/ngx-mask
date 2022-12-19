import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
    templateUrl: './error.component.html',
    standalone: true,
    imports: [MatToolbarModule, MatGridListModule],
})
export class ErrorComponent {}
