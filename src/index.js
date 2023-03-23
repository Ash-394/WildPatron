import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { AuthProvider } from "@arcana/auth";
import { ProvideAuth } from "@arcana/auth-react";

const provider = new AuthProvider(process.env.REACT_APP_ARCANA_APP_ID);

ReactDOM.render(
  <React.StrictMode>
     <ProvideAuth provider={provider}>
    <App />
    </ProvideAuth>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
