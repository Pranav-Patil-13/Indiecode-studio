import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Chip, 
  Tabs, 
  Tab, 
  Paper,
  Divider,
  Avatar,
  AvatarGroup,
  LinearProgress,
  IconButton,
  CircularProgress,
  Breadcrumbs,
  Link,
  Grid,
  useTheme,
  TextField
} from '@mui/material';
import { 
  ArrowLeft, 
  Layout, 
  Users, 
  FileText, 
  Calendar, 
  MoreVertical, 
  Clock, 
  CheckCircle2,
  Plus,
  ChevronRight,
  TrendingUp,
  Edit2,
  Receipt,
  Sparkles
} from 'lucide-react';
import MagicImportModal from '../components/Modals/MagicImportModal';

import { useApp } from '../context/AppContext';
import KanbanBoard from '../components/Projects/ProjectDetails/KanbanBoard';
import TeamSection from '../components/Projects/ProjectDetails/TeamSection';
import ResourceCenter from '../components/Projects/ProjectDetails/ResourceCenter';
import ProjectRoadmap from '../components/Projects/ProjectDetails/ProjectRoadmap';
import ProjectFinancials from '../components/Projects/ProjectDetails/ProjectFinancials';
import confetti from 'canvas-confetti';
import { ProjectDetailsSkeleton } from '../components/Feedback/LoadingSkeleton';
import { useEffect } from 'react';

