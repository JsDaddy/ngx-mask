import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskDirective } from './mask.directive';
var Ng2MaskModule = (function () {
    function Ng2MaskModule() {
    }
    return Ng2MaskModule;
}());
export { Ng2MaskModule };
Ng2MaskModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MaskDirective],
                declarations: [MaskDirective]
            },] },
];
/** @nocollapse */
Ng2MaskModule.ctorParameters = function () { return []; };
