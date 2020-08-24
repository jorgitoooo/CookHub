import React, { useState, useEffect } from "react";
import "./App.css";
import Routes from "./Routes";
import Navbar from "./components/Navbar";

import firebase from "./firebase";

function App(props) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false); // Calling userHasAuthenticated sets isAuthenticated to true/false
  const [uid, setUid] = useState("none");

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      // see if we're already logged in
      let q = await firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setUid(user.uid);
          userHasAuthenticated(true);
        }
      });
    } catch (e) {
      // something bad happened
    }
    setIsAuthenticating(false);
  }

  function handleLogout() {
    firebase.auth().signOut();
    userHasAuthenticated(false);
  }

  return (
    !isAuthenticating && (
      <div>
        <Navbar
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        ></Navbar>
        <Routes appProps={{ isAuthenticated, userHasAuthenticated, setUid }} />
      </div>
    )
  );
}

export default App;