const ProjectDetails = ({ isClient = false }) => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, clients, loading, openEditProjectModal } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [magicModalOpen, setMagicModalOpen] = useState(false);


  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (loading) return;
    if (!loading && project?.progress === 100) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e']
      });
    }
  }, [loading, project?.progress]);

  if (loading) return <ProjectDetailsSkeleton />;
  if (!project) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5">Project not found</Typography>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/projects')} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Breadcrumbs */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/projects')} size="small" sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
          <ArrowLeft size={18} />
        </IconButton>
        <Breadcrumbs 
          separator={<ChevronRight size={14} />} 
          sx={{ '& .MuiBreadcrumbs-li': { fontSize: '0.875rem', fontWeight: 500 } }}
        >
          <Link 
            underline="hover" 
            color="inherit" 
            href="/projects" 
            onClick={(e) => { e.preventDefault(); navigate('/projects'); }}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}
          >
            Projects
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>{project.name}</Typography>
        </Breadcrumbs>
      </Stack>

      {/* Hero Section & Summary Card */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, md: 4 }, 
              height: '100%',
              borderRadius: 5, 
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {/* Decorative elements */}
            <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 0, 0, 0.02) 0%, transparent 70%)' }} />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
                <Chip 
                  icon={<TrendingUp size={14} />}
                  label={project.status} 
                  size="small" 
                  sx={{ 
                    fontWeight: 500, 
                    borderRadius: 2,
                    bgcolor: project.status === 'On Track' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: project.status === 'On Track' ? '#10b981' : '#3b82f6',
                    pl: 0.5
                  }}
                />
                <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto', opacity: 0.5 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Created {new Date(project.created_at).toLocaleDateString()}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h3" sx={{ fontWeight: 500, letterSpacing: '-0.03em', color: 'text.primary', fontSize: '2rem' }}>
                  {project.name}
                </Typography>
                {!isClient && (
                  <IconButton 
                    size="small" 
                    onClick={() => openEditProjectModal(project)}
                    sx={{ 
                      bgcolor: 'background.paper', 
                      border: '1px solid', 
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover', color: 'primary.main' }
                    }}
                  >
                    <Edit2 size={18} />
                  </IconButton>
                )}
              </Stack>
              
              <MagicImportModal 
                open={magicModalOpen} 
                onClose={() => setMagicModalOpen(false)} 
                projectId={project.id}
              />
              
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', sm: '1rem' }, lineHeight: 1.6, maxWidth: 700, mb: 3 }}>
                {project.description || 'No description provided.'}
              </Typography>
              
              <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>
                    Client Partner
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    {clients.find(c => c.id === project.client_id)?.name || 'Unknown Client'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>
                    Delivery
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Calendar size={14} color="text.disabled" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {project.due_date}
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>
                    Priority
                  </Typography>
                  <Chip 
                    label={project.priority} 
                    sx={{ 
                      height: 24, 
                      fontWeight: 500, 
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      bgcolor: project.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
                      color: project.priority === 'High' ? '#ef4444' : 'text.primary',
                      border: '1px solid',
                      borderColor: project.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'divider'
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 5, 
              bgcolor: 'background.paper',
              boxShadow: theme.palette.mode === 'light' ? '0 10px 40px rgba(0,0,0,0.04)' : '0 10px 40px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2.5 }}>
              <CircularProgress 
                variant="determinate" 
                value={100} 
                size={100} 
                thickness={4} 
                sx={{ color: 'action.hover' }} 
              />
              <CircularProgress 
                variant="determinate" 
                value={project.progress} 
                size={100} 
                thickness={4} 
                sx={{ 
                  color: project.progress > 80 ? '#10b981' : 'primary.main',
                  position: 'absolute',
                  left: 0,
                  strokeLinecap: 'round'
                }} 
              />
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                  {project.progress}%
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>Project Completion</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, mb: 3 }}>
              {project.phases?.filter(p => p.status === 'completed' || p.status === 'Done').length || 0} of {project.phases?.length || 4} phases done
            </Typography>

            <Divider sx={{ width: '100%', mb: 2.5, opacity: 0.5 }} />

            <Box sx={{ width: '100%', mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Team</Typography>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>{project.team?.length || 0} active</Typography>
              </Box>
              <AvatarGroup max={4} sx={{ justifyContent: 'center', '& .MuiAvatar-root': { width: 30, height: 30, fontSize: '0.7rem', border: '2px solid', borderColor: 'background.paper' } }}>
                {project.team?.map((member) => (
                  <Avatar key={member.id}>{member.avatar}</Avatar>
                ))}
              </AvatarGroup>
            </Box>

            {!isClient && (
              <Button 
                fullWidth
                variant="contained" 
                startIcon={<Sparkles size={18} />}
                onClick={() => setMagicModalOpen(true)}
                sx={{ 
                  borderRadius: 2.5, 
                  py: 1.25,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Sync Meeting
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Tab Navigation: Select for Mobile, Tabs for Desktop */}
      <Box sx={{ mb: 5 }}>
        {/* Mobile Select Dropdown */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <TextField
            select
            fullWidth
            value={activeTab}
            onChange={(e) => setActiveTab(parseInt(e.target.value))}
            label="Select View"
            slotProps={{
              select: {
                native: true,
              },
              input: {
                sx: { 
                  borderRadius: 3, 
                  bgcolor: 'background.paper',
                  '& select': { py: 1.5 }
                }
              }
            }}
          >
            {[
              "Kanban Board",
              "Team Management",
              "Resource Center",
              "Timeline",
              "Financials"
            ].map((label, index) => (
              <option key={index} value={index}>
                {label}
              </option>
            ))}
          </TextField>
        </Box>

        {/* Desktop Tabs */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 48,
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTabs-scroller': { overflow: 'visible' }
            }}
          >
            {[
              { icon: <Layout size={18} />, label: "Kanban Board" },
              { icon: <Users size={18} />, label: "Team Management" },
              { icon: <FileText size={18} />, label: "Resource Center" },
              { icon: <Calendar size={18} />, label: "Timeline" },
              { icon: <Receipt size={18} />, label: "Financials" }
            ].map((tab, index) => (
              <Tab 
                key={index}
                icon={tab.icon} 
                iconPosition="start" 
                label={tab.label} 
                sx={{
                  minWidth: 'auto',
                  px: 3,
                  mr: 1,
                  borderRadius: 3,
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  minHeight: 44,
                  color: 'text.secondary',
                  transition: 'all 0.2s ease',
                  bgcolor: activeTab === index ? 'primary.main' : 'action.hover',
                  color: activeTab === index ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': {
                    bgcolor: activeTab === index ? 'primary.main' : 'action.selected'
                  },
                  '&.Mui-selected': {
                    color: 'primary.contrastText'
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Box>

      {/* Tab Panels */}
      <Box sx={{ minHeight: 400 }}>
        {activeTab === 0 && <KanbanBoard project={project} isClient={isClient} />}
        {activeTab === 1 && <TeamSection project={project} isClient={isClient} />}
        {activeTab === 2 && <ResourceCenter project={project} isClient={isClient} />}
        {activeTab === 3 && <ProjectRoadmap project={project} isClientView={isClient} />}
        {activeTab === 4 && <ProjectFinancials project={project} isClient={isClient} />}
      </Box>
    </Box>
  );
};

export default ProjectDetails;
