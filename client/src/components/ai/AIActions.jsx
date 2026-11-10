import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, BookOpen, Lightbulb } from 'lucide-react';

import aiService from '../../services/aiService';
import MarkdownRenderer from '../common/MarkdownRenderer';

const AIActions = () => {
  const { id: documentId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [concept, setConcept] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);

  const handleSummarize = async () => {
    setLoadingAction('summary');
    try {
      const res = await aiService.generateSummary(documentId);
      setModalTitle('Generated Summary');
      setModalContent(res.data.summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to generate summary.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplain = async () => {
    if (!concept.trim()) {
      toast.error('Please enter a concept to explain.');
      return;
    }
    setLoadingAction('explain');
    try {
      const res = await aiService.explainConcept(documentId, concept);
      setModalTitle(`Explanation of "${res.data.concept}"`);
      setModalContent(res.data.explanation);
      setIsModalOpen(true);
      setConcept('');
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to explain concept.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Sparkles className="text-white" size={22} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">AI Assistant</h3>
            <p className="text-sm text-slate-500">Powered by advanced AI</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Generate Summary */}
          <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center">
                    <BookOpen className="text-sky-600" size={18} strokeWidth={2} />
                  </div>
                  <h4 className="font-semibold text-slate-900">Generate Summary</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Get a concise summary of the entire document.
                </p>
              </div>
              <button
                onClick={handleSummarize}
                disabled={loadingAction === 'summary'}
                className="px-5 py-2.5 bg-teal-500 text-white text-sm font-medium rounded-lg shadow-md shadow-teal-200 hover:bg-teal-600 disabled:opacity-50"
              >
                {loadingAction === 'summary' ? 'Loading...' : 'Summarize'}
              </button>
            </div>
          </div>

          {/* Explain a Concept */}
          <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                <Lightbulb className="text-amber-600" size={18} strokeWidth={2} />
              </div>
              <h4 className="font-semibold text-slate-900">Explain a Concept</h4>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Enter a topic or concept from the document to get a detailed explanation.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g. React JSX"
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={handleExplain}
                disabled={loadingAction === 'explain' || !concept.trim()}
                className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-md shadow-emerald-200 hover:bg-emerald-600 disabled:opacity-50"
              >
                {loadingAction === 'explain' ? 'Loading...' : 'Explain'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result popup */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">{modalTitle}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <MarkdownRenderer content={modalContent} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIActions;