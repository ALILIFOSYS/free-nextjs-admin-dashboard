'use client';

import { BaseUrl } from '@/constents/serverBaseUrl';
import axios from 'axios';
import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from "@tiptap/react";
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Code, Undo2, Redo2, Heading1, Heading2, Heading3, Link as LinkIcon } from "lucide-react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";


// Helper component for icons
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);



// Main Component
export default function CreateChapters({ course_id, data }) {


    const createNewContent = () => ({
        isFree: false,
        contentTitle: '',
        contentType: 'document',
        file: null,
        videoUrl: '',
        quiz: {
            question: '',
            options: ['', '', '', ''],
            answer: '',
        },
        text :''
    });

    const createNewChapter = () => ({
        chapterTitle: '',
        serialNumber: data.last_number,
        contents: [createNewContent()],
    });


    const [chapters, setChapters] = useState([createNewChapter()]);

    const handleChapterChange = useCallback((index, field, value) => {
        const newChapters = [...chapters];
        newChapters[index][field] = value;
        setChapters(newChapters);
    }, [chapters]);

    const handleContentChange = useCallback((chapterIndex, contentIndex, field, value) => {
        const newChapters = [...chapters];
        const newContents = [...newChapters[chapterIndex].contents];

        if (field === 'file' && value) {
            newContents[contentIndex][field] = value;
        } else {
            newContents[contentIndex][field] = value;
        }

        newChapters[chapterIndex].contents = newContents;
        setChapters(newChapters);
    }, [chapters]);

    const handleQuizChange = useCallback((chapterIndex, contentIndex, field, value) => {
        const newChapters = [...chapters];
        const newContents = [...newChapters[chapterIndex].contents];
        newContents[contentIndex].quiz[field] = value;
        newChapters[chapterIndex].contents = newContents;
        setChapters(newChapters);
    }, [chapters]);

    const handleQuizOptionChange = useCallback((chapterIndex, contentIndex, optionIndex, value) => {
        const newChapters = [...chapters];
        const newContents = [...newChapters[chapterIndex].contents];
        newContents[contentIndex].quiz.options[optionIndex] = value;
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
            // Here you would typically send the data to your API
            const courseData = {
                courseTitle: data.course_title,
                chapters,
            };
            const createData = await axios.post(`${BaseUrl}/chapters/create-chapter/${course_id}`, courseData, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y',

                }
            })
        } catch (error) {
            console.log(error);

        }


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
        content: "",
        onUpdate: ({ editor }) => {
            console.log(editor,"sdf");
            
            const html = editor.getHTML();
            // setFormData(prev => ({
            //     ...prev,
            //     description: html
            // }));
       
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
            },
        },
    });

    const setLink = () => {
        const url = window.prompt("Enter URL");
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
    };


    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Course Chapters</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Build your course by adding chapters and content. You can add multiple content types like documents, videos, and quizzes.
                    </p>
                </header>

                <div className="space-y-8">
                    {/* Course Title */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <label htmlFor="course-title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Course Title
                        </label>
                        <input
                            type="text"
                            id="course-title"
                            value={data.course_title}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="e.g., Introduction to Web Development"
                            disabled
                        />
                    </div>

                    {/* Chapters */}
                    {chapters.map((chapter, chapterIndex) => (
                        <div key={chapterIndex} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Chapter {chapterIndex + 1}</h2>
                                {chapters.length > 1 && (
                                    <button onClick={() => removeChapter(chapterIndex)} type="button" className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-full bg-red-100 dark:bg-gray-700">
                                        <TrashIcon />
                                    </button>
                                )}
                            </div>

                            {/* Chapter Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label htmlFor={`chapter-title-${chapterIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chapter Title</label>
                                    <input
                                        type="text"
                                        id={`chapter-title-${chapterIndex}`}
                                        value={chapter.chapterTitle}
                                        onChange={(e) => handleChapterChange(chapterIndex, 'chapterTitle', e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="e.g., Getting Started with HTML"
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`serial-number-${chapterIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Serial Number</label>
                                    <input
                                        type="number"
                                        id={`serial-number-${chapterIndex}`}
                                        value={chapter.serialNumber}
                                        min="1"
                                        onChange={(e) => handleChapterChange(chapterIndex, 'serialNumber', parseInt(e.target.value) || 1)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Contents for the chapter */}
                            <div className="space-y-6">
                                {chapter.contents.map((content, contentIndex) => (
                                    <div key={contentIndex} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Content {contentIndex + 1}</h3>
                                            {chapter.contents.length > 1 && (
                                                <button onClick={() => removeContent(chapterIndex, contentIndex)} type="button" className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-full -mt-1 -mr-1">
                                                    <TrashIcon />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Content Title */}
                                            <div>
                                                <label htmlFor={`content-title-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content Title</label>
                                                <input
                                                    type="text"
                                                    id={`content-title-${chapterIndex}-${contentIndex}`}
                                                    value={content.contentTitle}
                                                    onChange={(e) => handleContentChange(chapterIndex, contentIndex, 'contentTitle', e.target.value)}
                                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                    placeholder="e.g., Basic HTML Tags"
                                                />
                                            </div>

                                            {/* Content Type */}
                                            <div>
                                                <label htmlFor={`content-type-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content Type</label>
                                                <select
                                                    id={`content-type-${chapterIndex}-${contentIndex}`}
                                                    value={content.contentType}
                                                    onChange={(e) => handleContentChange(chapterIndex, contentIndex, 'contentType', e.target.value)}
                                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                >
                                                    <option value="document">Document</option>
                                                    <option value="video">Video</option>
                                                    <option value="quiz">Quiz</option>
                                                    <option value="text">Text</option>

                                                </select>
                                            </div>
                                        </div>

                                        {/* Is Free Checkbox */}
                                        <div className="flex items-center mt-4">
                                            <input
                                                id={`is-free-${chapterIndex}-${contentIndex}`}
                                                type="checkbox"
                                                checked={content.isFree}
                                                onChange={(e) => handleContentChange(chapterIndex, contentIndex, 'isFree', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label htmlFor={`is-free-${chapterIndex}-${contentIndex}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is this content free?</label>
                                        </div>

                                        {/* Conditional Inputs */}
                                        <div className="mt-4">
                                            {content.contentType === 'document' && (
                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor={`file-upload-${chapterIndex}-${contentIndex}`}>Upload Document</label>
                                                    <input
                                                        id={`file-upload-${chapterIndex}-${contentIndex}`}
                                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                                        type="file"
                                                        onChange={(e) => handleContentChange(chapterIndex, contentIndex, 'file', e.target.files[0])}
                                                    />
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">PDF, DOCX, TXT (MAX. 5MB).</p>
                                                </div>
                                            )}
                                            {content.contentType === 'video' && (
                                                <div>
                                                    <label htmlFor={`video-url-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Video URL</label>
                                                    <input
                                                        type="text"
                                                        id={`video-url-${chapterIndex}-${contentIndex}`}
                                                        value={content.videoUrl}
                                                        onChange={(e) => handleContentChange(chapterIndex, contentIndex, 'videoUrl', e.target.value)}
                                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                        placeholder="https://example.com/video.mp4"
                                                    />
                                                </div>
                                            )}

                                            {content.contentType === 'quiz' && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor={`quiz-question-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question</label>
                                                        <input
                                                            type="text"
                                                            id={`quiz-question-${chapterIndex}-${contentIndex}`}
                                                            value={content.quiz.question}
                                                            onChange={(e) => handleQuizChange(chapterIndex, contentIndex, 'question', e.target.value)}
                                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                            placeholder="What is the capital of France?"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {content.quiz.options.map((option, optionIndex) => (
                                                            <div key={optionIndex}>
                                                                <label htmlFor={`option-${chapterIndex}-${contentIndex}-${optionIndex}`} className="block mb-2 text-xs font-medium text-gray-900 dark:text-white">Option {optionIndex + 1}</label>
                                                                <input
                                                                    type="text"
                                                                    id={`option-${chapterIndex}-${contentIndex}-${optionIndex}`}
                                                                    value={option}
                                                                    onChange={(e) => handleQuizOptionChange(chapterIndex, contentIndex, optionIndex, e.target.value)}
                                                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                                    placeholder={`Option ${optionIndex + 1}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`quiz-answer-${chapterIndex}-${contentIndex}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correct Answer</label>
                                                        <select
                                                            id={`quiz-answer-${chapterIndex}-${contentIndex}`}
                                                            value={content.quiz.answer}
                                                            onChange={(e) => handleQuizChange(chapterIndex, contentIndex, 'answer', e.target.value)}
                                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                        >
                                                            <option value="">Select the correct option</option>
                                                            {content.quiz.options.map((option, optionIndex) => (
                                                                option && <option key={optionIndex} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                            {content.contentType === 'text' &&
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
                                                        <EditorContent editor={editor} onChange={()=>console.log("hi")} className="min-h-[300px] max-h-[500px] overflow-y-auto" />
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addContent(chapterIndex)}
                                    type="button"
                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 border-2 border-dashed border-gray-300 rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    <PlusIcon />
                                    Add Content
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={addChapter}
                        type="button"
                        className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    >
                        <PlusIcon />
                        Create New Chapter
                    </button>
                    <button
                        onClick={handleCreateCourse}
                        type="button"
                        className="w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Create Course
                    </button>
                </div>
            </div>
        </div>
    );
}

