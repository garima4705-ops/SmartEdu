import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, BookOpen, BrainCircuit, Clock, Trash2 } from 'lucide-react';

// Turns 97485 into "95.2 KB"
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Turns a date into "9 hours ago"
const timeAgo = (dateString) => {
  if (!dateString) return '';
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  const units = [
    { label: 'day', size: 86400 },
    { label: 'hour', size: 3600 },
    { label: 'minute', size: 60 },
  ];
  for (const unit of units) {
    const count = Math.floor(seconds / unit.size);
    if (count >= 1) return `${count} ${unit.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // stops the card from opening when you click the trash icon
    onDelete(document);
  };

  return (
    <div
      onClick={() => navigate(`/documents/${document._id}`)}
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Delete button (shows when you hover over the card) */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label="Delete document"
      >
        <Trash2 size={16} strokeWidth={2} />
      </button>

      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white mb-4">
        <FileText size={20} strokeWidth={2} />
      </div>

      {/* Title and size */}
      <h3 className="text-sm font-semibold text-slate-900 truncate">
        {document.title}
      </h3>
      <p className="text-xs text-slate-500 mt-1">
        {formatFileSize(document.fileSize)}
      </p>

      {/* Flashcard and quiz badges (always shown, even at 0) */}
      <div className="flex items-center gap-2 mt-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-fuchsia-50 text-fuchsia-600 text-xs font-medium">
          <BookOpen size={12} strokeWidth={2.5} />
          {document.flashcardCount || 0} Flashcards
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium">
          <BrainCircuit size={12} strokeWidth={2.5} />
          {document.quizCount || 0} Quizzes
        </span>
      </div>

      {/* Upload time */}
      <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <Clock size={12} strokeWidth={2} />
        Uploaded {timeAgo(document.uploadDate || document.createdAt)}
      </div>
    </div>
  );
};

export default DocumentCard;