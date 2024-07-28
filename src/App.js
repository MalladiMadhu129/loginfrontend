import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Login from './components/Login'; // Assuming you have a Login component
import Register from './components/Register'
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await axios.get('http://localhost:5000/api/auth/me', {
                        headers: {
                            'x-auth-token': token
                        }
                    });
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error('Error verifying token:', err);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>

                <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard setAuth={setIsAuthenticated} /> : <Navigate to="/login" />} />
                <Route path="/*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
