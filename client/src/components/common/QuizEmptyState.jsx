import React from "react";
import { ClipboardList, Plus } from "lucide-react";

const QuizEmptyState = ({ onActionClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8 text-emerald-500" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-1">
        No quizzes yet
      </h3>

      <p className="text-sm text-slate-500 mb-6 max-w-xs">
        Generate a quiz from this document to test what you have learned.
      </p>

      <button
        type="button"
        onClick={onActionClick}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600"
      >
        <Plus className="w-4 h-4" />
        Generate Quiz
      </button>
    </div>
  );
};

export default QuizEmptyState;