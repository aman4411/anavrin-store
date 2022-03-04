import {BrowserRouter as Router } from 'react-router-dom'
import Header from './component/layout/Header/Header'
import ReactNavbar from 'overlay-navbar/dist/lib/ReactNavbar';
import WebFont from 'webfontloader'
import './App.css';
import React, { useEffect } from 'react';
import Footer from './component/layout/Footer/Footer';


function App() {

  React.useEffect(() => {
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"]
      }
    });
  });
  return (
    <Router>
      <Header/>
      <Footer/>
    </Router>
  );
}

export default App;
