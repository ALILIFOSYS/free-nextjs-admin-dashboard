'use client';

import { useState, useRef } from 'react';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Code, Undo2, Redo2, Heading1, Heading2, Heading3, Link as LinkIcon } from "lucide-react";
import axios from 'axios';
import { BaseUrl } from '@/constents/serverBaseUrl';
import Image from 'next/image';

// Define TypeScript interfaces
interface Instructor {
  id: number;
  instructor_name: string;
}
interface Category {
  id: number;
  title: string;
}
interface CourseFormData {
  media_id: number | null;
  courseTitle: string;
  categoryName: string;
  category_id: number | null
  instructors: number[];
  regularPrice: number;
  offerPrice: number;
  is_free: boolean;
  descriptionTitle: string;
  description: string;
  is_active : boolean
}

const CourseCreationForm = ({ categoryData, instructorData }: { categoryData: Category[], instructorData: Instructor[] }) => {

  const instructorOptions: Instructor[] = instructorData || []
  const categoryOptions: Category[] = categoryData || []
  // Initialize form state
  const [formData, setFormData] = useState<CourseFormData>({
    media_id: null,
    courseTitle: '',
    categoryName: '',
    category_id: null,
    instructors: [],
    regularPrice: 0,
    offerPrice: 0,
    is_free: false,
    descriptionTitle: '',
    description: '',
    is_active:false
  });

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isInstructorDropdownOpen, setIsInstructorDropdownOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string>('')
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name == 'categoryName') {
      setFormData(prev => ({
        ...prev,
        category_id: parseInt(value),
        categoryName: categoryOptions[parseInt(value)].title
      }))
      return
    }

    if (type === 'checkbox' && 'checked' in e.target) {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle instructor selection
  const toggleInstructor = (instructorId: number) => {
    setFormData(prev => {
      const isSelected = prev.instructors.includes(instructorId);

      if (isSelected) {
        return {
          ...prev,
          instructors: prev.instructors.filter(id => id !== instructorId)
        };
      } else {
        return {
          ...prev,
          instructors: [...prev.instructors, instructorId]
        };
      }
    });
  };

  // Select all instructors
  const selectAllInstructors = () => {
    setFormData(prev => ({
      ...prev,
      instructors: instructorOptions.map(instructor => instructor.id)
    }));
  };

  // Clear all instructors
  const clearAllInstructors = () => {
    setFormData(prev => ({
      ...prev,
      instructors: []
    }));
  };

  // Simulate file upload
  const handleFileUpload = async (file : File) => {
    setUploading(true);
    setUploadProgress(0);
    setSelectedFile(file);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // Create a temporary URL for the image
      const objectUrl = URL.createObjectURL(file);
      setThumbnail(objectUrl)
    } catch (error) {
      console.error('Upload error:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      handleFileUpload(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true)
    if (!selectedFile) {
      setUploading(false)
      alert('Please upload a thumbnail image');
      return;
    }

    if (!formData.courseTitle.trim()) {
      alert('Please enter a course title');
      return;
    }

    if (formData.instructors.length === 0) {
      alert('Please select at least one instructor');
      return;
    }

    try {
      // In a real application, you would submit to your API here
    

      const uploadToS3 = async () => {
        if (!selectedFile) return null;

        // setIsUploading(true);
        // setUploadProgress(0);
        try {
          const fileName = `courses/${selectedFile.name}`;
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
          // setIsUploading(false);
        }
      };
      const uploadResult = await uploadToS3();
      if (!uploadResult) {
        throw new Error('Image upload failed');
      }
      const { imageUrl, fileType } = uploadResult;
      const { data } = await axios.post(
        `${BaseUrl}/medias/create-media`,
        {
          src: imageUrl,
          path: "courses",
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
      
     formData.media_id=mediaId

      const res = await axios.post(`${BaseUrl}/courses/create-course`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      })
    console.log(res);
    
      setUploading(false)

      alert('Course created successfully!');

      // Reset form
      setFormData({
        media_id: null,
        courseTitle: '',
        categoryName: '',
        category_id: null,
        instructors: [],
        regularPrice: 0,
        offerPrice: 0,
        is_free: false,
        descriptionTitle: '',
        description: '',
        is_active :false
      });
      setThumbnail("")
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
editor?.commands.clearContent()
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to create course. Please try again.');
    }
  };

  // Get selected instructor names
  const selectedInstructorNames = formData.instructors.map(id => {
    const instructor = instructorOptions.find(inst => inst.id === id);
    return instructor ? instructor.instructor_name : '';
  });
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      // TextAlign.configure({
      //   types: ['heading', 'paragraph'],
      // }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData(prev => ({
        ...prev,
        description: html
      }));
      // if (onChange) onChange(html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const setLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };
  return (
    <div className="max-w mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thumbnail Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail Image *
          </label>
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="thumbnail-upload"
            />
            <label
              htmlFor="thumbnail-upload"
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Choose Image
            </label>

            {uploading && (
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {selectedFile && !uploading && (
              <div className="flex items-center space-x-2">
                <Image
                width={50}
                height={50}
                  src={thumbnail}
                  alt="Thumbnail preview"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <span className="text-sm text-green-600">✓ Uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="categoryName"
              value={formData.categoryName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categoryOptions.map(category => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              )
              )}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructors *
            </label>

            {/* Custom multi-select dropdown */}
            <div className="relative">
              <div
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between"
                onClick={() => setIsInstructorDropdownOpen(!isInstructorDropdownOpen)}
              >
                <div className="flex flex-wrap gap-1">
                  {formData.instructors.length === 0 ? (
                    <span className="text-gray-400">Select instructors</span>
                  ) : (
                    selectedInstructorNames.map((name, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                      >
                        {name}
                      </span>
                    ))
                  )}
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${isInstructorDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {isInstructorDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2 border-b border-gray-200 flex justify-between">
                    <button
                      type="button"
                      onClick={selectAllInstructors}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={clearAllInstructors}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear All
                    </button>
                  </div>

                  {instructorOptions.map(instructor => (
                    <div
                      key={instructor.id}
                      className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${formData.instructors.includes(instructor.id) ? 'bg-blue-50' : ''}`}
                      onClick={() => toggleInstructor(instructor.id)}
                    >
                      <div className={`w-5 h-5 flex items-center justify-center border rounded mr-2 ${formData.instructors.includes(instructor.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {formData.instructors.includes(instructor.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {/* <span className="mr-2 text-lg">{instructor.avatar}</span> */}
                      <span>{instructor.instructor_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Is Free?
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_free"
                checked={formData.is_free}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">This course is free</span>
            </label>
          </div>

          {!formData.is_free && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price
                </label>
                <input
                  type="number"
                  name="regularPrice"
                  value={formData.regularPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Price
                </label>
                <input
                  type="number"
                  name="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </>
          )}
        </div>

        {/* Description Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="descriptionTitle"
            value={formData.descriptionTitle}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='Description title'
          />
        </div>
        <label htmlFor="">Description</label>
        <div className="max-w-4xl mx-auto p-6 bg-white  shadow-md">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 border-b pb-2 mb-3">
            <button
              type="button"

              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"

              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"

              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <button
              type="button"

              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="w-4 h-4" />
            </button>

            <button
              type="button"

              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <button
              type="button"

              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <button
              type="button"

              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"

              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              type="button"

              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="w-4 h-4" />
            </button>

            <button
              type="button"


              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Code className="w-4 h-4" />
            </button>

            <button
              type="button"


              onClick={setLink}
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            <button
              type="button"


              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Editor content */}

          <div className="border-b border-gray-200">
            <EditorContent editor={editor} className="min-h-[300px] max-h-[500px] overflow-y-auto" />
          </div>
        </div>
        <div>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700"> Approve and Publish</span>
          </label>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseCreationForm;