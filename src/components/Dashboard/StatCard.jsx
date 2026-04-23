import { Card, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color }) => {
  return (
    <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Box 
          sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: `${color}15`,
            color: color
          }}
        >
          <Icon size={22} strokeWidth={2.5} />
        </Box>
        {trend && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              fontSize: '0.75rem', 
              fontWeight: 700,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: trend === 'up' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              color: trend === 'up' ? '#10b981' : '#ef4444',
              border: '1px solid',
              borderColor: trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            }}
          >
            {trend === 'up' ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
            <span>{trendValue}</span>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, letterSpacing: 0.2 }}>
          {label}
        </Typography>
      </Box>
    </Card>
  );
};

export default StatCard;
