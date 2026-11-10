import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Lightbulb,
} from 'lucide-react';
import toast from 'react-hot-toast';

import quizService from '../../services/quizService';
import Spinner from '../../components/common/Spinner';

// ICONS: change an icon here and it changes everywhere on the page
const BackIcon = ArrowLeft;
const CorrectIcon = CheckCircle2;
const WrongIcon = XCircle;
const ScoreIcon = Trophy;
const ExplainIcon = Lightbulb;

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

const getMessage = (percentage) => {
  if (percentage >= 80) return 'Excellent work!';
  if (percentage >= 50) return 'Good effort, keep practicing!';
  return "Don't worry, try again and you will improve!";
};

const QuizResultPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId);
        setData(response.data);
      } catch (error) {
        toast.error(error.error || error.message || 'Failed to fetch results.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!data || !data.quiz || !data.results) {
    return <div className="text-center p-8">Results not found.</div>;
  }

  const { quiz, results } = data;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const wrongCount = results.filter((r) => r.selectedAnswer && !r.isCorrect).length;
  const skippedCount = results.filter((r) => !r.selectedAnswer).length;
  const percentage = quiz.score ?? 0;

  // Quiz name comes from the document name
  const quizTitle = quiz.document?.title
    ? `${quiz.document.title} Quiz`
    : quiz.title || 'Untitled Quiz';

  // Score ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  const handleBack = () => {
    const documentId = quiz.document?._id;
    if (documentId) {
      navigate(`/documents/${documentId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
      >
        <BackIcon size={16} />
        Back to Document
      </button>

      {/* Score card */}
      <div className="bg-white rounded-3xl border border-[#ece6f6] shadow-xl shadow-[#e6dcf5]/50 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-[#e6dcf5] to-[#d8ebf5] px-8 py-6">
          <div className="inline-flex items-center gap-2 text-sm font-medium bg-white/70 px-3 py-1 rounded-full text-slate-700 mb-2">
            <ScoreIcon size={15} className="text-[#8a73c2]" />
            Quiz Results
          </div>
          <h2 className="text-xl font-semibold text-slate-800">{quizTitle}</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 px-8 py-8">
          {/* Ring */}
          <div className="relative w-36 h-36 shrink-0">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke="#f0ecf7"
                strokeWidth="12"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke="#a994d6"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">
                {percentage}%
              </span>
              <span className="text-xs text-slate-500">score</span>
            </div>
          </div>

          {/* Summary */}
          <div className="flex-1 w-full">
            <p className="text-lg font-semibold text-slate-800 mb-4">
              {getMessage(percentage)}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[#d9f0e3] px-4 py-3 text-center">
                <p className="text-2xl font-bold text-[#3f7a5b]">{correctCount}</p>
                <p className="text-xs text-[#3f7a5b]">Correct</p>
              </div>
              <div className="rounded-2xl bg-[#fbdcdc] px-4 py-3 text-center">
                <p className="text-2xl font-bold text-[#a8514f]">{wrongCount}</p>
                <p className="text-xs text-[#a8514f]">Wrong</p>
              </div>
              <div className="rounded-2xl bg-[#f3f1f7] px-4 py-3 text-center">
                <p className="text-2xl font-bold text-slate-600">{skippedCount}</p>
                <p className="text-xs text-slate-600">Skipped</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question review */}
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Review your answers
      </h3>

      <div className="space-y-5">
        {results.map((item, index) => {
          const notAnswered = !item.selectedAnswer;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#ece6f6] shadow-sm p-6"
            >
              {/* Question header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h4 className="font-semibold text-slate-800 leading-snug">
                  <span className="text-[#8a73c2] mr-2">Q{index + 1}.</span>
                  {item.question}
                </h4>

                {item.isCorrect ? (
                  <span className="inline-flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full bg-[#d9f0e3] text-[#3f7a5b] text-xs font-medium">
                    <CorrectIcon size={14} />
                    Correct
                  </span>
                ) : notAnswered ? (
                  <span className="inline-flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full bg-[#f3f1f7] text-slate-600 text-xs font-medium">
                    Skipped
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full bg-[#fbdcdc] text-[#a8514f] text-xs font-medium">
                    <WrongIcon size={14} />
                    Wrong
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {item.options.map((option, optIndex) => {
                  const isCorrectOption = option === item.correctAnswer;
                  const isUserWrongPick =
                    option === item.selectedAnswer && !item.isCorrect;

                  let style = 'border-[#eeeaf5] bg-white text-slate-700';
                  if (isCorrectOption) {
                    style = 'border-[#a7dbbf] bg-[#eefaf3] text-slate-800';
                  } else if (isUserWrongPick) {
                    style = 'border-[#f2b8b8] bg-[#fef1f1] text-slate-800';
                  }

                  return (
                    <div
                      key={optIndex}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm ${style}`}
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/80 border border-black/5 text-xs font-semibold text-slate-600 shrink-0">
                        {optionLetters[optIndex]}
                      </span>
                      <span className="flex-1">{option}</span>
                      {isCorrectOption && (
                        <CorrectIcon size={18} className="text-[#3f7a5b] shrink-0" />
                      )}
                      {isUserWrongPick && (
                        <WrongIcon size={18} className="text-[#a8514f] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {item.explanation && (
                <div className="flex gap-3 rounded-xl bg-[#f4effb] px-4 py-3">
                  <ExplainIcon size={18} className="text-[#8a73c2] shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResultPage;