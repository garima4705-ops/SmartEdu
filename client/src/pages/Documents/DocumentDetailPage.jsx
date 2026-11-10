import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

import documentService from '../../services/documentService';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import Tabs from '../../components/common/Tabs';
import ChatInterface from '../../components/chat/ChatInterface';
import AIActions from '../../components/ai/AIActions';
import FlashcardManager from '../../components/flashcards/FlashcardManager';
import QuizManager from '../../components/quizzes/QuizManager';

const DocumentDetailPage = () => {
  const { id } = useParams();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Content');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await documentService.getDocumentById(id);
        setDoc(response.data || response);
      } catch (error) {
        toast.error('Failed to fetch document details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // Content tab: the PDF viewer
  const renderContent = () => {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60">
          <h3 className="text-sm font-medium text-slate-900">Document Viewer</h3>
          <a
            href={doc.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ExternalLink size={16} strokeWidth={2} />
            Open in new tab
          </a>
        </div>

        <div className="p-4 bg-slate-50">
          <iframe
            src={doc.filePath}
            title={doc.title}
            className="w-full h-[70vh] rounded-xl border border-slate-200 bg-white"
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!doc) {
    return <div className="text-center p-8">Document not found.</div>;
  }

  const tabs = [
    { name: 'Content', label: 'Content', content: renderContent() },
    { name: 'Chat', label: 'Chat', content: <ChatInterface /> },
    { name: 'AI Actions', label: 'AI Actions', content: <AIActions /> },
    { name: 'Flashcards', label: 'Flashcards', content: <FlashcardManager documentId={id} /> },
    { name: 'Quizzes', label: 'Quizzes', content: <QuizManager documentId={id} /> },
  ];

  return (
    <div>
      {/* Back link */}
      <div className="mb-4">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>

      <PageHeader title={doc.title} />

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentDetailPage;