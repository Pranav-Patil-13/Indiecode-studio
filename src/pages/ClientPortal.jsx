import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Grid, 
  Chip, 
  LinearProgress,
  Button,
  Avatar,
  Divider,
  useTheme,
  IconButton,
  Breadcrumbs,
  Link,
  CircularProgress,
  alpha
} from '@mui/material';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  TrendingUp,
  ChevronRight,
  Briefcase,
  ArrowLeft,
  LayoutDashboard,
  Target,
  Rocket,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectRoadmap from '../components/Projects/ProjectDetails/ProjectRoadmap';
import { motion, AnimatePresence } from 'framer-motion';

const ClientPortal = () => {
  const theme = useTheme();
  const { projects, clients, loading } = useApp();
  
  const client = clients[0];
  const clientProjects = useMemo(() => 
    projects.filter(p => p.client_id === client?.id), 
  [projects, client]);

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  React.useEffect(() => {
    if (!selectedProjectId && clientProjects.length > 0) {
      setSelectedProjectId(clientProjects[0].id);
    }
  }, [clientProjects, selectedProjectId]);

  const project = clientProjects.find(p => p.id === selectedProjectId);

  if (loading) return null;
  if (!client) return (
    <Box sx={{ height: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box textAlign="center" maxWidth={400}>
        <Typography variant="h5" fontWeight={500} gutterBottom>Account Pending Setup</Typography>
        <Typography color="text.secondary">Your client profile is pending setup by the studio administrator.</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Subtle Project Switcher */}
      {clientProjects.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ mb: 4, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
          {clientProjects.map((p) => (
            <Button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              variant={selectedProjectId === p.id ? "contained" : "text"}
              size="small"
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 500,
                bgcolor: selectedProjectId === p.id ? 'primary.main' : 'transparent',
                color: selectedProjectId === p.id ? 'primary.contrastText' : 'text.secondary',
                '&:hover': { bgcolor: selectedProjectId === p.id ? 'primary.main' : 'action.hover' }
              }}
            >
              {p.name}
            </Button>
          ))}
        </Stack>
      )}

      <AnimatePresence mode="wait">
        {project ? (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Minimalist Header */}
            <Box sx={{ mb: 6 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 500, color: 'primary.main', letterSpacing: 1.5 }}>
                    Project Dashboard
                  </Typography>
                  <Typography variant="h3" fontWeight={500} sx={{ mt: 1, letterSpacing: '-0.03em' }}>
                    {project.name}
                  </Typography>
                </Box>
                <Chip 
                  label={project.status} 
                  size="small"
                  sx={{ 
                    fontWeight: 500, 
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    color: 'primary.main',
                    mb: 1
                  }} 
                />
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.7 }}>
                {project.description}
              </Typography>
            </Box>

            {/* Core Metrics Grid */}
            <Grid container spacing={3} sx={{ mb: 8 }}>
              {/* Progress Card */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    borderRadius: 4, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={500} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                      Overall Progress
                    </Typography>
                    <Typography variant="h5" fontWeight={500} color="primary.main">
                      {project.progress}%
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={project.progress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': { borderRadius: 4 }
                    }} 
                  />
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Box>
                      <Typography variant="caption" color="text.disabled" fontWeight={500} display="block">COMPLETED</Typography>
                      <Typography variant="body2" fontWeight={500}>{project.phases?.filter(p => p.status === 'completed' || p.status === 'Done').length || 0} Phases</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ opacity: 0.5 }} />
                    <Box>
                      <Typography variant="caption" color="text.disabled" fontWeight={500} display="block">REMAINING</Typography>
                      <Typography variant="body2" fontWeight={500}>{project.phases?.length - (project.phases?.filter(p => p.status === 'completed' || p.status === 'Done').length || 0) || 0} Phases</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Stat Boxes */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  {[
                    { label: 'Efficiency', value: '+12%', icon: TrendingUp, color: '#10b981' },
                    { label: 'Target Date', value: project.due_date || 'TBD', icon: Calendar, color: '#3b82f6' },
                    { label: 'Next Milestone', value: project.phases?.find(p => p.status === 'active')?.name || 'TBD', icon: Target, color: '#f59e0b' },
                    { label: 'Active Days', value: `${project.created_at ? Math.max(1, Math.ceil((new Date() - new Date(project.created_at)) / (1000 * 60 * 60 * 24))) : '1'}`, icon: Activity, color: '#6366f1' }
                  ].map((stat, idx) => (
                    <Grid item xs={6} key={idx}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          borderRadius: 4, 
                          border: '1px solid', 
                          borderColor: 'divider',
                          transition: 'all 0.2s ease',
                          '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' }
                        }}
                      >
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
                          <Box sx={{ color: stat.color, display: 'flex' }}>
                            <stat.icon size={18} />
                          </Box>
                          <Typography variant="caption" fontWeight={500} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            {stat.label}
                          </Typography>
                        </Stack>
                        <Typography variant="h6" fontWeight={500}>
                          {stat.value}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            {/* Roadmap Section */}
            <Box>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" fontWeight={500}>Development Roadmap</Typography>
                <Button endIcon={<ArrowUpRight size={16} />} size="small" sx={{ fontWeight: 500 }}>
                  View Full Details
                </Button>
              </Stack>
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 3, md: 5 }, 
                  borderRadius: 4, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <ProjectRoadmap project={project} isClientView={true} />
              </Paper>
            </Box>
          </motion.div>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography color="text.secondary">No project selected.</Typography>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ClientPortal;
