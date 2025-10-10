'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Image, FileText, Settings, Download, X, ChevronDown, Check } from 'lucide-react';
import { uploadImage } from '@/constents/uploadImage'
import { BaseUrl } from '@/constents/serverBaseUrl';
import axios from 'axios';
export default function CertificateConfigurator({ courses = [] }) {
    const [certificateData, setCertificateData] = useState({
        courseIds: [], // Changed to array for multi-select
        purposeTitle: '',
        shortText: '',
        fullText: '',
        authorName: '',
        authorDesignation: '',
        status: 'draft', // Added status field,
        authorSignature: null,
        siteLogo: null,
        template: null
    });

    const [files, setFiles] = useState({
        template: null,
        siteLogo: null,
        authorSignature: null,
    });

    const [previews, setPreviews] = useState({
        template: '',
        siteLogo: '',
        authorSignature: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

    const fileInputRefs = {
        template: useRef(null),
        siteLogo: useRef(null),
        authorSignature: useRef(null),
    };

    const handleInputChange = (field, value) => {
        setCertificateData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle multi-select course selection
    const handleCourseSelect = (courseId) => {
        setCertificateData(prev => {
            const currentCourseIds = prev.courseIds || [];
            const isSelected = currentCourseIds.includes(courseId);

            if (isSelected) {
                // Remove course if already selected
                return {
                    ...prev,
                    courseIds: currentCourseIds.filter(id => id !== courseId)
                };
            } else {
                // Add course if not selected
                return {
                    ...prev,
                    courseIds: [...currentCourseIds, courseId]
                };
            }
        });
    };

    // Select all courses
    const handleSelectAll = () => {
        const allCourseIds = courses.map(course => course.id);
        setCertificateData(prev => ({
            ...prev,
            courseIds: allCourseIds
        }));
    };

    // Clear all selected courses
    const handleClearAll = () => {
        setCertificateData(prev => ({
            ...prev,
            courseIds: []
        }));
    };

    const handleFileUpload = useCallback(async (type, file) => {
        console.log(type, "type", file, "value");

        const uploadResponse = await uploadImage(file, "frame")
        console.log(uploadResponse, "upload response");
        setCertificateData(prev => ({
            ...prev,
            [type]: uploadResponse,
        }));
        // return uploadResponse
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviews(prev => ({
                ...prev,
                [type]: e.target?.result,
            }));
        };
        reader.readAsDataURL(file);
        setFiles(prev => ({
            ...prev,
            [type]: file,
        }));
    }, []);

    const handleFileChange = (type, event) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            handleFileUpload(type, file);
        }
    };

    const handleDrop = (type, event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            handleFileUpload(type, file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const triggerFileInput = (type) => {
        fileInputRefs[type].current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation
        if (!certificateData.courseIds.length) {
            alert('Please select at least one course');
            setIsSubmitting(false);
            return;
        }
        if (!certificateData.purposeTitle) {
            alert('Please enter a purpose title');
            setIsSubmitting(false);
            return;
        }
        if (!files.template) {
            alert('Please upload a certificate template');
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare form data for file upload
            const formData = new FormData();
            console.log(certificateData, "certificate data");

         

            // Append files
            // if (files.template) formData.append('template', files.template);
            // if (files.siteLogo) formData.append('siteLogo', files.siteLogo);
            // if (files.authorSignature) formData.append('authorSignature', files.authorSignature);

            // Send to backend
            const response = await axios.post(`${BaseUrl}/certificates/create-certificate`,certificateData , {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'

                }
            });
            console.log(response,"response");
            

            if (!response.data.status) {
                throw new Error('Failed to save certificate');
            }


            alert('Certificate configuration saved successfully!');

            // Reset form
            setCertificateData({
                courseIds: [],
                purposeTitle: '',
                shortText: '',
                fullText: '',
                authorName: '',
                authorDesignation: '',
                issuedDate: new Date().toISOString().split('T')[0],
                status: 'draft',
            });
            setFiles({
                template: null,
                siteLogo: null,
                authorSignature: null,
            });
            setPreviews({
                template: '',
                siteLogo: '',
                authorSignature: '',
            });

        } catch (error) {
            console.error('Error saving certificate:', error);
            // alert('Error saving certificate configuration. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearFile = (type) => {
        setFiles(prev => ({ ...prev, [type]: null }));
        setPreviews(prev => ({ ...prev, [type]: '' }));
        if (fileInputRefs[type].current) {
            fileInputRefs[type].current.value = '';
        }
    };

    const getSelectedCourseNames = () => {
        return certificateData.courseIds.map(courseId => {
            const course = courses.find(c => c.id === courseId);
            return course?.title;
        }).filter(Boolean);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Certificate Configuration
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Configure and customize certificates for multiple courses
                    </p>
                </div>

                {/* Configuration Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Template Upload Section */}
                        <Section title="Certificate Template" icon={<FileText className="w-5 h-5" />}>
                            <FileUploadArea
                                type="template"
                                preview={previews.template}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => triggerFileInput('template')}
                                onClear={() => clearFile('template')}
                                accept="image/*"
                                ref={fileInputRefs.template}
                                onChange={(e) => handleFileChange('template', e)}
                                hasFile={!!files.template}
                            />
                        </Section>

                        {/* Certificate Information */}
                        <Section title="Certificate Information" icon={<Settings className="w-5 h-5" />}>
                            <div className="space-y-4">
                                {/* Multi-select Course Dropdown */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Courses <span className="text-red-500 dark:text-red-400">*</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                            (Select multiple courses)
                                        </span>
                                    </label>



                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 flex items-center justify-between"
                                        >
                                            <span className="truncate">
                                                {certificateData.courseIds.length > 0
                                                    ? `${certificateData.courseIds.length} course(s) selected`
                                                    : 'Select courses'
                                                }
                                            </span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isCourseDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isCourseDropdownOpen && (
                                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                                                    <div className="flex justify-between items-center">
                                                        <button
                                                            type="button"
                                                            onClick={handleSelectAll}
                                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                        >
                                                            Select All
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleClearAll}
                                                            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                                        >
                                                            Clear All
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-2 space-y-1">
                                                    {courses.map(course => (
                                                        <label
                                                            key={course.id}
                                                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={certificateData.courseIds.includes(course.id)}
                                                                onChange={() => handleCourseSelect(course.id)}
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                                                                {course.title}
                                                            </span>
                                                            {certificateData.courseIds.includes(course.id) && (
                                                                <Check className="w-4 h-4 text-green-500" />
                                                            )}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected courses chips */}
                                    {certificateData.courseIds.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {getSelectedCourseNames().map((courseName, index) => (
                                                <div
                                                    key={certificateData.courseIds[index]}
                                                    className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs"
                                                >
                                                    <span>{courseName}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCourseSelect(certificateData.courseIds[index])}
                                                        className="hover:text-blue-600 dark:hover:text-blue-200"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <FormField
                                    label="Purpose Title"
                                    value={certificateData.purposeTitle}
                                    onChange={(value) => handleInputChange('purposeTitle', value)}
                                    placeholder="e.g., Certificate of Completion"
                                    required
                                />

                                <FormField
                                    label="Short Text"
                                    value={certificateData.shortText}
                                    onChange={(value) => handleInputChange('shortText', value)}
                                    placeholder="Brief description or subtitle"
                                    type="textarea"
                                    rows={2}
                                />

                                <FormField
                                    label="Full Text"
                                    value={certificateData.fullText}
                                    onChange={(value) => handleInputChange('fullText', value)}
                                    placeholder="Detailed certificate text describing the achievement..."
                                    type="textarea"
                                    rows={4}
                                    required
                                />

                               
                            </div>
                        </Section>

                        {/* Logo and Signature Section */}
                        <Section title="Logo & Signature" icon={<Image className="w-5 h-5" />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FileUploadArea
                                    type="siteLogo"
                                    preview={previews.siteLogo}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => triggerFileInput('siteLogo')}
                                    onClear={() => clearFile('siteLogo')}
                                    accept="image/*"
                                    ref={fileInputRefs.siteLogo}
                                    onChange={(e) => handleFileChange('siteLogo', e)}
                                    compact
                                    hasFile={!!files.siteLogo}
                                />

                                <FileUploadArea
                                    type="authorSignature"
                                    preview={previews.authorSignature}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => triggerFileInput('authorSignature')}
                                    onClear={() => clearFile('authorSignature')}
                                    accept="image/*"
                                    ref={fileInputRefs.authorSignature}
                                    onChange={(e) => handleFileChange('authorSignature', e)}
                                    compact
                                    hasFile={!!files.authorSignature}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <FormField
                                    label="Author Name"
                                    value={certificateData.authorName}
                                    onChange={(value) => handleInputChange('authorName', value)}
                                    placeholder="Author full name"
                                    required
                                />

                                <FormField
                                    label="Author Designation"
                                    value={certificateData.authorDesignation}
                                    onChange={(value) => handleInputChange('authorDesignation', value)}
                                    placeholder="e.g., Course Instructor, Program Director"
                                    required
                                />
                            </div>
                        </Section>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    <span>Save Certificate Configuration</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Supporting Components (same as before)
function Section({ title, icon, children }) {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50 transition-colors duration-300">
            <div className="flex items-center space-x-2 mb-4">
                {icon}
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            {children}
        </div>
    );
}

const FileUploadArea = ({
    type,
    preview,
    onDrop,
    onDragOver,
    onClick,
    onChange,
    onClear,
    accept,
    compact = false,
    hasFile = false,
    ref
}) => {
    const getUploadText = () => {
        switch (type) {
            case 'template': return 'Certificate Template';
            case 'siteLogo': return 'Site Logo';
            case 'authorSignature': return 'Author Signature';
            default: return 'File';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'template': return <FileText className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400 dark:text-gray-500`} />;
            case 'siteLogo': return <Image className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400 dark:text-gray-500`} />;
            case 'authorSignature': return <Upload className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400 dark:text-gray-500`} />;
            default: return <Upload className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400 dark:text-gray-500`} />;
        }
    };
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <div className="group">
            <div
                className={`border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
          ${compact ? 'p-3' : 'p-6'} 
          ${hasFile
                        ? 'border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-100 dark:bg-gray-600/30 hover:bg-gray-200 dark:hover:bg-gray-600/50'
                    }
          hover:shadow-md`}
                onDrop={onDrop}
                onDragOver={handleDragOver}
                onClick={onClick}
            >
                <input
                    type="file"
                    ref={ref}
                    onChange={onChange}
                    accept={accept}
                    className="hidden"
                />

                {preview ? (
                    <div className="text-center">
                        <div className="relative inline-block group">
                            <img
                                src={preview}
                                alt={getUploadText()}
                                className={`max-w-full rounded-lg border border-gray-200 dark:border-gray-600 ${compact ? 'max-h-24' : 'max-h-36'
                                    } transition-transform duration-200 group-hover:scale-105`}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
                                <Upload className="w-5 h-5 text-white" />
                                <span className="text-white text-sm">Change</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Click to change {getUploadText()}
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        {getIcon()}
                        <p className={`mt-2 font-medium ${compact ? 'text-sm' : ''} text-gray-700 dark:text-gray-300`}>
                            {getUploadText()}
                        </p>
                        <p className={`text-sm mt-1 text-gray-500 dark:text-gray-400 ${compact ? 'text-xs' : ''}`}>
                            Drag & drop or click to upload
                        </p>
                        <p className={`text-xs mt-1 text-gray-400 dark:text-gray-500`}>
                            PNG, JPG, JPEG (Max 5MB)
                        </p>
                    </div>
                )}
            </div>

            {hasFile && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear();
                    }}
                    className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                >
                    Remove file
                </button>
            )}
        </div>
    );
};

function FormField({
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
    options,
    rows = 3,
    required = false,
}) {
    const baseClasses = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200";

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
            </label>

            {type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows}
                    placeholder={placeholder}
                    className={baseClasses}
                    required={required}
                />
            ) : type === 'select' ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseClasses}
                    required={required}
                >
                    <option value="">Select {label}</option>
                    {options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={baseClasses}
                    required={required}
                />
            )}
        </div>
    );
}

// Default courses data
CertificateConfigurator.defaultProps = {
    courses: [
        { id: '1', name: 'Web Development Bootcamp', duration: '12 weeks', level: 'Beginner' },
        { id: '2', name: 'Data Science Fundamentals', duration: '8 weeks', level: 'Intermediate' },
        { id: '3', name: 'Machine Learning Advanced', duration: '16 weeks', level: 'Advanced' },
        { id: '4', name: 'UX/UI Design Masterclass', duration: '10 weeks', level: 'Intermediate' },
    ]
};