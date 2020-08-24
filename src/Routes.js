import React from "react";
import { Route, Switch } from "react-router-dom";

// Components used
import InfoRoute from "./components/InfoRoute";

// Containers that the route links to
import NotFound from "./containers/404";
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import Home from "./containers/Home";
import RecipePage from "./containers/RecipePage";
import CreateRecipePage from "./containers/CreateRecipePage";
import UserProfile from "./containers/UserProfile";
import SearchResults from "./containers/SearchResults";

export default function Routes({ appProps }) {
  return (
    <Switch>
      <InfoRoute path="/" exact component={Home} appProps={appProps} />
      <InfoRoute path="/Login" exact component={Login} appProps={appProps} />
      <InfoRoute path="/SignUp" exact component={SignUp} appProps={appProps} />
      <InfoRoute
        path="/recipe/:id"
        exact
        component={RecipePage}
        appProps={appProps}
      />
      <InfoRoute
        path="/create-recipe/:id"
        exact
        component={CreateRecipePage}
        appProps={appProps}
      />
      <InfoRoute
        path="/user/:id"
        exact
        component={UserProfile}
        appProps={appProps}
      />
      <InfoRoute
        path="/search/:id"
        exact
        component={SearchResults}
        appProps={appProps}
      />
      <Route component={NotFound} />
    </Switch>
  );
}
