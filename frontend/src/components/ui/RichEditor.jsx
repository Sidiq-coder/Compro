import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';

const RichEditor = ({ 
  value, 
  onChange, 
  placeholder = "Mari mulai menulis artikel yang menarik...",
  readOnly = false 
}) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (editorRef.current && !editorInstance.current) {
      initializeEditor();
    }

    return () => {
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy();
        } catch (e) {
          console.warn('Editor cleanup error:', e);
        }
        editorInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isReady && editorInstance.current && value) {
      try {
        const data = typeof value === 'string' ? JSON.parse(value) : value;
        if (data && data.blocks) {
          editorInstance.current.render(data);
        }
      } catch (error) {
        console.warn('Error parsing editor data:', error);
      }
    }
  }, [isReady, value]);

  const initializeEditor = async () => {
    try {
      editorInstance.current = new EditorJS({
        holder: editorRef.current,
        readOnly,
        placeholder,
        tools: {
          header: {
            class: Header,
            inlineToolbar: ['marker', 'link'],
            config: {
              placeholder: 'Masukkan judul...',
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2
            }
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: 'Masukkan teks...'
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByFile: async (file) => {
                  return uploadImage(file);
                },
                uploadByUrl: async (url) => {
                  return {
                    success: 1,
                    file: {
                      url: url
                    }
                  };
                }
              }
            }
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            config: {
              quotePlaceholder: 'Masukkan kutipan...',
              captionPlaceholder: 'Penulis kutipan'
            }
          },
          code: {
            class: Code,
            config: {
              placeholder: 'Masukkan kode...'
            }
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            }
          },
          delimiter: {
            class: Delimiter
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+W',
            config: {
              titlePlaceholder: 'Judul peringatan...',
              messagePlaceholder: 'Pesan peringatan...'
            }
          },
          marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M'
          },
          inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+C'
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/articles/fetch-url'
            }
          }
        },
        onChange: async () => {
          if (onChange && editorInstance.current) {
            try {
              const outputData = await editorInstance.current.save();
              onChange(outputData);
            } catch (error) {
              console.error('Error saving editor data:', error);
            }
          }
        },
        onReady: () => {
          setIsReady(true);
        }
      });
    } catch (error) {
      console.error('Error initializing editor:', error);
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Assuming you have an image upload endpoint
      const response = await fetch('/api/articles/upload-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        return {
          success: 1,
          file: {
            url: result.data.url
          }
        };
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: 0,
        error: error.message || 'Upload failed'
      };
    }
  };

  return (
    <div className="rich-editor">
      <div 
        ref={editorRef} 
        className="min-h-[400px] border border-gray-300 rounded-lg p-4 bg-white"
        style={{
          fontSize: '16px',
          lineHeight: '1.6'
        }}
      />
      
      {/* Editor Styles */}
      <style jsx>{`
        .rich-editor .ce-toolbar__content,
        .rich-editor .ce-block__content {
          max-width: none !important;
        }
        
        .rich-editor .ce-block__content {
          margin: 0 !important;
        }
        
        .rich-editor .ce-paragraph[data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
        
        .rich-editor .ce-header {
          margin: 1rem 0;
        }
        
        .rich-editor .ce-quote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          background: #f8fafc;
        }
        
        .rich-editor .ce-code {
          background: #1f2937;
          color: #f9fafb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
        }
        
        .rich-editor .ce-warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
        }
        
        .rich-editor .ce-table {
          margin: 1rem 0;
        }
        
        .rich-editor .ce-table__content {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .rich-editor .tc-row {
          border-bottom: 1px solid #e5e7eb;
        }
        
        .rich-editor .tc-cell {
          border-right: 1px solid #e5e7eb;
          padding: 0.5rem;
        }
        
        .rich-editor .ce-delimiter {
          text-align: center;
          margin: 2rem 0;
        }
        
        .rich-editor .cdx-marker {
          background: #fef08a;
          padding: 0 0.25rem;
        }
        
        .rich-editor .ce-inline-code {
          background: #f3f4f6;
          color: #ef4444;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
      `}</style>
    </div>
  );
};

export default RichEditor;
