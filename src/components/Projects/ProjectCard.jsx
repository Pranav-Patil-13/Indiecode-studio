import { Card, Box, Typography, LinearProgress, IconButton, Chip, CardActionArea, useTheme, Stack, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Clock, CheckCircle2, AlertCircle, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import ConfirmDialog from '../Modals/ConfirmDialog';

const ProjectCard = ({ project, variant = 'grid' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { clients, deleteProject, showNotification, openEditProjectModal, user } = useApp();
  const { id, name, client_id, progress, status, due_date, priority } = project;
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const role = user?.user_metadata?.role || 'admin';
  const isClient = role === 'client';

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteProject(id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    openEditProjectModal(project);
  };

  const handleView = (e) => {
    e.stopPropagation();
    navigate(`/projects/${id}`);
  };

  const clientName = clients.find(c => c.id === client_id)?.name || 'Unknown Client';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Track': return <CheckCircle2 size={16} color="#10b981" />;
      case 'Delayed': return <AlertCircle size={16} color="#ef4444" />;
      case 'In Review': return <Clock size={16} color="#3b82f6" />;
      default: return <Clock size={16} color="#64748b" />;
    }
  };

  return (
    <>
      {variant === 'list' ? (
        <Card 
          sx={{ 
            p: 2.5, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            cursor: 'pointer',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }
          }}
          onClick={() => navigate(`/projects/${id}`)}
        >
          <Box sx={{ width: 300, flexShrink: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
              {name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {clientName}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, px: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                Progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 500, color: 'primary.main' }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: progress > 80 ? '#10b981' : 'primary.main',
                }
              }} 
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 110 }}>
              {getStatusIcon(status)}
              <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.primary' }}>
                {status}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
              <Clock size={14} color="#64748b" />
              <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {due_date}
              </Typography>
            </Box>

            <Chip 
              label={priority} 
              size="small"
              sx={{ 
                height: 24,
                fontSize: '0.65rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                bgcolor: priority === 'High' ? 'rgba(239, 68, 68, 0.08)' : priority === 'Medium' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                color: priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f59e0b' : '#10b981',
                borderRadius: 2,
                minWidth: 70
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} sx={{ ml: 2 }} onClick={(e) => e.stopPropagation()}>
            <IconButton size="small" onClick={handleView} title="View Details">
              <ExternalLink size={18} />
            </IconButton>
            {!isClient && (
              <>
                <IconButton size="small" onClick={handleEdit} title="Edit Project">
                  <Edit2 size={18} />
                </IconButton>
                <IconButton size="small" onClick={handleDelete} title="Delete Project" sx={{ color: 'error.main' }}>
                  <Trash2 size={18} />
                </IconButton>
              </>
            )}
          </Stack>
        </Card>
      ) : (
        <Card 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            cursor: 'pointer',
            borderRadius: 6,
            border: '1px solid',
            borderColor: 'rgba(184, 134, 11, 0.2)',
            boxShadow: 'none',
            background: 'linear-gradient(135deg, #FDB931 0%, #D4AF37 100%)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-10px)',
              borderColor: 'rgba(184, 134, 11, 0.5)',
              boxShadow: `0 30px 60px -12px ${alpha('#B8860B', 0.25)}`
            }
          }}
          onClick={() => navigate(`/projects/${id}`)}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 0.5, letterSpacing: '-0.01em' }}>
                {name}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(0,0,0,0.6)' }}>
                {clientName}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
              <IconButton 
                size="small" 
                onClick={handleView} 
                title="View Details"
                sx={{ bgcolor: 'action.hover', borderRadius: 2 }}
              >
                <ExternalLink size={18} />
              </IconButton>
              {!isClient && (
                <>
                  <IconButton 
                    size="small" 
                    onClick={handleEdit} 
                    title="Edit Project"
                    sx={{ bgcolor: 'action.hover', borderRadius: 2 }}
                  >
                    <Edit2 size={18} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={handleDelete} 
                    title="Delete Project" 
                    sx={{ color: 'error.main', bgcolor: 'rgba(239, 68, 68, 0.05)', borderRadius: 2 }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </>
              )}
            </Stack>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>
                Live Progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#000000', fontSize: '0.875rem' }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: progress > 80 ? '#10b981' : 'primary.main',
                  transition: 'transform 1s ease-in-out'
                }
              }} 
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {getStatusIcon(status)}
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#000000' }}>
                {status}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={14} color="rgba(0,0,0,0.6)" />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'rgba(0,0,0,0.6)' }}>
                  {due_date}
                </Typography>
              </Box>

              <Chip 
                label={priority} 
                size="small"
                sx={{ 
                  height: 24,
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  bgcolor: priority === 'High' ? 'rgba(239, 68, 68, 0.08)' : priority === 'Medium' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                  color: priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f59e0b' : '#10b981',
                  borderRadius: 2
                }}
              />
            </Stack>
          </Box>
        </Card>
      )}
      <ConfirmDialog 
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
        confirmText="Delete Project"
        severity="error"
      />
    </>
  );
};

export default ProjectCard;
