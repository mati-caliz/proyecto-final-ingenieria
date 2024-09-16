import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Components/login/Login';
import ArgumentAnalysis from './Components/resultsViewer/ArgumentAnalysis';
import Principal from './Components/main/Principal';

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
