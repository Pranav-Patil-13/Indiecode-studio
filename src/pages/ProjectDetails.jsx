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
      {/* Integrated Hero Header */}
      <Box 
        sx={{ 
          pt: { xs: 2, md: 4 },
          pb: { xs: 6, md: 8 },
          px: { xs: 3, md: 0 },
          position: 'relative',
          overflow: 'hidden',
          mb: 4
        }}
      >
        {/* Abstract Background Shapes */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -150, 
            right: -100, 
            width: 400, 
            height: 400, 
            borderRadius: '50%', 
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            zIndex: 0
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -100, 
            left: -50, 
            width: 300, 
            height: 300, 
            borderRadius: '50%', 
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            zIndex: 0
          }} 
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumbs Integrated */}
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 4 }}>
            <IconButton 
              onClick={() => navigate('/projects')} 
              size="small" 
              sx={{ 
                bgcolor: 'background.paper', 
                border: '1px solid', 
                borderColor: 'divider',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <ArrowLeft size={16} />
            </IconButton>
            <Breadcrumbs 
              separator={<ChevronRight size={14} />} 
              sx={{ '& .MuiBreadcrumbs-li': { fontSize: '0.85rem', fontWeight: 500, color: 'text.secondary' } }}
            >
              <Link 
                underline="hover" 
                color="inherit" 
                href="/projects" 
                onClick={(e) => { e.preventDefault(); navigate('/projects'); }}
              >
                Projects
              </Link>
              <Typography color="text.primary" sx={{ fontWeight: 600 }}>{project.name}</Typography>
            </Breadcrumbs>
          </Stack>

          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
                <Chip 
                  icon={<TrendingUp size={14} />}
                  label={project.status} 
                  size="small" 
                  sx={{ 
                    fontWeight: 600, 
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    px: 1,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: '0.65rem'
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Created {new Date(project.created_at).toLocaleDateString()}
                </Typography>
              </Stack>

              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 700, 
                    letterSpacing: '-0.04em', 
                    color: 'text.primary', 
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    lineHeight: 1.1
                  }}
                >
                  {project.name}
                </Typography>
                
                <Stack direction="row" spacing={1}>
                  {!isClient && (
                    <IconButton 
                      size="small" 
                      onClick={() => openEditProjectModal(project)}
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'primary.main', color: 'white' }
                      }}
                    >
                      <Edit2 size={18} />
                    </IconButton>
                  )}
                  {!isClient && (
                    <Button 
                      variant="contained" 
                      size="small" 
                      startIcon={<Sparkles size={16} />}
                      onClick={() => setMagicModalOpen(true)}
                      sx={{ 
                        borderRadius: 2.5, 
                        fontWeight: 600,
                        boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                        bgcolor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Sync Meeting
                    </Button>
                  )}
                </Stack>
              </Box>

              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, lineHeight: 1.6, maxWidth: 800, mb: 5, fontSize: '1.15rem' }}>
                {project.description || 'No description provided.'}
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={6} sm="auto">
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1.2, display: 'block', mb: 0.5 }}>
                      Client Partner
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {clients.find(c => c.id === project.client_id)?.name || 'Unknown Client'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm="auto">
                  <Box sx={{ pl: { sm: 4 }, borderLeft: { sm: '1px solid' }, borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1.2, display: 'block', mb: 0.5 }}>
                      Target Delivery
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Calendar size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {project.due_date}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={6} sm="auto">
                  <Box sx={{ pl: { sm: 4 }, borderLeft: { sm: '1px solid' }, borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1.2, display: 'block', mb: 0.5 }}>
                      Priority
                    </Typography>
                    <Chip 
                      label={project.priority} 
                      size="small"
                      sx={{ 
                        height: 24, 
                        fontWeight: 700, 
                        borderRadius: 1.5,
                        fontSize: '0.65rem',
                        bgcolor: project.priority === 'High' ? alpha('#ef4444', 0.1) : alpha(theme.palette.text.primary, 0.05),
                        color: project.priority === 'High' ? '#ef4444' : 'text.primary'
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper 
                sx={{ 
                  p: 4, 
                  borderRadius: 8, 
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  backdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.1),
                  boxShadow: '0 25px 60px -12px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={100} 
                    size={140} 
                    thickness={4} 
                    sx={{ color: alpha(theme.palette.primary.main, 0.05) }} 
                  />
                  <CircularProgress 
                    variant="determinate" 
                    value={project.progress} 
                    size={140} 
                    thickness={4} 
                    sx={{ 
                      color: 'primary.main',
                      position: 'absolute',
                      left: 0,
                      strokeLinecap: 'round',
                      filter: `drop-shadow(0 0 8px ${alpha(theme.palette.primary.main, 0.4)})`
                    }} 
                  />
                  <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: '-2px', lineHeight: 1 }}>
                        {project.progress}%
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', fontSize: '0.6rem' }}>
                        Done
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>Project Pulse</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, mb: 4 }}>
                  {project.phases?.filter(p => p.status === 'completed' || p.status === 'Done').length || 0} of {project.phases?.length || 4} phases completed
                </Typography>

                <Box sx={{ width: '100%', bgcolor: alpha(theme.palette.divider, 0.05), p: 2, borderRadius: 4 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled', display: 'block', mb: 0.5, textAlign: 'left' }}>Collaborators</Typography>
                      <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: '0.7rem', border: '2px solid', borderColor: 'background.paper' } }}>
                        {project.team?.map((member) => (
                          <Avatar key={member.id} src={member.avatar}>{member.name?.[0]}</Avatar>
                        ))}
                        {(!project.team || project.team.length === 0) && <Avatar sx={{ width: 30, height: 30, fontSize: '0.7rem' }}>+</Avatar>}
                      </AvatarGroup>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>{project.team?.length || 0}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled' }}>Active</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <MagicImportModal 
        open={magicModalOpen} 
        onClose={() => setMagicModalOpen(false)} 
        projectId={project.id}
      />

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
