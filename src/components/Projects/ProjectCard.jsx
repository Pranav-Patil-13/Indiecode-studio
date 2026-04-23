import { Card, Box, Typography, LinearProgress, IconButton, Chip, CardActionArea, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ProjectCard = ({ project, variant = 'grid' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { clients } = useApp();
  const { id, name, client_id, progress, status, due_date, priority } = project;

  const clientName = clients.find(c => c.id === client_id)?.name || 'Unknown Client';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Track': return <CheckCircle2 size={16} color="#10b981" />;
      case 'Delayed': return <AlertCircle size={16} color="#ef4444" />;
      case 'In Review': return <Clock size={16} color="#3b82f6" />;
      default: return null;
    }
  };

  if (variant === 'list') {
    return (
      <Card 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateX(8px)',
            bgcolor: 'action.hover',
            boxShadow: theme.palette.mode === 'light' ? '0 4px 20px rgba(0,0,0,0.05)' : '0 10px 40px rgba(0,0,0,0.4)'
          }
        }}
        onClick={() => navigate(`/projects/${id}`)}
      >
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {clientName}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, px: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 4, 
              borderRadius: 2,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                bgcolor: progress > 80 ? '#10b981' : 'primary.main',
              }
            }} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
            {getStatusIcon(status)}
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {status}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
            <Clock size={14} color="#6C757D" />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.muted' }}>
              {due_date}
            </Typography>
          </Box>

          <Chip 
            label={priority} 
            size="small"
            sx={{ 
              height: 22,
              fontSize: '0.625rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              bgcolor: priority === 'High' ? 'rgba(239, 68, 68, 0.08)' : priority === 'Medium' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              color: priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f59e0b' : '#10b981',
              borderRadius: 1.5,
              minWidth: 70
            }}
          />
        </Box>

        <IconButton size="small">
          <MoreHorizontal size={18} />
        </IconButton>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
        }
      }}
      onClick={() => navigate(`/projects/${id}`)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {clientName}
          </Typography>
        </Box>
        <IconButton size="small">
          <MoreHorizontal size={18} />
        </IconButton>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            Development Progress
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
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

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getStatusIcon(status)}
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            {status}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.default', px: 1, py: 0.5, borderRadius: 1.5 }}>
          <Clock size={14} color="#6C757D" />
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.muted' }}>
            {due_date}
          </Typography>
        </Box>

        <Chip 
          label={priority} 
          size="small"
          sx={{ 
            height: 24,
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            bgcolor: priority === 'High' ? 'rgba(239, 68, 68, 0.08)' : priority === 'Medium' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            color: priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f59e0b' : '#10b981',
            borderRadius: 1.5
          }}
        />
      </Box>
    </Card>
  );
};

export default ProjectCard;
