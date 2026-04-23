import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Chip, 
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  Skeleton,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Flag as FlagIcon,
  Plus
} from 'lucide-react';

import { useApp } from '../context/AppContext';

const Timeline = () => {
  const theme = useTheme();
  const { projects, loading } = useApp();

  // Map real projects to timeline format
  const projectsData = projects.map(p => ({
    id: p.id,
    name: p.name,
    phases: p.phases || [
      { name: 'Initial Development', status: 'active', start: 0, width: p.progress || 10 },
      { name: 'Future Phases', status: 'pending', start: p.progress || 10, width: 100 - (p.progress || 10) }
    ],
    milestones: p.milestones || []
  }));


  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'active': return theme.palette.primary.main;
      default: return theme.palette.action.hover;
    }
  };

  if (loading) return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Skeleton width={300} height={48} sx={{ mb: 1 }} />
          <Skeleton width={450} height={24} />
        </Box>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width={180} height={44} />
          <Skeleton variant="rounded" width={140} height={44} />
        </Stack>
      </Box>
      <Paper sx={{ p: 4, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', mb: 4, ml: '250px' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} sx={{ flex: 1, mx: 2 }} height={24} />
          ))}
        </Box>
        <Stack spacing={6}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 250, pr: 4 }}>
                <Skeleton width="80%" height={28} sx={{ mb: 1 }} />
                <Skeleton width="40%" height={20} />
              </Box>
              <Skeleton variant="rounded" sx={{ flex: 1, height: 40, borderRadius: 2 }} />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Project Roadmap</Typography>
          <Typography variant="body2" color="text.secondary">Strategic timeline and milestones across all active development cycles</Typography>
        </Box>
        
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box sx={{ p: 0.5, bgcolor: 'action.hover', borderRadius: 2, display: 'flex', border: '1px solid', borderColor: 'divider' }}>
            <IconButton size="small"><ChevronLeft size={18} /></IconButton>
            <Box sx={{ px: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Q2 2026</Typography>
            </Box>
            <IconButton size="small"><ChevronRight size={18} /></IconButton>
          </Box>
          <Button variant="contained" startIcon={<Plus size={18} />} sx={{ borderRadius: 2, px: 3 }}>Add Event</Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 4, overflowX: 'auto', border: '1px solid', borderColor: 'divider', boxShadow: 'none', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', mb: 4, ml: '250px', position: 'relative' }}>
          {months.map((month) => (
            <Box key={month} sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1 }}>
                {month}
              </Typography>
            </Box>
          ))}
          <Box sx={{ position: 'absolute', top: 30, left: 0, right: 0, height: 600, display: 'flex', zIndex: 0, pointerEvents: 'none' }}>
            {months.map((_, i) => (
              <Box key={i} sx={{ flex: 1, borderLeft: '1px dashed', borderColor: 'divider' }} />
            ))}
          </Box>
        </Box>

        <Stack spacing={6}>
          {projectsData.map((project) => (
            <Box key={project.id} sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Box sx={{ width: 250, pr: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                  {project.name}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.primary.main }} />
                  <Typography variant="caption" color="text.secondary">In Development</Typography>
                </Stack>
              </Box>

              <Box sx={{ flex: 1, height: 40, bgcolor: 'action.hover', borderRadius: 2, position: 'relative', display: 'flex', alignItems: 'center' }}>
                {project.phases.map((phase, idx) => (
                  <Tooltip key={idx} title={`${phase.name} (${phase.status}) - Drag to reschedule`} arrow>
                    <Box 
                      component={motion.div}
                      drag="x"
                      dragConstraints={{ left: 0, right: 800 }}
                      dragElastic={0.1}
                      whileHover={{ scaleY: 1.1, cursor: 'grab' }}
                      whileDrag={{ scaleY: 1.2, cursor: 'grabbing', zIndex: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                      sx={{ 
                        position: 'absolute',
                        left: `${phase.start}%`,
                        width: `${phase.width}%`,
                        height: 24,
                        bgcolor: getStatusColor(phase.status),
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        px: 1.5,
                        zIndex: 1
                      }}
                    >
                      <Typography variant="caption" sx={{ color: phase.status === 'pending' ? 'text.secondary' : 'white', fontWeight: 700, fontSize: '0.65rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {phase.name}
                      </Typography>
                    </Box>
                  </Tooltip>
                ))}

                {project.milestones.map((milestone, idx) => (
                  <Box 
                    key={idx}
                    sx={{ 
                      position: 'absolute',
                      left: `${milestone.pos}%`,
                      top: -10,
                      bottom: -10,
                      width: 2,
                      bgcolor: 'primary.main',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <Tooltip title={`Milestone: ${milestone.name}`} arrow>
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        bgcolor: 'primary.main', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 0 0 4px rgba(33, 37, 41, 0.1)',
                        mt: -1.5,
                        cursor: 'pointer'
                      }}>
                        <FlagIcon size={10} fill="currentColor" />
                      </Box>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Stack direction="row" spacing={4} sx={{ mt: 4, justifyContent: 'center' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: '#10b981' }} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Completed</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: theme.palette.primary.main }} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Active</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Pending</Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Timeline;
