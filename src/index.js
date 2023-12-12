import 'bootstrap/dist/css/bootstrap.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './components/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import ApiService from './API/service'
import { fetchTestData } from './API/service';
import { render } from '@testing-library/react';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
// these are just for checking if I can hit the endpoints
 /* var res = await ApiService.fetchPlayerData('TyreekHill');
console.log(res);
var res2 = await ApiService.fetchTeamSchedule('ARI','2022');
console.log(res2);
var res3 = await ApiService.fetchPlayerByID('3116406');
console.log(res3); */

/* var res3 = await ApiService.fetchLiveScoreboard();
console.log(res3); */



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
