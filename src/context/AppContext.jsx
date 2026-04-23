import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Theme State
  const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') || 'light');
  const [accentColor, setAccentColor] = useState(localStorage.getItem('accentColor') || '#212529');

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData();
      } else {
        // Clear data on logout
        setClients([]);
        setProjects([]);
        setNotifications([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsRes, projectsRes, notificationsRes] = await Promise.all([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false })
      ]);

      if (clientsRes.error) throw clientsRes.error;
      if (projectsRes.error) throw projectsRes.error;
      if (notificationsRes.error) throw notificationsRes.error;

      setClients(clientsRes.data);
      setProjects(projectsRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      showNotification('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const toggleTheme = () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light');

  const openCommandPalette = () => setIsCommandPaletteOpen(true);
  const closeCommandPalette = () => setIsCommandPaletteOpen(false);
  
  const openNotificationDrawer = () => setIsNotificationDrawerOpen(true);
  const closeNotificationDrawer = () => setIsNotificationDrawerOpen(false);

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ unread: false })
        .eq('id', id);
      
      if (error) throw error;
      setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch (error) {
      showNotification('Failed to mark as read', 'error');
    }
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeNotification = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const addClient = async (newClient) => {
    try {
      const avatar = newClient.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...newClient, avatar, user_id: user.id }])
        .select();

      if (error) throw error;
      setClients([data[0], ...clients]);
      showNotification('Client added successfully!');
    } catch (error) {
      showNotification('Error adding client', 'error');
    }
  };

  const addProject = async (newProject) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...newProject, user_id: user.id }])
        .select();

      if (error) throw error;
      setProjects([data[0], ...projects]);
      
      // Update local client project count if needed or just re-fetch
      showNotification('Project created successfully!');
    } catch (error) {
      showNotification('Error creating project', 'error');
    }
  };

  const openAddProjectModal = () => setIsAddProjectModalOpen(true);
  const closeAddProjectModal = () => setIsAddProjectModalOpen(false);

  return (
    <AppContext.Provider value={{
      user,
      loading,
      clients,
      projects,
      addClient,
      addProject,
      snackbar,
      showNotification,
      closeNotification,
      isAddProjectModalOpen,
      openAddProjectModal,
      closeAddProjectModal,
      themeMode,
      toggleTheme,
      accentColor,
      setAccentColor,
      notifications,
      markAsRead,
      isCommandPaletteOpen,
      openCommandPalette,
      closeCommandPalette,
      isNotificationDrawerOpen,
      openNotificationDrawer,
      closeNotificationDrawer,
      fetchData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
