import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  BrainCircuit,
  Clock,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import progressService from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';

// ICONS: change an icon here and it changes everywhere on this page
const DocsIcon = FileText;
const FlashcardsIcon = BookOpen;
const QuizIcon = BrainCircuit;
const ActivityIcon = Clock;
const BrandIcon = GraduationCap;
const GoIcon = ArrowRight;

// Drawn illustration: a child with a backpack, books and a little tree
const SchoolIllustration = () => (
  <svg viewBox="0 0 320 240" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* sun and clouds */}
    <circle cx="265" cy="48" r="22" fill="#fde9b8" />
    <ellipse cx="70" cy="46" rx="30" ry="12" fill="#ffffff" opacity="0.85" />
    <ellipse cx="92" cy="40" rx="22" ry="10" fill="#ffffff" opacity="0.85" />

    {/* ground */}
    <ellipse cx="160" cy="218" rx="150" ry="16" fill="#cdebd9" />

    {/* little tree */}
    <rect x="262" y="150" width="8" height="64" rx="3" fill="#c9a98a" />
    <circle cx="266" cy="140" r="30" fill="#a7dbbf" />
    <circle cx="248" cy="156" r="18" fill="#bfe7d1" />

    {/* stack of books */}
    <rect x="30" y="188" width="70" height="14" rx="3" fill="#a994d6" />
    <rect x="36" y="174" width="60" height="14" rx="3" fill="#f0a882" />
    <rect x="32" y="160" width="66" height="14" rx="3" fill="#7fb6d6" />
    <rect x="40" y="148" width="50" height="12" rx="3" fill="#f2b8b8" />

    {/* backpack */}
    <rect x="118" y="108" width="30" height="62" rx="12" fill="#a994d6" />
    <rect x="124" y="140" width="18" height="16" rx="4" fill="#8a73c2" />

    {/* legs */}
    <rect x="150" y="170" width="13" height="42" rx="6" fill="#4b4a68" />
    <rect x="170" y="170" width="13" height="42" rx="6" fill="#4b4a68" />
    <ellipse cx="156" cy="214" rx="12" ry="5" fill="#6d56a3" />
    <ellipse cx="177" cy="214" rx="12" ry="5" fill="#6d56a3" />

    {/* body */}
    <rect x="140" y="104" width="52" height="70" rx="18" fill="#f2b8b8" />

    {/* arm holding a book */}
    <rect x="186" y="124" width="36" height="12" rx="6" fill="#f2b8b8" />
    <rect x="212" y="112" width="30" height="38" rx="4" fill="#7fb6d6" />
    <rect x="216" y="116" width="22" height="30" rx="2" fill="#d8ebf5" />

    {/* head */}
    <circle cx="166" cy="82" r="24" fill="#fbdcc4" />
    {/* hair */}
    <path d="M142 80 Q146 52 168 54 Q190 54 190 80 Q178 66 160 68 Q148 70 142 80 Z" fill="#6b4f6f" />
    {/* face */}
    <circle cx="158" cy="86" r="2.5" fill="#4b4a68" />
    <circle cx="175" cy="86" r="2.5" fill="#4b4a68" />
    <path d="M160 95 Q166 100 173 95" stroke="#4b4a68" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="153" cy="93" r="4" fill="#f5a9a9" opacity="0.6" />
    <circle cx="180" cy="93" r="4" fill="#f5a9a9" opacity="0.6" />
  </svg>
);

const DashboardPage = () => {
  const { user } = useAuth(); // CHECK: your AuthContext gives "user"
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await progressService.getDashboardData();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">No dashboard data available.</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments,
      icon: DocsIcon,
      card: 'bg-[#eef6fb] border-[#d8ebf5]',
      iconStyle: 'bg-[#d8ebf5] text-[#3c6f8f]',
    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards,
      icon: FlashcardsIcon,
      card: 'bg-[#f4effb] border-[#e6dcf5]',
      iconStyle: 'bg-[#e6dcf5] text-[#6d56a3]',
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes,
      icon: QuizIcon,
      card: 'bg-[#eefaf3] border-[#cdebd9]',
      iconStyle: 'bg-[#d9f0e3] text-[#3f7a5b]',
    },
  ];

  // Combine documents and quizzes into one list, newest first
  const recentDocuments = dashboardData.recentActivity?.documents || [];
  const recentQuizzes = dashboardData.recentActivity?.quizzes || [];

  const activities = [
    ...recentDocuments.map((doc) => ({
      id: doc._id,
      label: `Accessed Document: ${doc.title}`,
      timestamp: doc.lastAccessed,
      link: `/documents/${doc._id}`,
    })),
    ...recentQuizzes.map((quiz) => ({
      id: quiz._id,
      label: `Attempted Quiz: ${quiz.title || quiz.documentId?.title || 'Quiz'}`,
      timestamp: quiz.completedAt || quiz.createdAt,
      link: `/quiz/${quiz._id}`,
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div>
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#e6dcf5] via-[#e3e6f7] to-[#d8ebf5] border border-[#ece6f6] shadow-xl shadow-[#e6dcf5]/50 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 px-8 py-8 md:py-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-sm font-medium text-[#6d56a3] mb-4">
              <BrandIcon size={16} />
              SmartEdu
            </div>

            <h1 className="text-3xl font-semibold text-slate-800 leading-tight mb-2">
              {user?.username ? `Welcome back, ${user.username}!` : 'Welcome back!'}
            </h1>

            <p className="text-slate-600 max-w-md mb-6">
              Your AI-powered personal library. Learn smarter, one page at a time.
            </p>

            <Link
              to="/documents"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#a994d6] rounded-xl shadow-md shadow-[#d9cdf0] hover:bg-[#9a84cc] transition-colors"
            >
              Open my library
              <GoIcon size={16} />
            </Link>
          </div>

          <div className="w-full md:w-80 h-56 md:h-64 px-6 md:px-0 md:pr-6">
            <SchoolIllustration />
          </div>
        </div>
      </div>

      {/* Section title */}
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Your learning progress
      </h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, card, iconStyle }) => (
          <div
            key={label}
            className={`rounded-2xl border-2 p-6 transition-all hover:shadow-lg hover:shadow-slate-200 ${card}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-4xl font-semibold text-slate-800 mt-3">
                  {value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconStyle}`}
              >
                <Icon size={22} strokeWidth={2} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-3xl border border-[#ece6f6] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#f4effb] flex items-center justify-center text-[#6d56a3]">
            <ActivityIcon size={20} strokeWidth={2} />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
        </div>

        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-center justify-between p-4 rounded-2xl border border-[#eeeaf5] bg-[#fbfaff] hover:bg-[#f4effb] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#a994d6] mt-1.5"></span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {activity.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activity.timestamp
                        ? new Date(activity.timestamp).toLocaleString()
                        : 'No date'}
                    </p>
                  </div>
                </div>
                <Link
                  to={activity.link}
                  className="text-sm font-semibold text-[#6d56a3] hover:text-[#523f85]"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No recent activity yet. Upload a document to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;