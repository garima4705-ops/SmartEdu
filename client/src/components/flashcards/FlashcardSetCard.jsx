import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, Sparkles, Trash2 } from 'lucide-react';

// ICONS: change an icon here and it changes everywhere on this card
const SetIcon = BookOpen;
const ProgressIcon = TrendingUp;
const StudyIcon = Sparkles;
const DeleteIcon = Trash2;

// Soft pastel themes, one for each card
const themes = [
  { card: 'bg-[#f4effb] border-[#e6dcf5]', icon: 'bg-[#e6dcf5] text-[#6d56a3]', bar: 'bg-[#a994d6]' },
  { card: 'bg-[#eefaf3] border-[#cdebd9]', icon: 'bg-[#d9f0e3] text-[#3f7a5b]', bar: 'bg-[#7cc6a0]' },
  { card: 'bg-[#fff4ec] border-[#fde3d6]', icon: 'bg-[#fde3d6] text-[#a8603c]', bar: 'bg-[#f0a882]' },
  { card: 'bg-[#eef6fb] border-[#d8ebf5]', icon: 'bg-[#d8ebf5] text-[#3c6f8f]', bar: 'bg-[#7fb6d6]' },
];

const timeAgo = (dateString) => {
  if (!dateString) return '';
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'JUST NOW';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} MINUTE${minutes === 1 ? '' : 'S'} AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} HOUR${hours === 1 ? '' : 'S'} AGO`;
  const days = Math.floor(hours / 24);
  return `${days} DAY${days === 1 ? '' : 'S'} AGO`;
};

const FlashcardSetCard = ({ set, index = 0, onDelete }) => {
  const navigate = useNavigate();
  const theme = themes[index % themes.length];

  // documentId may be a populated object or a plain id
  const documentId = set.documentId?._id || set.documentId;
  const title = set.documentId?.title || 'Flashcard Set';

  const totalCards = set.cards?.length || 0;
  // CHECK: how your cards store "reviewed" (lastReviewed or reviewCount)
  const reviewedCount =
    set.cards?.filter((c) => c.lastReviewed || c.reviewCount > 0).length || 0;
  const percentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div
      className={`relative rounded-2xl border-2 p-5 transition-all hover:shadow-lg hover:shadow-slate-200 ${theme.card}`}
    >
      {onDelete && (
        <button
          onClick={() => onDelete(set)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white/70 transition-colors"
          title="Delete set"
        >
          <DeleteIcon size={16} />
        </button>
      )}

      <div className="flex items-center gap-3 mb-5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${theme.icon}`}>
          <SetIcon size={20} />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-800 truncate">{title}</h4>
          <p className="text-xs text-slate-500 tracking-wide">
            CREATED {timeAgo(set.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-white/70 text-xs font-medium text-slate-600 rounded-lg border border-black/5">
          {totalCards} Cards
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/70 text-xs font-medium text-slate-600 rounded-lg border border-black/5">
          <ProgressIcon size={12} />
          {percentage}%
        </span>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Progress</span>
          <span>{reviewedCount}/{totalCards} reviewed</span>
        </div>
        <div className="w-full h-2 bg-white/80 rounded-full">
          <div
            className={`h-2 rounded-full transition-all ${theme.bar}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`/flashcards/${documentId}`)}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-sm font-semibold text-slate-700 border border-black/5 shadow-sm hover:bg-slate-50 transition-colors"
      >
        <StudyIcon size={16} />
        Study Now
      </button>
    </div>
  );
};

export default FlashcardSetCard;