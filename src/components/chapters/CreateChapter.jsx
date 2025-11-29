'use client';

import React, { useState, useCallback } from 'react';
// UPDATED: Changed imports to use a CDN to resolve module loading errors
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { BaseUrl } from '@/constents/serverBaseUrl';
import { API_KEY } from '@/constents/apiKey';
import axios from 'axios'
import { uploadImage } from '@/constents/uploadImage'
import { useSearchParams } from 'next/navigation'
import {useRouter} from 'next/navigation'
// --- Helper Icons (Unchanged) ---
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>);

// --- Tiptap Editor Toolbar Component ---
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

// --- Tiptap Rich Text Editor Component ---
const TextEditorComponent = ({ content, onChange }) => {
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
            onChange(editor.getHTML()); // Pass HTML back to parent
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

// --- Main Component ---
export default function CreateChapters({ course_id, data }) {
    
    const title = data.course_title
    const router = useRouter()
    // UPDATED: Added new quiz fields
    const createNewContent = () => ({
        isFree: false,
        contentTitle: '',
        contentType: 'text',
        file: null,
        videoUrl: '',
        textContent: '',
        media_id: null,
        quiz: {
            question: '',
            quizType: 'mcq', // 'mcq' or 'true-false'
            options: {
                option_1: { text: "", is_correct: false },
                option_2: { text: "", is_correct: false },
                option_3: { text: "", is_correct: false },
                option_4: { text: "", is_correct: false }
            },
            answer: '',
            marksPerQuestion: 10,
            durationPerQuestion: 5,
        },
    });

    const createNewChapter = () => ({
        chapterTitle: '',
        serialNumber: data.last_number,
        contents: [createNewContent()],
    });

    const [courseTitle, setCourseTitle] = useState(title);
    const [chapters, setChapters] = useState([createNewChapter()]);



    const handleChapterChange = useCallback((index, field, value) => {
        const newChapters = [...chapters];
        newChapters[index][field] = value;
        setChapters(newChapters);
    }, [chapters]);
    const uploadDocument = async (file) => {
        const uploadResponse = await uploadImage(file, "chapters")
        return uploadResponse
    }
    const handleContentChange = useCallback(async (chapterIndex, contentIndex, field, value) => {
        const newChapters = [...chapters];
        const newContents = [...newChapters[chapterIndex].contents];

        if (field === 'file' && value) {
            const media_id = await uploadDocument(value)
            if (media_id) {

                newContents[contentIndex]['media_id'] = media_id;
            }
        } else {
            newContents[contentIndex][field] = value;
        }

        newChapters[chapterIndex].contents = newContents;
        setChapters(newChapters);
    }, [chapters]);

    // UPDATED: Logic to handle quiz type switching
   const handleQuizChange = useCallback((chapterIndex, contentIndex, field, value) => {
  const newChapters = [...chapters];
  const newContents = [...newChapters[chapterIndex].contents];
  const newQuiz = { ...newContents[contentIndex].quiz };

  newQuiz[field] = value;

  // If changing quiz type, reset options appropriately
  if (field === 'quizType') {
    if (value === 'true-false') {
      newQuiz.options = {
        option_true: { text: 'True', is_correct: true },
        option_false: { text: 'False', is_correct: false }
      };
    } else { // mcq
      newQuiz.options = {
        option_1: { text: '', is_correct: false },
        option_2: { text: '', is_correct: false },
        option_3: { text: '', is_correct: false },
        option_4: { text: '', is_correct: false }
      };
    }
  }

  newContents[contentIndex].quiz = newQuiz;
  newChapters[chapterIndex].contents = newContents;
  setChapters(newChapters);
}, [chapters]);

    const handleQuizOptionChange = useCallback((chapterIndex, contentIndex, optionKey, field, value) => {
        const newChapters = [...chapters];
        const newContents = [...newChapters[chapterIndex].contents];
        const newQuiz = { ...newContents[contentIndex].quiz };
        const newOptions = { ...newQuiz.options };

        if (field === 'is_correct' && value === true) {
            // Uncheck all other options
            Object.keys(newOptions).forEach(key => {
                newOptions[key].is_correct = false;
            });
            // Set the current option as correct
            newOptions[optionKey].is_correct = true;
        } else {
            newOptions[optionKey][field] = value;
        }

        newQuiz.options = newOptions;
        newContents[contentIndex].quiz = newQuiz;
        newChapters[chapterIndex].contents = newContents;
        setChapters(newChapters);
    }, [chapters]);
    const handleTrueFalseChange = useCallback((chapterIndex, contentIndex, optionValue) => {
  const newChapters = [...chapters];
  const newContents = [...newChapters[chapterIndex].contents];
  const newQuiz = { ...newContents[contentIndex].quiz };
  const newOptions = { ...newQuiz.options };

  // Set all options to false first
  Object.keys(newOptions).forEach(key => {
    newOptions[key].is_correct = false;
  });

  // Set the selected option to true
  const optionKey = `option_${optionValue.toLowerCase()}`;
  newOptions[optionKey].is_correct = true;

  newQuiz.options = newOptions;
  newContents[contentIndex].quiz = newQuiz;
  newChapters[chapterIndex].contents = newContents;
  setChapters(newChapters);
}, [chapters]);
    const addChapter = useCallback(() => {
        setChapters(prev => [...prev, createNewChapter()]);
    }, []);

    const removeChapter = useCallback((index) => {
        setChapters(prev => prev.filter((_, i) => i !== index));
    }, []);

    const addContent = useCallback((chapterIndex) => {
        const newChapters = [...chapters];
        newChapters[chapterIndex].contents.push(createNewContent());
        setChapters(newChapters);
    }, [chapters]);

    const removeContent = useCallback((chapterIndex, contentIndex) => {
        const newChapters = [...chapters];
        const newContents = newChapters[chapterIndex].contents.filter((_, i) => i !== contentIndex);
        newChapters[chapterIndex].contents = newContents;
        setChapters(newChapters);
    }, [chapters]);

    const handleCreateCourse = async () => {
        try {
            const formData = new FormData();
            formData.append('courseTitle', courseTitle);
            formData.append('chapters', JSON.stringify(chapters));
            formData.append('course_id', course_id)

            // Append document files if any
            chapters.forEach((chapter, chapterIndex) => {
                chapter.contents.forEach((content, contentIndex) => {
                    if (content.contentType === 'document' && content.file) {
                        formData.append(`document-${chapterIndex}-${contentIndex}`, content.file);
                    }
                });
            });

            const response = await axios.post(`${BaseUrl}/chapters/create-chapter/${course_id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                }
            });

            if (response.data.status) {
                alert('Course created successfully!');
                router.push(`/chapters/${course_id}`)
            } else {
                console.error('Error creating course:');
                alert('Error creating course: ');
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Error creating course');
        }
    };


    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Course Chapters</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Build your course by adding chapters and content, including rich text, documents, videos, and quizzes.
                    </p>
                </header>

                <div className="space-y-8">
                    {/* Course Title */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <label htmlFor="course-title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Course Title</label>
                        <input type="text" id="course-title" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="e.g., Introduction to Web Development" disabled />
                    </div>

                    {/* Chapters Loop */}
                    {chapters.map((chapter, chapterIndex) => (
                        <div key={chapterIndex} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Chapter {chapterIndex + 1}</h2>
                                {chapters.length > 1 && (<button onClick={() => removeChapter(chapterIndex)} type="button" className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-full bg-red-100 dark:bg-gray-700"><TrashIcon /></button>)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label htmlFor={`chapter-title-${chapterIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chapter Title</label>
                                    <input type="text" id={`chapter-title-${chapterIndex}`} value={chapter.chapterTitle} onChange={(e) => handleChapterChange(chapterIndex, 'chapterTitle', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="e.g., Getting Started with HTML" />
                                </div>
                                <div>
                                    <label htmlFor={`serial-number-${chapterIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Serial Number</label>
                                    <input type="number" id={`serial-number-${chapterIndex}`} value={chapter.serialNumber} min="1" onChange={(e) => handleChapterChange(chapterIndex, 'serialNumber', parseInt(e.target.value) || 1)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {chapter.contents.map((content, contentIndex) => (
                                    <div key={contentIndex} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Content {contentIndex + 1}</h3>
                                            {chapter.contents.length > 1 && (<button onClick={() => removeContent(chapterIndex, contentIndex)} type="button" className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-full -mt-1 -mr-1"><TrashIcon /></button>)}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor={`content-title-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content Title</label>
                                                <input type="text" id={`content-title-${chapterIndex}-${contentIndex}`} value={content.contentTitle} onChange={(e) => handleContentChange(chapterIndex, contentIndex, 'contentTitle', e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., Basic HTML Tags" />
                                            </div>

                                            <div>
                                                <label htmlFor={`content-type-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content Type</label>
                                                <select id={`content-type-${chapterIndex}-${contentIndex}`} value={content.contentType} onChange={(e) => handleContentChange(chapterIndex, contentIndex, 'contentType', e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                                                    <option value="text">Text</option>
                                                    <option value="document">Document</option>
                                                    <option value="video">Video</option>
                                                    <option value="quiz">Quiz</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center mt-4">
                                            <input id={`is-free-${chapterIndex}-${contentIndex}`} type="checkbox" checked={content.isFree} onChange={(e) => handleContentChange(chapterIndex, contentIndex, 'isFree', e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            <label htmlFor={`is-free-${chapterIndex}-${contentIndex}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is this content free?</label>
                                        </div>

                                        <div className="mt-4">
                                            {content.contentType === 'text' && (
                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Text Content</label>
                                                    <TextEditorComponent
                                                        content={content.textContent}
                                                        onChange={(newHtml) => handleContentChange(chapterIndex, contentIndex, 'textContent', newHtml)}
                                                    />
                                                </div>
                                            )}
                                            {content.contentType === 'document' && (
                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor={`file-upload-${chapterIndex}-${contentIndex}`}>Upload Document</label>
                                                    <input id={`file-upload-${chapterIndex}-${contentIndex}`} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600" type="file" onChange={(e) => handleContentChange(chapterIndex, contentIndex, 'file', e.target.files[0])} />
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">PDF, DOCX, TXT (MAX. 5MB).</p>
                                                </div>
                                            )}
                                            {content.contentType === 'video' && (
                                                <div>
                                                    <label htmlFor={`video-url-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Video URL</label>
                                                    <input type="text" id={`video-url-${chapterIndex}-${contentIndex}`} value={content.videoUrl} onChange={(e) => handleContentChange(chapterIndex, contentIndex, 'videoUrl', e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" placeholder="https://example.com/video.mp4" />
                                                </div>
                                            )}
                                            {/* UPDATED: Revamped Quiz UI */}
                                            {content.contentType === 'quiz' && (
                                                <div className="space-y-4 p-4 mt-4 bg-gray-100 dark:bg-gray-900/70 rounded-md border dark:border-gray-700">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label htmlFor={`quiz-type-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quiz Type</label>
                                                            <select id={`quiz-type-${chapterIndex}-${contentIndex}`} value={content.quiz.quizType} onChange={(e) => handleQuizChange(chapterIndex, contentIndex, 'quizType', e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                                                                <option value="mcq">MCQ</option>
                                                                <option value="true-false">True/False</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`quiz-marks-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Marks Per Question</label>
                                                            <input type="number" id={`quiz-marks-${chapterIndex}-${contentIndex}`} value={content.quiz.marksPerQuestion} min="1" onChange={(e) => handleQuizChange(chapterIndex, contentIndex, 'marksPerQuestion', parseInt(e.target.value) || 1)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`quiz-duration-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Duration (Minutes)</label>
                                                            <input type="number" id={`quiz-duration-${chapterIndex}-${contentIndex}`} value={content.quiz.durationPerQuestion} min="1" onChange={(e) => handleQuizChange(chapterIndex, contentIndex, 'durationPerQuestion', parseInt(e.target.value) || 1)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`quiz-question-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question</label>
                                                        <input type="text" id={`quiz-question-${chapterIndex}-${contentIndex}`} value={content.quiz.question} onChange={(e) => handleQuizChange(chapterIndex, contentIndex, 'question', e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" placeholder="What is the capital of France?" />
                                                    </div>

                                                    {content.quiz.quizType === 'mcq' && (
                                                        <div className="space-y-3">
                                                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Options</label>
                                                            {Object.keys(content.quiz.options).map((optionKey, optionIndex) => (
                                                                <div key={optionKey} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                    <div className="flex-1">
                                                                        <label htmlFor={`option-${chapterIndex}-${contentIndex}-${optionKey}`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                                            Option {optionIndex + 1}
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            id={`option-${chapterIndex}-${contentIndex}-${optionKey}`}
                                                                            value={content.quiz.options[optionKey].text}
                                                                            onChange={(e) => handleQuizOptionChange(chapterIndex, contentIndex, optionKey, 'text', e.target.value)}
                                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                                                                            placeholder={`Enter option ${optionIndex + 1}`}
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={`correct-${chapterIndex}-${contentIndex}-${optionKey}`}
                                                                            type="radio"
                                                                            name={`correct-answer-${chapterIndex}-${contentIndex}`}
                                                                            checked={content.quiz.options[optionKey].is_correct}
                                                                            onChange={(e) => handleQuizOptionChange(chapterIndex, contentIndex, optionKey, 'is_correct', e.target.checked)}
                                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                        />
                                                                        <label htmlFor={`correct-${chapterIndex}-${contentIndex}-${optionKey}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                            Correct
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {content.quiz.quizType === 'true-false' && (
                                                        <div className="space-y-3">
                                                            <label className="block text-sm font-medium text-gray-900 dark:text-white">True/False Options</label>
                                                            {['True', 'False'].map((optionValue) => (
                                                                <div key={optionValue} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                    <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{optionValue}</span>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={`tf-${chapterIndex}-${contentIndex}-${optionValue}`}
                                                                            type="radio"
                                                                            name={`correct-answer-${chapterIndex}-${contentIndex}`}
                                                                            checked={content.quiz.options[`option_${optionValue.toLowerCase()}`]?.is_correct || false}
                                                                            onChange={() => handleTrueFalseChange(chapterIndex, contentIndex, optionValue)}
                                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                        />
                                                                        <label htmlFor={`tf-${chapterIndex}-${contentIndex}-${optionValue}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                            Correct
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => addContent(chapterIndex)} type="button" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 border-2 border-dashed border-gray-300 rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:border-gray-600 dark:hover:bg-gray-700"><PlusIcon /> Add Content</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button onClick={addChapter} type="button" className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"><PlusIcon /> Create New Chapter</button>
                    <button onClick={handleCreateCourse} type="button" className="w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700">Create Course</button>
                </div>
            </div>
        </div>
    );
}

