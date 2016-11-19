# Ng2Mask

##### Lightweight native Angular2 mask module.

##### Angular2 mask without dependencies (No jQuery).
...
=======

[![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_64x64.png)](https://docs.angularjs.org/misc/faq/#what-browsers-does-angular-work-with-) [![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_64x64.png)](https://docs.angularjs.org/misc/faq/#what-browsers-does-angular-work-with-) [![IE8+](https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_64x64.png)](https://docs.angularjs.org/guide/ie) [![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_64x64.png)](https://docs.angularjs.org/misc/faq/#what-browsers-does-angular-work-with-) [![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_64x64.png)](https://docs.angularjs.org/misc/faq/#what-browsers-does-angular-work-with-)
======

### How To Use

**npm:**
* Install the package:

   ```shell
   npm install ng2-mask
   ```
* Import ng2-mask Module:

   ```javascript
   import {Ng2MaskModule} from 'ng2-mask'
   ```
* Import module dependency:

   ```javascript
      ...
      imports: [
      ...
       Ng2MaskModule
      ...
      ]
      ```
   ```

* Use ng2-mask directive:

   ```html
   <input type='text' mask='0000-00-00' />
   ```
  
  More examples will be soon available
======================================


**Common Patterns**

### Available Patterns

You can make your mask using some patterns available. If you use a pattern not specified below to construct your mask, It'll be considered a divisor. A dividor is a character used to group semantic elements, for example: "/" in dates to separate days, months and years, "-" in SSN to separate area, group and serial numbers or "." in IPv4 to create 4 groups of 8 bits.

**Common Patterns**
   - * =====> /./
      - Any single character
   - **w** =====> /\w/
      - Any word character (letter, number, underscore)
   - **W** =====> /\W/
      - Any non-word character
   - **d** =====> /\d/
      - Any digit
   - **D** =====> /\D/
      - Any non-digit
   - **s** =====> /\s/
      - Any whitespace character
   - **S** =====> /\S/
      - Any non-whitespace character
   - **b** =====> /\b/
      - Any word boundary

**Number Patterns**
   - **9** =====> /[0-9]/
      - Valid numbers: 0,1,2,3,4,5,6,7,8,9
   - **8** =====> /[0-8]/
      - Valid numbers: 0,1,2,3,4,5,6,7,8
   - **7** =====> /[0-7]/
      - Valid numbers: 0,1,2,3,4,5,6,7
   - **6** =====> /[0-6]/
      - Valid numbers: 0,1,2,3,4,5,6
   - **5** =====> /[0-5]/
      - Valid numbers: 0,1,2,3,4,5
   - **4** =====> /[0-4]/
      - Valid numbers: 0,1,2,3,4
   - **3** =====> /[0-3]/
      - Valid numbers: 0,1,2,3
   - **2** =====> /[0-2]/
      - Valid numbers: 0,1,2
   - **1** =====> /[0-1]/
      - Valid numbers: 0,1
   - **0** =====> /[0]/
      - Valid numbers: 0

**Especial Patterns**
   - **?** =====> /?/
      - Optional character. It makes the previous pattern optional.
   - **A** =====> /[A-Z]/
      - Any uppercase alphabet letter without accents
   - **a** =====> /[a-z]/
      - Any lowercase alphabet letter without accents
   - **Z** =====> /[A-ZÇÀÁÂÃÈÉÊẼÌÍÎĨÒÓÔÕÙÚÛŨ]/
      - Any uppercase alphabet letter with accents
   - **z** =====> /[a-zçáàãâéèêẽíìĩîóòôõúùũüû]/
      - Any lowercase alphabet letter with accents
   - **@** =====> /[a-zA-Z]/
      - Any alphabet letter without accents
   - **\#** =====> /[a-zA-ZçáàãâéèêẽíìĩîóòôõúùũüûÇÀÁÂÃÈÉÊẼÌÍÎĨÒÓÔÕÙÚÛŨ]/
      - Any alphabet letter with accents
   - **%** =====> /[0-9a-zA-zçáàãâéèêẽíìĩîóòôõúùũüûÇÀÁÂÃÈÉÊẼÌÍÎĨÒÓÔÕÙÚÛŨ]/
      - Any digit and alphabet letter with accents

======
=======


### Options

Comming soon...
=======


### Examples

Comming soon...
=======
