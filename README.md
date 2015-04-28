# blint

Blint is a pair of linting tools for the [css-bliss](https://github.com/gilbox/css-bliss) style
guide: [blint-react](#blint-react) and [scss-lint-bliss](#scss-lint-bliss).
They can be used individually or together. They complement each other very well
since one enforces a number of rules that the other cannot, and vice-versa.
`blint-react` focuses on linting markup, while `scss-lint-bliss` focuses on the styles.
The goal is to guide the developer in building scalable CSS by enforcing
the rules of css-bliss. This README file documents both linting tools, although only `blint-react`
source code actually lives in this repo.

-------------------------------------------------------------------


## blint-react

`blint-react` works by monkey-patching `React#createElement` and linting the `className`
prop of every single component instantiated by the application, in real-time. If
a `className` fails the linter, an error is thrown which is intended to bring the application
to it's knees, forcing the developer to fix the mistake before doing anything else.

### installation

Install using npm:

    npm install blint-react

Once installed, pull in `blint-react` as early as possible via:

    require('blint-react');

That's all there is to is. Now sit back and worry less about reviewing bad css code.

### advantages

`blint-react` has a full suite of [unit tests](https://github.com/gilbox/blint/blob/master/spec/blint-react.spec.js).
In a properly configured build pipeline, `blint-react` will not compile into the minified bundle,
adding zero overhead in production.

### error messages

All linting error messages include a detailed explanation, an accurate
stack trace pointing you right to the problem area, and often
a link to css-bliss documentation about the rule. Sometimes you get a suggestion, for example an
error related to a Module Modifier looks like:

> In `div[className="Foo--bar"]` there is a CSS Module Modifier,
> but no CSS Module specified. If you are passing a Module Modifier into
> another element that will always combine it with a CSS Module, use a custom prop like
> classModifier instead

Note that this is an especially opinionated rule that assumes if you've created a
`Foo` component which renders `<div class="Foo">Hello World</div>` and would like to
subclass an instance of the component with a module modifier you would do so with
a custom prop (named `classModifer` for example), and not by passing the modifier into
the `className` prop.

In other words, instead of

    <Foo className="Foo--bar" />

We must do:

    <Foo classModifier="Foo--bar" />

Where Foo's render function looks like:

    render() {
      return (
        <div className={cx('Foo', this.props.classModifier)}>
          Hello World
        </div>
      )
    }

### rules

- Enforces the Module class naming scheme. Any class beginning with an uppercase
  letter is assumed to be following the css-bliss Module naming rules. This includes
  so-called Module *Element*, *Element Modifier*, and *Module Modifier* classes.

- Ensures that a DOM element has classes from as most one CSS Module.

- A DOM element may have an Element class or a Module class, but not both.

- A DOM element may have an Element class or a Module Modifier class, but not both.

- A DOM element may have an Element Modifier class or a Module class, but not both.

- If a DOM element has a Module Modifier class, it must have a Module class.

- If a DOM element has an Element Modifier class, it must have an Element class.

### options

There are currently no configurable options.

-------------------------------------------------------------------

## scss-lint-bliss

The [scss-lint-bliss](https://github.com/gilbox/scss-lint/tree/bliss) tool
is a [fork](https://github.com/gilbox/scss-lint/tree/bliss)
of the popular [scss-lint](https://github.com/brigade/scss-lint),
with the addition of rules specific to css-bliss modules. It is *not* the goal of this project
to maintain a fork. Instead, it will be converted to a plugin
[when scss-lint's plugin system is available](https://github.com/brigade/scss-lint/issues/440).

To install scss-lint-bliss simply install the gem:

    gem install scss-lint-bliss

Which will install the global binary `scss-lint`. Note that this is the same binary filename
used by the `scss-lint` gem. Then to lint some files do:

    scss-lint ./path/to/css/

### configuration

It might interest you to [read about scss-lint configuration](https://github.com/gilbox/scss-lint#configuration).
scss-lint-bliss adds the following options and defaults:

      Bliss::Module:
        enabled: true
        severity: error
        module_file_pattern: !ruby/regexp '/[\/\\]_?([A-Z][a-zA-Z0-9]+)\.scss/'
        allow_id_selector_in_module: false
        allow_attribute_selector_in_module: true
        allow_element_selector_in_module: true

        allow_module_margin: false
        allow_module_width: false

        allow_utility_classes_in_module: false
        ignored_utility_class_prefixes: ['is', 'ie']

        allow_utility_direct_styling: false

### `Bliss::Module:` linting behavior

 - only lints files matching the `module_file_pattern` regex pattern

 - does not allow any id selector in a Module unless `allow_id_selector_in_module` is `true`

 - does not allow any attribute selector in a Module unless `allow_attribute_selector_in_module` is `true`

 - does not allow any element selector in a Module unless `allow_element_selector_in_module` is `true`

 - does not allow a module to have a `margin` property unless the `allow_module_margin` option is `true` (todo: add support for `auto`)

 - does not allow a module to have a `width` property unless the `allow_module_width` option is `true`

 - Does not allow any utility class in a module unless it is included in the `ignored_utility_class_prefixes`
 list or the `allow_utility_classes_in_module` option is `true`

 - Does not allow a rule to end with a utility class as a descended selector
 (`.Foo .isOpen` is bad but `.Foo.isOpen` is good) unless `allow_utility_direct_styling` is `true`

### Reliability

scss-lint-bliss is [fully unit tested](https://github.com/gilbox/scss-lint/blob/bliss/spec/scss_lint/linter/bliss/module_spec.rb)
but could still be circumvented by the developer with ugly code.
