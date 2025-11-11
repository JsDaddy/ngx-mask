import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { runValueAccessorTests } from 'ngx-cva-test-suite';
import type { ElementRef} from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  template: `<input
    mask="Hh:m0"
    [dropSpecialCharacters]="false"
    [showMaskTyped]="true"
    [leadZeroDateTime]="true"
    #ctrl />`,
  imports: [NgxMaskDirective],
})
export class CVAWrapperComponent {
  @ViewChild(NgxMaskDirective) public defaultCtrl!: NgxMaskDirective;
  @ViewChild('ctrl') public readonly ctrl!: ElementRef<HTMLInputElement>;

  public get value(): string {
    return this.ctrl?.nativeElement.value;
  }
}

describe('TimeFieldFormComponent', () => {
  runValueAccessorTests<NgxMaskDirective, CVAWrapperComponent>({
    component: NgxMaskDirective,
    testModuleMetadata: {
      providers: [provideNgxMask()],
      imports: [FormsModule, ReactiveFormsModule],
    },
    hostTemplate: {
      hostComponent: CVAWrapperComponent,
      getTestingComponent: fixture => fixture.componentInstance.defaultCtrl,
    },
    supportsOnBlur: true,
    nativeControlSelector: 'input[mask]',
    internalValueChangeSetter: null,
    getComponentValue: null,
    resetCustomValue: { value: '__:__' },
    getValues: () => ['10:00', '20:00', null],
  });
});
