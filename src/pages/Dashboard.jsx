import { Container, Grid, Typography, Button, Box, Paper, Stack, Divider } from '@mui/material';
import { 
  Users, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Download,
  Smartphone,
  CheckCircle2,
  Calendar,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../components/Dashboard/StatCard';
import ProjectCard from '../components/Projects/ProjectCard';
import ActivityFeed from '../components/Timeline/ActivityFeed';
import RevenueChart from '../components/Dashboard/RevenueChart';
import { DashboardSkeleton } from '../components/Feedback/LoadingSkeleton';
import { useApp } from '../context/AppContext';
import { Capacitor } from '@capacitor/core';

const Dashboard = ({ isClient = false }) => {
  const { clients, projects, invoices, loading, user, notifications, messages } = useApp();

  if (loading) return <DashboardSkeleton />;

  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((acc, inv) => acc + (parseFloat(inv.total_amount) || 0), 0);

  const unreadNotifications = notifications.filter(n => n.unread).length;
  const unreadMessages = messages.filter(m => {
    const isMe = isClient ? m.sender === 'client' : m.sender === 'admin';
    return !isMe && m.unread === true;
  }).length;
  const studioUpdatesCount = unreadNotifications + unreadMessages;

  const adminStats = [
    { icon: Users, label: 'Active Clients', value: clients.length.toString(), trend: 'up', trendValue: '+12%', color: '#3b82f6' },
    { icon: Briefcase, label: 'Ongoing Projects', value: projects.length.toString(), trend: 'up', trendValue: '+5%', color: '#10b981' },
    { icon: Clock, label: 'Pending Updates', value: studioUpdatesCount.toString(), trend: 'down', trendValue: 'None', color: '#6366f1' },
    { icon: TrendingUp, label: 'Total Revenue', value: `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`, trend: 'up', trendValue: '+8%', color: '#8b5cf6' },
  ];

  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length) 
    : 0;

  const clientStats = [
    { icon: Briefcase, label: 'Active Projects', value: projects.length.toString(), color: '#3b82f6' },
    { icon: TrendingUp, label: 'Avg. Progress', value: `${avgProgress}%`, color: '#10b981' },
    { icon: Clock, label: 'Unpaid Invoices', value: invoices.filter(inv => inv.status !== 'Paid').length.toString(), color: '#f59e0b' },
    { icon: Activity, label: 'Studio Updates', value: studioUpdatesCount.toString(), color: '#6366f1' },
  ];

  const stats = isClient ? clientStats : adminStats;
  const recentProjects = projects.slice(0, 4);

  return (
    <Box sx={{ width: '100%', pb: 5 }}>
      {/* Mobile App Download Banner */}
      {!Capacitor.isNativePlatform() && (
        <Box
          component="a"
          href="https://docs.google.com/uc?export=download&id=1Th6zZE_aXtGww2ctnu9e8pNoUzW4HlG8"
          download
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 2,
            borderRadius: 3,
            mb: 4,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Smartphone size={24} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                Get IndieCode Studio for Android
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Seamless project tracking, anytime, anywhere.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: '50%', display: 'flex' }}>
            <Download size={18} />
          </Box>
        </Box>
      )}

      <Grid container spacing={4} sx={{ m: 0, width: '100%' }}>
        {/* Stats Section */}
        {stats.map((stat, index) => (
          <Grid size={{ xs: 6, sm: 6, md: 3 }} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          </Grid>
        ))}

        {/* Main Content Area */}
        <Grid size={12}>
          <Stack spacing={4}>
            {!isClient && (
              <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 6, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden', background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)' }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>Revenue Performance</Typography>
                    <Typography variant="body2" color="text.secondary">Financial growth overview for the current half-year</Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Download size={16} />}
                    sx={{ borderRadius: 2.5, borderColor: 'divider', color: 'text.primary', px: 2 }}
                  >
                    Export Report
                  </Button>
                </Box>
                <Box sx={{ height: { xs: 300, sm: 400 }, width: '100%' }}>
                  <RevenueChart />
                </Box>
              </Paper>
            )}

            <Box>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 4, height: 24, bgcolor: 'primary.main', borderRadius: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 500, letterSpacing: '-0.01em' }}>
                    {isClient ? 'My Active Projects' : 'Active Studio Projects'}
                  </Typography>
                </Stack>
                <Button 
                  endIcon={<ArrowRight size={18} />} 
                  sx={{ color: 'primary.main', fontWeight: 500, textTransform: 'none' }}
                  onClick={() => window.location.href = '/projects'}
                >
                  View All
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {recentProjects.length > 0 ? (
                  recentProjects.map((project, index) => (
                    <Grid size={{ xs: 12, md: 6 }} key={project.id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + (index * 0.1) }}
                      >
                        <ProjectCard project={project} />
                      </motion.div>
                    </Grid>
                  ))
                ) : (
                  <Grid size={12}>
                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 5, border: '1px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
                       <Briefcase size={40} color="#cbd5e1" style={{ marginBottom: 16 }} />
                       <Typography variant="h6" color="text.secondary" fontWeight={500}>No active projects yet</Typography>
                       <Typography variant="body2" color="text.disabled">Your studio projects will appear here once started.</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
