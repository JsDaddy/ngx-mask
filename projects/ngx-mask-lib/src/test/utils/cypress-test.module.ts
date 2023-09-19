import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CypressTestTriggerOnMaskChangeComponent } from './cypress-test-trigger-on-mask-change.component';
import { CypressTestMaskComponent } from './cypress-test-component.component';
import { CypressTestMaskShadowDomComponent } from './cypress-test-shadow-dom.component';
import { NgxMaskModule } from '../../lib/ngx-mask.module';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskModule.forRoot()],
    declarations: [
        CypressTestMaskShadowDomComponent,
        CypressTestMaskComponent,
        CypressTestTriggerOnMaskChangeComponent,
    ],
    exports: [
        CypressTestMaskShadowDomComponent,
        CypressTestMaskComponent,
        CypressTestTriggerOnMaskChangeComponent,
    ],
})
export class CypressTestMaskModule {}
