//var tokenizer = require('gonzales-pe/lib/scss/tokenizer');
var gonzales = require('gonzales-pe');

window.gonzales = gonzales;
//var foo = 'hello';
//var fs = require('fs');
//var path = require('path');

//var content = fs.readFileSync(path.resolve('./test.scss')).toString();
//console.log(content);

var content = `
.Foo {
  &-title--foo.isVisible:hover {
    color: green;
    height: 50px;
  }

  .Bar &-copy {
    border: 10px;
  }

  .thing {
    width: 100px;

    a {
      &:after {
        color: red;
      }
    }
  }
}
`;

window.content = content;

window.result = gonzales.cssToAST({
  css: content,
  needInfo: true,
  syntax: 'scss'
});

console.log(gonzales.astToTree(result).replace(/'\n+/g, "'\\n"));


function traverse(root, options) {
  const preCb = options.preCb || (() => 0);
  const postCb = options.postCb || (() => 0);

  (function visit(node, parent, acc) {
    if (! (node instanceof Array)) return;

    const len = node.length;
    let i = 1;

    while (i < len) {

      const child = node[i];
      preCb(child, node);
      visit(child, node, acc);
      postCb(child, node);
      i++;

    }
  })(root, null, {});
}

function lint(ast, options) {
  const depthAcc = { blockCount: 0 };

  traverse(ast, {
    preCb(node, parent) {
      classCheck(node, options);
      depthCheckPre(depthAcc, node, options);
    },
    postCb(node, parent) {
      depthCheckPost(depthAcc, node);
    }
  });
}

function depthCheckPre(acc, node, options) {
  if (node[1] === 'block') {
    acc.blockCount++;
    if (acc.blockCount > options.maxDepth) {
      fail('Depth Check', node, `Exceeded max nesting depth of ${options.maxDepth}`);
    }
  }
}

function depthCheckPost(acc, node) {
  if (node[1] === 'block') acc.blockCount--;
}

function classCheck(node, options) {
  //const nodeInfo = node[0];
  const ident = node[2];

  if (node[1] === 'class') {
    const className = ident[2];

    if (!(className.startsWith(options.moduleName) || className.startsWith('is'))) {
      fail('Class Check', node, `All classes in module ${options.moduleName} must start with \`.is\` or  \`.${options.moduleName}\``);
    }
  }
}

const lines = content.split("\n");

function fail(testName, node, description) {
  const lineNumber = node[0].ln;

  console.log('----','FAIL:', testName, `@ ${lineNumber}`, `(${description})`, '----');
  console.log(
    lines
      .slice(lineNumber-2, lineNumber+1)
      .map((line, i) => {
        let ln = (lineNumber - 1 + i) + '';
        ln = '     '.slice(ln.length) + ln;
        return `${ln}:  ${line}`;
      })
      .join("\n")
  );
}

console.log('traverse');

window.traverse = traverse;

lint(result, {
  moduleName: 'Foo',
  maxDepth: 3
});

//console.log(tokenizer(css));