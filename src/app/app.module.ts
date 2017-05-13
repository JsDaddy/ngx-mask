import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdGridListModule, MdToolbarModule, MdIconModule, MdInputModule,
  MdSelectModule, MdListModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
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
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MdGridListModule,
    FlexLayoutModule,
    MdToolbarModule,
    MdSelectModule,
    MdInputModule,
    BrowserModule,
    Ng2MaskModule,
    MdIconModule,
    MdListModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
