import { Container, Grid, Typography, Button, Box, Paper, Stack } from '@mui/material';
import { 
  Users, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Download,
  Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../components/Dashboard/StatCard';
import ProjectCard from '../components/Projects/ProjectCard';
import ActivityFeed from '../components/Timeline/ActivityFeed';
import RevenueChart from '../components/Dashboard/RevenueChart';
import { DashboardSkeleton } from '../components/Feedback/LoadingSkeleton';
import { useApp } from '../context/AppContext';
import { Capacitor } from '@capacitor/core';

const Dashboard = () => {
  const { clients, projects, invoices, loading } = useApp();

  if (loading) return <DashboardSkeleton />;

  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((acc, inv) => acc + (parseFloat(inv.total_amount) || 0), 0);

  const stats = [
    { icon: Users, label: 'Active Clients', value: clients.length.toString(), trend: 'up', trendValue: '+12%', color: '#3b82f6' },
    { icon: Briefcase, label: 'Ongoing Projects', value: projects.length.toString(), trend: 'up', trendValue: '+5%', color: '#10b981' },
    { icon: Clock, label: 'Pending Updates', value: '0', trend: 'down', trendValue: 'None', color: '#6366f1' },
    { icon: TrendingUp, label: 'Total Revenue', value: `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`, trend: 'up', trendValue: '+8%', color: '#8b5cf6' },
  ];

  const recentProjects = projects.slice(0, 4);

  return (
    <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3, md: 5 } }}>
      {/* Mobile App Download Banner - Only shown on mobile browser, hidden on native app */}
      {!Capacitor.isNativePlatform() && (
        <Box
          component="a"
          href="/indiecode-studio.apk"
          download
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 2,
            borderRadius: 3,
            mb: 3,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Smartphone size={24} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
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

      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* Stats Row */}
        {stats.map((stat, index) => (
          <Grid size={{ xs: 6, md: 3 }} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          </Grid>
        ))}

        {/* Main Content */}
        <Grid size={{ xs: 12 }}>
          {/* Chart Section */}
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 5, mb: 5, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden' }}>
            <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>Revenue Performance</Typography>
                <Typography variant="body2" color="text.secondary">Financial growth overview for the current half-year</Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<Download size={16} />}
                sx={{ borderRadius: 2, borderColor: 'divider', color: 'text.primary', alignSelf: { xs: 'flex-start', sm: 'center' } }}
              >
                Export
              </Button>
            </Box>
            <Box sx={{ height: { xs: 300, sm: 400 }, width: '100%' }}>
              <RevenueChart />
            </Box>
          </Paper>

          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: 2, color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500 }}>
              Active Projects
            </Typography>
            <Button 
              endIcon={<ArrowRight size={16} />} 
              sx={{ color: 'primary.main', fontWeight: 500 }}
            >
              View All
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {recentProjects.map((project, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={project.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
