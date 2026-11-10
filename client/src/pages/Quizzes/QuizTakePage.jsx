import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

import quizService from '../../services/quizService';
import Spinner from '../../components/common/Spinner';

// ICONS: change an icon here and it changes everywhere on the page
const BackIcon = ArrowLeft;
const PrevIcon = ChevronLeft;
const NextIcon = ChevronRight;
const SelectedIcon = Check;
const SubmitIcon = Send;
const HeaderIcon = Sparkles;

// One soft color for each option letter (A, B, C, D)
const optionThemes = [
  { badge: 'bg-[#d9f0e3] text-[#3f7a5b]' }, // mint
  { badge: 'bg-[#fde3d6] text-[#a8603c]' }, // peach
  { badge: 'bg-[#d8ebf5] text-[#3c6f8f]' }, // sky
  { badge: 'bg-[#e6dcf5] text-[#6d56a3]' }, // lilac
];
const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        toast.error(error.error || error.message || 'Failed to fetch quiz.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleSelectOption = (option) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // CHECK: the backend may expect a different answer format
      const answers = Object.entries(selectedAnswers).map(
        ([questionIndex, selectedAnswer]) => ({
          questionIndex: Number(questionIndex),
          selectedAnswer,
        })
      );

      await quizService.submitQuiz(quizId, answers);
      toast.success('Quiz submitted successfully!');
      navigate(`/quiz/${quizId}/results`);
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div className="text-center p-8">Quiz not found.</div>;
  }

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
      >
        <BackIcon size={16} />
        Back
      </button>

      <div className="bg-white rounded-3xl border border-[#ece6f6] shadow-xl shadow-[#e6dcf5]/50 overflow-hidden">
        {/* Header: lavender to sky */}
        <div className="bg-gradient-to-r from-[#e6dcf5] to-[#d8ebf5] px-8 py-6 text-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-2 text-sm font-medium bg-white/70 px-3 py-1 rounded-full">
              <HeaderIcon size={15} className="text-[#8a73c2]" />
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm font-medium">
              {answeredCount} / {totalQuestions} answered
            </span>
          </div>
          <div className="w-full h-2 bg-white/60 rounded-full">
            <div
              className="h-2 bg-[#a994d6] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="px-8 py-8">
          {/* Question */}
          <h3 className="text-xl font-semibold text-slate-800 leading-snug mb-6">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentIndex] === option;
              const theme = optionThemes[index % optionThemes.length];

              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full flex items-center gap-4 text-left px-4 py-3.5 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-[#b9a7e0] bg-[#f4effb] shadow-md shadow-[#e6dcf5]'
                      : 'border-[#eeeaf5] bg-white hover:border-[#d6cbee] hover:bg-[#faf8fd]'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-semibold shrink-0 ${
                      isSelected ? 'bg-[#a994d6] text-white' : theme.badge
                    }`}
                  >
                    {isSelected ? (
                      <SelectedIcon size={18} />
                    ) : (
                      optionLetters[index]
                    )}
                  </span>
                  <span
                    className={`text-sm md:text-base ${
                      isSelected ? 'text-slate-900 font-medium' : 'text-slate-700'
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Question dots */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {quiz.questions.map((_, index) => {
              const isCurrent = index === currentIndex;
              const isAnswered = selectedAnswers[index] !== undefined;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  title={`Go to question ${index + 1}`}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                    isCurrent
                      ? 'bg-[#a994d6] text-white ring-4 ring-[#e6dcf5]'
                      : isAnswered
                      ? 'bg-[#cdebd9] text-[#3f7a5b]'
                      : 'bg-[#f3f1f7] text-slate-500 hover:bg-[#e9e5f1]'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Previous / Next or Submit */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-[#e6e0f0] rounded-xl hover:bg-[#faf8fd] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <PrevIcon size={16} />
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-[#2f6b4d] bg-[#bfe7d1] rounded-xl shadow-md shadow-[#d9f0e3] hover:bg-[#add fc5] hover:bg-[#aee0c4] disabled:opacity-50 transition-colors"
              >
                <SubmitIcon size={16} />
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-[#a994d6] rounded-xl hover:bg-[#9a84cc] transition-colors"
              >
                Next
                <NextIcon size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTakePage;