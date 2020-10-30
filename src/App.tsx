import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Normalize } from "styled-normalize";

import { LoginPage } from "containers/Auth/Login";

import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = (): React.ReactElement => (
  <>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      transition={Zoom}
      draggable={false}
    />
    <Router>
      <Normalize />
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
      </Switch>
    </Router>
  </>
);
