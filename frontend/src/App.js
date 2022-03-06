import {BrowserRouter as Router,Route, Routes } from 'react-router-dom'
import Header from './component/layout/Header/Header'
import WebFont from 'webfontloader'
import './App.css';
import React, { useEffect } from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js'


function App() {

  React.useEffect(() => {
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"]
      }
    });
  },[]);
  
  return (
    <Router>
      <Header />
      <Routes>
        <Route extact path='/' element={<Home/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
