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

const APP_VERSION = '1.0.0'; // This should match the version in your native APK

function AppContent() {
  const location = useLocation();
  const { snackbar, showNotification, closeNotification, themeMode, accentColor, user, loading, clients } = useApp();
  
  const theme = getTheme(themeMode, accentColor);
  
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const setupUpdater = async () => {
      alert('OTA: checking if native...');
      if (Capacitor.isNativePlatform()) {
        alert('OTA: is native! starting...');
        try {
          console.log('OTA: Native platform detected');
          // Tell CapacitorUpdater the app loaded successfully
          await CapacitorUpdater.notifyAppReady();
          
          // Check for updates
          console.log('OTA: Fetching version.json...');
          const response = await fetch('https://studio.indiecode.in/version.json');
          if (!response.ok) throw new Error('Failed to fetch version.json');
          
          const data = await response.json();
          console.log('OTA: Server version:', data.version);
          
          const currentVersion = APP_VERSION;
          console.log('OTA: Current version:', currentVersion);
          
          if (data.version !== currentVersion) {
            console.log('OTA: Update found!');
            showNotification(`New update v${data.version} available!`, 'info');
            
            // alert(`OTA: Found v${data.version}. Downloading...`);
            
            const update = await CapacitorUpdater.download({
              url: data.url,
              version: data.version,
            });
            
            console.log('OTA: Download complete', update);
            showNotification('Update downloaded. Applying...', 'success');
            // alert('OTA: Downloaded. Reloading...');
            
            // Set the new version and reload
            await CapacitorUpdater.set(update);
          } else {
            console.log('OTA: Already on latest version');
          }
        } catch (error) {
          console.error('OTA: Error:', error);
          if (navigator.onLine) {
            showNotification(`Update Error: ${error.message}`, 'error');
          }
        }
      } else {
        alert('OTA: Not a native platform');
        console.log('OTA: Not a native platform, skipping update check');
      }
    };
    
    setupUpdater();
  }, []);

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
        return 'IndieCode Studio';
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
        {!isClient && (
          <Sidebar 
            mobileOpen={mobileOpen} 
            onDrawerToggle={handleDrawerToggle} 
          />
        )}
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
              p: { xs: 3, md: 5, lg: 6 }, 
              width: '100%',
              overflowY: 'auto',
              bgcolor: 'background.default'
            }}
          >
            <Routes>
              {isClient ? (
                <>
                  <Route path="/portal" element={<ClientPortal />} />
                  <Route path="*" element={<Navigate to="/portal" replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/timeline" element={<Timeline />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/portal" element={<ClientPortal />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
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
