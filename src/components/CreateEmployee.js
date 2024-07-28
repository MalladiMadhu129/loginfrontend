import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateEmployee = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        designation: 'HR',
        gender: '',
        course: [],
        imgUpload: null,
    });
    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [filePreview, setFilePreview] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL parameters

    useEffect(() => {
        if (id) {
            // Fetch employee data if ID is provided (edit mode)
            const fetchEmployee = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/employees/${id}`, {
                        headers: {
                            'x-auth-token': localStorage.getItem('token')
                        }
                    });
                    setFormData(res.data);
                    setFilePreview(res.data.imgUpload);
                    setIsEditMode(true);
                } catch (err) {
                    console.error('Error fetching employee:', err);
                }
            };
            fetchEmployee();
        }
    }, [id]);

    const { name, email, mobileNo, designation, gender, course, imgUpload } = formData;

    const onChange = (e) => {
        if (e.target.name === 'course') {
            const value = e.target.value;
            const checked = e.target.checked;
            let updatedCourses = [...formData.course];
            
            if (checked) {
                updatedCourses.push(value);
            } else {
                updatedCourses = updatedCourses.filter(course => course !== value);
            }
            
            setFormData({ ...formData, course: updatedCourses });
        } else if (e.target.name === 'imgUpload') {
            setFormData({ ...formData, imgUpload: e.target.files[0] });
            setFilePreview(URL.createObjectURL(e.target.files[0]));
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        
        if (!name) newErrors.name = 'Name is required';
        if (!email) newErrors.email = 'Email is required';
        if (!validateEmail(email)) newErrors.email = 'Email is invalid';
        if (!mobileNo) newErrors.mobileNo = 'Mobile number is required';
        if (isNaN(mobileNo)) newErrors.mobileNo = 'Mobile number must be numeric';
        if (!gender) newErrors.gender = 'Gender is required';
        if (!imgUpload && !isEditMode) newErrors.imgUpload = 'Image upload is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const data = new FormData();
            data.append('name', name);
            data.append('email', email);
            data.append('mobileNo', mobileNo);
            data.append('designation', designation);
            data.append('gender', gender);
            data.append('course', course);
            if (imgUpload) data.append('imgUpload', imgUpload);

            try {
                if (isEditMode) {
                    await axios.put(`http://localhost:5000/api/employees/${id}`, data, {
                        headers: {
                            'x-auth-token': localStorage.getItem('token'),
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    alert('Employee updated successfully');
                } else {
                    await axios.post('http://localhost:5000/api/employees', data, {
                        headers: {
                            'x-auth-token': localStorage.getItem('token'),
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    alert('Employee created successfully');
                }
                navigate('/dashboard/employees');
            } catch (err) {
                console.error('Error saving employee:', err);
            }
        }
    };


    const onCancel = () => {
        navigate('/dashboard/employees');
    };
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Employee' : 'Create Employee'}</h2>
                <form onSubmit={onSubmit} encType="multipart/form-data" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            className={`p-2 border border-gray-300 rounded w-full ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className={`p-2 border border-gray-300 rounded w-full ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Mobile No:</label>
                        <input
                            type="text"
                            name="mobileNo"
                            value={mobileNo}
                            onChange={onChange}
                            className={`p-2 border border-gray-300 rounded w-full ${errors.mobileNo ? 'border-red-500' : ''}`}
                        />
                        {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Designation:</label>
                        <select
                            name="designation"
                            value={designation}
                            onChange={onChange}
                            className="p-2 border border-gray-300 rounded w-full"
                        >
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="Developer">sales</option>
                           
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Gender:</label>
                        <div>
                            <label className="mr-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={gender === 'Male'}
                                    onChange={onChange}
                                    className="mr-1"
                                />
                                Male
                            </label>
                            <label className="mr-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={gender === 'Female'}
                                    onChange={onChange}
                                    className="mr-1"
                                />
                                Female
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Other"
                                    checked={gender === 'Other'}
                                    onChange={onChange}
                                    className="mr-1"
                                />
                                Other
                            </label>
                        </div>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Courses:</label>
                        <div>
                            <label className="mr-2">
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="MCA"
                                    checked={course.includes('MCA')}
                                    onChange={onChange}
                                    className="mr-1"
                                />
                               
                                MCA
                            </label>
                            <label className="mr-2">
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="BCA"
                                    checked={course.includes('BCA')}
                                    onChange={onChange}
                                    className="mr-1"
                                />
                                BCA
                            </label>
                            <label className="mr-2">
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="BSC"
                                    checked={course.includes('BSC')}
                                    onChange={onChange}
                                    className="mr-1"
                                />
                               BSC
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Image Upload:</label>
                        <input
                            type="file"
                            name="imgUpload"
                            onChange={onChange}
                            className={`p-2 border border-gray-300 rounded w-full ${errors.imgUpload ? 'border-red-500' : ''}`}
                        />
                        {filePreview && <img src={filePreview} alt="Preview" className="w-20 h-20 mt-2" />}
                        {errors.imgUpload && <p className="text-red-500 text-sm">{errors.imgUpload}</p>}
                    </div>
                    <div className="md:col-span-2 flex justify-between">
                    <button
                            type="button"
                            onClick={onCancel}
                            className="bg-red-500 text-white p-2 rounded"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded ">
                            {isEditMode ? 'Update Employee' : 'Create Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEmployee;
