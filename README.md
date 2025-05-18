# NGX-MASK

<p align="center">
  <img src="http://jsdaddy.io/assets/images/shared/logo.svg" alt="JSDaddy Logo">
</p>

<p align="center">
  A powerful Angular directive for input masking with customizable patterns
</p>

<p align="center">
  <a href="https://github.com/JsDaddy/ngx-mask/actions/workflows/quality-check.yml">
    <img src="https://github.com/JsDaddy/ngx-mask/actions/workflows/quality-check.yml/badge.svg?branch=develop" alt="CI">
  </a>
  <a href="https://www.npmjs.com/package/ngx-mask">
    <img src="https://img.shields.io/npm/v/ngx-mask.svg" alt="npm version">
  </a>
  <a href="https://npmjs.org/ngx-mask">
    <img src="https://img.shields.io/npm/dt/ngx-mask.svg" alt="npm downloads">
  </a>
  <a href="https://www.npmjs.com/package/ngx-mask">
    <img src="https://img.shields.io/npm/dm/ngx-mask.svg" alt="npm monthly downloads">
  </a>
  <a href="https://github.com/JSDaddy/ngx-mask">
    <img src="https://img.shields.io/github/contributors/JSDaddy/ngx-mask.svg?style=flat" alt="GitHub contributors">
  </a>
  <a href="https://github.com/JSDaddy/ngx-mask">
    <img src="https://img.shields.io/github/stars/JSDaddy/ngx-mask.svg?label=GitHub%20Stars&style=flat" alt="GitHub Stars">
  </a>
</p>

## 📖 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Version Compatibility](#version-compatibility)
- [Quick Start](#quick-start)
    - [For Angular 15+ (Standalone)](#for-angular-15-standalone)
    - [For Angular Modules](#for-angular-modules)
- [Documentation](#documentation)
- [Related Projects](#related-projects)
- [Contributing](#contributing)

## ✨ Features

NGX-MASK is a feature-rich input mask directive for Angular applications that helps you:

- Format input values according to predefined patterns
- Validate input against mask patterns
- Support custom validation rules
- Provide real-time input formatting

## 🚀 Demo

Check out our [live documentation and examples](https://jsdaddy.github.io/ngx-mask/)

## 📦 Installation

```bash
# For Angular 17 and above
$ npm install ngx-mask    # Using npm
$ bun add ngx-mask       # Using bun

# For specific Angular versions:
# Angular 16.x.x
$ npm install ngx-mask@16.4.2    # Using npm
$ bun add ngx-mask@16.4.2       # Using bun

# Angular 15.x.x
$ npm install ngx-mask@15.2.3    # Using npm
$ bun add ngx-mask@15.2.3       # Using bun

# Angular 14.x.x
$ npm install ngx-mask@14.3.3    # Using npm
$ bun add ngx-mask@14.3.3       # Using bun

# Angular 13.x.x or 12.x.x
$ npm install ngx-mask@13.2.2    # Using npm
$ bun add ngx-mask@13.2.2       # Using bun
```

> **Package Manager Note**: You can use either npm or bun based on your preference. Both package managers will work equally well with ngx-mask.

## 🔄 Version Compatibility

NGX-MASK follows Angular's official support policy, supporting Active and LTS versions. Currently supported:

- Angular 17 and newer (latest features and updates)
- For older Angular versions, use the corresponding NGX-MASK version as specified above

> **Note**: Versions for Angular older than v17 will not receive new features or updates.

## 🚀 Quick Start

### For Angular 15+ (Standalone)

#### Application-wide Setup with Default Config

```typescript
bootstrapApplication(AppComponent, { providers: [provideEnvironmentNgxMask()] }).catch((err) =>
    console.error(err)
);
```

#### With Custom Configuration

```typescript
import { NgxMaskConfig } from 'ngx-mask';

const maskConfig: Partial<NgxMaskConfig> = { validation: false };

bootstrapApplication(AppComponent, { providers: [provideEnvironmentNgxMask(maskConfig)] }).catch(
    (err) => console.error(err)
);
```

#### Feature-level Configuration

```typescript
@Component({
    selector: 'my-feature',
    standalone: true,
    imports: [NgxMaskDirective],
    providers: [provideNgxMask()],
})
export class MyFeatureComponent {}
```

### For Angular < 15 (NgModule)

#### Application-wide Setup with Default Config

```typescript
import { NgxMaskModule } from 'ngx-mask';

@NgModule({ imports: [NgxMaskModule.forRoot()] })
export class AppModule {}
```

#### With Custom Configuration

```typescript
import { NgxMaskModule, NgxMaskConfig } from 'ngx-mask';

const maskConfig: Partial<NgxMaskConfig> = { validation: false };

@NgModule({ imports: [NgxMaskModule.forRoot(maskConfig)] })
export class AppModule {}
```

#### Feature-level Configuration

```typescript
import { NgxMaskModule } from 'ngx-mask';

@NgModule({ imports: [NgxMaskModule.forChild()] })
export class FeatureModule {}
```

## 📚 Documentation

For detailed usage instructions and examples, please refer to our [Usage Documentation](https://github.com/JsDaddy/ngx-mask/blob/develop/USAGE.md).

## 🔗 Related Projects

Check out our other Angular utilities:

- [NGX Loader Indicator](https://www.npmjs.com/package/ngx-loader-indicator)
- [NGX Copypaste](https://www.npmjs.com/package/ngx-copypaste)

## 👥 Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/JsDaddy/ngx-mask/blob/develop/CONTRIBUTING.md) to get started.
