import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/login/Login';
import ArgumentAnalysis from './Components/resultsViewer/ArgumentAnalysis';
import Principal from './Components/main/Principal';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/principal" element={<Principal />} />
                <Route path="/argument-analysis" element={<ArgumentAnalysis />} />
            </Routes>
        </Router>
    );
}

export default App;
