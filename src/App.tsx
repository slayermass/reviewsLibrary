import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { CheckRoute } from "components/Auth/CheckRoute";

import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";

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
      <CheckRoute />
    </Router>
  </>
);
