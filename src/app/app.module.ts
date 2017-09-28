import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule, MdCardModule, MdGridListModule, MdIconModule, MdInputModule,
  MdListModule,
  MdSelectModule, MdSidenavModule,
  MdToolbarModule
}
  from
    '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import 'hammerjs';

import { AppComponent } from './app.component';
import { NgxMaskModule } from './ngx-mask/ngx-mask.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MdGridListModule,
    MdSidenavModule,
    MdToolbarModule,
    MdSelectModule,
    MdButtonModule,
    MdInputModule,
    NgxMaskModule.forRoot(),
    MdIconModule,
    MdListModule,
    MdCardModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
