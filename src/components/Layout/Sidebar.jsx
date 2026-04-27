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
  Divider,
  Drawer,
  useTheme,
  alpha,
  Badge
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  Receipt
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import logoImg from '../../assets/logo.jpg';
import profilePic from '../../assets/profile.png';

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const { user, messages } = useApp();
  const role = user?.user_metadata?.role || 'admin';
  const isClient = role === 'client';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: isClient ? 'Team' : 'Clients', path: '/clients' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: Calendar, label: 'Timeline', path: '/timeline' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Receipt, label: 'Billing', path: '/billing' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box 
          sx={{ 
            width: 36, 
            height: 36, 
            borderRadius: 1, 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.25rem', letterSpacing: -0.5 }}>
          IndieCode Studio
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, px: 2, py: 2, overflowY: 'auto' }}>
        <Typography variant="caption" sx={{ px: 2.5, color: 'text.disabled', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 2, mb: 2, display: 'block', fontSize: '0.65rem' }}>
          Main Menu
        </Typography>
        <List sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          {menuItems.map((item) => {
            const isMessages = item.label === 'Messages';
            const unreadMessagesCount = messages.filter(m => {
              const isMe = isClient ? m.sender === 'client' : m.sender === 'admin';
              return !isMe && m.unread === true;
            }).length;

            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton 
                  component={NavLink} 
                  to={item.path}
                  selected={location.pathname === item.path}
                  onClick={mobileOpen ? onDrawerToggle : undefined}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.25,
                    mb: 0.5,
                    transition: 'all 0.2s ease',
                    '&.active': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': { 
                        color: 'primary.main',
                        transform: 'scale(1.1)' 
                      },
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    },
                    '&:not(.active):hover': {
                      bgcolor: 'action.hover',
                      color: 'text.primary'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: location.pathname === item.path ? 'primary.main' : 'text.secondary', transition: 'all 0.2s' }}>
                    {isMessages ? (
                      <Badge badgeContent={unreadMessagesCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 18, minWidth: 18 } }}>
                        <item.icon size={20} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
                      </Badge>
                    ) : (
                      <item.icon size={20} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    slotProps={{
                      primary: { 
                        fontSize: '0.875rem', 
                        fontWeight: location.pathname === item.path ? 500 : 500,
                        letterSpacing: '-0.01em'
                      }
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 4, mx: 2, opacity: 0.5 }} />

        <Typography variant="caption" sx={{ px: 2.5, color: 'text.disabled', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 2, mb: 2, display: 'block', fontSize: '0.65rem' }}>
          Support
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              component={NavLink} 
              to="/settings"
              onClick={mobileOpen ? onDrawerToggle : undefined}
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
            src={profilePic}
            sx={{ 
              width: 36, 
              height: 36, 
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: 'divider', 
              bgcolor: 'primary.main', 
              fontSize: '0.875rem',
              '& .MuiAvatar-img': { objectPosition: 'top' }
            }} 
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>
              {user?.user_metadata?.full_name || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {isClient ? 'Client' : 'Founder'}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={handleLogout}>
          <LogOut size={18} />
        </IconButton>
      </Box>
      <Box sx={{ px: 2, pb: 1, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
          IndieCode Studio v1.1.9
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { lg: 280 }, flexShrink: { lg: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderRight: '1px solid', borderColor: 'divider' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
