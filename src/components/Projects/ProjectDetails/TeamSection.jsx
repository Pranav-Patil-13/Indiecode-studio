import React from 'react';
import { Box, Paper, Typography, Stack, Avatar, Button, IconButton, Grid, useTheme } from '@mui/material';
import { Plus, Mail, MoreHorizontal, Shield, User } from 'lucide-react';

const TeamSection = ({ project, isClient = false }) => {
  const theme = useTheme();
  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500, letterSpacing: '-0.02em', mb: 0.5 }}>Team Collaboration</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Manage access and roles for this project</Typography>
        </Box>
        {!isClient && (
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />}
            sx={{ borderRadius: 2.5, width: { xs: '100%', sm: 'auto' } }}
          >
            Invite Member
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {project.team?.map((member) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={member.id}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 6, 
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: theme.palette.mode === 'light' ? '0 4px 20px rgba(0,0,0,0.02)' : '0 10px 40px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                  transform: 'translateY(-4px)',
                  borderColor: 'primary.main'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    fontSize: '1.5rem', 
                    fontWeight: 500,
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.1)'
                  }}
                >
                  {member.avatar}
                </Avatar>
                {!isClient && <IconButton size="small" sx={{ height: 32, width: 32 }}><MoreHorizontal size={20} /></IconButton>}
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5, letterSpacing: '-0.01em' }}>
                {member.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                {member.role === 'Project Lead' ? <Shield size={16} color="#f59e0b" fill="#fef3c7" /> : <User size={16} />}
                {member.role}
              </Typography>

              <Stack direction="row" spacing={1.5}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="small" 
                  disableElevation
                  startIcon={<Mail size={14} />}
                  sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 500, py: 1 }}
                >
                  Message
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  size="small"
                  color="inherit"
                  sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 500, borderColor: 'divider', py: 1 }}
                >
                  Profile
                </Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TeamSection;
