![screen shot 2017-01-22 at 14 07 50](https://cloud.githubusercontent.com/assets/1526680/22182355/31d103ca-e0ac-11e6-9664-c7c0399ef69f.png)

## Installing

```bash
$ npm install --save ngx-mask
```

## Quickstart

Import **ng2-mask** module in Angular app.

```typescript
import {NgxMaskModule} from 'ngx-mask'

(...)

@NgModule({
  (...)
  imports: [
    NgxMaskModule
  ]
  (...)
})
```

Then, just define masks in inputs.

```html
<input type='text' mask='0000-00-00' >
```

## Documentation

### Mask

#### Usage

```html 
<input type='text' mask='{here comes your mask}' >
```

#### Params
You construct your mask pattern using these follow codes:

| code | meaning |
|------|---------|
| **0** or **9** | digits (like 0 to 9 numbers) |
| **A** | letters (uppercase or lowercase) and digits |
| **S** | only letters (uppercase or lowercase) |
| Custom Pattern | Work in Progress |

And you can mix with special characters:

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
| Custom characters (WIP) |

#### Examples

| mask | example |
| ------- | ------- |
| 9999-99-99 | 2017-04-15 |
| 000.000.000-99 | 048.457.987-98 |
| AAAA | 0F6g |
| SSSS | asDF |

### Special characters
You can choose if mask will propagate to model, or not, you just need to set
the boolean attribute `specialCharacters`.

#### Usage

```html 
<input type='text' specialCharacters="false" mask="000-000.00" >
```

Then:

```
Input value: 789-874.98
Model value: 78987498
```

### Clear if not match
You can choose clear the input if the input value **not match** the mask, you just need
to set the boolean attribute `clearIfNotMatch`


#### Usage

```html 
<input type='text' clearIfNotMatch="false" mask="99.99-99" >
```

## Examples

Check the [demo](https://nepipenkoigor.github.io/ngx-mask/).
