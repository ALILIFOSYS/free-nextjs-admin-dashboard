'use client'
import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { BaseUrl } from '@/constents/serverBaseUrl';
import Image from 'next/image';
import { AWS_STUDENT_BASE_URL } from '@/constents/URLs'
import { uploadImage } from '@/constents/uploadImage';
const ShowCertificate = ({ courses }) => {

    const router = useRouter()
    const [selectedCourse, setSelectedCourse] = useState('')
    const [certificates, setCertificates] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isDeleting, setIsDeleting] = useState(false);
    const handleCreate = () => {
        router.push('/certificates/create')
    }



    const [formData, setFormData] = useState({
        certificate_title: '',
        certificate_short_text: '',
        certificate_text: '',
        author_name: '',
        author_designation: '',
        frame_id: '',
        site_logo_id: '',
        author_signature_id: ''
    })

    const [images, setImages] = useState({
        site_logo: null,
        author_signature: null,
        template_image: null
    })

    const [previewUrls, setPreviewUrls] = useState({
        site_logo: '',
        author_signature: '',
        template_image: ''
    })
    const handleFileUpload = useCallback(async (type, file) => {
        try {
            const uploadResponse = await uploadImage(file, "frame");

            // Update form data with the new media ID
            if (type === 'template_image') {
                setFormData(prev => ({
                    ...prev,
                    frame_id: uploadResponse,
                }));
            } else if (type === 'site_logo') {
                setFormData(prev => ({
                    ...prev,
                    site_logo_id: uploadResponse,
                }));
            } else if (type === 'author_signature') {
                setFormData(prev => ({
                    ...prev,
                    author_signature_id: uploadResponse,
                }));
            }

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrls(prev => ({
                    ...prev,
                    [type]: e.target?.result,
                }));
            };
            reader.readAsDataURL(file);

            // Update files state
            setImages(prev => ({
                ...prev,
                [type]: file,
            }));

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        }
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleImageChange = (e, imageType) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            handleFileUpload(imageType, file);
        }
    };

    const removeImage = (imageType) => {
        setImages(prev => ({
            ...prev,
            [imageType]: null
        }))
        setPreviewUrls(prev => ({
            ...prev,
            [imageType]: ''
        }))
    }
    const handleDelete = async (certificateId) => {
        if (!window.confirm('Are you sure you want to delete this certificate?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await axios.delete(
                `${BaseUrl}/certificates/delete-certificate/${certificateId}`,
                {
                    data: { course_id: selectedCourse },
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
                    }
                }
            );

            if (response.data.status) {
                // Remove the deleted certificate from state
                setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
                alert('Certificate deleted successfully');
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting certificate:', error);
            alert('Failed to delete certificate. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare the data to send
            const updateData = {
                ...formData,
                // Only include media IDs if they exist
                frame_id: formData.frame_id || null,
                site_logo_id: formData.site_logo_id || null,
                author_signature_id: formData.author_signature_id || null
            };

            const { data } = await axios.put(
                `${BaseUrl}/certificates/update-certificates/${certificates[0].id}`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
                    }
                }
            );

            if (data.status) {
                alert('Certificate updated successfully!');
                // Optionally refresh the certificates data
                handleCourseChange({ target: { value: selectedCourse } });
            } else {
                setError(data.message || 'Failed to update certificate');
            }
        } catch (error) {
            console.error('Error updating certificate:', error);
            setError('Failed to update certificate. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleCourseChange = async (e) => {
        const index = e.target.value
        if (!index) {
            setSelectedCourse('')
            setCertificates([])
            return
        }

        const { id, title } = courses[index]
        const Details = {
            id, title
        }

        setLoading(true)
        try {
            const { data } = await axios.post(`${BaseUrl}/certificates/get-certificates`, Details, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
                }
            })
            if (data.data && data.data.length > 0) {
                const certificate = data.data
                setFormData({
                    certificate_title: certificate[0].certificate_title || '',
                    certificate_short_text: certificate[0].certificate_short_text || '',
                    certificate_text: certificate[0].certificate_text || '',
                    author_name: certificate[0].author_name || '',
                    author_designation: certificate[0].author_designation || '',
                    frame_id: certificate[0].frame_id || '',
                    site_logo_id: certificate[0].site_logo_id || '',
                    author_signature_id: certificate[0].author_signature_id || ''
                })

                // Set preview URLs for existing images
                setPreviewUrls({
                    site_logo: certificate[0].site_logo_path ? `${AWS_STUDENT_BASE_URL}${certificate[0].site_logo_path}` : '',
                    author_signature: certificate[0].author_signature_path ? `${AWS_STUDENT_BASE_URL}${certificate[0].author_signature_path}` : '',
                    template_image: certificate[0].template_image_path ? `${AWS_STUDENT_BASE_URL}${certificate[0].template_image_path}` : ''
                })
            }
            setSelectedCourse(id)
            setCertificates(data.data || [])
        } catch (error) {
            console.error("Error fetching certificates:", error)
            setCertificates([])
        } finally {
            setLoading(false)
        }
    }

  

    return (
        <div className="max-w-7xl mx-auto  sm:p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Certificate Management
                </h1>
                <button
                    className='px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200 font-medium dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white'
                    onClick={handleCreate}
                >
                    Create Certificate +
                </button>
            </div>

            {/* Course Selection Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Course
                </label>
                <select
                    id="course-select"
                    onChange={handleCourseChange}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                    disabled={loading}
                >
                    <option value="">Select a course</option>
                    {courses.length > 0 && courses.map((value, index) => (
                        <option value={index} key={index}>{value.title}</option>
                    ))}
                </select>
                {loading && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Loading certificates...</p>
                )}
            </div>


            {selectedCourse && certificates.length > 0 && <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Edit Certificate
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Update certificate details and images
                            </p>
                        </div>
                        <button
                            onClick={() => handleDelete(certificates[0].id)}
                            disabled={isDeleting}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 transition-colors"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Certificate'}
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                        <div className="p-6 space-y-8">
                            {/* Basic Information */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="certificate_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Certificate Title *
                                        </label>
                                        <input
                                            type="text"
                                            id="certificate_title"
                                            name="certificate_title"
                                            value={formData.certificate_title}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter certificate title"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Certificate Text */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Certificate Content
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="certificate_short_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Short Text *
                                        </label>
                                        <input
                                            type="text"
                                            id="certificate_short_text"
                                            name="certificate_short_text"
                                            value={formData.certificate_short_text}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter short description"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="certificate_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Certificate Text *
                                        </label>
                                        <textarea
                                            id="certificate_text"
                                            name="certificate_text"
                                            value={formData.certificate_text}
                                            onChange={handleInputChange}
                                            required
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter full certificate text"
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            You can use HTML tags for formatting. Use {'{course_name}'} for dynamic course name.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Author Information */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Author Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Author Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="author_name"
                                            name="author_name"
                                            value={formData.author_name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter author name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="author_designation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Author Designation *
                                        </label>
                                        <input
                                            type="text"
                                            id="author_designation"
                                            name="author_designation"
                                            value={formData.author_designation}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter author designation"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Images Section */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Images
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {/* Site Logo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Site Logo
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                            {previewUrls.site_logo ? (
                                                <div className="relative">
                                                    <Image
                                                        src={previewUrls.site_logo}
                                                        alt="Site Logo Preview"
                                                        width={120}
                                                        height={120}
                                                        className="mx-auto rounded-lg object-contain"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage('site_logo')}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div className="mt-2">
                                                        <label htmlFor="site_logo" className="cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                            <span>Upload Logo</span>
                                                            <input
                                                                id="site_logo"
                                                                name="site_logo"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, 'site_logo')}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Author Signature */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Author Signature
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                            {previewUrls.author_signature ? (
                                                <div className="relative">
                                                    <Image
                                                        src={previewUrls.author_signature}
                                                        alt="Author Signature Preview"
                                                        width={120}
                                                        height={120}
                                                        className="mx-auto rounded-lg object-contain"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage('author_signature')}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div className="mt-2">
                                                        <label htmlFor="author_signature" className="cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                            <span>Upload Signature</span>
                                                            <input
                                                                id="author_signature"
                                                                name="author_signature"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, 'author_signature')}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Template Image */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Template Image
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                            {previewUrls.template_image ? (
                                                <div className="relative">
                                                    <Image
                                                        src={previewUrls.template_image}
                                                        alt="Template Image Preview"
                                                        width={120}
                                                        height={120}
                                                        className="mx-auto rounded-lg object-contain"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage('template_image')}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div className="mt-2">
                                                        <label htmlFor="template_image" className="cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                            <span>Upload Template</span>
                                                            <input
                                                                id="template_image"
                                                                name="template_image"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, 'template_image')}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Updating...' : 'Update Certificate'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            }

            {/* Empty State */}
            {!selectedCourse && !loading && certificates.length == 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-8 text-center mx-4 sm:mx-auto max-w-lg">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                        <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Course Selected
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
                        Please select a course to view the certificate details.
                    </p>
                </div>
            )}
        </div>
    )
}

export default ShowCertificate