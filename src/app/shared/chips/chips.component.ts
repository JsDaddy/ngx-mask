import {Component, Input} from '@angular/core';
import {NgForOf} from "@angular/common";


@Component({
  selector: 'ngx-mask-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  standalone: true,
  imports: [
    NgForOf
  ],

})
export class ChipsComponent {
  @Input()
  public chips!: string[];
}
