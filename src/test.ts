import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import '../projects/ngx-mask-lib/src/test.ts';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Автоматически импортировать все .spec.ts файлы
const context = (require as any).context('./', true, /\.spec\.ts$/);
context.keys().forEach(context); 