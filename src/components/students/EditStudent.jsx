// app/students/[id]/page.js

"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Hook to access dynamic route parameters
import { AWS_STUDENT_BASE_URL } from '@/constents/URLs'
import { uploadImage } from '@/constents/uploadImage'
import axios from 'axios';
import { BaseUrl } from '@/constents/serverBaseUrl';
import { encoder } from '@/constents/encoder'
import {FiUser, FiMail, FiPhone, FiLock,  FiShield, FiCalendar, FiInfo} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa'; // Using a specific icon for WhatsApp
import { useRouter } from 'next/navigation'

export default function EditStudent({ studentData }) {
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: studentData[0].name || '',
        email: studentData[0].email || '',
        phone: studentData[0].phone || '',
        isAdmin: studentData[0].is_admin || '',
        whatsapp: studentData[0].whatsapp || '',
        gender: studentData[0].gender || '',
        about: studentData[0].about || '',
        birthday: studentData[0].birthday || null
    });
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // For new image previews
    const [existingImageUrl, setExistingImageUrl] = useState(''); // For the current image

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch student data when the component mounts


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfilePictureFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Password validation only if a new password is entered
        if (passwordData.password && passwordData.password !== passwordData.confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        // Prepare data for submission (using FormData for file uploads)
        const dataToSubmit = new FormData();
        dataToSubmit.append('name', formData.name);
        dataToSubmit.append('email', formData.email);
        dataToSubmit.append('phone', formData.phone);
        dataToSubmit.append('is_admin', formData.isAdmin);
        dataToSubmit.append('whatsapp', formData.whatsapp)
        dataToSubmit.append('gender', formData.gender)
        dataToSubmit.append('about', formData.about)


        if (formData.birthday) {
            dataToSubmit.append('birthday', formData.birthday)
        }



        if (passwordData.password) {
            dataToSubmit.append('password', encoder(passwordData.password));
        }

        if (profilePictureFile) {
            const uploadResponse = await uploadImage(profilePictureFile, "Users")
            dataToSubmit.append('media_id', uploadResponse);
        }

        const { data } = await axios.put(`${BaseUrl}/students/update-student/${studentData[0].id}`, dataToSubmit, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
            }
        })

        router.push('/students')

        alert(`Student update form submitted! `);
    };

    useEffect(() => {
        if(!studentData) setLoading(true)
        if (studentData[0].media_id) {
            studentData[0].src = "Users/1758104205932_mee.jpg"
        }

        setExistingImageUrl(studentData[0].media_id ? studentData[0].src : "");
    }, []);
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-white">Loading student data...</p>
            </div>
        );
    }

    return (
        <div className=" bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full  bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                    Edit Student Profile
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center space-y-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Profile Picture
                        </label>
                        <div className="relative w-32 h-32">
                            {studentData[0].media_id &&
                                <img
                                    src={`${AWS_STUDENT_BASE_URL}${existingImageUrl}`}
                                    alt="Profile Preview"
                                    className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                                />
                            }
                            {imagePreviewUrl &&
                                <img
                                    src={imagePreviewUrl}
                                    alt="Profile Preview"
                                    className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                                />}
                            <label htmlFor="profilePicture" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs font-bold rounded-full opacity-10 hover:opacity-100 transition-opacity cursor-pointer">
                                Change
                            </label>
                            <input
                                id="profilePicture"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="name" type="text" required className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="email" type="email" required className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="phone" type="tel" required className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                        </div>
                        {/* WhatsApp Number */}
                        <div className="relative"><FaWhatsapp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="WhatsApp Number" /></div>

                        {/* Date of Birth */}
                        <div className="relative"><FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input name="birthday" type="date" value={formData.dob} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Date of Birth" /></div>

                        {/* Gender */}
                        <div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none">
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* About Me (Text Area) */}
                        <div className="relative md:col-span-2"><FiInfo className="absolute left-3 top-3 text-gray-400" />
                            <textarea name="about" rows="4" value={formData.about} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="About Me..."></textarea>
                        </div>
                        {/* Admin Privileges */}
                        <div className="flex items-center justify-start bg-gray-50 dark:bg-gray-700 border rounded-lg border-gray-300 dark:border-gray-600 p-2">
                            <label htmlFor="isAdmin" className="flex items-center cursor-pointer">
                                <FiShield className="mr-3 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Admin Privileges</span>
                                <input id="isAdmin" name="isAdmin" type="checkbox" className="ml-4 h-4 w-4 text-blue-600" checked={formData.isAdmin} onChange={handleChange} />
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="password" type="password" className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="New Password" value={passwordData.password} onChange={handlePasswordChange} />
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="confirmPassword" type="password" className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <div className='flex justify-center mt-10'>
                        <button type="submit" className="w-50 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-300">
                            Update Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}