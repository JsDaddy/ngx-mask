<h1 align="center">NGX-MASK</h1>

<p align="center">
A powerful Angular directive for input masking with customizable patterns
</p>

<p align="center">
  Created with ❤️ by
</p>

<p align="center">
  <a href="https://jsdaddy.io">
    <img src="http://jsdaddy.io/assets/images/shared/logo.svg" alt="JSDaddy" width="75">
  </a>
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

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Version Compatibility](#version-compatibility)
- [Quick Start](#quick-start)
    - [For Angular 15+ (Standalone)](#for-angular-15-standalone)
    - [For Angular Modules](#for-angular-modules)
- [Related Projects](#related-projects)
- [Contributing](#contributing)

## Features

NGX-MASK is a feature-rich input mask directive for Angular applications that provides:

<table>
<tr>
<td width="33%" valign="top">

### 🎯 Masking Patterns

• Custom patterns & expressions

• Multiple mask patterns (|)

• Built-in common patterns

• Prefix & suffix support

</td>
<td width="33%" valign="top">

### 🔢 Number Formatting

• Thousand separators

• Decimal markers

• Negative numbers

• Leading zeros

</td>
<td width="33%" valign="top">

### ⚡ Input Control

• Real-time validation

• Clear on non-match

• Show/hide mask typing

• Keep character positions

</td>
</tr>
<tr>
<td width="33%" valign="top">

### 📅 Date & Time

• Leading zero handling

• AM/PM support

• Custom separators

• Multiple formats

</td>
<td width="33%" valign="top">

### 🛠️ Customization

• Custom placeholders

• Special characters

• Transform functions

• Custom validation

</td>
<td width="33%" valign="top">

### 📋 Form Integration

• Reactive Forms

• ControlValueAccessor

• Built-in validation

• Standalone support

</td>
</tr>
</table>

## Demo

Check out our [live documentation and examples](https://jsdaddy.github.io/ngx-mask/)

## Installation

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

## Version Compatibility

NGX-MASK follows Angular's official support policy, supporting Active and LTS versions. Currently supported:

- Angular 17 and newer (latest features and updates)
- For older Angular versions, use the corresponding NGX-MASK version as specified above

> **Note**: Versions for Angular older than v17 will not receive new features or updates.

## Quick Start

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

## Related Projects

Check out other projects by JSDaddy:

- [ngx-copypaste](https://github.com/JsDaddy/ngx-copypaste)
- [ngx-loader-indicator](https://github.com/JsDaddy/ngx-loader-indicator)

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) to learn about our development process and how you can propose bugfixes and improvements.
