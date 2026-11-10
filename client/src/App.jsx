import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DocumentListPage from "./pages/Documents/DocumentListPage";
import DocumentDetailPage from "./pages/Documents/DocumentDetailPage";
import FlashcardsListPage from "./pages/Flashcards/FlashcardsListPage";
import FlashcardPage from "./pages/Flashcards/FlashcardPage";
import QuizTakePage from "./pages/Quizzes/QuizTakePage";
import QuizResultPage from "./pages/Quizzes/QuizResultPage";
import ProfilePage from "./pages/Profile/ProfilePage";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />}
        />

        {/* Protected routes — nested under ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/flashcards/:documentId" element={<FlashcardPage />} />
          <Route path="/quiz/:quizId" element={<QuizTakePage />} />
          <Route path="/quiz/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Default and fallback */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;