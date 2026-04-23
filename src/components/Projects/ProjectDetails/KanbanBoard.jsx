import React from 'react';
import { Box, Paper, Typography, Stack, IconButton, Chip, Avatar, Divider, useTheme } from '@mui/material';
import { Plus, MoreHorizontal, MessageSquare, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

const KanbanColumn = ({ title, tasks, color }) => {
  const theme = useTheme();
  return (
  <Box 
    sx={{ 
      flex: 1, 
      minWidth: 320, 
      bgcolor: 'action.hover', 
      borderRadius: 5, 
      p: 2,
      height: 'fit-content',
      minHeight: 500,
      border: '1px solid',
      borderColor: 'divider'
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 10px ${color}40` }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 850, letterSpacing: '-0.01em' }}>{title}</Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 800, 
            bgcolor: 'background.paper', 
            color: 'text.secondary',
            px: 1, 
            py: 0.2, 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          {tasks.length}
        </Typography>
      </Stack>
      <IconButton size="small" sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'background.paper', color: 'primary.main' } }}>
        <Plus size={18} />
      </IconButton>
    </Box>

    <Stack spacing={2}>
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              cursor: 'grab',
              bgcolor: 'background.paper',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                transform: 'translateY(-4px)',
                borderColor: 'primary.main'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Chip 
                label={task.priority} 
                size="small"
                sx={{ 
                  height: 22, 
                  fontSize: '0.65rem', 
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  bgcolor: task.priority === 'High' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0,0,0,0.04)',
                  color: task.priority === 'High' ? '#ef4444' : 'text.primary'
                }}
              />
              <IconButton size="small" sx={{ p: 0, opacity: 0.4, '&:hover': { opacity: 1 } }}>
                <MoreHorizontal size={16} />
              </IconButton>
            </Box>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 750, mb: 2, lineHeight: 1.5, color: 'text.primary' }}>
              {task.title}
            </Typography>

            <Divider sx={{ my: 1.5, opacity: 0.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={2.5}>
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", color: 'text.disabled' }}>
                  <MessageSquare size={14} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>2</Typography>
                </Stack>
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", color: 'text.disabled' }}>
                  <Paperclip size={14} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>1</Typography>
                </Stack>
              </Stack>
              <Avatar 
                sx={{ 
                  width: 28, 
                  height: 28, 
                  fontSize: '0.65rem', 
                  fontWeight: 800,
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  border: '2px solid',
                  borderColor: 'background.paper'
                }}
              >
                {task.assignee.split(' ').map(n => n[0]).join('')}
              </Avatar>
            </Box>
          </Paper>
        </motion.div>
      ))}
    </Stack>
    </Box>
  );
};

const KanbanBoard = ({ project }) => {
  const columns = [
    { title: 'To Do', color: '#6C757D', tasks: project.tasks?.filter(t => t.status === 'To Do') || [] },
    { title: 'In Progress', color: '#3b82f6', tasks: project.tasks?.filter(t => t.status === 'In Progress') || [] },
    { title: 'Done', color: '#10b981', tasks: project.tasks?.filter(t => t.status === 'Done') || [] }
  ];

  return (
    <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 4, minHeight: 600, width: '100%' }}>
      {columns.map(column => (
        <KanbanColumn key={column.title} {...column} />
      ))}
      
      {/* Add Column Button */}
      <Box 
        sx={{ 
          minWidth: 320, 
          height: 100, 
          border: '2px dashed', 
          borderColor: 'divider',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'text.disabled',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'primary.main',
            color: 'primary.main'
          }
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Plus size={20} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Add Section</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default KanbanBoard;
