import { Container, Grid, Typography, Button, Box, Paper, Stack } from '@mui/material';
import { 
  Users, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../components/Dashboard/StatCard';
import ProjectCard from '../components/Projects/ProjectCard';
import ActivityFeed from '../components/Timeline/ActivityFeed';
import RevenueChart from '../components/Dashboard/RevenueChart';
import { DashboardSkeleton } from '../components/Feedback/LoadingSkeleton';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { clients, projects, loading } = useApp();

  if (loading) return <DashboardSkeleton />;

  const totalRevenue = clients.reduce((acc, client) => {
    const amount = parseFloat(client.revenue?.replace(/[₹,L]/g, '') || 0);
    return acc + amount;
  }, 0);

  const stats = [
    { icon: Users, label: 'Active Clients', value: clients.length.toString(), trend: 'up', trendValue: '+0', color: '#3b82f6' },
    { icon: Briefcase, label: 'Ongoing Projects', value: projects.length.toString(), trend: 'up', trendValue: '+0', color: '#10b981' },
    { icon: Clock, label: 'Pending Updates', value: '0', trend: 'down', trendValue: '-0', color: '#6366f1' },
    { icon: TrendingUp, label: 'Total Revenue', value: `₹${totalRevenue.toFixed(1)}L`, trend: 'up', trendValue: '+0%', color: '#8b5cf6' },
  ];

  const recentProjects = projects.slice(0, 4);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Stats Row */}
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
          <Paper sx={{ p: 4, borderRadius: 5, mb: 5, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Revenue Performance</Typography>
                <Typography variant="body2" color="text.secondary">Financial growth overview for the current half-year</Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<Download size={16} />}
                sx={{ borderRadius: 2, borderColor: 'divider', color: 'text.primary' }}
              >
                Export
              </Button>
            </Box>
            <RevenueChart />
          </Paper>

          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: 2, color: 'text.secondary', fontSize: '0.875rem', fontWeight: 700 }}>
              Active Projects
            </Typography>
            <Button 
              endIcon={<ArrowRight size={16} />} 
              sx={{ color: 'primary.main', fontWeight: 700 }}
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
