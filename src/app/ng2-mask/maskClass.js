var HTMLAttributes = function () {
    var input = $(this),
      options = {},
      prefix = 'data-mask-',
      mask = input.attr('data-mask');

    if (input.attr(prefix + 'reverse')) {
      options.reverse = true;
    }

    if (input.attr(prefix + 'clearifnotmatch')) {
      options.clearIfNotMatch = true;
    }

    if (input.attr(prefix + 'selectonfocus') === 'true') {
      options.selectOnFocus = true;
    }

    if (notSameMaskObject(input, mask, options)) {
      return input.data('mask', new Mask(this, mask, options));
    }
  },
  eventSupported = function (eventName) {
    var el = document.createElement('div'), isSupported;

    eventName = 'on' + eventName;
    isSupported = (eventName in el);

    if (!isSupported) {
      el.setAttribute(eventName, 'return;');
      isSupported = typeof el[eventName] === 'function';
    }
    el = null;

    return isSupported;
  };

$.fn.mask = function (mask, options) {
};

$.fn.masked = function (val) {
  return this.data('mask').getMaskedVal(val);
};

$.fn.unmask = function () {
  clearInterval($.maskWatchers[this.selector]);
  delete $.maskWatchers[this.selector];
  return this.each(function () {
    var dataMask = $(this).data('mask');
    if (dataMask) {
      dataMask.remove().removeData('mask');
    }
  });
};

$.fn.cleanVal = function () {
  return this.data('mask').getCleanVal();
};

$.applyDataMask = function (selector) {
  selector = selector || $.jMaskGlobals.maskElements;
  var $selector = (selector instanceof $) ? selector : $(selector);
  $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
};

