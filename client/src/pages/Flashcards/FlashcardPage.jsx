import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

import flashcardService from '../../services/flashcardService';
import Spinner from '../../components/common/Spinner';
import Flashcard from '../../components/flashcards/Flashcard';

// ICONS: change an icon here and it changes everywhere on this page
const BackIcon = ArrowLeft;
const PrevIcon = ChevronLeft;
const NextIcon = ChevronRight;

const FlashcardPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [flashcardSet, setFlashcardSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewedIds = useRef(new Set());

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await flashcardService.getFlashcardsForDocument(documentId);
        // This page shows the first set of the document
        setFlashcardSet(response.data?.[0] || null);
      } catch (error) {
        toast.error(error.error || error.message || 'Failed to fetch flashcards.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [documentId]);

  // Count a card as reviewed the first time it is shown
  useEffect(() => {
    if (!flashcardSet) return;
    const card = flashcardSet.cards[currentIndex];
    if (!card || reviewedIds.current.has(card._id)) return;

    reviewedIds.current.add(card._id);
    flashcardService.reviewFlashcard(card._id).catch((error) => {
      // CHECK: the function name in flashcardService.js
      console.error(error);
    });
  }, [flashcardSet, currentIndex]);

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcardSet((prev) => ({
        ...prev,
        cards: prev.cards.map((c) =>
          c._id === cardId ? { ...c, isStarred: !c.isStarred } : c
        ),
      }));
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to star flashcard.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!flashcardSet || !flashcardSet.cards || flashcardSet.cards.length === 0) {
    return <div className="text-center p-8">No flashcards found for this document.</div>;
  }

  const cards = flashcardSet.cards;
  const currentCard = cards[currentIndex];
  const title = flashcardSet.documentId?.title || 'Flashcards';
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(`/documents/${documentId}`)}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
      >
        <BackIcon size={16} />
        Back to Document
      </button>

      <div className="bg-white rounded-3xl border border-[#ece6f6] shadow-xl shadow-[#e6dcf5]/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e6dcf5] to-[#d8ebf5] px-8 py-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">{title}</h2>
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>Card {currentIndex + 1} of {cards.length}</span>
          </div>
          <div className="w-full h-2 bg-white/60 rounded-full">
            <div
              className="h-2 bg-[#a994d6] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="px-8 py-8">
          {/* key makes each card start on the question side */}
          <Flashcard
            key={currentCard._id || currentIndex}
            flashcard={currentCard}
            onToggleStar={handleToggleStar}
          />

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-[#e6e0f0] rounded-xl hover:bg-[#faf8fd] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <PrevIcon size={16} />
              Previous
            </button>

            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              disabled={currentIndex === cards.length - 1}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-[#a994d6] rounded-xl hover:bg-[#9a84cc] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <NextIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;