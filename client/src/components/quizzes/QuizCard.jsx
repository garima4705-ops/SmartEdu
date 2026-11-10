import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Award, BarChart2, Play } from 'lucide-react';

const QuizCard = ({ quiz, onDelete }) => {
  const isCompleted = Boolean(quiz.completedAt);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString)
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      .toUpperCase();
  };

  return (
    <div className="relative bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-sm hover:shadow-lg hover:shadow-slate-200 transition-all">
      {/* Delete button */}
      <button
        onClick={() => onDelete(quiz)}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        title="Delete quiz"
      >
        <Trash2 size={16} strokeWidth={2} />
      </button>

      {/* Score badge */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-100">
        <Award size={13} />
        Score: {quiz.score ?? 0}
      </div>

      {/* Title and date */}
      <h4 className="font-semibold text-slate-900">
      {quiz.title ||
      (quiz.documentId?.title ? `${quiz.documentId.title} Quiz` : 'Untitled Quiz')}
      </h4>
      <p className="text-xs text-slate-500 tracking-wide mt-1 mb-4">
        CREATED {formatDate(quiz.createdAt)}
      </p>

      {/* Question count */}
      <div className="pt-4 border-t border-slate-100 mb-4">
        <span className="inline-block px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-md border border-slate-200">
          {quiz.totalQuestions ?? quiz.questions?.length ?? 0} Questions
        </span>
      </div>

      {/* Action button */}
      {isCompleted ? (
        <Link
          to={`/quiz/${quiz._id}/results`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-100 text-slate-800 text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          <BarChart2 size={16} />
          View Results
        </Link>
      ) : (
        <Link
          to={`/quiz/${quiz._id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium shadow-md shadow-emerald-200 hover:bg-emerald-600 transition-colors"
        >
          <Play size={16} />
          Start Quiz
        </Link>
      )}
    </div>
  );
};

export default QuizCard;