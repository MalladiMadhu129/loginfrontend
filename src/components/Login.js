import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background.JPG'

const Login = ({ setAuth }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onChangeUserName = e => setUserName(e.target.value);
    const onChangePassword = e => setPassword(e.target.value);

    const onSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { userName, password });
            localStorage.setItem('token', res.data.token);
            setAuth(true);
            navigate('/dashboard');
        } catch (err) {
            alert('Invalid login details');
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="bg-cover bg-center flex items-center justify-center min-h-screen bg-gray-100 " style={{ backgroundImage: `url(${backgroundImage})`}}>
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={onChangeUserName}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={onChangePassword}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        onClick={onSubmit}
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Login
                    </button>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <button
                        onClick={goToRegister}
                        className="text-blue-500 hover:underline"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
