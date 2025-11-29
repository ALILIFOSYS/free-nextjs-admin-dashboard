'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { BaseUrl } from '@/constents/serverBaseUrl'
import { API_KEY } from '@/constents/apiKey';
import Image from 'next/image'

const EditCertificate = () => {
    const router = useRouter()
    const params = useParams()
    const certificateId = params.id

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

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState('')

    // Fetch certificate data
    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                setFetching(true)
                const { data } = await axios.get(`${BaseUrl}/certificates/${certificateId}`, {
                    headers: {
                        'x-api-key': API_KEY
                    }
                })
                
                if (data.data) {
                    const certificate = data.data
                    setFormData({
                        certificate_title: certificate.certificate_title || '',
                        certificate_short_text: certificate.certificate_short_text || '',
                        certificate_text: certificate.certificate_text || '',
                        author_name: certificate.author_name || '',
                        author_designation: certificate.author_designation || '',
                        frame_id: certificate.frame_id || '',
                        site_logo_id: certificate.site_logo_id || '',
                        author_signature_id: certificate.author_signature_id || ''
                    })

                    // Set preview URLs for existing images
                    setPreviewUrls({
                        site_logo: certificate.site_logo_path ? `${AWS_STUDENT_BASE_URL}${certificate.site_logo_path}` : '',
                        author_signature: certificate.author_signature_path ? `${AWS_STUDENT_BASE_URL}${certificate.author_signature_path}` : '',
                        template_image: certificate.template_image_path ? `${AWS_STUDENT_BASE_URL}${certificate.template_image_path}` : ''
                    })
                }
            } catch (error) {
                console.error('Error fetching certificate:', error)
                setError('Failed to load certificate data')
            } finally {
                setFetching(false)
            }
        }

        if (certificateId) {
            fetchCertificate()
        }
    }, [certificateId])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e, imageType) => {
        const file = e.target.files[0]
        if (file) {
            setImages(prev => ({
                ...prev,
                [imageType]: file
            }))

            // Create preview URL
            const previewUrl = URL.createObjectURL(file)
            setPreviewUrls(prev => ({
                ...prev,
                [imageType]: previewUrl
            }))
        }
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const submitData = new FormData()
            
            // Append form data
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key])
            })

            // Append images if they exist
            if (images.site_logo) submitData.append('site_logo', images.site_logo)
            if (images.author_signature) submitData.append('author_signature', images.author_signature)
            if (images.template_image) submitData.append('template_image', images.template_image)

            const { data } = await axios.post(
                `${BaseUrl}/certificates/update/${certificateId}`,
                submitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-api-key': API_KEY
                    }
                }
            )

            if (data.success) {
                router.push('/certificates')
            } else {
                setError(data.message || 'Failed to update certificate')
            }
        } catch (error) {
            console.error('Error updating certificate:', error)
            setError('Failed to update certificate. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        router.push('/certificates')
    }

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading certificate data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Certificate
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Update certificate details and images
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}

                {/* Form */}
                sdfs
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                    <div className="p-6 space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                <div>
                                    <label htmlFor="frame_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Frame ID
                                    </label>
                                    <input
                                        type="number"
                                        id="frame_id"
                                        name="frame_id"
                                        value={formData.frame_id}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter frame ID"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Certificate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditCertificate       