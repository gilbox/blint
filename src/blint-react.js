if ("production" !== process.env.NODE_ENV) { // don't compile in production

  const React = require('react');
  const MODULE = 0;
  const MODULE_MODIFIER = 1;
  const ELEMENT = 2;
  const ELEMENT_MODIFIER = 3;
  const createElement = React.createElement;

  // monkeypatch React
  React.createElement = function(el, opts) {
    if (opts && opts.className) {
      const elementType = (typeof el === 'string') ? el : (el.displayName || '<unknown>');
      lint(opts.className, elementType);
    }
    return createElement.apply(this, Array.prototype.slice.call(arguments));
  }

  /**
   * Try to detect and throw an arror if you break css-bliss rules.
   *
   * @returns {string}
   */
  function lint(className, elementType) {
    const classes = className.split(' ');
    const types = [0, 0, 0, 0];
    var moduleName;

    classes.forEach(c => {
      if (c.match(/^[A-Z]/)) {
        if (moduleName) {
          if (!c.startsWith(moduleName)) {
            const m = c.split('-')[0];
            throw new Error(`In ${elementType}[className="${className}"] there is more than one CSS Module: ${m} and ${moduleName}. ` +
            'A DOM element should not have more than one Module because this breaks encapsulation. ' +
            'Use a wrapping DOM element instead to compose CSS Modules.' +
            'https://github.com/gilbox/css-bliss#encapsulation');
          }
        } else {
          moduleName = c.split('-')[0];
        }

        const matches = c.match(/^([A-Z]\w*)(\-([a-z]\w*))?(\-\-([a-z]\w*))?$/);
        if (matches) {
          const type = matches[5] && matches[3] ? ELEMENT_MODIFIER
            : matches[5] ? MODULE_MODIFIER
            : matches[3] ? ELEMENT
            : MODULE;
          types[type]++;
        } else {
          throw new Error(`In ${elementType}[className="${className}"] the class ${c} starts with an uppercase letter, indicating ` +
          'that it belongs to a module. However, it does not conform to the css-bliss naming ' +
          'conventions for modules https://github.com/gilbox/css-bliss#naming');
        }
      }
    });

    if (types[MODULE] && types[ELEMENT]) {
      throw new Error(`In ${elementType}[className="${className}"] there is a CSS Module and ` +
      'an CSS Element. A DOM element ' +
      'may have one or the other but not both. ' +
      'https://github.com/gilbox/css-bliss/blob/master/common-mistakes.md#module-and-element-classes-applied-to-same-tag');
    }

    if (types[MODULE_MODIFIER] && types[ELEMENT]) {
      throw new Error(`In ${elementType}[className="${className}"] there is a CSS Module Modifier and an CSS Element. A DOM element ` +
      'may have one or the other but not both.');
    }

    if (types[ELEMENT_MODIFIER] && types[MODULE]) {
      throw new Error(`In ${elementType}[className="${className}"] there is a CSS Module and an CSS Element Modifier. A DOM element ` +
      'may have one or the other but not both.');
    }

    if (types[ELEMENT_MODIFIER] && types[MODULE_MODIFIER]) {
      throw new Error(`In ${elementType}[className="${className}"] there is a CSS Module Modifier ` +
      'and an CSS Element Modifier. A DOM element ' +
      'may have one or the other but not both.');
    }

    if (types[ELEMENT] > 1) {
      throw new Error(`In ${elementType}[className="${className}"] there are multiple CSS Elements. ` +
      'A DOM element may have at most one CSS Element.');
    }

    if (types[MODULE_MODIFIER] && !types[MODULE]) {
      throw new Error(`In ${elementType}[className="${className}"] there is a CSS Module Modifier, ` +
      'but no CSS Module specified. If you are passing a Module Modifier into ' +
      'another element that will always combine it with a CSS Module, use a prop named ' +
      'classModifier instead');
    }

    if (types[ELEMENT_MODIFIER] && !types[ELEMENT]) {
      throw new Error(`In ${elementType}[className="${className}"] there is a CSS Element Modifier, ` +
      'but no CSS Element specified. If you are passing an Element Modifier into ' +
      'another element that will always combine it with a CSS Element, use a prop named ' +
      'classModifier instead');
    }
  }

}
