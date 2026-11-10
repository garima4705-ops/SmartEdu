import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

import quizService from '../../services/quizService'; // CHECK
import aiService from '../../services/aiService';
import Spinner from '../common/Spinner';
import QuizEmptyState from '../common/QuizEmptyState';
import QuizCard from './QuizCard';

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizService.getQuizzesForDocument(documentId); // CHECK
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to fetch quizzes.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await aiService.generateQuiz(documentId, { numQuestions }); // CHECK
      toast.success('Quiz generated successfully!');
      setIsGenerateModalOpen(false);
      await fetchQuizzes();
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to generate quiz.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz) => {
    setQuizToDelete(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;
    setDeleting(true);
    try {
      await quizService.deleteQuiz(quizToDelete._id); // CHECK
      toast.success('Quiz deleted successfully!');
      setIsDeleteModalOpen(false);
      setQuizToDelete(null);
      await fetchQuizzes();
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to delete quiz.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setQuizToDelete(null);
  };

  // 1. Loading
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {quizzes.length === 0 ? (
          // 2. Empty state
          <QuizEmptyState onActionClick={() => setIsGenerateModalOpen(true)} />
        ) : (
          // 3. List of quizzes
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsGenerateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-md shadow-emerald-200 hover:bg-emerald-600"
              >
                <Plus size={16} strokeWidth={2.5} />
                Generate Quiz
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Generate quiz popup */}
      {isGenerateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsGenerateModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Generate New Quiz</h3>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerateQuiz}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Number of Questions
              </label>
              <input
                type="number"
                value={numQuestions}
                onChange={(e) =>
                  setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))
                }
                min="1"
                required
                className="w-full px-3 py-2.5 mb-6 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  disabled={generating}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-lg shadow-md shadow-emerald-200 hover:bg-emerald-600 disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation popup */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Delete Quiz?</h3>
              <button
                onClick={handleCancelDelete}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg shadow-md shadow-red-200 hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizManager;