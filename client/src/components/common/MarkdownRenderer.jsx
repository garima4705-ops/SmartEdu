import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="text-sm text-slate-800 leading-relaxed">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
          h1: ({ children }) => (
            <h1 className="text-lg font-semibold text-slate-900 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-slate-900 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-slate-900 mb-2">{children}</h3>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 underline"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-slate-100 text-xs font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="p-3 mb-3 rounded-xl bg-slate-100 overflow-x-auto text-xs [&_code]:bg-transparent [&_code]:p-0">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
