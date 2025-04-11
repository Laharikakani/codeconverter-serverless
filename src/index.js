import React from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from 'aws-amplify';
import awsConfig from "./aws-exports";
import App from "./App";
import "./styles/App.css";

// Configure Amplify with only the necessary parts
Amplify.configure({
  Auth: awsConfig.Auth,
  API: awsConfig.API
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
