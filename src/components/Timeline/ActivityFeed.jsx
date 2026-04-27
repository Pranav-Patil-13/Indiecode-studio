import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Code, UserPlus, FileCheck, MessageSquare } from 'lucide-react';

import { useApp } from '../../context/AppContext';

const ActivityFeed = ({ limit = 5 }) => {
  const { notifications } = useApp();
  
  const getIcon = (type) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'task': return FileCheck;
      case 'milestone': return FileCheck;
      case 'client': return UserPlus;
      default: return Code;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'message': return '#6366f1';
      case 'task': return '#8b5cf6';
      case 'milestone': return '#10b981';
      case 'client': return '#10b981';
      default: return '#3b82f6';
    }
  };

  const activities = (notifications || []).slice(0, limit).map(n => ({
    id: n.id,
    type: n.type,
    icon: getIcon(n.type),
    user: 'Studio',
    action: n.title,
    target: n.message,
    time: new Date(n.created_at),
    color: getColor(n.type)
  }));

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.disabled">No recent activity</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={0}>
      {activities.map((item, index) => (
        <motion.div 
          key={item.id} 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Box sx={{ display: 'flex', gap: 3, position: 'relative', pb: 4 }}>
            {index !== activities.length - 1 && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  left: 17, 
                  top: 36, 
                  bottom: 0, 
                  width: '2px', 
                  bgcolor: 'action.hover',
                  zIndex: 0
                }} 
              />
            )}
            <Box 
              sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: 2.5, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                color: item.color,
                zIndex: 1
              }}
            >
              <item.icon size={18} strokeWidth={2.2} />
            </Box>
            <Box sx={{ flex: 1, pt: 0.5 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.primary', 
                  lineHeight: 1.5,
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {item.action}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  fontSize: '0.8125rem',
                  mb: 1
                }}
              >
                {item.target}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.disabled', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  fontSize: '0.65rem',
                  letterSpacing: 0.5
                }}
              >
                {formatTime(item.time)}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      ))}
    </Stack>
  );
};

export default ActivityFeed;
