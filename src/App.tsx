import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";

import { createGlobalStyle } from "styled-components";

import { CheckRoute } from "components/Auth/CheckRoute";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #fafafa;
    margin: 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

export const App = (): React.ReactElement => (
  <>
    <GlobalStyle />
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
