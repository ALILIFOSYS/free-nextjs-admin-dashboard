'use client'
import  { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BaseUrl } from "@/constents/serverBaseUrl";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Code, Undo2, Redo2, Heading1, Heading2, Heading3 } from "lucide-react";
import Image from "next/image";




export default function EditCourse({ categoryData, instructorData, courseData }) {
  const router = useRouter();



  // const [loading, setLoading] = useState(false);
  // const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: courseData[0].id,
    media_id: courseData[0].media_id,
    courseTitle: courseData[0].title,
    categoryName: courseData[0].category_title,
    category_id: courseData[0].category_id,
    instructors: courseData[0].instructor_ids,
    regularPrice: 0,
    offerPrice: courseData[0].price,
    is_free: courseData[0].is_free,
    descriptionTitle: courseData[0].description.body,
    description: courseData[0].description.heading,
    is_active: courseData[0].is_active
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnail, setThumbnail] = useState('')
  const [isInstructorDropdownOpen, setIsInstructorDropdownOpen] = useState(false);



  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleFileChange = (e) => {
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
      setUploading(true);
      setUploadProgress(0);
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };
  const handleFileUpload = async (file) => {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true)


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
      let mediaId
      if (selectedFile) {
        const uploadToS3 = async () => {
          if (!selectedFile) return null;

          // setIsUploading(true);
          // setUploadProgress(0);
          try {
            const fileName = `courses/${Date.now()}_${selectedFile.name}`;
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
        mediaId = data.media.id;
        formData.media_id = mediaId
      }


      const res = await axios.put(`${BaseUrl}/courses/update-course`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      })
console.log(res);

      setUploading(false)

      alert('Course updated successfully!');

       router.push('/courses')
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to create course. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push("/courses");
  };

  const toggleInstructor = (instructorId) => {
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

  const selectedInstructorNames = formData.instructors.map(id => {
    const instructor = instructorData.find(inst => inst.id === id);
    return instructor ? instructor.name : '';
  });
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
    content: formData.description,
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







  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="text-lg">Loading course details...</div>
  //     </div>
  //   );
  // }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Course not found</div>
      </div>
    );
  }
  return (
    <div className="max-w mx-auto ">
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-6 mb-6">
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
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.courseTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>


          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select a category</option>
              {categoryData.map(category => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div className="">
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
                        {name}                     </span>
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

                  {instructorData.map(instructor => (
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
                      <span>{instructor.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Regular Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.regularPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required={!formData.is_free}
              disabled={formData.is_free}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Offer Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.offerPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required={!formData.is_free}
              disabled={formData.is_free}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_free"
              name="is_free"
              checked={formData.is_free}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_free" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Free Course
            </label>
          </div>


          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Active & Publish
            </label>
          </div>
        </div>
        {/* Description Section */}
        <div className="my-4" >
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

            {/* <button
              type="button"


              onClick={setLink}
            >
              <LinkIcon className="w-4 h-4" />
            </button> */}

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
        <div className="flex justify-end space-x-4 my-5">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
          {/* <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Update'}
          </button> */}
        </div>
      </form>
    </div>
  );
}