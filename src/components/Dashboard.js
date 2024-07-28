import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Route, Routes, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import EmployeeList from './EmployeeList';
import CreateEmployee from './CreateEmployee';
import backgroundImage from '../assets/background.JPG'
const Dashboard = ({ setAuth }) => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setUserName(res.data.userName);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user details:', err);
                navigate('/login');
            }
        };
        fetchUserName();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        setAuth(false);
        navigate('/login');
    };

    const goToHome = () => navigate('/dashboard');
    const goToEmployeeList = () => navigate('/dashboard/employees');

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundImage: `url(${backgroundImage})`}}>
            <div className="flex justify-between items-center p-4 shadow-md bg-white">
                <img src="https://www.dealsdray.com/wp-content/uploads/2023/11/logo_B2R.png" alt="Logo" className="w-12 h-12" />
                <div className="hidden md:flex items-center space-x-4">
                    <button className="mr-4" onClick={goToHome}>Home</button>
                    <button className="mr-4" onClick={goToEmployeeList}>Employee List</button>
                </div>
                <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 border border-gray-300 p-2 rounded-md">

                    <FontAwesomeIcon icon={faUser} />
                    <span className="hidden md:inline">{userName}</span>
                    </div>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
            <div className="md:hidden flex justify-between items-center p-4 shadow-md bg-white">
                <div className="flex items-center space-x-4">
                    <button className="mr-4" onClick={goToHome}>Home</button>
                    <button className="mr-4" onClick={goToEmployeeList}>Employee List</button>
                </div>
            </div>
            <div className="flex-grow p-4">
                <Routes>
                    <Route path="/" element={<h1 className="text-xl font-bold">Welcome to Admin Panel</h1>} />
                    <Route path="employees" element={<EmployeeList />} />
                    <Route path="createemployee" element={<CreateEmployee />} />
                    <Route path="createemployee/:id" element={<CreateEmployee />} />
                </Routes>
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
