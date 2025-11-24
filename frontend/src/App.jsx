import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import ProjectWizard from './pages/ProjectWizard';
import Editor from './pages/Editor';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public route for login */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Private routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/create" element={<PrivateRoute><ProjectWizard /></PrivateRoute>} />
            <Route path="/editor/:id" element={<PrivateRoute><Editor /></PrivateRoute>} />

            {/* Redirect any unmatched routes to dashboard if authenticated, otherwise to login */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
