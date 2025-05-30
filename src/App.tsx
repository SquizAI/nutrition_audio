import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { ToastProvider } from './components/shared/Toast';
import { MealPlanProvider } from './services/mealPlanContext';
import Layout from './components/Layout';

// Import all pages
import Dashboard from './pages/Dashboard';
import MealPlanner from './pages/MealPlanner';
import Progress from './pages/Progress';
import Community from './pages/Community';
import Insights from './pages/Insights';
import MusicMood from './pages/MusicMood';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';

// Layout wrapper component
const LayoutWrapper: React.FC = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App: React.FC = () => {
  // Reactive state for onboarding completion
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(
    localStorage.getItem('onboardingCompleted') === 'true'
  );

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsOnboardingCompleted(localStorage.getItem('onboardingCompleted') === 'true');
    };

    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (from same tab)
    window.addEventListener('onboardingCompleted', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('onboardingCompleted', handleStorageChange);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <MealPlanProvider>
          <Router>
            <Routes>
              {/* Onboarding route without Layout */}
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Protected routes with Layout */}
              <Route element={
                isOnboardingCompleted ? <LayoutWrapper /> : <Navigate to="/onboarding" replace />
              }>
                {/* Main routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/meal-planner" element={<MealPlanner />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/community" element={<Community />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/music-mood" element={<MusicMood />} />

                {/* Profile routes */}
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Redirect to onboarding if not completed */}
              <Route path="*" element={
                isOnboardingCompleted ? <Navigate to="/" /> : <Navigate to="/onboarding" />
              } />
            </Routes>
          </Router>
        </MealPlanProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;