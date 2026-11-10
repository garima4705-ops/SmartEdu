import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import aiService from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';
import MarkdownRenderer from '../common/MarkdownRenderer';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const userInitial = user?.username?.[0]?.toUpperCase() || 'U';

  // Load old messages when the tab opens (or the document changes)
  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      setInitialLoading(true);
      setMessages([]);
      try {
        const response = await aiService.getChatHistory(documentId);
        const list = Array.isArray(response.data)
          ? response.data
          : response.data?.messages || [];

        if (!cancelled) {
          setMessages(
            list.map((m) => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [documentId]);

  // Scroll down when a new message arrives
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async (e) => {
    e.preventDefault();

    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setSending(true);

    try {
      const response = await aiService.chat(documentId, text);
      const data = response?.data || response;
      const answer =
        data?.answer ||
        data?.response ||
        data?.message ||
        (typeof data === 'string' ? data : '');

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer || 'No response received.' },
      ]);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to get a response.'));
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setSending(false);
      // input is disabled while sending, so refocus after it re-enables
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[65vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 && !sending && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
              <Sparkles size={26} strokeWidth={2} />
            </div>
            <h3 className="text-base font-medium text-slate-900">
              Ask anything about this document
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              The AI will answer using the content of your PDF.
            </p>
          </div>
        )}

        {messages.map((msg, index) =>
          msg.role === 'user' ? (
            <div key={index} className="flex items-start justify-end gap-3">
              <div className="max-w-[70%] px-4 py-3 rounded-2xl rounded-tr-md bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-sm whitespace-pre-wrap break-words">
                {msg.content}
              </div>
              <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center">
                {userInitial}
              </div>
            </div>
          ) : (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center">
                <Sparkles size={16} strokeWidth={2} />
              </div>
              <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-slate-200/60 shadow-sm break-words">
                <MarkdownRenderer content={msg.content} />
              </div>
            </div>
          )
        )}

        {/* "Thinking" bubble while waiting for the AI */}
        {sending && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center">
              <Sparkles size={16} strokeWidth={2} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-slate-200/60 shadow-sm text-sm text-slate-500">
              Thinking...
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 p-4 border-t border-slate-200/60 bg-white"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow up question..."
          disabled={sending}
          className="flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-sm text-slate-900 focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors duration-200 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send size={18} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;