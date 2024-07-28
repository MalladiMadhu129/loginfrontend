import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/employees/employees', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                setEmployees(res.data);
                setFilteredEmployees(res.data);
                setTotalCount(res.data.length);
            } catch (err) {
                console.error('Error fetching employees:', err);
            }
        };
        fetchEmployees();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        const filtered = employees.filter(employee =>
            employee.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            employee.email.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredEmployees(filtered);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/employees/${id}`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            const newFilteredEmployees = filteredEmployees.filter(employee => employee._id !== id);
            setFilteredEmployees(newFilteredEmployees);
            setTotalCount(newFilteredEmployees.length);
        } catch (err) {
            console.error('Error deleting employee:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-8xl">
                <h2 className="text-2xl font-bold mb-4">Employee List</h2>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <button className="bg-green-500 text-white p-2 rounded mb-4 md:mb-0" onClick={() => navigate('/dashboard/createemployee')}>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Create Employee
                    </button>
                    <div className="flex items-center">
                        <label className="mr-2">Search:</label>
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={handleSearch}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <span className="ml-4">Total Count: {totalCount}</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Unique Id</th>
                                <th className="px-4 py-2">Image</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Mobile No</th>
                                <th className="px-4 py-2">Designation</th>
                                <th className="px-4 py-2">Gender</th>
                                <th className="px-4 py-2">Course</th>
                                <th className="px-4 py-2">Create Date</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(employee => (
                                <tr key={employee._id}>
                                    <td className="border px-4 py-2">{employee._id}</td>
                                    <td className="border px-4 py-2">
                                        <img src={employee.imgUpload} alt={`${employee.name}`} className="w-20 h-20 object-cover" />
                                    </td>
                                    <td className="border px-4 py-2">{employee.name}</td>
                                    <td className="border px-4 py-2">
                                        <a href={`mailto:${employee.email}`} className="text-blue-500">{employee.email}</a>
                                    </td>
                                    <td className="border px-4 py-2">{employee.mobileNo}</td>
                                    <td className="border px-4 py-2">{employee.designation}</td>
                                    <td className="border px-4 py-2">{employee.gender}</td>
                                    <td className="border px-4 py-2">{employee.course.join(', ')}</td>
                                    <td className="border px-4 py-2">{new Date(employee.createDate).toLocaleDateString()}</td>
                                    <td className="border px-4 py-2 flex flex-col md:flex-col">
                                        <button className="bg-blue-500 text-white p-1 rounded m-1" onClick={() => navigate(`/dashboard/createemployee/${employee._id}`)}>Edit</button>
                                        <button className="bg-red-500 text-white p-1 rounded m-1" onClick={() => handleDelete(employee._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
