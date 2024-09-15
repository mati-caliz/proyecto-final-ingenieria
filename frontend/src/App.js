import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Components/Login/Login';
import ArgumentAnalysis from './Components/SecondPage/ArgumentAnalysis';
import Principal from './Components/Principal/Principal';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Login</Link>
                        </li>
                        <li>
                            <Link to="/principal">Principal</Link>
                        </li>
                        <li>
                            <Link to="/argument-analysis">Argumentos</Link>
                        </li>
                    </ul>
                </nav>

                {/* Definición de las rutas */}
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/principal" element={<Principal />} />
                    <Route path="/argument-analysis" element={<ArgumentAnalysis />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
