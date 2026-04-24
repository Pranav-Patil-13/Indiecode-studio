import React from 'react';
import { Box, Skeleton, Grid, Container, Paper, Stack, Divider } from '@mui/material';

const StatCardSkeleton = () => (
  <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 1 }} />
    </Box>
    <Skeleton width="60%" height={40} sx={{ mb: 1 }} />
    <Skeleton width="40%" height={24} />
  </Paper>
);

const ProjectCardSkeleton = () => (
  <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rounded" width={24} height={24} />
    </Box>
    <Skeleton width="80%" height={28} sx={{ mb: 1 }} />
    <Skeleton width="50%" height={20} sx={{ mb: 3 }} />
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Skeleton width={40} height={16} />
        <Skeleton width={30} height={16} />
      </Box>
      <Skeleton variant="rounded" height={8} sx={{ borderRadius: 4 }} />
    </Box>
    <Divider sx={{ my: 2 }} />
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Skeleton width={80} height={20} />
      <Skeleton width={60} height={20} />
    </Box>
  </Paper>
);

const ActivityItemSkeleton = () => (
  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
    <Skeleton variant="circular" width={40} height={40} />
    <Box sx={{ flex: 1 }}>
      <Skeleton width="90%" height={20} sx={{ mb: 0.5 }} />
      <Skeleton width="40%" height={16} />
    </Box>
  </Box>
);

export const DashboardSkeleton = () => (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <Grid container spacing={4}>
      {/* Stats Row */}
      {[1, 2, 3, 4].map((i) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
          <StatCardSkeleton />
        </Grid>
      ))}

      {/* Main Content */}
      <Grid size={{ xs: 12 }}>
        {/* Chart Section */}
        <Paper sx={{ p: 4, borderRadius: 5, mb: 5, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Skeleton width={200} height={32} sx={{ mb: 1 }} />
              <Skeleton width={300} height={20} />
            </Box>
            <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
          </Box>
          <Skeleton variant="rounded" height={350} sx={{ borderRadius: 4, width: '100%' }} />
        </Paper>

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width={180} height={32} />
          <Skeleton width={100} height={24} />
        </Box>
        
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, md: 6 }} key={i}>
              <ProjectCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  </Container>
);

export const ProjectDetailsSkeleton = () => (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <Box sx={{ mb: 4 }}>
      <Skeleton width={120} height={20} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton width="60%" height={60} sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton width={150} height={24} />
            <Skeleton width={100} height={24} />
          </Box>
        </Box>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width={140} height={44} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={120} height={44} sx={{ borderRadius: 2 }} />
        </Stack>
      </Box>
    </Box>

    <Paper sx={{ p: 0, borderRadius: 5, border: '1px solid', borderColor: 'divider', overflow: 'hidden', mb: 5 }}>
      <Box sx={{ p: 4, bgcolor: 'action.hover' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton width={150} height={24} />
          <Skeleton width={60} height={24} />
        </Box>
        <Skeleton variant="rounded" height={12} sx={{ borderRadius: 6 }} />
      </Box>
      <Box sx={{ px: 4, py: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={4}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width={100} height={48} />
          ))}
        </Stack>
      </Box>
    </Paper>

    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 4, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
          <Skeleton width={200} height={32} sx={{ mb: 4 }} />
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton width={150} height={24} />
                <Skeleton width={32} height={32} variant="circular" />
              </Box>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={4}>
          <Paper sx={{ p: 4, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
            <Skeleton width="60%" height={28} sx={{ mb: 3 }} />
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="80%" height={20} />
                  <Skeleton width="40%" height={16} />
                </Box>
              </Box>
            ))}
          </Paper>
          <Paper sx={{ p: 4, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
            <Skeleton width="60%" height={28} sx={{ mb: 3 }} />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 2, borderRadius: 2 }} />
            ))}
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  </Container>
);
