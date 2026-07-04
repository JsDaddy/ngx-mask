import { Component, input } from '@angular/core';

@Component({
    selector: 'ngxd-chip[chip]',
    standalone: true,
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.scss',
})
export class ChipComponent {
    public chip = input.required<string>();
    public chipBgColor = input('rgba(0,0,0,0.05)');
    public isActive = input(false);
    public pointer = input(false);
}
