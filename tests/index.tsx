import * as React from 'react';
import * as ReactDom from 'react-dom';
import Foo from './foo.mdx';
console.log(Foo);
ReactDom.render(<Foo onClick={() => console.log(333)} />, document.body);
