import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Code, UserPlus, FileCheck, MessageSquare } from 'lucide-react';

import { useApp } from '../../context/AppContext';

const ActivityFeed = () => {
  const { notifications } = useApp();
  
  const getIcon = (type) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'task': return FileCheck;
      case 'client': return UserPlus;
      default: return Code;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'message': return '#6366f1';
      case 'task': return '#8b5cf6';
      case 'client': return '#10b981';
      default: return '#3b82f6';
    }
  };

  const activities = notifications.map(n => ({
    id: n.id,
    type: n.type,
    icon: getIcon(n.type),
    user: 'System', // Or derive from n.user if added
    action: n.title,
    target: n.description,
    time: new Date(n.created_at).toLocaleDateString(),
    color: getColor(n.type)
  }));

  return (
    <Stack spacing={4}>
      {activities.map((item, index) => (
        <motion.div 
          key={item.id} 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Box sx={{ display: 'flex', gap: 2, position: 'relative' }}>
            {index !== activities.length - 1 && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  left: 14, 
                  top: 36, 
                  bottom: -32, 
                  width: '1px', 
                  bgcolor: 'rgba(0, 0, 0, 0.06)',
                  zIndex: 0
                }} 
              />
            )}
            <Box 
              sx={{ 
                width: 30, 
                height: 30, 
                borderRadius: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: 'white',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                color: item.color,
                zIndex: 1
              }}
            >
              <item.icon size={16} strokeWidth={2.5} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  lineHeight: 1.6,
                  fontSize: '0.875rem'
                }}
              >
                <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>{item.user}</Box>
                {` ${item.action} `}
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>{item.target}</Box>
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.disabled', 
                  mt: 0.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  fontWeight: 500
                }}
              >
                {item.time}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      ))}
    </Stack>
  );
};

export default ActivityFeed;
