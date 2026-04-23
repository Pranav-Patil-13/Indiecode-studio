import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Box, Typography, Paper, useTheme, alpha } from '@mui/material';

const data = [
  { month: 'Jan', revenue: 0, projects: 0 },
  { month: 'Feb', revenue: 0, projects: 0 },
  { month: 'Mar', revenue: 0, projects: 0 },
  { month: 'Apr', revenue: 0, projects: 0 },
  { month: 'May', revenue: 0, projects: 0 },
  { month: 'Jun', revenue: 0, projects: 0 },
  { month: 'Jul', revenue: 0, projects: 0 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper 
        sx={{ 
          p: 1.5, 
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', 
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 2
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Revenue: ₹{payload[0].value}L
          </Typography>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
            {payload[0].payload.projects} Active Projects
          </Typography>
        </Box>
      </Paper>
    );
  }
  return null;
};

const RevenueChart = () => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  return (
    <Box sx={{ width: '100%', height: 350, minWidth: 0, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.15}/>
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={alpha(theme.palette.divider, 0.5)} 
          />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fontWeight: 600, fill: theme.palette.text.secondary }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fontWeight: 600, fill: theme.palette.text.secondary }}
            tickFormatter={(value) => `₹${value}L`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke={primaryColor} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            animationBegin={300}
            animationDuration={2000}
            activeDot={{ r: 6, strokeWidth: 0, fill: primaryColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueChart;
