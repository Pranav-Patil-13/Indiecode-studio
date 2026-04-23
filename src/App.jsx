import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Timeline from './pages/Timeline';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import ProjectDetails from './pages/ProjectDetails';



import { Box, Snackbar, Alert, ThemeProvider, CssBaseline, CircularProgress } from '@mui/material';
import { AppProvider, useApp } from './context/AppContext';
import getTheme from './theme';
import AddProjectModal from './components/Modals/AddProjectModal';
import CommandPalette from './components/Modals/CommandPalette';
import NotificationDrawer from './components/Layout/NotificationDrawer';

import Auth from './pages/Auth';

function AppContent() {
  const location = useLocation();
  const { snackbar, closeNotification, themeMode, accentColor, user, loading } = useApp();
  
  const theme = getTheme(themeMode, accentColor);
  
  // Helper to get page title from route
  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Overview';
      case '/clients': return 'Client Portfolio';
      case '/projects': return 'Project Management';
      case '/timeline': return 'Development Timeline';
      case '/messages': return 'Client Communication';
      case '/settings': return 'System Settings';
      default: 
        if (path.startsWith('/projects/')) return 'Project Command Center';
        return 'IndieCode Studio';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Auth />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            ml: '280px', // Matches --sidebar-width
            width: 'calc(100% - 280px)',
            bgcolor: 'background.default',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Navbar title={getPageTitle(location.pathname)} />
          <Box sx={{ flexGrow: 1, p: { xs: 3, md: 5, lg: 6 }, maxWidth: 1600, mx: 'auto', width: '100%' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
            </Routes>
          </Box>
        </Box>

        {/* Global Components */}
        <AddProjectModal />
        <CommandPalette />
        <NotificationDrawer />
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={closeNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={closeNotification} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3, fontWeight: 600 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
