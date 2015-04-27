const React = require('react');
const originalCreateElement = React.createElement;

const lint = require('../src/blint-react');

describe('blint-react', () => {
  beforeEach(() => {
    jasmine.addMatchers({
      toPassBlint() {
        return {
          compare: function(className){
            var pass = false;
            var stack = '';
            try {
              lint(className);
              pass = true
            } catch(e) { stack = e.stack }

            var result = { pass };
            if(pass) {
              result.message = `Expected className '${className}' to pass the blint linter. ${stack}`;
            } else {
              result.message = `Expected className '${className}' to pass the blint linter. ${stack}`;
            }
            return result;
          }
        }
      }
    })
  });

  it('should monkey-patch React.createElement', () => {
    expect(React.createElement).not.toBe(originalCreateElement);
  });

  it('should fail linter when there are classes from more than one Module', () => {
    expect('FooModule FooOtherModule').not.toPassBlint();
    expect('FooModule BamBam-foo').not.toPassBlint();
    expect('FooModule Grammy-doo-mooMoo').not.toPassBlint();
    expect('One-uno Two-dos').not.toPassBlint();
  });

  it('should fail linter when there are multiple elements', () => {
    expect('Foo-one Foo-two').not.toPassBlint();
  });

  it('should fail linter when there is a module and an element', () => {
    expect('Foo Foo-two').not.toPassBlint();
  });

  it('should fail linter when there is a module modifier and an element', () => {
    expect('Foo--bar Foo-two').not.toPassBlint();
  });

  it('should fail linter when there is an element modifier without an element', () => {
    expect('Foo-bar--baz').not.toPassBlint();
  });

  it('should fail linter when there is an element modifier and a module modifier', () => {
    expect('Foo--bar Foo-bar--baz').not.toPassBlint();
  });

  it('should fail linter when there is a module modifier but no module', () => {
    expect('Foo--bar').not.toPassBlint();
  });

  it('should fail linter when there is an element modifier but no element', () => {
    expect('Foo-bar--baz').not.toPassBlint();
  });

  it('should fail linter when class naming is incorrect', () => {
    expect('Foo-One').not.toPassBlint();
    expect('Foo-one--Two').not.toPassBlint();
    expect('Foo-one-two').not.toPassBlint();
    expect('FooBar-bar--Baz').not.toPassBlint();
    expect('FooBar--Baz').not.toPassBlint();
  });

  it('should not fail linter when class naming is correct', () => {
    expect('Z').toPassBlint();
    expect('Z-a Z-a--b').toPassBlint();
    expect('Z1-a2 Z1-a2--b3').toPassBlint();
  });

  it('should not fail linter with valid input', () => {
    expect('Foo-one').toPassBlint();
    expect('Foo-one Foo-one--twoThree').toPassBlint();
    expect('Foo Foo--modifierOk').toPassBlint();
  });
});