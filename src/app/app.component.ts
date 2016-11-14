import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  masks = ['00/00/0000',
  '00:00:00',
  '00/00/0000 00:00:00',
  '00000-000',
  '0000-0000',
  '(00) 0000-0000',
  '+0(000) 000-0000',
  '(000) (000) - 0000',
  '000.000.000-00']

  public someValue:string[] = ['ssds'];




}
