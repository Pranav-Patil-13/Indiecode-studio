import { Box, Typography, IconButton, InputBase, Badge, Button, Paper } from '@mui/material';
import { Search, Bell, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Navbar = ({ title }) => {
  const { openAddProjectModal, openCommandPalette, openNotificationDrawer, notifications } = useApp();
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Box 
      component="header" 
      sx={{ 
        height: 70, 
        px: 4, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, display: { xs: 'none', md: 'block' }, letterSpacing: '-0.02em' }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Paper 
          elevation={0}
          onClick={openCommandPalette}
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            width: { xs: 40, sm: 300 }, 
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
              fontWeight: 600,
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            Search or press ⌘K
          </Typography>
        </Paper>

        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: 2.5, fontWeight: 800, px: 3 }}
          onClick={openAddProjectModal}
        >
          New Project
        </Button>

        <IconButton 
          color="inherit" 
          onClick={openNotificationDrawer}
          sx={{ bgcolor: 'action.hover', borderRadius: 2.5, p: 1.25 }}
        >
          <Badge badgeContent={unreadCount} color="error" overlap="circular">
            <Bell size={20} />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Navbar;
