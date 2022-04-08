<a name="13.1.7"></a>

# 13.1.7 (2022-04-08)

### Feature

- Added lowercase and uppercase mask support
- Feature ([#947](https://github.com/JsDaddy/ngx-mask/issues/947))

<a name="13.1.6"></a>

# 13.1.6 (2022-04-04)

### Fix

- Ghost characters shown in input when toggling mask on/off
- Fix ([#897](https://github.com/JsDaddy/ngx-mask/issues/897))

<a name="13.1.5"></a>

# 13.1.5 (2022-04-03)

### Fix

- Fixed ([#848](https://github.com/JsDaddy/ngx-mask/issues/848))

<a name="13.1.4"></a>

# 13.1.4 (2022-03-30)

### Feature

- Function maskFilled is added
- Feature ([#917](https://github.com/JsDaddy/ngx-mask/issues/917))

<a name="13.1.3"></a>

# 13.1.3 (2022-03-28)

### Features and fixes

feature ([#940](https://github.com/JsDaddy/ngx-mask/issues/940))
Fixed ([#965](https://github.com/JsDaddy/ngx-mask/issues/965))

<a name="13.1.2"></a>

# 13.1.2 (2022-01-20)

### Features

- added triggerOnMaskChange, allow mask change to trigger onChange

<a name="13.1.1"></a>

# 13.1.1 (2022-01-12)

### Fixes

- Revision for separator logic.
- Set default decimalMarker to [".",","] instead "."

<a name="13.1.0"></a>

# 13.1.0 (2021-12-30)

### Features

- Enable non-zero-selections
- Deletion of special mask character moves just the cursor instead of deleting the character next to it

### Test/CI fixes

- Enable cypress component testing

<a name="13.0.1"></a>

# 13.0.1 (2021-12-15)

### Test/CI fixes

- the same that in 13.0.0
- fix test
- fix CI

<a name="13.0.0"></a>

# 13.0.0 (2021-11-28)

### Angular 13 release

- up all dependencies to latest
- move from tslint to eslint
- add more strict rules for tsconfig and code quality config
- build library with IVY and new angular package structure

<a name="12.0.0"></a>

# 12.0.0 (2021-05-19)

### Bug Fixes

Fixed ([#875](https://github.com/JsDaddy/ngx-mask/issues/875))
Fixed ([#892](https://github.com/JsDaddy/ngx-mask/issues/892))
Fixed ([#861](https://github.com/JsDaddy/ngx-mask/issues/861))
Fixed ([#893](https://github.com/JsDaddy/ngx-mask/issues/893))

<a name="11.1.5"></a>

# 11.1.5 (2020-03-19)

### Bug Fixes

Fixed ([#864](https://github.com/JsDaddy/ngx-mask/issues/864)) ([#863](https://github.com/JsDaddy/ngx-mask/issues/863)) ([#706](https://github.com/JsDaddy/ngx-mask/issues/706))

<a name="11.1.4"></a>

# 11.1.4 (2020-11-26)

### Bug Fixes

Remove complet mask if part of it is deleted ([#831](https://github.com/JsDaddy/ngx-mask/issues/831))

<a name="11.1.3"></a>

# 11.1.3 (2020-11-25)

### Bug Fixes

Now backspace no leaves special characters ([#692](https://github.com/JsDaddy/ngx-mask/issues/692)) ([831](https://github.com/JsDaddy/ngx-mask/pull/831))

<a name="11.1.2"></a>

# 11.1.2 (2020-11-24)

### Bug Fixes

DropSpecialCharacters false also should return prefix ([#686](https://github.com/JsDaddy/ngx-mask/issues/686)) ([830](https://github.com/JsDaddy/ngx-mask/pull/830))

<a name="11.1.1"></a>

# 11.1.1 (2020-11-24)

### Bug Fixes

Number cast bug. Now if model value number mask should return type number ([#791](https://github.com/JsDaddy/ngx-mask/issues/791)) ([#702](https://github.com/JsDaddy/ngx-mask/issues/702)) ([829](https://github.com/JsDaddy/ngx-mask/pull/829))

<a name="11.1.0"></a>

# 11.1.0 (2020-11-23)

### Bug Fixes

Copy paste event should work as expected ([#765](https://github.com/JsDaddy/ngx-mask/issues/765)) ([827](https://github.com/JsDaddy/ngx-mask/pull/827))

<a name="11.0.1"></a>

# 11.0.1 (2020-11-15)

### Bug Fixes

Difinition for form control with `{value, disable} should work ([#803](https://github.com/JsDaddy/ngx-mask/issues/803)) ([826](https://github.com/JsDaddy/ngx-mask/pull/826))

<a name="11.0.0"></a>

# [11.0.0 Update to Angular 11](2020-11-12)

Update to Angular 11

<a name="9.1.0"></a>

# [9.1.0 Directive's selector change](2020-05-20)

Change directive selector to restrict to input and textarea tags

<a name="9.0.2"></a>

# [9.0.2 Bugfix](2020-04-20)

Fix for #721 - prevent entering dots when decimal marker is comma

<a name="9.0.1"></a>

# [9.0.1 Bugfix](2020-04-08)

Fix for #715 - mark fields as touched on blur on form fields with an empty mask

Fix for #711 - stop fields being marked as dirty after a form reset

<a name="9.0.0"></a>

# [9.0.0 Update to Angular 9](2020-04-08)

Feature: Library updated to Angular 9

Feature: Can pass empty string for thousandSeparator if do not want any separation

Fix: allowNegativeNumbers works correctly when set as true or false. If false, entering a hyphen will not be allowed

Fix: stop cursor jumping around when mask is set as empty

<a name="8.2.0"></a>

# [8.2.0 bugfix and breaking change](2020-01-17)

Fix for #657 - showMaskTyped option now works correctly when set in the config

Fix for #665 - validateTime mark field as invalid immediately if value is null

Feature: Added new error page for handling 404's, and new bugs page for being a playground for bug fixing

Breaking change: Made validation error return an object named mask. If you were previously checking for a
validation error named 'Mask error' then it will need changing to just 'mask'.

<a name="8.1.7"></a>

# [8.1.7 bugfix](2019-12-27)

Fix for #369 - add thousandSeparator to separator pipe

Fix for #381 - add support to negative number in separator mask

<a name="8.1.6"></a>

# [8.1.6 bugfix](2019-10-30)

Fix for #560 - do not overwrite the mask available patterns when patterns attribute passed in value is a falsey value i.e null/undefined/false

Fix for #620 - allow delete button to work when at beginning of input and no prefix exists

Fix for #621 - validation config value now works correctly

<a name="8.1.5"></a>

# [8.1.5 bugfix](2019-10-25)

Fix for #614 - export everything from config

<a name="8.1.4"></a>

# [8.1.4 bugfix](2019-10-23)

Fix for #580 - honour the special characters that user may have specified, and prevent runtime exception occuring

Project folder structure converted over to follow Angular CLI way of libraries

<a name="8.1.3"></a>

# [8.1.3 bugfix](2019-10-23)

Fix for #590 - Problem if prefix last char is not a number

<a name="8.1.2"></a>

# [8.1.2 placeholder customisation](2019-10-11)

Placeholder can now be customised

<a name="8.1.1"></a>

# [8.1.1 bugfix](2019-10-10)

bugs fix

<a name="8.1.0"></a>

# [8.1.0 separator update](2019-11-09)

update separator

<a name="8.0.9"></a>

# [8.0.8 bugfix](2019-10-07)

bugs fix [refs: #554, #580, #582]
<a name="8.0.8"></a>

# [8.0.7 bugfix](2019-10-04)

bugs fix [refs: #579, #576, #561]
<a name="8.0.7"></a>

# [8.0.7 update date and time](2019-10-02)

Update date and time masks [refs: #571, #567, #572, #564, #558, #573]

<a name="8.0.4"></a>

# [8.0.4 bugfix](2019-09-09)

minor bug fixes

<a name="8.0.3"></a>

# [8.0.3 cursor](2019-09-04)

minor bug fixes

<a name="7.9.9"></a>

# [7.9.9 cursor](2019-05-8)

Issues fix

<a name="7.9.2"></a>

# [7.9.1 cursor](2019-04-15)

Bugs fix

<a name="7.9.1"></a>

# [7.9.1 cursor](2019-04-11)

Fix Backspace on empty input causes cursor to jump after entering a value

<a name="7.8.6"></a>

# [7.8.6 bugfix](2019-03-29)

Bugfix

<a name="7.8.5"></a>

# [7.8.5 update of returned value type](2019-03-28)

Fix returned value when input value type is number

<a name="7.8.4"></a>

# [7.8.4 decimal](2019-03-28)

Added decimal percent, fix suffix prevents decimals

<a name="7.7.3"></a>

# [7.7.3 polyfill](2019-03-28)

Added polyfill for IE11

<a name="7.7.2"></a>

# [7.7.2 dot_separator](2019-03-27)

Fix decimals

<a name="7.7.1"></a>

# [7.7.1 coma_separator](2019-03-25)

Readme update

<a name="7.7.0"></a>

# [7.7.0 coma_separator](2019-03-21)

Secure input and bugs fix

<a name="7.6.6"></a>

# [7.6.6 coma_separator](2019-03-18)

Bugs fix
<a name="7.6.4"></a>

# [7.6.4 coma_separator] (2019-03-13)

Bugs fix

<a name="7.6.0"></a>

# [7.6.0 coma_separator] (2019-03-11)

Feature: added default validation

<a name="7.5.0"></a>

# [7.5.0 coma_separator] (2019-03-11)

Bugs fix: fix minutes validation, '-' in separator, decimal part in separator and fix issues with FF/IE

<a name="7.4.6"></a>

# [7.4.6 coma_separator] (2019-02-15)

Fix coma_separator behavior

<a name="7.4.5"></a>

# [7.4.5 dependencies] (2019-02-15)

Update dev and prod dependencies

<a name="7.3.4"></a>

# [7.3.4 decimals values separator] (2019-01-17)

Added coma_separator

<a name="7.3.3"></a>

# [7.3.3 decimals values separator] (2019-01-08)

Added decimals values for separator and dot_separator

<a name="7.3.1"></a>

# [7.3.1 update separator] (2018-12-19)

Now separator can separate by dots

<a name="7.3.0"></a>

# [7.3.0 feature percent] (2018-12-14)

Added validation for percent

<a name="7.2.0"></a>

# [7.2.0 feature 24 hour forma] (2018-12-12)

Added valid 24 hour format mask and update separator

<a name="7.1.0"></a>

# [7.1.0 feature thousand separator] (2018-12-11)

Added new mask that separates number by thousands

<a name="7.0.4"></a>

# [7.0.4 fix multiple mask] (2018-12-11)

Fix multiple mask when you use the same symbols bettwen \*

<a name="7.0.3"></a>

# [7.0.3 hotfix] (2018-12-10)

hotfix

<a name="7.0.2"></a>

# [7.0.2 update of sufix] (2018-12-10)

sufix appears while you inputing data

<a name="6.5.17"></a>

# [6.5.17 fix of sufix](2018-10-09)

you can use sufix along with '\*'

<a name="6.5.16"></a>

# [6.5.16 new specialCharacters 'quotes'](2018-10-09)

You can used new specialCharacters 'quotes'

<a name="6.5.15"></a>

# [6.5.15 support for repeat mask](2018-10-08)

You can pass into mask pattern with brackets

<a name="6.4.14"></a>

# [6.4.14 fixed '\*' pattern in maskExpression](2018-10-05)

Fixed pattern '\*'

<a name="6.4.13"></a>

# [6.4.13 selection of input value and deletion of it is fixed](2018-10-05)

You can select and delete value.

<a name="6.4.12"></a>

# [6.4.12 pipe with mask expression and custom Pattern](2018-04-10)

You can pass array of expression and custom Pattern to pipe

<a name="6.3.11"></a>

# [6.3.11 fixed mask visable](2018-03-10)

Fixed when page is loaded the mask is visible

<a name="6.3.10"></a>

# [6.3.10 fixed writeValue](2018-03-10)

Fixed writeValue in directive

<a name="6.2.8"></a>

# [6.2.8 support for Mask Pipe/MaskService](2018-01-10)

Added ability to use MaskPipe/MaskService inside component

<a name="6.2.5"></a>

# [6.2.5 support for IE](2018-01-10)

Added poliffyls for IE

<a name="6.2.4"></a>

# [6.2.4 support for mask](2018-10-09)

Added support for using 'showMaskTyped' property to see mask while typing
Resolved issues

<a name="6.1.3"></a>

# [6.1.3 update demo, added support, resolved issues](2018-10-09)

Update of demo version
Added support to pass in value of type number or string
Resolved issues

<a name="6.1.1"></a>

# [6.1.1 support for prefix](2018-23-07)

Add support for prefix

<a name="2.9.5"></a>

# [2.9.5 support for optional character in input '?'](2018-18-06)

Add [ and ] as defoult symbols for mask

<a name="2.9.4"></a>

# [2.9.4 support for optional character in input '?'](2018-18-06)

Fix shift for cursor and updated all dependencies

<a name="2.9.3"></a>

# [2.9.3 support for optional character in input '?'](2018-29-05)

Add support for optional character in input '?'

<a name="2.8.3"></a>

# [2.8.3 support for multicharacter input '\*'](2018-29-05)

Add support for multicharacter input '\*'

<a name="2.7.3"></a>

# [2.7.3 proprioception-reinforcement](2018-08-05)

Updated all dependencies and remove usages of rxjs
