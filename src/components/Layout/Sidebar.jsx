import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Avatar, 
  IconButton,
  Divider
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import logoImg from '../../assets/logo.jpg';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useApp();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: Calendar, label: 'Timeline', path: '/timeline' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
  ];

  return (
    <Box 
      sx={{ 
        width: 280, 
        height: '100vh', 
        bgcolor: 'background.paper', 
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200
      }}
    >
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box 
          sx={{ 
            width: 32, 
            height: 32, 
            borderRadius: 1, 
            overflow: 'hidden',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0.5
          }}
        >
          <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: -0.5 }}>
          IndieCode Studio
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, px: 2, py: 2 }}>
        <Typography variant="caption" sx={{ px: 2, color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, mb: 2, display: 'block' }}>
          Main Menu
        </Typography>
        <List sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton 
                component={NavLink} 
                to={item.path}
                selected={location.pathname === item.path}
                sx={{ 
                  borderRadius: 2,
                  py: 1.25,
                  '&.active': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { bgcolor: 'primary.main' }
                  },
                  '&:not(.active):hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'white' : 'text.secondary' }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  slotProps={{
                    primary: { 
                      fontSize: '0.875rem', 
                      fontWeight: location.pathname === item.path ? 600 : 500 
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 4, mx: 2, opacity: 0.5 }} />

        <Typography variant="caption" sx={{ px: 2, color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, mb: 2, display: 'block' }}>
          Support
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              component={NavLink} 
              to="/settings"
              sx={{ 
                borderRadius: 2,
                py: 1.25,
                '&.active': { bgcolor: 'primary.main', color: 'white' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                <Settings size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                slotProps={{
                  primary: { fontSize: '0.875rem', fontWeight: 500 }
                }} 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar 
            sx={{ width: 36, height: 36, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'primary.main', fontSize: '0.875rem' }} 
          >
            {user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>
              {user?.user_metadata?.full_name || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Founder</Typography>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={handleLogout}>
          <LogOut size={18} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
