<a href="https://jsdaddy.github.io/ngx-mask">
  <h1 align="center">ngx-mask</h1>
</a>

[![Build Status](https://img.shields.io/travis/JsDaddy/ngx-mask.svg?branch=develop)](https://travis-ci.org/JsDaddy/ngx-mask)
[![npm](https://img.shields.io/npm/v/ngx-mask.svg)](https://www.npmjs.com/package/ngx-mask)
<a href="https://npmjs.org/ngx-mask">
  <img src="https://img.shields.io/npm/dt/ngx-mask.svg" alt="npm downloads" >
</a>
[![npm](https://img.shields.io/npm/dm/ngx-mask.svg)](https://www.npmjs.com/package/ngx-mask)
[![Backers on Open Collective](https://opencollective.com/ngx-mask/backers/badge.svg?style=flat-square)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/ngx-mask/sponsors/badge.svg?style=flat-square)](#sponsors)
[![GitHub contributors](https://img.shields.io/github/contributors/JSDaddy/ngx-mask.svg?style=flat-square)](https://github.com/JSDaddy/ngx-mask)
[![GitHub stars](https://img.shields.io/github/stars/JSDaddy/ngx-mask.svg?label=GitHub%20Stars&style=flat-square)](https://github.com/JSDaddy/ngx-mask)


You can also try our NGX LOADER INDICATOR [Download](https://www.npmjs.com/package/ngx-loader-indicator) it.
You can also try our NGX COPYPASTE [Download](https://www.npmjs.com/package/ngx-copypaste) it.


### You can see the full [documentation](https://jsdaddy.github.io/ngx-mask-page/) with examples.


## Credits

### Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

<a href="https://github.com/JsDaddy/ngx-mask/graphs/contributors"></a>

### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/ngx-mask#backer)]

<a href="https://opencollective.com/ngx-mask#backers" target="_blank"><img src="https://opencollective.com/ngx-mask/backers.svg?width=890"></a>

### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/ngx-mask#sponsor)]


## Installing

```bash
$ npm install --save ngx-mask
```

## Quickstart

Import **ngx-mask** module in Angular app.

```typescript
import {NgxMaskModule} from 'ngx-mask'

export const options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  (...)
  imports: [
    NgxMaskModule.forRoot(options)
  ]
  (...)
})
```

Then, just define masks in inputs.

#### Usage

```html
<input type='text' mask='{here comes your mask}' >
```

Also you can use mask pipe

#### Usage

```html
<span>{{phone | mask: '(000) 000-0000'}}</span>
```

#### Examples

| mask           | example        |
| -------------- | -------------- |
| 9999-99-99     | 2017-04-15     |
| 0*.00          | 2017.22        |
| 000.000.000-99 | 048.457.987-98 |
| AAAA           | 0F6g           |
| SSSS           | asDF           |

## Mask Options
You can define your custom options for all directives (as  object in the mask module) or for each (as attributes for directive). If you override this parameter, you have to provide all the special characters (default one are not included).
### specialCharacters (string[ ])
 We have next default characters:

   | character |
   |-----------|
   | / |
   | ( |
   | ) |
   | . |
   | : |
   | - |
   | **space** |
   | + |
   | , |
   | @ |

##### Usage

```html
<input type='text' [specialCharacters]="[ '[' ,']' , '\\' ]" mask="[00]\[000]" >
```

##### Then:

```
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

##### Usage:

```html
<input type='text' [patterns]="customPatterns" mask="(000-000)" >
```
and in your component

```typescript
public customPatterns = {'0': { pattern: new RegExp('\[a-zA-Z\]')}};
```

##### Then:

```
Input value: 789HelloWorld
Masked value: (Hel-loW)
```

### Custom pattern for this
 You can define custom pattern and specify symbol to be rendered in input field.
 
```typescript
pattern =  {
    'B': {
            pattern: new RegExp('\\d'),
            symbol: 'X'
      }
  }
```

### prefix (string)
   You can add prefix to you masked value
##### Usage

```html
<input type='text' prefix="+7 " mask="(000) 000 00 00" >
```

### sufix (string)
   You can add sufix to you masked value
##### Usage

```html
<input type='text' sufix=" $" mask="0000" >
```

### dropSpecialCharacters (boolean)
   You can choose if mask will drop special character in the model, or not, default value true
##### Usage

```html
<input type='text' [dropSpecialCharacters]="false" mask="000-000.00" >
```

##### Then:

```
Input value: 789-874.98
Model value: 789-874.98
```

### showMaskTyped (boolean)
  You can choose if mask is shown while typing, or not, default value false
##### Usage

```html
 <input mask="(000) 000-0000" prefix="+7" [showMaskTyped] = "true">
```

### clearIfNotMatch (boolean)
   You can choose clear the input if the input value **not match** the mask, default value false

### Pipe with mask expression and custom Pattern ([string, pattern])
  You can pass array of expression and custom Pattern to pipe
  
##### Usage

```html
 <span>{{phone | mask: customMaska}}</span>
```
and in your component
```
customMaska: [string, pattern];

pattern =  {
    'P': {
        pattern: new RegExp('\\d'),
    }};
  
this.customMaska = ['PPP-PPP', this.pattern];
```

### Repeat mask
  You can pass into mask pattern with brackets
  
##### Usage

```html
 <input type='text' mask="A{4}">
```

### Thousand separator
  You can devide your input by thousands

##### Usage

```html
 <input type='text' mask="separator">
```
For separate input with dots

```html
 <input type='text' mask="dot_separator">
```
For using decimals enter '.' to the end of your input to 'separator' mask and ',' to 'dot_separator'

```html
 <input type='text' mask="comma_separator">
```
For using decimals enter '.' to the end of your input to 'separator' or 'comma_separator' mask and ',' to 'dot_separator'


```
Input value: 1234.56
Masked value: 1 234.56

Input value: 1234,56
Masked value: 1.234,56

Input value: 1234.56
Masked value: 1,234.56
```

```html
 <input type='text' mask="dot_separator.2">
 <input type='text' mask="comma_separator.2">
 <input type='text' mask="dot_separator.0">
 <input type='text' mask="comma_separator.0">
```
For limiting decimal precision add '.' and the precision you want to limit too on the input. 2 is useful for currency. 0 will prevent decimals completely. 

```
Input value: 1234,56
Masked value: 1.234,56

Input value: 1234.56
Masked value: 1,234.56

Input value: 1234,56
Masked value: 1.234

Input value: 1234.56
Masked value: 1,234
```

### Time validation
  You can validate your input as 24 hour format

##### Usage

```html
 <input type='text' mask="Hh:m0:s0">
```

### Percent validation
  You can validate your input for percents

##### Usage

```html
 <input type='text' mask="percent" sufix="%">
```

### FormControl validation
  You can validate your formControl, default value is true

##### Usage

```html
 <input type='text' mask="00 00" [validation]="true">
```
### Secure input
  You can hide symbols in input field and get the actual value in formcontrol

##### Usage

```html
 <input matInput placeholder="Secure input" [hiddenInput]="true" mask="XXX/X0/0000">
```

### IP valid mask

##### Usage

```html
 <input mask="IP">
```
