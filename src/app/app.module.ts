import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdGridListModule, MdIconModule, MdInputModule,
  MdListModule, MdSelectModule, MdButtonModule,
  MdToolbarModule, MdCardModule, MdSidenavModule
}
  from
    '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import 'hammerjs';

import { AppComponent } from './app.component';
import { Ng2MaskModule } from './ng2-mask/ng2-mask.module';

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
    Ng2MaskModule,
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
