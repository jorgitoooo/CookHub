import React from "react";
import { Route } from "react-router-dom";

// From https://serverless-stack.com/chapters/add-the-session-to-the-state.html
export default function InfoRoute({ component: C, appProps, ...rest }) {
  return <Route {...rest} render={props => <C {...props} {...appProps} />} />;
}
