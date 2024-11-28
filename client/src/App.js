import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './hooks/useAuth';
import theme from './theme';

// Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import KeywordResearch from './pages/KeywordResearch/KeywordResearch';
import ContentGenerator from './pages/ContentGenerator/ContentGenerator';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/keywords"
              element={
                <ProtectedRoute>
                  <Layout>
                    <KeywordResearch />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/content"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ContentGenerator />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
