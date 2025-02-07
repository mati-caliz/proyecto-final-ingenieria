import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Components/login/Login';
import ArgumentAnalysis from './Components/resultsViewer/ArgumentAnalysis';
import Principal from './Components/main/Principal';
import { useAppSelector } from './redux/redux/hooks';
import PrivateRoute from './Components/main/PrivateRoute';

function App() {
  const navigate = useNavigate();
  const token = useAppSelector((state) => {
    console.log('User State:', state.user);
    return state.user.accessToken;
  });

  useEffect(() => {
    const currentPath = window.location.pathname;
    console.log('Token:', token, 'Path:', currentPath);

    if (token && currentPath === '/') {
      navigate('/principal');
    }
  }, [token, navigate]);

  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/principal" element={<Principal />} />
          <Route path="/argument-analysis" element={<ArgumentAnalysis />} />
        </Route>
      </Routes>
  );
}

export default function AppWrapper() {
  return (
      <Router>
        <App />
      </Router>
  );
}
