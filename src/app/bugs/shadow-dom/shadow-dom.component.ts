import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shadow-dom',
  templateUrl: './shadow-dom.component.html',
  styleUrls: ['./shadow-dom.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ShadowDomComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
