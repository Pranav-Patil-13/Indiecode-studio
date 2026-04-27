import React from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  Button,
  alpha,
  useTheme,
  Chip
} from '@mui/material';
import { X, MessageSquare, CheckCircle2, Clock, Bell, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NotificationDrawer = () => {
  const theme = useTheme();
  const { isNotificationDrawerOpen, closeNotificationDrawer, notifications, markAsRead } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'message': return <MessageSquare size={18} color="#3b82f6" />;
      case 'task': return <CheckCircle2 size={18} color="#10b981" />;
      case 'deadline': return <Clock size={18} color="#ef4444" />;
      default: return <Bell size={18} />;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isNotificationDrawerOpen}
      onClose={closeNotificationDrawer}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, border: 'none', boxShadow: '-10px 0 30px rgba(0,0,0,0.05)' }
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>Activity Feed</Typography>
          <Chip 
            label={notifications.filter(n => n.unread).length} 
            size="small" 
            color="primary"
            sx={{ fontWeight: 500, height: 20, fontSize: '0.7rem' }}
          />
        </Box>
        <IconButton onClick={closeNotificationDrawer} size="small">
          <X size={20} />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {notifications.length > 0 ? (
          <List sx={{ p: 0 }}>
            {notifications.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <ListItem 
                  onClick={() => markAsRead(notif.id)}
                  sx={{ 
                    py: 3, 
                    px: 3, 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: notif.unread ? alpha(theme.palette.primary.main, 0.02) : 'transparent',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Box 
                      sx={{ 
                        p: 1.25, 
                        borderRadius: 2, 
                        bgcolor: notif.unread ? 'white' : 'transparent',
                        border: '1px solid',
                        borderColor: notif.unread ? 'rgba(0,0,0,0.06)' : 'transparent',
                        display: 'flex',
                        boxShadow: notif.unread ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
                      }}
                    >
                      {getIcon(notif.type)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" component="div" sx={{ fontWeight: 500 }}>{notif.title}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 500 }} component="div">{notif.time}</Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.4 }} component="div">
                        {notif.description}
                      </Typography>
                    }
                  />
                  {notif.unread && (
                    <Box sx={{ ml: 1, width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  )}
                </ListItem>
                {index < notifications.length - 1 && <Divider sx={{ mx: 3, opacity: 0.5 }} />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', px: 4 }}>
            <Box sx={{ p: 3, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.03)', display: 'inline-flex', mb: 2 }}>
              <Bell size={32} color={theme.palette.text.disabled} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>All caught up!</Typography>
            <Typography variant="body2" color="text.secondary">You have no new notifications or activities to review.</Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
        <Button 
          fullWidth 
          variant="outlined" 
          size="small"
          sx={{ borderRadius: 2, fontWeight: 500, textTransform: 'none' }}
        >
          View All History
        </Button>
        <IconButton sx={{ borderRadius: 2, bgcolor: 'rgba(0,0,0,0.03)' }}>
          <Settings size={20} />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default NotificationDrawer;
