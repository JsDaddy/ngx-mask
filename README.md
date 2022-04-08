<a href="https://jsdaddy.github.io/ngx-mask">
  <h1 align="center">ngx-mask</h1>
</a>

[![CI](https://github.com/JsDaddy/ngx-mask/actions/workflows/main.yml/badge.svg?branch=develop)](https://github.com/JsDaddy/ngx-mask/actions/workflows/main.yml)
[![npm](https://img.shields.io/npm/v/ngx-mask.svg)](https://www.npmjs.com/package/ngx-mask)
[![npm downloads](https://img.shields.io/npm/dt/ngx-mask.svg)](https://npmjs.org/ngx-mask)

[![npm](https://img.shields.io/npm/dm/ngx-mask.svg)](https://www.npmjs.com/package/ngx-mask)

[![GitHub contributors](https://img.shields.io/github/contributors/JSDaddy/ngx-mask.svg?style=flat)](https://github.com/JSDaddy/ngx-mask)

[![GitHub stars](https://img.shields.io/github/stars/JSDaddy/ngx-mask.svg?label=GitHub%20Stars&style=flat)](https://github.com/JSDaddy/ngx-mask)

You can also try our [NGX LOADER INDICATOR](https://www.npmjs.com/package/ngx-loader-indicator).
You can also try our [NGX COPYPASTE](https://www.npmjs.com/package/ngx-copypaste).

### You can see the full [documentation](https://jsdaddy.github.io/ngx-mask-page/) with examples

## Installing

```bash
$ npm install --save ngx-mask
```

## Quickstart

Import **ngx-mask** module in Angular app.

### With default mask config options

```typescript
import { NgxMaskModule, IConfig } from 'ngx-mask'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

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

### Usage

```html
<input type="text" mask="<here goes your mask>" />
```

or

```html
<input type="text" [mask]="<here goes a reference to your component's mask property>" />
```

Also, you can use mask pipe.

### Usage

```html
<span>{{phone | mask: '(000) 000-0000'}}</span>
```

For separator you can add thousandSeparator

### Usage

```html
<span>{{value | mask: 'separator':','}}</span>
```

#### Examples

| mask           | example        |
| -------------- | -------------- |
| 9999-99-99     | 2017-04-15     |
| 0\*.00         | 2017.22        |
| 000.000.000-99 | 048.457.987-98 |
| AAAA           | 0F6g           |
| SSSS           | asDF           |
| UUUU           | ASDF           |
| LLLL           | asdf           |

## Mask Options

You can define your custom options for all directives (as object in the mask module) or for each (as attributes for directive). If you override this parameter, you have to provide all the special characters (default one are not included).

### specialCharacters (string[ ])

We have next default characters:

| character |
| --------- |
| -         |
| /         |
| (         |
| )         |
| .         |
| :         |
| **space** |
| +         |
| ,         |
| @         |
| [         |
| ]         |
| "         |
| '         |

#### Usage

```html
<input type="text" [specialCharacters]="[ '[' ,']' , '\\' ]" mask="[00]\[000]" />
```

##### Then

```text
Input value: 789-874.98
Masked value: [78]\[987]
```

```typescript
patterns ({ [character: string]: { pattern: RegExp, optional?: boolean})
```

We have next default patterns:

| code  | meaning                                     |
| ----- | ------------------------------------------- |
| **0** | digits (like 0 to 9 numbers)                |
| **9** | digits (like 0 to 9 numbers), but optional  |
| **A** | letters (uppercase or lowercase) and digits |
| **S** | only letters (uppercase or lowercase)       |
| **U** | only letters uppercase                      |
| **L** | only letters lowercase                      |

##### Usage

```html
<input type="text" [patterns]="customPatterns" mask="(000-000)" />
```

and in your component

```typescript
public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Z\]')} };
```

##### Then

```text
Input value: 789HelloWorld
Masked value: (Hel-loW)
```

### Custom pattern for this

You can define custom pattern and specify symbol to be rendered in input field.

```typescript
pattern = {
  B: {
    pattern: new RegExp('\\d'),
    symbol: 'X',
  },
};
```

### prefix (string)

You can add prefix to you masked value

#### Usage

```html
<input type="text" prefix="+7" mask="(000) 000 00 00" />
```

### suffix (string)

You can add suffix to you masked value

#### Usage

```html
<input type="text" suffix="$" mask="0000" />
```

### dropSpecialCharacters (boolean | string[])

You can choose if mask will drop special character in the model, or not, default value is `true`.

#### Usage

```html
<input type="text" [dropSpecialCharacters]="false" mask="000-000.00" />
```

##### Then

```text
Input value: 789-874.98
Model value: 789-874.98
```

### showMaskTyped (boolean)

You can choose if mask is shown while typing, or not, default value is `false`.

#### Usage

```html
<input mask="(000) 000-0000" prefix="+7" [showMaskTyped]="true" />
```

### allowNegativeNumbers (boolean)

You can choose if mask will allow the use of negative numbers. The default value is `false`.

#### Usage

```html
<input type="text" [allowNegativeNumbers]="true" mask="separator.2" />
```

##### Then

```text
Input value: -10,000.45
Model value: -10000.45
```

### placeHolderCharacter (string)

If the `showMaskTyped` parameter is enabled, this setting customizes the character used as placeholder. Default value is `_`.

#### Usage

```html
<input mask="(000) 000-0000" prefix="+7" [showMaskTyped]="true" placeHolderCharacter="*" />
```

### clearIfNotMatch (boolean)

You can choose clear the input if the input value **not match** the mask, default value is `false`.

### Pipe with mask expression and custom Pattern ([string, pattern])

You can pass array of expression and custom Pattern to pipe.

#### Usage

```html
<span>{{phone | mask: customMask}}</span>
```

and in your component

```typescript
customMask: [string, pattern];

pattern = {
  P: {
    pattern: new RegExp('\\d'),
  },
};

this.customMask = ['PPP-PPP', this.pattern];
```

### Repeat mask

You can pass into mask pattern with brackets.

#### Usage

```html
<input type="text" mask="A{4}" />
```

### Thousand separator

You can divide your input by thousands, by default will seperate with a space.

#### Usage

```html
<input type="text" mask="separator" />
```

For separate input with dots.

```html
<input type="text" mask="separator" thousandSeparator="." />
```

For using decimals enter `.` and how many decimals to the end of your input to `separator` mask.

```html
<input type="text" mask="separator.2" />
```

```text
Input value: 1234.56
Masked value: 1 234.56

Input value: 1234,56
Masked value: 1.234,56

Input value: 1234.56
Masked value: 1,234.56
```

```html
<input type="text" mask="separator.2" thousandSeparator="." />
<input type="text" mask="separator.2" thousandSeparator="," />
<input type="text" mask="separator.0" thousandSeparator="." />
<input type="text" mask="separator.0" thousandSeparator="," />
```

For limiting decimal precision add `.` and the precision you want to limit too on the input. **2** is useful for currency. **0** will prevent decimals completely.

```text
Input value: 1234,56
Masked value: 1.234,56

Input value: 1234.56
Masked value: 1,234.56

Input value: 1234,56
Masked value: 1.234

Input value: 1234.56
Masked value: 1,234
```

```html
<input type="text" mask="separator.2" separatorLimit="1000" />
```

For limiting the number of digits before the decimal point you can set `separatorLimit` value to _10_, _100_, _1000_ etc.

```text
Input value: 12345678,56
Masked value: 1.234,56
```

### Time validation

You can validate your input as 24 hour format.

#### Usage

```html
<input type="text" mask="Hh:m0:s0" />
```

### Date validation

You can validate your date.

#### Usage

```html
<input type="text" mask="d0/M0/0000" />
```

### leadZeroDateTime (boolean)

If the `leadZeroDateTime` parameter is `true`, skipped symbols of date or time will be replaced by `0`. Default value is `false`.

#### Usage

```html
<input type="text" mask="d0/M0/0000" [leadZeroDateTime]="true" />
```

```text
Input value: 422020
Masked value: 04/02/2020
```

```html
<input type="text" mask="Hh:m0:s0" [leadZeroDateTime]="true" />
```

```text
Input value: 777
Masked value: 07:07:07
```

### Percent validation

You can validate your input for percents.

#### Usage

```html
<input type="text" mask="percent" suffix="%" />
```

### FormControl validation

You can validate your `formControl`, default value is `true`.

#### Usage

```html
<input type="text" mask="00 00" [validation]="true" />
```

### Secure input

You can hide symbols in input field and get the actual value in `formcontrol`.

#### Usage

```html
<input placeholder="Secure input" [hiddenInput]="true" mask="XXX/X0/0000" />
```

### IP valid mask

#### Usage

```html
<input mask="IP" />
```

### CPF_CNPJ valid mask

#### Usage

```html
<input mask="CPF_CNPJ" />
```

### Dynamic valid mask

#### Usage

You can pass into mask pattern with `||`.

```html
<input mask="000.000.000-00||00.000.000/0000-00" />
```

```html
<input mask="(00) 0000-0000||(00) 0 0000-0000" />
```

### Function maskFilled

#### Usage

```html
<input mask="0000" (maskFilled)="maskFilled()" />
```
