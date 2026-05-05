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

      {/* Hero Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 4, md: 6 }, 
          borderRadius: 6, 
          background: 'linear-gradient(135deg, #FDB931 0%, #D4AF37 50%, #AF9134 100%)',
          border: '1px solid',
          borderColor: 'rgba(184, 134, 11, 0.3)',
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 30px 60px -12px ${alpha('#B8860B', 0.15)}`
        }}
      >
        {/* Decorative elements */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 400 } }}>
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
                Created on {new Date(project.created_at).toLocaleDateString()}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 600, letterSpacing: '-0.03em', color: '#000000', fontSize: { xs: '2rem', sm: '3rem' } }}>
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
              {!isClient && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<Sparkles size={16} />}
                  onClick={() => setMagicModalOpen(true)}
                  sx={{ 
                    borderRadius: 2.5, 
                    fontWeight: 600,
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'action.hover', color: 'primary.main', borderColor: 'primary.main' }
                  }}
                >
                  Sync Meeting
                </Button>
              )}
            </Stack>
            
            <MagicImportModal 
              open={magicModalOpen} 
              onClose={() => setMagicModalOpen(false)} 
              projectId={project.id}
            />
            
            <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', fontWeight: 500, fontSize: { xs: '1rem', sm: '1.1rem' }, lineHeight: 1.6, maxWidth: 700, mb: 4 }}>
              {project.description || 'No description provided.'}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 'auto' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
                  Client Partner
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#000000' }}>
                  {clients.find(c => c.id === project.client_id)?.name || 'Unknown Client'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 'auto' }}>
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
                  Target Delivery
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Calendar size={18} color="#64748b" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {project.due_date}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6, sm: 'auto' }}>
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
                  Priority Level
                </Typography>
                <Chip 
                  label={project.priority} 
                  sx={{ 
                    height: 28, 
                    fontWeight: 500, 
                    borderRadius: 1.5,
                    bgcolor: project.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
                    color: project.priority === 'High' ? '#ef4444' : 'text.primary'
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Paper 
            sx={{ 
              p: 4, 
              width: { xs: '100%', md: 320 },
              minWidth: { xs: '100%', md: 320 }, 
              borderRadius: 6, 
              bgcolor: 'rgba(0,0,0,0.03)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.08)'
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
              <CircularProgress 
                variant="determinate" 
                value={100} 
                size={120} 
                thickness={4} 
                sx={{ color: 'rgba(0,0,0,0.1)' }} 
              />
              <CircularProgress 
                variant="determinate" 
                value={project.progress} 
                size={120} 
                thickness={4} 
                sx={{ 
                  color: '#000000',
                  position: 'absolute',
                  left: 0,
                  strokeLinecap: 'round'
                }} 
              />
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 600, letterSpacing: '-1px', color: '#000000' }}>
                  {project.progress}%
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>Overall Completion</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.6)', fontWeight: 600, mb: 3 }}>
              {project.phases?.filter(p => p.status === 'completed' || p.status === 'Done').length || 0} of {project.phases?.length || 4} phases completed
            </Typography>

            <Divider sx={{ width: '100%', mb: 3, opacity: 0.2, borderColor: '#000000' }} />

            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'rgba(0,0,0,0.6)' }}>Team Collaboration</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#000000' }}>{project.team?.length || 0} active</Typography>
              </Box>
              <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.75rem', border: '2px solid', borderColor: 'background.paper' } }}>
                {project.team?.map((member) => (
                  <Avatar key={member.id}>{member.avatar}</Avatar>
                ))}
              </AvatarGroup>
            </Box>
          </Paper>
        </Box>
      </Paper>

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
