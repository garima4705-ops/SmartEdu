import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

import flashcardService from '../../services/flashcardService';
import Spinner from '../../components/common/Spinner';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        // CHECK: the function name in flashcardService.js
        const response = await flashcardService.getAllFlashcardSets();
        setFlashcardSets(response.data || []);
      } catch (error) {
        toast.error(error.error || error.message || 'Failed to fetch flashcard sets.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        All Flashcard Sets
      </h1>

      {flashcardSets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ece6f6] p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#e6dcf5] flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-[#6d56a3]" size={26} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">
            No flashcard sets yet
          </h3>
          <p className="text-sm text-slate-500">
            Open a document and generate flashcards from its Flashcards tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {flashcardSets.map((set, index) => (
            <FlashcardSetCard key={set._id} set={set} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardsListPage;