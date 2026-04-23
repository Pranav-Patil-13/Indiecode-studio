import React from 'react';
import { Box, Paper, Typography, Stack, Divider, useTheme, Chip } from '@mui/material';
import { Circle, CheckCircle2, Clock, Calendar } from 'lucide-react';

const RoadmapItem = ({ title, date, status, isLast }) => {
  const theme = useTheme();
  return (
  <Box sx={{ display: 'flex', gap: 4 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box 
        sx={{ 
          p: 0.8, 
          borderRadius: '50%', 
          bgcolor: status === 'Done' ? 'rgba(16, 185, 129, 0.1)' : status === 'In Progress' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.03)',
          color: status === 'Done' ? '#10b981' : status === 'In Progress' ? '#3b82f6' : 'text.disabled',
          border: '2px solid',
          borderColor: 'background.paper',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          zIndex: 1
        }}
      >
        {status === 'Done' ? <CheckCircle2 size={24} /> : <Circle size={24} fill={status === 'In Progress' ? '#3b82f6' : 'white'} />}
      </Box>
      {!isLast && <Box sx={{ width: 3, flexGrow: 1, bgcolor: 'divider', my: 1, borderRadius: 1.5 }} />}
    </Box>
    <Box sx={{ pb: isLast ? 0 : 6, flexGrow: 1 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: status === 'In Progress' ? 'action.selected' : 'background.paper',
          boxShadow: status === 'In Progress' ? '0 10px 30px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.02)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(8px)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.06)'
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 850, mb: 1, color: 'text.primary' }}>{title}</Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: 'text.secondary' }}>
            <Calendar size={14} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{date}</Typography>
          </Stack>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.1)' }} />
          <Chip 
            label={status} 
            size="small"
            sx={{ 
              height: 20, 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              textTransform: 'uppercase',
              bgcolor: status === 'Done' ? 'rgba(16, 185, 129, 0.1)' : status === 'In Progress' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.05)',
              color: status === 'Done' ? '#10b981' : status === 'In Progress' ? '#3b82f6' : 'text.disabled'
            }}
          />
        </Stack>
      </Paper>
    </Box>
  </Box>
  );
};

const ProjectRoadmap = ({ project }) => {
  const milestones = [
    { title: 'Project Kickoff & Discovery', date: 'April 10, 2026', status: 'Done' },
    { title: 'UI/UX Design Phase', date: 'April 25, 2026', status: 'Done' },
    { title: 'Frontend Architecture & Setup', date: 'May 02, 2026', status: 'In Progress' },
    { title: 'Backend Integration & API', date: 'May 15, 2026', status: 'Upcoming' },
    { title: 'Beta Testing & QA', date: 'June 01, 2026', status: 'Upcoming' },
    { title: 'Final Deployment', date: 'June 10, 2026', status: 'Upcoming' }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 0.5 }}>Project Roadmap</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Visual journey of key milestones and delivery goals</Typography>
      </Box>

      <Box sx={{ maxWidth: 800, mt: 2 }}>
        {milestones.map((milestone, index) => (
          <RoadmapItem 
            key={milestone.title} 
            {...milestone} 
            isLast={index === milestones.length - 1} 
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProjectRoadmap;
