import { Box, Typography, IconButton, InputBase, Badge, Button, Paper, alpha } from '@mui/material';
import { Search, Bell, Plus, LogOut, Menu } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

const Navbar = ({ title, onDrawerToggle }) => {
  const { openAddProjectModal, openCommandPalette, openNotificationDrawer, notifications, user } = useApp();
  const unreadCount = notifications.filter(n => n.unread).length;
  
  const role = user?.user_metadata?.role || 'admin';
  const isClient = role === 'client';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <Box 
      component="header" 
      sx={{ 
        height: { xs: 70, sm: 80 }, 
        px: { xs: 2, sm: 4 }, 
        py: { xs: 1, sm: 2 },
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        bgcolor: '#f44336',
        color: 'white',
        borderBottom: '1px solid',
        borderColor: 'rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        {!isClient && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ display: { lg: 'none' }, mr: 1 }}
          >
            <Menu size={20} />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' }, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        <Paper 
          elevation={0}
          onClick={openCommandPalette}
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            width: { xs: 40, sm: 200, md: 300 }, 
            bgcolor: 'action.hover',
            borderRadius: 2.5,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid transparent',
            '&:hover': {
              bgcolor: 'action.selected',
              borderColor: 'primary.main'
            }
          }}
        >
          <IconButton sx={{ p: '8px' }} aria-label="search">
            <Search size={18} />
          </IconButton>
          <Typography 
            variant="body2" 
            sx={{ 
              ml: 1, 
              flex: 1, 
              color: 'text.secondary', 
              fontWeight: 500,
              display: { xs: 'none', sm: 'block' },
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          >
            Search or press ⌘K
          </Typography>
        </Paper>

        {!isClient && (
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />}
            sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: 2.5, fontWeight: 500, px: 3 }}
            onClick={openAddProjectModal}
          >
            New Project
          </Button>
        )}

        <IconButton 
          color="inherit" 
          onClick={openNotificationDrawer}
          sx={{ bgcolor: 'action.hover', borderRadius: 2.5, p: 1.25 }}
        >
          <Badge badgeContent={unreadCount} color="error" overlap="circular">
            <Bell size={20} />
          </Badge>
        </IconButton>

        {isClient && (
          <IconButton 
            color="error" 
            onClick={handleSignOut}
            sx={{ bgcolor: 'error.main', color: 'white', borderRadius: 2.5, p: 1.25, '&:hover': { bgcolor: 'error.dark' } }}
            title="Sign Out"
          >
            <LogOut size={20} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
