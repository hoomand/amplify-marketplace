import React from "react";
import ReactDOM from "react-dom";
import AppWithAuth from "./AppWithAuth";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import * as serviceWorker from "./serviceWorker";

// Bring in default Element React theme
import "element-theme-default";

Amplify.configure(aws_exports);

ReactDOM.render(<AppWithAuth />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
