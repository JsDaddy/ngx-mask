/**
 * Created by igornepipenko on 11/13/16.
 */
var Mask = function (el, mask, options) {

  var p = {
    invalid: [],
    getCaret: function () {
      try {
        var sel,
          pos = 0,
          ctrl = el.get(0),
          dSel = document.selection,
          cSelStart = ctrl.selectionStart;

        // IE Support
        if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
          sel = dSel.createRange();
          sel.moveStart('character', -p.val().length);
          pos = sel.text.length;
        }
        // Firefox support
        else if (cSelStart || cSelStart === '0') {
          pos = cSelStart;
        }

        return pos;
      } catch (e) {}
    },
    setCaret: function(pos) {
      try {
        if (el.is(':focus')) {
          var range, ctrl = el.get(0);

          // Firefox, WebKit, etc..
          if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
          } else { // IE
            range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
          }
        }
      } catch (e) {}
    },
    getRegexMask: function() {
      var maskChunks = [], translation, pattern, optional, recursive, oRecursive, r;

      for (var i = 0; i < mask.length; i++) {
        translation = jMask.translation[mask.charAt(i)];

        if (translation) {

          pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
          optional = translation.optional;
          recursive = translation.recursive;

          if (recursive) {
            maskChunks.push(mask.charAt(i));
            oRecursive = {digit: mask.charAt(i), pattern: pattern};
          } else {
            maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
          }

        } else {
          maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        }
      }

      r = maskChunks.join('');

      if (oRecursive) {
        r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
          .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
      }

      return new RegExp(r);
    },
    destroyEvents: function() {
      el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
    },
    getMCharsBeforeCount: function(index, onCleanVal) {
      for (var count = 0, i = 0, maskL = mask.length; i < maskL && i < index; i++) {
        if (!jMask.translation[mask.charAt(i)]) {
          index = onCleanVal ? index + 1 : index;
          count++;
        }
      }
      return count;
    },
    caretPos: function (originalCaretPos, oldLength, newLength, maskDif) {
      var translation = jMask.translation[mask.charAt(Math.min(originalCaretPos - 1, mask.length - 1))];

      return !translation ? p.caretPos(originalCaretPos + 1, oldLength, newLength, maskDif)
        : Math.min(originalCaretPos + newLength - oldLength - maskDif, newLength);
    },
    behaviour: function(e) {
      e = e || window.event;
      p.invalid = [];

      var keyCode = el.data('mask-keycode');

      if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
        var caretPos    = p.getCaret(),
          currVal     = p.val(),
          currValL    = currVal.length,
          newVal      = p.getMasked(),
          newValL     = newVal.length,
          maskDif     = p.getMCharsBeforeCount(newValL - 1) - p.getMCharsBeforeCount(currValL - 1),
          changeCaret = caretPos < currValL;

        p.val(newVal);

        if (changeCaret) {
          // Avoid adjusting caret on backspace or delete
          if (!(keyCode === 8 || keyCode === 46)) {
            caretPos = p.caretPos(caretPos, currValL, newValL, maskDif);
          }
          p.setCaret(caretPos);
        }

        return p.callbacks(e);
      }
    },
    getMasked: function(skipMaskChars, val) {
      var buf = [],
        value = val === undefined ? p.val() : val + '',
        m = 0, maskLen = mask.length,
        v = 0, valLen = value.length,
        offset = 1, addMethod = 'push',
        resetPos = -1,
        lastMaskChar,
        check;

      if (options.reverse) {
        addMethod = 'unshift';
        offset = -1;
        lastMaskChar = 0;
        m = maskLen - 1;
        v = valLen - 1;
        check = function () {
          return m > -1 && v > -1;
        };
      } else {
        lastMaskChar = maskLen - 1;
        check = function () {
          return m < maskLen && v < valLen;
        };
      }

      while (check()) {
        var maskDigit = mask.charAt(m),
          valDigit = value.charAt(v),
          translation = jMask.translation[maskDigit];

        if (translation) {
          if (valDigit.match(translation.pattern)) {
            buf[addMethod](valDigit);
            if (translation.recursive) {
              if (resetPos === -1) {
                resetPos = m;
              } else if (m === lastMaskChar) {
                m = resetPos - offset;
              }

              if (lastMaskChar === resetPos) {
                m -= offset;
              }
            }
            m += offset;
          } else if (translation.optional) {
            m += offset;
            v -= offset;
          } else if (translation.fallback) {
            buf[addMethod](translation.fallback);
            m += offset;
            v -= offset;
          } else {
            p.invalid.push({p: v, v: valDigit, e: translation.pattern});
          }
          v += offset;
        } else {
          if (!skipMaskChars) {
            buf[addMethod](maskDigit);
          }

          if (valDigit === maskDigit) {
            v += offset;
          }

          m += offset;
        }
      }

      var lastMaskCharDigit = mask.charAt(lastMaskChar);
      if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
        buf.push(lastMaskCharDigit);
      }

      return buf.join('');
    },
    callbacks: function (e) {
      var val = p.val(),
        changed = val !== oldValue,
        defaultArgs = [val, e, el, options],
        callback = function(name, criteria, args) {
          if (typeof options[name] === 'function' && criteria) {
            options[name].apply(this, args);
          }
        };

      callback('onChange', changed === true, defaultArgs);
      callback('onKeyPress', changed === true, defaultArgs);
      callback('onComplete', val.length === mask.length, defaultArgs);
      callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
    }
  };

  el = $(el);
  var jMask = this, oldValue = p.val(), regexMask;

  mask = typeof mask === 'function' ? mask(p.val(), undefined, el,  options) : mask;


  // public methods
  jMask.mask = mask;
  jMask.options = options;
  jMask.remove = function() {
    var caret = p.getCaret();
    p.destroyEvents();
    p.val(jMask.getCleanVal());
    p.setCaret(caret - p.getMCharsBeforeCount(caret));
    return el;
  };

  // get value without mask
  jMask.getCleanVal = function() {
    return p.getMasked(true);
  };

  // get masked value without the value being in the input or element
  jMask.getMaskedVal = function(val) {
    return p.getMasked(false, val);
  };

};
