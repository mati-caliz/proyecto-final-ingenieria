import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login';
import Argumentos from "./Components/ChequeoArgumentos/Argumentos";
import Principal from "./Components/Principal/Principal";
import Navbar from './Components/NavBar/Navbar';
import React from 'react';

function App() {
  return (
    <div>
      <header className="header">
        <Navbar />
        <h1>Argucheck</h1>
      </header>
      <Principal />
    </div>
  );
}

export default App;
