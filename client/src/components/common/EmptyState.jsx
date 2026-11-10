import React from 'react';
import { FileX } from 'lucide-react';

const EmptyState = ({
  title = 'No documents uploaded',
  message = 'Upload your first document to start learning with AI.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-5">
        <FileX size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">{message}</p>
    </div>
  );
};

export default EmptyState;