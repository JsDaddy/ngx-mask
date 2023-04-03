import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CypressTestTriggerOnMaskChangeComponent } from './cypress-test-trigger-on-mask-change.component';
import { CypressTestMaskComponent } from './cypress-test-component.component';
import { CypressTestMaskShadowDomComponent } from './cypress-test-shadow-dom.component';
import { provideNgxMask } from '../../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../../lib/ngx-mask.directive';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective],
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
    providers: [provideNgxMask()],
})
export class CypressTestMaskModule {}
