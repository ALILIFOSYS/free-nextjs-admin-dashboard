'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { BaseUrl } from '@/constents/serverBaseUrl';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateCategory({ CloseModal }: { CloseModal: () => void }) {
    const [categoryTitle, setCategoryTitle] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(0);

    const router = useRouter();
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadToS3 = async () => {
        if (!selectedFile) return null;

        setIsUploading(true);
        setUploadProgress(0);
        try {
            const fileName = `categories/${Date.now()}_${selectedFile.name}`;
            const fileType = selectedFile.type
            const data = {
                fileName,
                fileType
            }
            const response = await axios.post('/api/upload', {
                headers: {
                    'Content-Type': 'application/json',
                },
                data,
            });

            const { signedUrl } = await response.data;

            const uploadResponse = await axios.put(signedUrl, selectedFile, {
                headers: {
                    'Content-Type': selectedFile.type,
                },
            });

            if (!uploadResponse) {
                throw new Error('Upload failed');
            }

            return { imageUrl: fileName, fileType };
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const uploadResult = await uploadToS3();
            if (!uploadResult) {
                alert('No image selected or upload failed.');
                return;
            }
            const { imageUrl, fileType } = uploadResult;

            // Submit your form data


            const { data } = await axios.post(
                `${BaseUrl}/medias/create-media`,
                {
                    src: imageUrl,
                    path: "categories",
                    type: fileType
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
                    }
                }
            );
            const mediaId = data.media.id;
            const CategoryData = {
                title: categoryTitle,
                isFeatured: isFeatured,
                imageUrl: imageUrl,
                media_id: mediaId,
            }
            const createCategory = await axios.post(`${BaseUrl}/courses/create-category`, CategoryData, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
                }
            });
            if (createCategory) {

                setIsFeatured(false);
                setCategoryTitle('');
                setPreviewImage(null);
                router.refresh()
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error creating category');
        }
    };

    return (
        <>

            <div className=" mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">New Category</h1>

                <form onSubmit={handleSubmit}>
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Title
                            </label>
                            <input
                                type="text"
                                value={categoryTitle}
                                onChange={(e) => setCategoryTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter category title..."
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thumbnail
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isUploading}
                                >
                                    Choose File
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png"
                                    disabled={isUploading}
                                />
                                {previewImage && (
                                    <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200">
                                        <Image
                                            src={previewImage}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {isUploading && (
                        <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
                        </div>
                    )}
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={isUploading}
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Feature on Homepage
                        </label>
                    </div>

                    <button
                        type="submit"
                        className=" bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                        disabled={isUploading || !selectedFile || !categoryTitle}
                    >
                        {isUploading ? 'Uploading...' : 'Create'}
                    </button>
                    <button type="button" onClick={CloseModal} className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        Close
                    </button>
                </form>
            </div>

        </>
    );
}