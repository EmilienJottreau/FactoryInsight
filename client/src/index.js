import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './Components/App';
import reportWebVitals from './reportWebVitals';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { TestRoute } from './test';
import "bootstrap/dist/css/bootstrap.min.css";
import './css/style.css';
import { Helmet } from 'react-helmet';
// import "placeholder-loading/dist/css/placeholder-loading.min.css"



library.add(fas)



const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(

  <React.StrictMode>
    
    <App />
    {/* <TestRoute /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
