import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {Ng2MaskModule} from './ng2-mask/ng2-mask.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2MaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
