'use client';

import { useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Register custom font sizes
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['small', 'normal', 'large', 'huge'];
Quill.register(Size, true);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  height = '200px',
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ size: ['small', 'normal', 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  }), []);

  const formats = [
    'header',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'align',
    'link',
  ];

  return (
    <div className="rich-text-editor">
      <style jsx>{`
        .rich-text-editor .ql-container {
          font-family: inherit;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          background: #f9fafb;
        }
        .rich-text-editor .ql-editor {
          min-height: ${height};
          font-size: 1rem;
          line-height: 1.8;
        }
        .rich-text-editor .ql-editor p {
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ql-editor h1 {
          font-size: 2em;
          font-weight: 700;
          margin-bottom: 0.5em;
          color: #111;
        }
        .rich-text-editor .ql-editor h2 {
          font-size: 1.5em;
          font-weight: 700;
          margin-bottom: 0.5em;
          color: #111;
        }
        .rich-text-editor .ql-editor h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-left: 1.5em;
        }
        .rich-text-editor .ql-editor li {
          margin-bottom: 0.25em;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
      />
    </div>
  );
}
