// app/students/create/page.js

"use client";

import { BaseUrl } from '@/constents/serverBaseUrl';
import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiImage, FiShield,FiInfo } from 'react-icons/fi';
import { uploadImage } from '@/constents/uploadImage'
import { encoder } from '@/constents/encoder'
import axios from 'axios';
import { useRouter } from 'next/navigation'

export default function CreateInstructor() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        title: '',
        about: '',
        confirmPassword: '',
        is_featured: false,
    });

    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setProfilePicture(null);
            setPreviewUrl('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match.');
                setToast({ visible: true, message: 'Passwords do not match.', type: 'error' });
                setIsSubmitting(false);
                return;
            }
            setError('');

            // Prepare data for submission (e.g., using FormData for file upload)
            const dataToSubmit = new FormData();
            dataToSubmit.append('name', formData.name);
            dataToSubmit.append('email', formData.email);
            dataToSubmit.append('phone', formData.phone);
            dataToSubmit.append('password', encoder(formData.password));
            dataToSubmit.append('is_featured', formData.is_featured);
            dataToSubmit.append('about', formData.about);
            dataToSubmit.append('title', formData.title);


           

            if (profilePicture) {
                const uploadResponse = await uploadImage(profilePicture, "Users")

                dataToSubmit.append('media_id', uploadResponse);
            }
console.log(dataToSubmit,"/////");

            const { data } = await axios.post(`${BaseUrl}/instructors/create-instructor`, dataToSubmit, {
                // Let the browser set Content-Type for FormData (multipart/form-data)
                headers: {
                    'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
                }
            })
            if (data.status) {
                router.push('/instructors')
            } else {
                setToast({ visible: true, message: data.message || 'Failed to create instructor', type: 'error' });
            }

            // alert('Student creation form submitted! Check the console for the data.');
        } catch (error) {
            console.log(error);
            const msg = error?.response?.data?.message || error.message || 'Something went wrong';
            setToast({ visible: true, message: msg, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-hide toast after 4 seconds
    useEffect(() => {
        let timer;
        if (toast.visible) {
            timer = setTimeout(() => setToast({ ...toast, visible: false }), 4000);
        }
        return () => clearTimeout(timer);
    }, [toast]);

    return (
        <div className=" bg-gray-100 dark:bg-gray-900 flex items-center justify-center ">
            {/* Toast */}
            {toast.visible && (
                <div className={`fixed top-6 right-6 z-50 max-w-sm w-full ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white rounded shadow-lg p-3`}> 
                    <div className="flex items-start gap-2">
                        <div className="flex-1 text-sm">{toast.message}</div>
                        <button onClick={() => setToast({ ...toast, visible: false })} className="ml-2 text-white/80 hover:text-white">✕</button>
                    </div>
                </div>
            )}

            <div className="w-full bg-white dark:bg-gray-800 p-8 rounded space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                    Create New Instructor
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center space-y-4">
                        <label htmlFor="profilePicture" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Profile Picture
                        </label>
                        <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <FiImage className="w-12 h-12 text-gray-400" />
                            )}
                            <input
                                id="profilePicture"
                                name="profilePicture"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="phone"
                                type="tel"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Instructor title */}
                        <div className="relative"><input name="title" type="text" value={formData.title} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Instructor Title" /></div>

               
                        <div className="relative md:col-span-2"><FiInfo className="absolute left-3 top-3 text-gray-400" />
                            <textarea name="about" rows="4" value={formData.about} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="About Me..."></textarea>
                        </div>
                        {/* Admin Privileges */}
                        <div className="flex items-center justify-start bg-gray-50 dark:bg-gray-700 border rounded-lg border-gray-300 dark:border-gray-600 p-2">
                            <label htmlFor="isAdmin" className="flex items-center cursor-pointer">
                                <FiShield className="mr-3 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Feature on Homepage</span>
                                <input
                                    id="isAdmin"
                                    name="is_featured"
                                    type="checkbox"
                                    className="ml-4 h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />  
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    {/* Create Button */}
                    <div className='flex justify-center '>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-50 flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-300`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                'Create Instructor'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}