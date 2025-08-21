"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Strikethrough, Underline, List, ListOrdered, Quote, Code, Undo2, Redo2, Heading1, Heading2, Heading3, Link as LinkIcon } from "lucide-react";

export default function RichTextEditor({ onChange }: { onChange?: (content: string) => void }) {
  const editor = useEditor({
     immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: "<p>Start writing your course description...</p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log(html,"sdfds");

      if (onChange) onChange(html);
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
    <div className="border rounded-lg p-3">
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
      <EditorContent editor={editor} className="min-h-[200px] p-2 outline-none" />
    </div>
  );
}
