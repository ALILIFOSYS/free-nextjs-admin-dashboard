'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { BaseUrl } from '@/constents/serverBaseUrl';
import { useRouter } from 'next/navigation';
type Category = {
  id: number;
  title: string;
  is_featured: number;
  media_src: string | null;
  media_id: number | null;
};
interface CategoryTableProps {
  category: Category;
  CloseModal: () => void;
}
export default function EditCategory({ category, CloseModal }: CategoryTableProps) {
  const [categoryTitle, setCategoryTitle] = useState(category.title);
  const [is_featured, setis_featured] = useState(category.is_featured == 1 ? true : false);
  const [previewImage, setPreviewImage] = useState<string | null>(category.media_src);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

   const router = useRouter()
  // Check if form has been modified
  useEffect(() => {
    const modified =
      categoryTitle !== category.title ||
      is_featured !== (category.is_featured == 1 ? true : false) ||
      (selectedFile !== null) ||
      (previewImage !== category.media_src && previewImage !== null);
    setIsModified(modified);
  }, [categoryTitle, is_featured, selectedFile, previewImage, category]);

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadToS3 = async () => {
    if (!selectedFile) return category.media_src;

    setIsUploading(true);

    try {
      const fileName = `categories/${Date.now()}_${selectedFile.name}`;
      const fileType = selectedFile.type
      const response = await axios.post('/api/upload', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          fileName,
          fileType: selectedFile.type,
        },
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

      return { imageUrl: fileName, fileType }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let media_src = category.media_src;

      if (selectedFile) {

        const uploadResult = await uploadToS3();
        if (uploadResult && typeof uploadResult === 'object' && 'imageUrl' in uploadResult && 'fileType' in uploadResult) {
          const { imageUrl, fileType } = uploadResult;
          const { data } = await axios.put(
            `${BaseUrl}/medias/update-media`,
            {
              src: imageUrl,
              id: category.media_id,
              type: fileType
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
              }
            }
          );
          console.log(data);
          
        }

      } else if (previewImage === null) {
        media_src = null; // Image was removed
      }

      // Now submit your form data with the updated values
      const formData = {
        id: category.id,
        title: categoryTitle,
        is_featured,
        media_src,
      };

      const updateCategory = await axios.put(`${BaseUrl}/courses/update-category`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      });
      console.log(updateCategory);
      
      CloseModal();
      alert('Category updated successfully!');
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category');
    }
  };

  const handleCancel = () => {
    CloseModal()
    // Reset form to original values
    setCategoryTitle(category.title);
    setis_featured(category.is_featured == 1 ? true : false);
    setPreviewImage(category.media_src);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    
  };

  return (
    <div className="max-w mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

      <form onSubmit={handleSubmit}>
        {/* Title and Image in a single row */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="categoryTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Category Title
            </label>
            <input
              type="text"
              id="categoryTitle"
              value={categoryTitle}
              onChange={(e) => setCategoryTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail
            </label>
            <div className="flex items-start gap-2">
              <button
                type="button"
                onClick={triggerFileInput}
                className="py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                {previewImage ? 'Change' : 'Choose File'}
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
                <div className="relative group">
                  <div className="relative w-30 h-30 rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="featureOnHomepage"
            checked={is_featured}
            onChange={(e) => setis_featured(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isUploading}
          />
          <label htmlFor="featureOnHomepage" className="ml-2 block text-sm text-gray-700">
            Feature on Homepage
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-100"
            // disabled={!isModified || isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            disabled={!isModified || isUploading || !categoryTitle}
          >
            {isUploading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}