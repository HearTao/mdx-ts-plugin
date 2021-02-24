import * as React from "react";
import * as ReactDom from "react-dom";
import Foo from "./foo.mdx";

ReactDom.render(<Foo onClick={() => console.log(333)} />, document.body);