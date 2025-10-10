'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseUrl } from '@/constents/serverBaseUrl';
import axios from 'axios';
import { AWS_STUDENT_BASE_URL } from '@/constents/URLs';
// UPDATED: Changed imports to use a CDN to resolve module loading errors
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { uploadImage } from '@/constents/uploadImage';

const CourseDetails = ({ courseData, onChapterDelete, onChapterEdit, onContentDelete, onContentEdit }) => {
  const [expandedChapters, setExpandedChapters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [contentFilter, setContentFilter] = useState('all');
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [editChapterForm, setEditChapterForm] = useState({});
  const [editContentForm, setEditContentForm] = useState({});
  console.log(courseData, "courseData");

  const router = useRouter();
  const EditorToolbar = ({ editor }) => {
    if (!editor) {
      return null;
    }

    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-t-lg p-2 flex flex-wrap items-center gap-2 bg-gray-50 dark:bg-gray-800">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-blue-500 text-white p-2 rounded' : 'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700'}>Bold</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-blue-500 text-white p-2 rounded' : 'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700'}>Italic</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-blue-500 text-white p-2 rounded' : 'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700'}>Underline</button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-blue-500 text-white p-2 rounded' : 'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700'}>Strike</button>
      </div>
    );
  };
  if (!courseData || !courseData.course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600 dark:text-red-400 text-center">No course data available</div>
      </div>
    );
  }
  console.log(editContentForm, "editContentForm");

  const { course, analytics } = courseData;
  const { Chapters } = course;

  // Toggle chapter expansion
  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  // Create new chapter
  const handleCreateChapter = () => {
    router.push(`/chapters/create/${course.id}`);
  };

  // Filter chapters based on search and content type
  const filteredChapters = Chapters.filter(chapter => {
    const matchesSearch = chapter.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.Contents.some(content =>
        content.contentTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesContentFilter = contentFilter === 'all' ||
      chapter.Contents.some(content => content.contentType === contentFilter);

    return matchesSearch && matchesContentFilter;
  });

  // Delete Chapter Handler
  const handleDeleteChapter = async (chapter_id, chapterTitle) => {
    if (window.confirm(`Delete chapter "${chapterTitle}"?`)) {
      try {
        const deleteChapter = await axios.delete(`${BaseUrl}/chapters/delete-chapter/${chapter_id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
          }
        });
        console.log(deleteChapter, "deleteChapter");
        if (deleteChapter.data.status) {
          // Success handling
        }
        if (onChapterDelete) {
          await onChapterDelete(chapter_id);
        }
      } catch (error) {
        console.error('Error deleting chapter:', error);
        alert('Failed to delete chapter.');
      }
    }
  };

  // Edit Chapter Handlers
  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter.id);
    setEditChapterForm({
      chapterTitle: chapter.chapterTitle,
      serialNumber: chapter.serialNumber
    });
  };

  const handleSaveChapterEdit = async (chapterId) => {
    try {
      console.log(chapterId, "fdsdfghjkkhf");

      const data = await axios.put(`${BaseUrl}/chapters/update-chapter/${chapterId}`, editChapterForm, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      })
      console.log(data, "gfdsdhj");

      setEditingChapter(null);
      setEditChapterForm({});
      router.push(`/chapters/${course.id}`)
    } catch (error) {
      console.error('Error updating chapter:', error);
      alert('Failed to update chapter.');
    }
  };

  const handleCancelChapterEdit = () => {
    setEditingChapter(null);
    setEditChapterForm({});
  };

  // Delete Content Handler
  const handleDeleteContent = async (content_id, contentTitle) => {
    if (window.confirm(`Delete content "${contentTitle}"?`)) {
      try {
        const deleteContent = await axios.delete(`${BaseUrl}/chapters/delete-content/${content_id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
          }
        });
        console.log(deleteContent, "fdfghj");
        if (deleteContent.data.status) {
          // Success handling
        }
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete content.');
      }
    }
  };

  // Edit Content Handlers - UPDATED
  const handleEditContent = (content) => {
    console.log(content, "lhfdsdfhjkl;");
    setEditingContent(content.id);
    if (content.contentType === 'quiz') {
      setEditContentForm({
        contentTitle: content.contentTitle,
        isFree: content.isFree,
        contentType: content.contentType,
        textContent: content.textContent || '',
        videoUrl: content.videoUrl || '',
        quizType: content.Quiz.quizType,
        marksPerQuestion: content.Quiz.marksPerQuestion,
        durationPerQuestion: content.Quiz.durationPerQuestion,
        question: content.Quiz.question,
        options: {
          option_1: { text: content.Quiz.options.option_1.text, is_correct: content.Quiz.options.option_1.is_correct },
          option_2: { text: content.Quiz.options.option_2.text, is_correct: content.Quiz.options.option_2.is_correct },
          option_3: { text: content.Quiz.options.option_3.text, is_correct: content.Quiz.options.option_3.is_correct },
          option_4: { text: content.Quiz.options.option_4.text, is_correct: content.Quiz.options.option_4.is_correct }
        },
      });
    } else {
      setEditContentForm({
        contentTitle: content.contentTitle,
        isFree: content.isFree,
        contentType: content.contentType,
        textContent: content.textContent || '',
        videoUrl: content.videoUrl || ''
      });
    }
  };

  // UPDATED: Fixed handleQuizOptionChange function
  const handleQuizOptionChange = (optionKey, field, value) => {
    console.log(optionKey, field, value, "hehee");
       if (field === 'is_correct' && value === true) {
            // Uncheck all other options
            Object.keys(newOptions).forEach(key => {
                newOptions[key].is_correct = false;
            });
            
        } 
    setEditContentForm(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionKey]: {
          ...prev.options[optionKey],
          [field]: field === 'is_correct' ? value : value
        }
      }
    }));
  };

  // NEW: Function to handle true/false option changes
  const handleTrueFalseChange = (optionValue) => {
    setEditContentForm(prev => {
      const newOptions = {
        option_true: { text: 'True', is_correct: optionValue === 'True' },
        option_false: { text: 'False', is_correct: optionValue === 'False' }
      };
      
      return {
        ...prev,
        options: newOptions
      };
    });
  };

  // NEW: Function to handle quiz field changes
  const handleQuizChange = (field, value) => {
    setEditContentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveContentEdit = async (contentId) => {
    try {
      console.log(editContentForm, "jhgfg", contentId);
      
      // Prepare the data for API call
      const requestData = {
        contentTitle: editContentForm.contentTitle,
        isFree: editContentForm.isFree,
        contentType: editContentForm.contentType,
        textContent: editContentForm.textContent,
        videoUrl: editContentForm.videoUrl
      };

      // Add quiz-specific fields if content type is quiz
      if (editContentForm.contentType === 'quiz') {
        requestData.quizType = editContentForm.quizType;
        requestData.marksPerQuestion = editContentForm.marksPerQuestion;
        requestData.durationPerQuestion = editContentForm.durationPerQuestion;
        requestData.question = editContentForm.question;
        requestData.options = editContentForm.options;
      }

      // Add media_id if present
      if (editContentForm.media_id) {
        requestData.media_id = editContentForm.media_id;
      }

      const { data } = await axios.put(`${BaseUrl}/chapters/update-content/${contentId}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      });
      
      console.log(data, "gfdsdhj");
      if (data.status) {
        setEditingContent(null);
        setEditContentForm({});
        // Optionally refresh the page or update local state
        if (onContentEdit) {
          onContentEdit();
        }
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Failed to update content.');
    }
  };

  const handleCancelContentEdit = () => {
    setEditingContent(null);
    setEditContentForm({});
  };

  const handleDocumentClick = (content) => {
    console.log(content, "conste");
    if (content.contentType === 'document' && content.Media && content.Media.file_source) {
      const filePath = `${AWS_STUDENT_BASE_URL}${content.Media.file_source}`;
      console.log(filePath, "path");

      // Validate it's an AWS S3 URL or secure URL
      if (isValidUrl(filePath)) {
        const newWindow = window.open(filePath, '_blank', 'noopener,noreferrer');
        if (newWindow) {
          newWindow.opener = null;
        }
      } else {
        console.warn('Invalid document URL:', filePath);
        alert('Unable to open document. Invalid URL.');
      }
    }
  };

  const uploadDocument = async (file) => {
    const uploadResponse = await uploadImage(file, "chapters")
    console.log(uploadResponse, "upload response");
    return uploadResponse
  }

  const handleFile = async (file) => {
    const media_id = await uploadDocument(file)
    console.log(media_id);
    if (media_id) {
      setEditContentForm(prev => ({
        ...prev,
        media_id
      }))
    }
  }

  // URL validation helper function
  const isValidUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  // Get content type icon
  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'text':
        return '📝';
      case 'document':
        return '📄';
      case 'video':
        return '🎥';
      case 'quiz':
        return '❓';
      default:
        return '📁';
    }
  };

  // --- Tiptap Rich Text Editor Component ---
  const TextEditorComponent = ({ content }) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { class: "text-blue-500 underline" },
        }),
      ],
      content: content, // Initialize with existing content
      onUpdate: ({ editor }) => {
        const newHtml = editor.getHTML()
        setEditContentForm((prev) =>
        ({
          ...prev,
          textContent: newHtml
        }))
      },
      editorProps: {
        attributes: {
          class: "prose dark:prose-invert prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[200px] p-4 border border-t-0 border-gray-300 dark:border-gray-600 rounded-b-lg",
        },
      },
      immediatelyRender: false,
    });

    return (
      <div>
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    );
  };

  // Render quiz options if content is quiz
  const renderQuizOptions = (content) => {
    if (content.contentType !== 'quiz' || !content.Quiz) return null;

    const { options } = content.Quiz;

    return (
      <div className="space-y-2 mt-2">
        {Object.entries(options).map(([key, option]) => (
          <div
            key={key}
            className={`flex justify-between items-center p-2 rounded border ${option.is_correct
              ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700'
              : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-600'
              }`}
          >
            <span className="text-sm text-gray-700 dark:text-gray-300">{option.text}</span>
            {option.is_correct && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Course Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {course.title}
          </h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            onClick={handleCreateChapter}
          >
            + Add Chapter
          </button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Created: {new Date(course.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {analytics.total_chapters}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Chapters</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {analytics.total_contents}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Contents</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {analytics.free_contents_count}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Free</div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search chapters and contents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={contentFilter}
          onChange={(e) => setContentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Content</option>
          <option value="text">Text</option>
          <option value="document">Document</option>
          <option value="video">Video</option>
          <option value="quiz">Quiz</option>
        </select>
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {filteredChapters.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No chapters found matching your search.
          </div>
        ) : (
          filteredChapters.map(chapter => (
            <div key={chapter.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Chapter Header */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1">
                    {editingChapter === chapter.id ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={editChapterForm.chapterTitle}
                          onChange={(e) => setEditChapterForm(prev => ({
                            ...prev,
                            chapterTitle: e.target.value
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Chapter title"
                        />
                        <input
                          type="number"
                          value={editChapterForm.serialNumber}
                          onChange={(e) => setEditChapterForm(prev => ({
                            ...prev,
                            serialNumber: parseInt(e.target.value) || 1
                          }))}
                          className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          min="1"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm font-medium">
                          #{chapter.serialNumber}
                        </span>
                        <h3
                          className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={() => toggleChapter(chapter.id)}
                        >
                          {chapter.chapterTitle || 'Untitled Chapter'}
                        </h3>
                      </div>
                    )}
                    <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{chapter.total_contents} items</span>
                      {chapter.free_contents_count > 0 && (
                        <span className="text-green-600 dark:text-green-400">
                          {chapter.free_contents_count} free
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {editingChapter === chapter.id ? (
                      <div className="flex gap-1">
                        <button
                          className="p-2 text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded hover:bg-green-600 hover:text-white transition-colors"
                          onClick={() => handleSaveChapterEdit(chapter.id)}
                          title="Save"
                        >
                          ✓
                        </button>
                        <button
                          className="p-2 text-gray-600 dark:text-gray-400 border border-gray-600 dark:border-gray-400 rounded hover:bg-gray-600 hover:text-white transition-colors"
                          onClick={handleCancelChapterEdit}
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          className="p-2 text-yellow-600 dark:text-yellow-400 border border-yellow-600 dark:border-yellow-400 rounded hover:bg-yellow-600 hover:text-white transition-colors"
                          onClick={() => handleEditChapter(chapter)}
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          className="p-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded hover:bg-red-600 hover:text-white transition-colors"
                          onClick={() => handleDeleteChapter(chapter.id, chapter.chapterTitle)}
                          title="Delete"
                        >
                          🗑
                        </button>
                        <button
                          className="p-2 text-gray-600 dark:text-gray-400 border border-gray-600 dark:border-gray-400 rounded hover:bg-gray-600 hover:text-white transition-colors"
                          onClick={() => toggleChapter(chapter.id)}
                          title={expandedChapters[chapter.id] ? 'Collapse' : 'Expand'}
                        >
                          {expandedChapters[chapter.id] ? '▲' : '▼'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Chapter Contents */}
              {expandedChapters[chapter.id] && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                  {chapter.Contents.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No contents in this chapter
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chapter.Contents.map(content => (
                        <div key={content.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          {/* Content Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg">{getContentTypeIcon(content.contentType)}</span>

                            {editingContent === content.id ? (
                              <div className="flex flex-1 flex-col sm:flex-row gap-3">
                                <input
                                  type="text"
                                  value={editContentForm.contentTitle}
                                  onChange={(e) => setEditContentForm(prev => ({
                                    ...prev,
                                    contentTitle: e.target.value
                                  }))}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                  placeholder="Content title"
                                />
                                <div className="flex items-center">
                                  <input 
                                    type="checkbox" 
                                    checked={editContentForm.isFree} 
                                    onChange={(e) => setEditContentForm(prev => ({
                                      ...prev,
                                      isFree: e.target.checked
                                    }))} 
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                                  />
                                  <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Free</label>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`flex-1 flex items-center gap-2 ${content.contentType === 'document' ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400' : ''}`}
                                onClick={() => content.contentType === 'document' && handleDocumentClick(content)}
                              >
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {content.contentTitle || 'Untitled Content'}
                                </h4>
                                {content.contentType === 'document' && (
                                  <span className="text-sm text-blue-600 dark:text-blue-400">↗</span>
                                )}
                                {content.isFree && (
                                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                                    Free
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex gap-1">
                              {editingContent === content.id ? (
                                <div className="flex gap-1">
                                  <button
                                    className="p-2 text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded hover:bg-green-600 hover:text-white transition-colors"
                                    onClick={() => handleSaveContentEdit(content.id)}
                                    title="Save"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    className="p-2 text-gray-600 dark:text-gray-400 border border-gray-600 dark:border-gray-400 rounded hover:bg-gray-600 hover:text-white transition-colors"
                                    onClick={handleCancelContentEdit}
                                    title="Cancel"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    className="p-2 text-yellow-600 dark:text-yellow-400 border border-yellow-600 dark:border-yellow-400 rounded hover:bg-yellow-600 hover:text-white transition-colors"
                                    onClick={() => handleEditContent(content)}
                                    title="Edit"
                                  >
                                    ✎
                                  </button>
                                  <button
                                    className="p-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded hover:bg-red-600 hover:text-white transition-colors"
                                    onClick={() => handleDeleteContent(content.id, content.contentTitle)}
                                    title="Delete"
                                  >
                                    🗑
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Content Details */}
                          <div className="ml-10">
                            {/* Text Content Preview */}
                            {content.contentType === 'text' && content.textContent && (
                              <div className="mt-2">
                                {editingContent === content.id ? (
                                  <>
                                    <div>
                                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Text Content</label>
                                      <TextEditorComponent
                                        content={editContentForm.textContent}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div
                                    className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                      __html: content.textContent.length > 150
                                        ? content.textContent.substring(0, 150) + '...'
                                        : content.textContent
                                    }}
                                  />
                                )}
                              </div>
                            )}

                            {/* Video Content */}
                            {content.contentType === 'video' && content.videoUrl && (
                              <div className="mt-2">
                                {editingContent === content.id ? (
                                  <>
                                    <input
                                      type="text"
                                      value={editContentForm.videoUrl}
                                      onChange={(e) => setEditContentForm(prev => ({
                                        ...prev,
                                        videoUrl: e.target.value
                                      }))}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="Video URL"
                                    />
                                    <div className="flex items-center mt-4">
                                      <input type="checkbox" checked={editContentForm.isFree} onChange={(e) => setEditContentForm(prev => ({
                                        ...prev,
                                        isFree: e.target.checked
                                      }))} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                      <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is this content free?</label>
                                    </div>
                                  </>
                                ) : (
                                  <span
                                    className="text-gray-600 dark:text-gray-400 text-sm break-all"
                                    dangerouslySetInnerHTML={{ __html: content.videoUrl }}
                                  />
                                )}
                              </div>
                            )}

                            {/* Quiz Content - UPDATED */}
                            {content.contentType === 'quiz' && content.Quiz && (
                              <div className="mt-2">
                                {editingContent === content.id ? (
                                  <>
                                    <div className="space-y-4 p-4 mt-4 bg-gray-100 dark:bg-gray-900/70 rounded-md border dark:border-gray-700">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                          <label htmlFor={`quiz-type`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quiz Type</label>
                                          <select 
                                            id={`quiz-type`} 
                                            value={editContentForm.quizType} 
                                            onChange={(e) => handleQuizChange('quizType', e.target.value)} 
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                                          >
                                            <option value="mcq">MCQ</option>
                                            <option value="true-false">True/False</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label htmlFor={`quiz-marks`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Marks Per Question</label>
                                          <input 
                                            type="number" 
                                            id={`quiz-marks`} 
                                            value={editContentForm.marksPerQuestion} 
                                            min="1" 
                                            onChange={(e) => handleQuizChange('marksPerQuestion', parseInt(e.target.value) || 1)} 
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" 
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor={`quiz-duration`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Duration (Minutes)</label>
                                          <input 
                                            type="number" 
                                            id={`quiz-duration`} 
                                            value={editContentForm.durationPerQuestion} 
                                            min="1" 
                                            onChange={(e) => handleQuizChange('durationPerQuestion', parseInt(e.target.value) || 1)} 
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" 
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label htmlFor={`quiz-question`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question</label>
                                        <input 
                                          type="text" 
                                          id={`quiz-question`} 
                                          value={editContentForm.question} 
                                          onChange={(e) => handleQuizChange('question', e.target.value)} 
                                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" 
                                          placeholder="What is the capital of France?" 
                                        />
                                      </div>

                                      {editContentForm.quizType === 'mcq' && (
                                        <div className="space-y-3">
                                          <label className="block text-sm font-medium text-gray-900 dark:text-white">Options</label>
                                          {Object.keys(editContentForm.options).map((optionKey, optionIndex) => (
                                            <div key={optionKey} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                              <div className="flex-1">
                                                <label htmlFor={`option-${optionKey}`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                  Option {optionIndex + 1}
                                                </label>
                                                <input
                                                  type="text"
                                                  id={`option-${optionKey}`}
                                                  value={editContentForm.options[optionKey].text}
                                                  onChange={(e) => handleQuizOptionChange(optionKey, 'text', e.target.value)}
                                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                                                  placeholder={`Enter option ${optionIndex + 1}`}
                                                />
                                              </div>
                                              <div className="flex items-center">
                                                <input
                                                  id={`correct-${optionKey}`}
                                                  type="radio"
                                                  name={`correct-answer`}
                                                  checked={editContentForm.options[optionKey].is_correct}
                                                  onChange={(e) => handleQuizOptionChange(optionKey, 'is_correct', e.target.checked)}
                                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label htmlFor={`correct-${optionKey}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                  Correct
                                                </label>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {editContentForm.quizType === 'true-false' && (
                                        <div className="space-y-3">
                                          <label className="block text-sm font-medium text-gray-900 dark:text-white">True/False Options</label>
                                          {['True', 'False'].map((optionValue) => (
                                            <div key={optionValue} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                              <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{optionValue}</span>
                                              <div className="flex items-center">
                                                <input
                                                  id={`tf-${optionValue}`}
                                                  type="radio"
                                                  name={`correct-answer`}
                                                  checked={editContentForm.options[`option_${optionValue.toLowerCase()}`]?.is_correct || false}
                                                  onChange={() => handleTrueFalseChange(optionValue)}
                                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label htmlFor={`tf-${optionValue}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                  Correct
                                                </label>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                                      {content.Quiz.question}
                                    </div>
                                    {renderQuizOptions(content)}
                                  </>
                                )}
                              </div>
                            )}

                            {/* Document Content */}
                            {content.contentType === 'document' && content.Media.file_source && (
                              <div className="mt-2">
                                {editingContent === content.id && (
                                  <>
                                    <input
                                      type="file"
                                      onChange={(e) => handleFile(e.target.files[0])}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    <div className="flex items-center mt-4">
                                      <input type="checkbox" checked={editContentForm.isFree} onChange={(e) => setEditContentForm(prev => ({
                                        ...prev,
                                        isFree: e.target.checked
                                      }))} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                      <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is this content free?</label>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseDetails;