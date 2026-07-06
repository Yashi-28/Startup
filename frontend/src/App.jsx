import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EvaluationForm from './pages/EvaluationForm';
import ReportDetail from './pages/ReportDetail';
import MentorChat from './pages/MentorChat';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/evaluate-form" 
            element={
              <ProtectedRoute>
                <EvaluationForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report/:id" 
            element={
              <ProtectedRoute>
                <ReportDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentor-chat" 
            element={
              <ProtectedRoute>
                <MentorChat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
