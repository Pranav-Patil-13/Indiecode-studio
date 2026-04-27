import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Timeline from './pages/Timeline';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import ProjectDetails from './pages/ProjectDetails';
import Billing from './pages/Billing';
import ClientPortal from './pages/ClientPortal';



import { Box, Snackbar, Alert, ThemeProvider, CssBaseline, CircularProgress } from '@mui/material';
import { AppProvider, useApp } from './context/AppContext';
import getTheme from './theme';
import AddProjectModal from './components/Modals/AddProjectModal';
import CommandPalette from './components/Modals/CommandPalette';
import NotificationDrawer from './components/Layout/NotificationDrawer';

import Auth from './pages/Auth';
import { initializePushNotifications } from './utils/pushNotifications';

const APP_VERSION = '1.2.3';

function AppContent() {
  const location = useLocation();
  const { snackbar, showNotification, closeNotification, themeMode, accentColor, user, loading, clients } = useApp();
  
  const theme = getTheme(themeMode, accentColor);
  
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // OTA Update check — notifyAppReady() is called in main.jsx immediately on load
  React.useEffect(() => {
    const checkForUpdates = async () => {
      if (!Capacitor.isNativePlatform()) return;

      try {
        const response = await fetch(`https://studio.indiecode.in/version.json?t=${Date.now()}`);
        if (!response.ok) return;
        
        const data = await response.json();
        console.log('OTA: Server version:', data.version, '| App version:', APP_VERSION);
        
        if (data.version !== APP_VERSION) {
          showNotification(`Updating to v${data.version}...`, 'info');
          
          const update = await CapacitorUpdater.download({
            url: data.url,
            version: data.version,
          });
          
          console.log('OTA: Download complete, applying...');
          await CapacitorUpdater.set(update);
        }
      } catch (error) {
        console.error('OTA update check failed:', error);
      }
    };
    
    checkForUpdates();
  }, []);

  React.useEffect(() => {
    if (user && Capacitor.isNativePlatform()) {
      console.log('Initializing push notifications for user:', user.id);
      initializePushNotifications(user);
    }
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const role = user?.user_metadata?.role || 'admin';
  const isClient = role === 'client';
  
  // Helper to get page title from route
  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Overview';
      case '/clients': return 'Client Portfolio';
      case '/projects': return 'Project Management';
      case '/timeline': return 'Development Timeline';
      case '/messages': return 'Client Communication';
      case '/settings': return 'System Settings';
      case '/billing': return 'Financial Hub';
      case '/portal': return 'Client Portal';
      default: 
        if (path.startsWith('/projects/')) return 'Project Command Center';
        return 'IndieCode Studio v1.2.3';
    }
  };

  // Only show the full-screen loader on the absolute first mount when we have no user and no data
  const isInitialBoot = loading && !user && clients.length === 0;
  
  if (isInitialBoot) {
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
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar 
          mobileOpen={mobileOpen} 
          onDrawerToggle={handleDrawerToggle} 
        />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <Navbar 
            title={getPageTitle(location.pathname)} 
            onDrawerToggle={handleDrawerToggle}
          />
          <Box 
            sx={{ 
              flexGrow: 1, 
              p: { xs: 2, sm: 3, md: 4, lg: 5 }, 
              width: '100%',
              overflowY: 'auto',
              bgcolor: 'background.default'
            }}
          >
            <Routes>
              {/* Common Routes for both Admin and Client */}
              <Route path="/" element={isClient ? <Dashboard isClient /> : <Dashboard />} />
              <Route path="/clients" element={isClient ? <Clients isClient /> : <Clients />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/messages" element={<Messages isClientPortal={isClient} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/billing" element={isClient ? <Billing isClient /> : <Billing />} />
              <Route path="/projects/:id" element={<ProjectDetails isClient={isClient} />} />
              
              {/* Redirect any legacy portal links or unknowns */}
              <Route path="/portal" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
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
          <Alert onClose={closeNotification} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3, fontWeight: 500 }}>
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
