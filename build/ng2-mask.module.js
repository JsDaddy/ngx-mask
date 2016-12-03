import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskDirective } from './mask.directive';
export var Ng2MaskModule = (function () {
    function Ng2MaskModule() {
    }
    Ng2MaskModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    exports: [MaskDirective],
                    declarations: [MaskDirective]
                },] },
    ];
    /** @nocollapse */
    Ng2MaskModule.ctorParameters = [];
    return Ng2MaskModule;
}());
//# sourceMappingURL=/Users/stevermeister/workspace/ng2-mask/src/app/ng2-mask/ng2-mask.module.js.map