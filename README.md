![screen shot 2017-01-22 at 14 07 50](https://cloud.githubusercontent.com/assets/1526680/22182355/31d103ca-e0ac-11e6-9664-c7c0399ef69f.png)

## Installing

```bash
$ npm install --save ng2-mask
```

## Quickstart

Import **ng2-mask** module in Angular app.

```typescript
import {Ng2MaskModule} from 'ng2-mask'

(...)

@NgModule({
  (...)
  imports: [
    Ng2MaskModule
  ]
  (...)
})
```

Then, just define masks in inputs.

```html
<input type='text' mask='0000-00-00' />
```

## Examples

Check the [demo](https://nepipenkoigor.github.io/ng2-mask/).
