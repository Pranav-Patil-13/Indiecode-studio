import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [editProjectData, setEditProjectData] = useState(null);
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
    // Only show global loading screen if we don't have any data yet
    const isInitial = clients.length === 0 && projects.length === 0;
    if (isInitial) setLoading(true);

    try {
      const fetchTable = async (table, select = '*') => {
        try {
          const { data, error } = await supabase.from(table).select(select).order('created_at', { ascending: table === 'messages' ? true : false });
          if (error) return [];
          return data;
        } catch (e) {
          return [];
        }
      };

      const clientsRaw = await fetchTable('clients');
      const role = user?.user_metadata?.role || 'admin';
      
      let clientsData = clientsRaw;
      let targetClientId = null;
      
      if (role === 'client') {
        // Match client by email (case insensitive)
        const clientRecord = clientsRaw.find(c => c.email?.toLowerCase() === user?.email?.toLowerCase());
        if (clientRecord) {
           targetClientId = clientRecord.id;
           clientsData = [clientRecord];
        } else {
           // Fallback to first client for demo purposes if not matched
           if (clientsRaw.length > 0) {
             targetClientId = clientsRaw[0].id;
             clientsData = [clientsRaw[0]];
           } else {
             clientsData = [];
           }
        }
      }

      const fetchFiltered = async (table) => {
         let query = supabase.from(table).select('*').order('created_at', { ascending: table === 'messages' ? true : false });
         if (role === 'client' && targetClientId) {
             if (['projects', 'invoices', 'messages'].includes(table)) {
                 query = query.eq('client_id', targetClientId);
             } else if (table === 'notifications') {
                 query = query.eq('user_id', user.id);
             }
         }
         try {
           const { data, error } = await query;
           return error ? [] : data;
         } catch {
           return [];
         }
      };

      const [projectsData, notificationsData, invoicesData, expensesData, messagesData] = await Promise.all([
        fetchFiltered('projects'),
        fetchFiltered('notifications'),
        fetchFiltered('invoices'),
        fetchFiltered('expenses'),
        fetchFiltered('messages')
      ]);

      let finalExpenses = expensesData || [];
      if (role === 'client' && projectsData) {
         const projectIds = projectsData.map(p => p.id);
         finalExpenses = finalExpenses.filter(e => projectIds.includes(e.project_id));
      }

      setClients(clientsData || []);
      setProjects(projectsData || []);
      setNotifications(notificationsData || []);
      setInvoices(invoicesData || []);
      setExpenses(finalExpenses);
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error in fetchData:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const createLocalNotification = async (title, message, type = 'info') => {
    try {
      const newNotification = {
        title,
        message,
        type,
        unread: true,
        user_id: user.id,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('notifications')
        .insert([newNotification])
        .select();
      
      if (!error && data) {
        setNotifications(prev => [data[0], ...prev]);
      } else {
        // Fallback for local state
        setNotifications(prev => [{ ...newNotification, id: Date.now() }, ...prev]);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    // Check for overdue invoices every time user logs in or data is fetched
    const checkOverdueInvoices = () => {
      const today = new Date();
      invoices.forEach(inv => {
        if (inv.status !== 'Paid' && inv.due_date) {
          const dueDate = new Date(inv.due_date);
          const diffDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
          if (diffDays >= 3) {
            showNotification(`Invoice #${inv.invoice_number} is OVERDUE by ${diffDays} days!`, 'error');
          }
        }
      });
    };
    checkOverdueInvoices();

    checkOverdueInvoices();
  }, [user]); 

  // Realtime Subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`studio-realtime-${Math.random().toString(36).substring(7)}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
        
        if (payload.new.sender_role === 'client') {
          showNotification(`New message from ${payload.new.sender_name || 'Client'}`, 'info');
          createLocalNotification('New Message', `${payload.new.sender_name || 'Client'} sent you a message regarding ${payload.new.project_id ? 'their project' : 'a inquiry'}.`, 'message');
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, payload => {
        const oldProject = projects.find(p => p.id === payload.new.id);
        setProjects(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
        
        if (payload.new.phases && oldProject) {
          const approvedPhase = payload.new.phases.find((p, idx) => 
            p.approvalStatus === 'Approved' && 
            (!oldProject.phases[idx] || oldProject.phases[idx].approvalStatus !== 'Approved')
          );
          
          if (approvedPhase) {
            showNotification(`Milestone Approved: ${approvedPhase.name}`, 'success');
            createLocalNotification('Milestone Approved', `Client approved the "${approvedPhase.name}" milestone for ${payload.new.name}.`, 'milestone');
          }
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'invoices' }, payload => {
        setInvoices(prev => {
          if (prev.find(i => i.id === payload.new.id)) return prev;
          return [payload.new, ...prev];
        });
        showNotification(`New Invoice Generated: #${payload.new.invoice_number}`, 'success');
      });

    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, projects]); // Added projects to closure if needed

  // Secondary effect to run overdue checks when invoices change, without re-fetching
  useEffect(() => {
    if (!user || invoices.length === 0) return;
    
    const checkOverdueInvoices = () => {
      const today = new Date();
      invoices.forEach(inv => {
        if (inv.status !== 'Paid' && inv.due_date) {
          const dueDate = new Date(inv.due_date);
          const diffDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
          if (diffDays >= 3) {
            showNotification(`Invoice #${inv.invoice_number} is OVERDUE by ${diffDays} days!`, 'error');
          }
        }
      });
    };
    checkOverdueInvoices();
  }, [invoices.length]);

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

  // ==================== API: Clients ==================== //
  const addClient = async (newClient) => {
    try {
      // Create Client Login in Auth if password is provided
      if (newClient.password) {
        const tempSupabase = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY,
          { auth: { persistSession: false, autoRefreshToken: false } }
        );
        const { error: authError } = await tempSupabase.auth.signUp({
          email: newClient.email,
          password: newClient.password,
          options: {
            data: { role: 'client', full_name: newClient.contact }
          }
        });
        if (authError) throw new Error("Failed to create client login: " + authError.message);
      }

      // Prepare client data for database
      const clientData = { ...newClient };
      delete clientData.password;
      delete clientData.payments; // handle payments separately
      
      const avatar = newClient.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...clientData, avatar, user_id: user.id, payments: newClient.payments || [] }])
        .select();

      if (error) throw error;
      setClients([data[0], ...clients]);
      showNotification('Client added successfully!');
    } catch (error) {
      showNotification('Error adding client', 'error');
    }
  };

  const updateClient = async (id, updatedClient) => {
    try {
      // Attempt to update password if provided
      if (updatedClient.password) {
        // Note: Updating password for another user via anon key is restricted by Supabase.
        // For a full production app, this requires an Edge Function with Service Role key.
        // We will log a warning. For now, the user must use the 'Forgot Password' flow to reset.
        console.warn("Updating another user's password requires Service Role. Please implement backend.");
        showNotification("Password update requires backend integration.", "warning");
      }

      const payload = { ...updatedClient };
      delete payload.password;

      // Recompute avatar if name changed
      if (payload.name) {
        payload.avatar = payload.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      }

      const { data, error } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', id)
        .select();

      if (error) throw error;
      setClients(clients.map(c => c.id === id ? data[0] : c));
      showNotification('Client updated successfully!');
    } catch (error) {
      showNotification('Error updating client', 'error');
    }
  };

  const deleteClient = async (id) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClients(clients.filter(c => c.id !== id));
      showNotification('Client deleted successfully!');
    } catch (error) {
      showNotification('Error deleting client (They might have active projects)', 'error');
    }
  };

  const addPayment = async (clientId, payment) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;

      const currentPayments = client.payments || [];
      const updatedPayments = [...currentPayments, {
        ...payment,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }];

      const { data, error } = await supabase
        .from('clients')
        .update({ payments: updatedPayments })
        .eq('id', clientId)
        .select();

      if (error) throw error;
      setClients(clients.map(c => c.id === clientId ? data[0] : c));
      showNotification('Payment recorded successfully!');
    } catch (error) {
      console.error('Error adding payment:', error);
      showNotification('Error recording payment', 'error');
    }
  };

  const calculateProgress = (phases) => {
    if (!phases || phases.length === 0) return 0;
    const completedCount = phases.filter(p => p.status === 'completed' || p.status === 'Done').length;
    // Calculate based on number of phases: (completed / total) * 100
    return Math.round((completedCount / phases.length) * 100);
  };

  const addProject = async (newProject) => {
    try {
      const progress = calculateProgress(newProject.phases);
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...newProject, progress, user_id: user.id }])
        .select();

      if (error) throw error;
      setProjects([data[0], ...projects]);
      
      // Update local client project count if needed or just re-fetch
      showNotification('Project created successfully!');
    } catch (error) {
      showNotification('Error creating project', 'error');
    }
  };

  const updateProject = async (id, updatedData) => {
    try {
      let finalData = { ...updatedData };
      if (updatedData.phases) {
        finalData.progress = calculateProgress(updatedData.phases);
        
        // Auto-update status based on progress if no explicit status update was provided
        if (!updatedData.status) {
          if (finalData.progress === 100) {
            finalData.status = 'Completed';
          } else if (finalData.progress > 0 && finalData.progress < 100) {
            // Get current project to check its current status
            const currentProject = projects.find(p => p.id === id);
            if (currentProject && (currentProject.status === 'Pending' || currentProject.status === 'Completed')) {
              finalData.status = 'On Track';
            }
          }
        }
      }

      const { data, error } = await supabase
        .from('projects')
        .update(finalData)
        .eq('id', id)
        .select();

      if (error) throw error;
      setProjects(projects.map(p => p.id === id ? data[0] : p));
      showNotification('Project updated successfully!');
    } catch (error) {
      showNotification('Error updating project', 'error');
    }
  };

  const deleteProject = async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
      showNotification('Project deleted successfully!');
    } catch (error) {
      showNotification('Error deleting project', 'error');
    }
  };

  // Financial Hub Methods
  const addInvoice = async (invoice) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([{ ...invoice, user_id: user.id }])
        .select();

      if (error) {
        // Retry without issue_date in case the column doesn't exist yet
        console.warn('Invoice insert failed, retrying without issue_date:', error.message);
        const { issue_date, ...invoiceWithoutIssueDate } = invoice;
        const { data: retryData, error: retryError } = await supabase
          .from('invoices')
          .insert([{ ...invoiceWithoutIssueDate, user_id: user.id }])
          .select();

        if (retryError) throw retryError;
        setInvoices([retryData[0], ...invoices]);
        showNotification('Invoice generated successfully!');
        return retryData[0];
      }

      setInvoices([data[0], ...invoices]);
      showNotification('Invoice generated successfully!');
      return data[0];
    } catch (error) {
      console.error('Error adding invoice:', error);
      // Fallback for demo if table doesn't exist
      const mockInvoice = { ...invoice, id: crypto.randomUUID(), created_at: new Date().toISOString() };
      setInvoices([mockInvoice, ...invoices]);
      showNotification('Invoice saved locally (Database table missing)', 'warning');
      return mockInvoice;
    }
  };

  const updateInvoice = async (id, updatedData) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updatedData)
        .eq('id', id)
        .select();

      if (error) throw error;
      setInvoices(invoices.map(inv => inv.id === id ? data[0] : inv));
      showNotification('Invoice updated successfully!');
    } catch (error) {
      console.error('Error updating invoice:', error.message);
      showNotification('Failed to save to database: ' + error.message, 'error');
      // Update locally so UI feels responsive, but user knows it failed to persist
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, ...updatedData } : inv));
    }
  };

  const deleteInvoice = async (id) => {
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
      setInvoices(invoices.filter(inv => inv.id !== id));
      showNotification('Invoice deleted');
    } catch (error) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const addExpense = async (expense) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: user.id }])
        .select();

      if (error) throw error;
      setExpenses([data[0], ...expenses]);
      showNotification('Expense recorded!');
    } catch (error) {
      const mockExpense = { ...expense, id: crypto.randomUUID(), created_at: new Date().toISOString() };
      setExpenses([mockExpense, ...expenses]);
      showNotification('Expense saved locally', 'warning');
    }
  };

  const deleteExpense = async (id) => {
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      setExpenses(expenses.filter(e => e.id !== id));
      showNotification('Expense removed');
    } catch (error) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const sendMessage = async (message) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ ...message, user_id: user.id }])
        .select();
      if (error) throw error;
      // Realtime listener will add it to state
      return data[0];
    } catch (error) {
      const mockMsg = { ...message, id: Date.now(), created_at: new Date().toISOString() };
      setMessages(prev => [...prev, mockMsg]);
      return mockMsg;
    }
  };

  const requestApproval = async (projectId, phaseIndex) => {
    const project = projects.find(p => p.id === projectId);
    const updatedPhases = [...project.phases];
    updatedPhases[phaseIndex] = { ...updatedPhases[phaseIndex], approvalStatus: 'Pending Approval' };
    await updateProject(projectId, { phases: updatedPhases });
    showNotification('Approval requested from client');
  };

  const approveMilestone = async (projectId, phaseIndex) => {
    const project = projects.find(p => p.id === projectId);
    const updatedPhases = [...project.phases];
    updatedPhases[phaseIndex] = { 
      ...updatedPhases[phaseIndex], 
      approvalStatus: 'Approved',
      status: 'completed'
    };
    await updateProject(projectId, { phases: updatedPhases });
    showNotification('Milestone approved! Great work.', 'success');
  };

  const addProjectTask = async (projectId, task) => {
    const project = projects.find(p => p.id === projectId);
    const newTask = { ...task, id: Date.now().toString(), created_at: new Date().toISOString() };
    const updatedTasks = [...(project.tasks || []), newTask];
    await updateProject(projectId, { tasks: updatedTasks });
  };

  const updateProjectTask = async (projectId, taskId, updatedFields) => {
    const project = projects.find(p => p.id === projectId);
    const updatedTasks = (project.tasks || []).map(t => t.id === taskId ? { ...t, ...updatedFields } : t);
    await updateProject(projectId, { tasks: updatedTasks });
  };

  const addProjectSection = async (projectId, sectionTitle) => {
    const project = projects.find(p => p.id === projectId);
    const currentSections = project.sections || ['To Do', 'In Progress', 'Done'];
    if (currentSections.includes(sectionTitle)) {
      showNotification('Section already exists', 'warning');
      return;
    }
    const updatedSections = [...currentSections, sectionTitle];
    await updateProject(projectId, { sections: updatedSections });
  };

  const updateProjectPhases = async (projectId, phases) => {
    const progress = calculateProgress(phases);
    await updateProject(projectId, { phases, progress });
  };

  const updateProjectMilestones = async (projectId, milestones) => {
    await updateProject(projectId, { milestones });
  };

  const openAddProjectModal = () => {
    setEditProjectData(null);
    setIsAddProjectModalOpen(true);
  };
  const closeAddProjectModal = () => {
    setIsAddProjectModalOpen(false);
    setEditProjectData(null);
  };

  const openEditProjectModal = (project) => {
    setEditProjectData(project);
    setIsAddProjectModalOpen(true);
  };

  return (
    <AppContext.Provider value={{
      user,
      loading,
      clients,
      projects,
      addClient,
      updateClient,
      deleteClient,
      addPayment,
      addProject,
      updateProject,
      deleteProject,
      addProjectTask,
      updateProjectTask,
      addProjectSection,
      updateProjectPhases,
      updateProjectMilestones,
      snackbar,
      showNotification,
      closeNotification,
      isAddProjectModalOpen,
      editProjectData,
      openAddProjectModal,
      closeAddProjectModal,
      openEditProjectModal,
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
      fetchData,
      invoices,
      expenses,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      addExpense,
      deleteExpense,
      messages,
      sendMessage,
      requestApproval,
      approveMilestone
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
