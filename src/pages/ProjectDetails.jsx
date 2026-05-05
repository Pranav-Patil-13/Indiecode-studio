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
  TextField,
  alpha
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
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Refined Header Section */}
      <Box 
        sx={{ 
          pt: 4,
          pb: 6,
          px: { xs: 2, md: 0 },
          position: 'relative',
          mb: 4
        }}
      >
        {/* Subtle Background Glow */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -100, 
            right: -50, 
            width: 500, 
            height: 400, 
            borderRadius: '50%', 
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            zIndex: 0
          }} 
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Top Bar: Breadcrumbs + Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <IconButton 
                onClick={() => navigate('/projects')} 
                size="small" 
                sx={{ 
                  bgcolor: 'background.paper', 
                  border: '1px solid', 
                  borderColor: 'divider',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <ArrowLeft size={16} />
              </IconButton>
              <Breadcrumbs 
                separator={<ChevronRight size={14} />} 
                sx={{ '& .MuiBreadcrumbs-li': { fontSize: '0.85rem', fontWeight: 500 } }}
              >
                <Link 
                  underline="hover" 
                  color="inherit" 
                  href="/projects" 
                  onClick={(e) => { e.preventDefault(); navigate('/projects'); }}
                  sx={{ color: 'text.secondary' }}
                >
                  Projects
                </Link>
                <Typography color="text.primary" sx={{ fontWeight: 600 }}>{project.name}</Typography>
              </Breadcrumbs>
            </Stack>

            <Stack direction="row" spacing={1.5}>
              {!isClient && (
                <IconButton 
                  size="small" 
                  onClick={() => openEditProjectModal(project)}
                  sx={{ 
                    border: '1px solid', 
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover', color: 'primary.main' }
                  }}
                >
                  <Edit2 size={16} />
                </IconButton>
              )}
              {!isClient && (
                <Button 
                  variant="contained" 
                  size="small" 
                  startIcon={<Sparkles size={16} />}
                  onClick={() => setMagicModalOpen(true)}
                  sx={{ 
                    borderRadius: 2, 
                    fontWeight: 600,
                    px: 2,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }
                  }}
                >
                  Sync Meeting
                </Button>
              )}
            </Stack>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={7.5} lg={8}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                <Chip 
                  label={project.status} 
                  size="small" 
                  sx={{ 
                    fontWeight: 600, 
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    height: 22,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase'
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, letterSpacing: 1 }}>
                  ID: {project.id.split('-')[0].toUpperCase()} • CREATED {new Date(project.created_at).toLocaleDateString()}
                </Typography>
              </Stack>

              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  letterSpacing: '-0.02em', 
                  color: 'text.primary', 
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                {project.name}
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, maxWidth: 700, mb: 5, fontSize: '1.05rem' }}>
                {project.description || 'No description provided.'}
              </Typography>

              <Stack direction="row" spacing={5} flexWrap="wrap" useFlexGap sx={{ gap: 4 }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>
                    Client
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {clients.find(c => c.id === project.client_id)?.name || 'Unknown Client'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>
                    Deadline
                  </Typography>
                  <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                    <Calendar size={14} color={theme.palette.text.secondary} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {project.due_date}
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>
                    Priority
                  </Typography>
                  <Chip 
                    label={project.priority} 
                    size="small"
                    sx={{ 
                      height: 20, 
                      fontWeight: 600, 
                      borderRadius: 1,
                      fontSize: '0.65rem',
                      bgcolor: project.priority === 'High' ? alpha('#ef4444', 0.1) : alpha(theme.palette.text.disabled, 0.1),
                      color: project.priority === 'High' ? '#ef4444' : 'text.secondary'
                    }}
                  />
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4.5} lg={4}>
              <Paper 
                sx={{ 
                  p: 3.5, 
                  borderRadius: 6, 
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3
                }}
              >
                <Box sx={{ position: 'relative', display: 'flex' }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={100} 
                    size={80} 
                    thickness={5} 
                    sx={{ color: 'action.hover' }} 
                  />
                  <CircularProgress 
                    variant="determinate" 
                    value={project.progress} 
                    size={80} 
                    thickness={5} 
                    sx={{ 
                      color: 'primary.main',
                      position: 'absolute',
                      left: 0,
                      strokeLinecap: 'round'
                    }} 
                  />
                  <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {project.progress}%
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.2 }}>Project Progress</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
                    {project.phases?.filter(p => p.status === 'completed' || p.status === 'Done').length || 0} of {project.phases?.length || 4} phases done
                  </Typography>
                  
                  <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 26, height: 26, fontSize: '0.65rem' } }}>
                    {project.team?.map((member) => (
                      <Avatar key={member.id} src={member.avatar}>{member.name?.[0]}</Avatar>
                    ))}
                    {(!project.team || project.team.length === 0) && <Avatar sx={{ width: 26, height: 26 }}>+</Avatar>}
                  </AvatarGroup>
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
