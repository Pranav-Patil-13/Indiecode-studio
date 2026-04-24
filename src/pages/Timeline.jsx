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
  Plus,
  Check
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import QuickPromptModal from '../components/Modals/QuickPromptModal';
import ConfirmDialog from '../components/Modals/ConfirmDialog';

const Timeline = () => {
  const theme = useTheme();
  const { projects, loading } = useApp();

  // Map real projects to timeline format
  const projectsData = projects.map(p => ({
    id: p.id,
    name: p.name,
    phases: p.phases || [
      { name: 'Frontend', status: 'pending', start: 0, width: 25, color: '#3b82f6' },
      { name: 'Backend', status: 'pending', start: 25, width: 25, color: '#8b5cf6' },
      { name: 'Testing', status: 'pending', start: 50, width: 25, color: '#f59e0b' },
      { name: 'Deploying', status: 'pending', start: 75, width: 25, color: '#10b981' }
    ],
    milestones: p.milestones || []
  }));




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
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 1 }}>Project Roadmap</Typography>
          <Typography variant="body2" color="text.secondary">Strategic timeline and milestones across all active development cycles</Typography>
        </Box>
        

      </Box>

      <Paper sx={{ p: 4, overflowX: 'auto', border: '1px solid', borderColor: 'divider', boxShadow: 'none', bgcolor: 'background.paper' }}>
        <Box sx={{ position: 'relative', ml: '250px' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', display: 'flex', zIndex: 0, pointerEvents: 'none' }}>
            {[1, 2, 3, 4].map((_, i) => (
              <Box key={i} sx={{ flex: 1, borderLeft: '1px solid', borderColor: 'rgba(0,0,0,0.03)' }} />
            ))}
          </Box>
        </Box>

        <Stack spacing={6}>
          {projectsData.map((project) => (
            <Box key={project.id} sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Box sx={{ width: 250, pr: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
                  {project.name}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.primary.main }} />
                  <Typography variant="caption" color="text.secondary">In Development</Typography>
                </Stack>
              </Box>

              <Box sx={{ flex: 1, height: 40, bgcolor: 'action.hover', borderRadius: 2, position: 'relative', display: 'flex', alignItems: 'center' }}>
                {project.phases.map((phase, idx) => {
                  const startPos = phase.start !== undefined ? phase.start : project.phases.slice(0, idx).reduce((acc, p) => acc + (p.width || 0), 0);
                  
                  return (
                    <Tooltip key={idx} title={`${phase.name} (${phase.status})`} arrow>
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          left: `${startPos}%`,
                          width: `${phase.width || 25}%`,
                          height: 28,
                          bgcolor: phase.status === 'pending' ? 'transparent' : (phase.color || getStatusColor(phase.status)),
                          border: phase.status === 'pending' ? '1px dashed' : '1px solid',
                          borderColor: phase.status === 'pending' ? 'rgba(0,0,0,0.1)' : 'transparent',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: 1,
                          zIndex: 1,
                          opacity: 1,
                          boxShadow: phase.status === 'active' ? `0 4px 15px ${(phase.color || theme.palette.primary.main)}40` : 'none',
                          '&:hover': { transform: 'scaleY(1.1)', boxShadow: `0 4px 10px ${phase.color || '#000'}40`, opacity: 1 }
                        }}
                      >
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', width: '100%', justifyContent: 'center', pointerEvents: 'none' }}>
                          {phase.status === 'completed' && <Check size={12} color="white" />}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: phase.status === 'pending' ? 'text.secondary' : 'white', 
                              fontWeight: 600, 
                              fontSize: '0.625rem', 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden',
                              textDecoration: phase.status === 'completed' ? 'line-through' : 'none',
                              opacity: phase.status === 'completed' ? 0.8 : 1
                            }}
                          >
                            {phase.name}
                          </Typography>
                        </Stack>
                      </Box>
                    </Tooltip>
                  );
                })}

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
          <Typography variant="caption" sx={{ fontWeight: 500 }}>Completed</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: theme.palette.primary.main }} />
          <Typography variant="caption" sx={{ fontWeight: 500 }}>Active</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }} />
          <Typography variant="caption" sx={{ fontWeight: 500 }}>Pending</Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Timeline;
