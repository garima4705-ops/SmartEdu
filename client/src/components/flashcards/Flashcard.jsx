import { useState } from 'react';
import { Star, RotateCw } from 'lucide-react';

const difficultyStyles = {
  easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  hard: 'bg-rose-50 text-rose-700 border-rose-200',
};

const dotStyles = {
  easy: 'bg-emerald-500',
  medium: 'bg-amber-500',
  hard: 'bg-rose-500',
};

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const difficulty = flashcard.difficulty || 'medium';

  const handleStarClick = (e) => {
    e.stopPropagation(); // so the card does not flip when you click the star
    onToggleStar(flashcard._id);
  };

  const faceStyle = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  };

  return (
    <div
      className="relative w-full h-72 sm:h-80 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of the card (Question) */}
        <div
          className="absolute inset-0 flex flex-col p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-white via-white to-emerald-50/70 border border-slate-200 shadow-lg shadow-slate-200/70"
          style={faceStyle}
        >
          {/* Thin green bar at the top */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />

          {/* Soft glows in the corners */}
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-emerald-100/60 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-16 w-48 h-48 rounded-full bg-teal-100/50 blur-2xl pointer-events-none" />

          {/* Big faint question mark in the background */}
          <span className="absolute right-5 bottom-8 text-[130px] leading-none font-serif font-bold text-emerald-100/80 select-none pointer-events-none">
            ?
          </span>

          {/* Top row: label + badge, and star */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700/70">
                Question
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded-full border ${difficultyStyles[difficulty]}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[difficulty]}`} />
                {difficulty}
              </span>
            </div>

            <button
              onClick={handleStarClick}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                flashcard.isStarred
                  ? 'bg-amber-50 text-amber-500 border-amber-200'
                  : 'bg-white/80 text-slate-400 border-slate-200 hover:text-amber-500 hover:bg-amber-50 hover:border-amber-200'
              }`}
              title="Star this card"
            >
              <Star
                size={18}
                strokeWidth={2}
                fill={flashcard.isStarred ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* The question */}
          <div className="relative z-10 flex-1 flex items-center justify-center overflow-y-auto py-4">
            <p className="text-center text-xl sm:text-2xl font-semibold text-slate-800 leading-snug">
              {flashcard.question}
            </p>
          </div>

          {/* Bottom hint */}
          <div className="relative z-10 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full">
              <RotateCw size={13} />
              Tap to reveal answer
            </span>
          </div>
        </div>

        {/* Back of the card (Answer) */}
        <div
          className="absolute inset-0 flex flex-col p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/20"
          style={{ ...faceStyle, transform: 'rotateY(180deg)' }}
        >
          <div className="flex justify-end">
            <button
              onClick={handleStarClick}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                flashcard.isStarred
                  ? 'bg-white/25 text-amber-200'
                  : 'bg-white/15 text-white/80 hover:bg-white/25'
              }`}
              title="Star this card"
            >
              <Star
                size={18}
                strokeWidth={2}
                fill={flashcard.isStarred ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-y-auto py-4">
            <p className="text-center text-lg font-medium leading-relaxed">
              {flashcard.answer}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-white/70">
            <RotateCw size={13} />
            Click to see question
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;