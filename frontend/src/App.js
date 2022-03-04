import {BrowserRouter as Router } from 'react-router-dom';
import Header from './component/layout/Header/Header';
import ReactNavbar from 'overlay-navbar/dist/lib/ReactNavbar';
import './App.css';

function App() {
  return (
    <Router>
      <Header/>
    </Router>
  );
}

export default App;
