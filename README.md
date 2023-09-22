<a href="http://jsdaddy.io/img/logo.png">
  <h1 align="center">NGX MASK</h1>
</a>

<p align="center">
  NGX MASK is the best directive to solve masking input with needed pattern
</p>

[![CI](https://github.com/JsDaddy/ngx-mask/actions/workflows/quality-check.yml/badge.svg?branch=develop)](https://github.com/JsDaddy/ngx-mask/actions/workflows/main.yml)
[![npm](https://img.shields.io/npm/v/ngx-mask.svg)](https://www.npmjs.com/package/ngx-mask)
[![npm downloads](https://img.shields.io/npm/dt/ngx-mask.svg)](https://npmjs.org/ngx-mask)

[![npm](https://img.shields.io/npm/dm/ngx-mask.svg)](https://www.npmjs.com/package/ngx-mask)

[![GitHub contributors](https://img.shields.io/github/contributors/JSDaddy/ngx-mask.svg?style=flat)](https://github.com/JSDaddy/ngx-mask)

[![GitHub stars](https://img.shields.io/github/stars/JSDaddy/ngx-mask.svg?label=GitHub%20Stars&style=flat)](https://github.com/JSDaddy/ngx-mask)

You can also try our NGX LOADER INDICATOR [check](https://www.npmjs.com/package/ngx-loader-indicator).
You can also try our NGX COPYPASTE [check](https://www.npmjs.com/package/ngx-copypaste).

### You can try live [documentation](https://jsdaddy.github.io/ngx-mask/) with examples


## Installing
Angular version 16.x.x
```bash
$ npm install --save ngx-mask
```
Angular version 15.x.x
```bash
$ npm install --save ngx-mask@15.2.1
```
Angular version 14.x.x
```bash
$ npm install --save ngx-mask@14.3.2
```
Angular version 13.x.x or 12.x.x
```bash
$ npm install --save ngx-mask@13.2.1
```

## Quickstart if ngx-mask version >= 15.0.0

Import **ngx-mask** directive, pipe and provide NgxMask providers with `provideNgxMask` function.

### With default config options application level

```typescript
bootstrapApplication(AppComponent, {
    providers: [
        (...)
        provideEnvironmentNgxMask(),
        (...)
    ],
}).catch((err) => console.error(err));
```

### Passing your own mask config options

```typescript
import { IConfig } from 'ngx-mask'

const maskConfig: Partial<IConfig> = {
  validation: false,
};

bootstrapApplication(AppComponent, {
    providers: [
        (...)
        provideEnvironmentNgxMask(maskConfig),
        (...)
    ],
}).catch((err) => console.error(err));
```

### Using a function to configure:

```typescript
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};

bootstrapApplication(AppComponent, {
    providers: [
         (...)
         provideEnvironmentNgxMask(maskConfigFunction),
         (...)
],
}).catch((err) => console.error(err));
```

### With config options feature level

```typescript
@Component({
    selector: 'my-feature',
    templateUrl: './my-feature.component.html',
    styleUrls: ['./my-feature.component.css'],
    standalone: true,
    imports: [NgxMaskDirective, (...)],
    providers: [
          (...)
          provideNgxMask(),
          (...)
    ],
})
export class MyFeatureComponent {}
```

Then, import directive, pipe to needed standalone component and just define masks in inputs.

### With Angular modules

```typescript
@NgModule({
  imports: [
      NgxMaskDirective, NgxMaskPipe
  ],
  providers: [provideNgxMask()]
})
```

## Quickstart if ngx-mask version < 15.0.0

For version ngx-mask < 15.0.0
Import **ngx-mask** module in Angular app.

### With default mask config options

```typescript
import { NgxMaskModule, IConfig } from 'ngx-mask'

export const options: Partial<null|IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  imports: [
    NgxMaskModule.forRoot(),
  ],
})
```

### Passing in your own mask config options

```typescript
import { NgxMaskModule, IConfig } from 'ngx-mask'

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  imports: [
    NgxMaskModule.forRoot(maskConfig),
  ],
})
```

Or using a function to get the config:

```typescript
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};

@NgModule({
  imports: [
    NgxMaskModule.forRoot(maskConfigFunction),
  ],
})
```

Then, just define masks in inputs.

## Usage

Text [documentation](https://github.com/JsDaddy/ngx-mask/blob/develop/USAGE.md)


## Contributing
We would love some contributions! Check out this [document](https://github.com/JsDaddy/ngx-mask/blob/develop/CONTRIBUTING.md) to get started.
