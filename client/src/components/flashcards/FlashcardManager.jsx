import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Plus,
  ArrowLeft,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import flashcardService from '../../services/flashcardService';
import aiService from '../../services/aiService';
import Spinner from '../common/Spinner';
import Flashcard from './Flashcard';

// Soft beige tones, one for each set card
const cardThemes = [
  { card: 'bg-[#f6efe3] border-[#e7dac2] hover:border-[#d4bf98]', icon: 'bg-[#ecdcc0] text-[#8a6a35]', badge: 'text-[#8a6a35] border-[#e1cfaa]' },
  { card: 'bg-[#f7ebe4] border-[#ebd5c8] hover:border-[#dcb9a5]', icon: 'bg-[#f0d9cb] text-[#9a6249]', badge: 'text-[#9a6249] border-[#e6cbbb]' },
  { card: 'bg-[#eef0e4] border-[#d9dec6] hover:border-[#bcc59f]', icon: 'bg-[#e0e6cc] text-[#5f7340]', badge: 'text-[#5f7340] border-[#d0d8b7]' },
  { card: 'bg-[#f1ece6] border-[#ddd3c8] hover:border-[#c4b5a4]', icon: 'bg-[#e6dccf] text-[#7a6a58]', badge: 'text-[#7a6a58] border-[#d8cbbb]' },
  { card: 'bg-[#f8efd8] border-[#ecdca8] hover:border-[#dcc680]', icon: 'bg-[#f1e2b3] text-[#8c6d1f]', badge: 'text-[#8c6d1f] border-[#e7d594]' },
  { card: 'bg-[#efe6dc] border-[#dccbb8] hover:border-[#c6ae94]', icon: 'bg-[#e3d3bf] text-[#7d5a3c]', badge: 'text-[#7d5a3c] border-[#d7c4ad]' },
];

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error('Failed to fetch flashcard sets.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId, { count: 10 });
      toast.success('Flashcards generated successfully!');
      await fetchFlashcardSets();
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to generate flashcards.');
    } finally {
      setGenerating(false);
    }
  };

  // ----- Open a set, move between cards -----
  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const handleNextCard = () => {
    if (currentCardIndex < selectedSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // ----- Star a card -----
  const handleToggleStar = async (cardId) => {
    try {
      // check if the card is starred right now, before we change it
      const card = selectedSet.cards.find((c) => c._id === cardId);
      const wasStarred = card?.isStarred;

      await flashcardService.toggleStar(cardId);

      const updateSet = (set) => ({
        ...set,
        cards: set.cards.map((c) =>
          c._id === cardId ? { ...c, isStarred: !c.isStarred } : c
        ),
      });

      setFlashcardSets((prev) =>
        prev.map((set) => (set._id === selectedSet._id ? updateSet(set) : set))
      );
      setSelectedSet((prev) => updateSet(prev));

      // the notification
      if (wasStarred) {
        toast('Star removed.');
      } else {
        toast.success('Flashcard reviewed!');
      }
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to star flashcard.');
    }
  };

  // ----- Delete a set -----
  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success('Flashcard set deleted successfully!');
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      await fetchFlashcardSets();
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to delete flashcard set.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSetToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString)
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      .toUpperCase();
  };

  // Number the sets in the order they were created (oldest = 1)
  const getSetNumber = (set) => {
    const sorted = [...flashcardSets].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    return sorted.findIndex((s) => s._id === set._id) + 1;
  };

  // 1. Loading
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  // 2. A set is selected: the flashcard viewer
  if (selectedSet) {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <button
          onClick={() => setSelectedSet(null)}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Sets
        </button>

        <div className="max-w-xl mx-auto">
          {/* key makes the card start on the question side every time */}
          <Flashcard
            key={currentCard._id || currentCardIndex}
            flashcard={currentCard}
            onToggleStar={handleToggleStar}
          />

          {/* Previous / counter / Next */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <span className="px-3 py-1 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
              {currentCardIndex + 1} / {selectedSet.cards.length}
            </span>

            <button
              onClick={handleNextCard}
              disabled={currentCardIndex === selectedSet.cards.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Empty state (no flashcards yet)
  if (flashcardSets.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center text-center px-6 py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
            <Brain className="text-emerald-600" size={30} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            Generate flashcards from your document to start learning and
            reinforce your knowledge.
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-md shadow-emerald-200 hover:bg-emerald-600 disabled:opacity-50"
          >
            <Sparkles size={16} strokeWidth={2} />
            {generating ? 'Generating...' : 'Generate Flashcards'}
          </button>
        </div>
      </div>
    );
  }

  // 4. List of flashcard sets
  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Your Flashcard Sets</h3>
            <p className="text-sm text-slate-500">
              {flashcardSets.length} {flashcardSets.length === 1 ? 'set' : 'sets'} available
            </p>
          </div>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-md shadow-emerald-200 hover:bg-emerald-600 disabled:opacity-50"
          >
            <Plus size={16} strokeWidth={2.5} />
            {generating ? 'Generating...' : 'Generate New Set'}
          </button>
        </div>

        {/* Set cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {flashcardSets.map((set, index) => {
            const theme = cardThemes[index % cardThemes.length];

            return (
              <div
                key={set._id}
                onClick={() => handleSelectSet(set)}
                className={`relative cursor-pointer p-5 rounded-2xl border-2 hover:shadow-lg hover:shadow-stone-200 transition-all ${theme.card}`}
              >
                <button
                  onClick={(e) => handleDeleteRequest(e, set)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-white/70 transition-colors"
                  title="Delete set"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${theme.icon}`}>
                  <Brain size={22} strokeWidth={2} />
                </div>
                <h4 className="font-semibold text-stone-900">
                  Flashcard Set {getSetNumber(set)}
                </h4>
                <p className="text-xs text-stone-500 tracking-wide mt-1 mb-4">
                  CREATED {formatDate(set.createdAt)}
                </p>
                <div className="pt-4 border-t border-black/5">
                  <span className={`inline-block px-3 py-1 bg-white/60 text-xs font-medium rounded-md border ${theme.badge}`}>
                    {set.cards.length} cards
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
              <h3 className="text-lg font-semibold text-slate-900">Delete Flashcard Set?</h3>
              <button
                onClick={handleCancelDelete}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this flashcard set? This action
              cannot be undone and all cards will be permanently removed.
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
                {deleting ? 'Deleting...' : 'Delete Set'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashcardManager;