import React, { useMemo, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Box, Typography, Paper, useTheme, alpha, Stack, Button } from '@mui/material';
import { useApp } from '../../context/AppContext';

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
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Revenue: ₹{payload[0].value.toLocaleString('en-IN')}
          </Typography>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
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
  const { invoices, projects } = useApp();
  const [timeRange, setTimeRange] = useState('1M'); // '1M', '3M', '6M', '1Y'

  const ranges = [
    { label: 'Monthly', value: '1M' },
    { label: 'Quarterly', value: '3M' },
    { label: 'Half-Year', value: '6M' },
    { label: 'Yearly', value: '1Y' },
  ];

  const chartData = useMemo(() => {
    const data = [];
    const dataMap = {};
    const d = new Date();
    
    if (timeRange === '1M') {
      // Generate from 1st of current month to current date
      const daysInMonth = d.getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const pastDate = new Date(d.getFullYear(), d.getMonth(), i);
        const label = pastDate.toLocaleDateString('default', { day: '2-digit', month: 'short' });
        const key = pastDate.toISOString().split('T')[0];
        data.push({ label, key, revenue: 0, projects: 0 });
        dataMap[key] = data[data.length - 1];
      }

      // Process invoices
      invoices.forEach(inv => {
        if (inv.status !== 'Paid') return;
        // Use paid_at if available, fallback to created_at
        const date = new Date(inv.paid_at || inv.created_at || Date.now()).toISOString().split('T')[0];
        if (dataMap[date]) {
          dataMap[date].revenue += parseFloat(inv.total_amount) || 0;
        }
      });

      // Process projects
      projects.forEach(p => {
        const date = new Date(p.created_at || Date.now()).toISOString().split('T')[0];
        if (dataMap[date]) {
          dataMap[date].projects += 1;
        }
      });
    } else {
      // Monthly aggregation for 3M, 6M, 1Y
      const monthCount = timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12;
      const months = [];
      
      for (let i = monthCount - 1; i >= 0; i--) {
        const pastDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
        const monthName = pastDate.toLocaleString('default', { month: 'short' });
        const year = pastDate.getFullYear();
        const key = `${monthName} ${year}`;
        months.push(key);
        dataMap[key] = { label: monthName, revenue: 0, projects: 0 };
      }

      invoices.forEach(inv => {
        if (inv.status !== 'Paid') return;
        const pastDate = new Date(inv.paid_at || inv.created_at || Date.now());
        const key = `${pastDate.toLocaleString('default', { month: 'short' })} ${pastDate.getFullYear()}`;
        if (dataMap[key]) {
          dataMap[key].revenue += parseFloat(inv.total_amount) || 0;
        }
      });

      projects.forEach(p => {
        const pastDate = new Date(p.created_at || Date.now());
        const key = `${pastDate.toLocaleString('default', { month: 'short' })} ${pastDate.getFullYear()}`;
        if (dataMap[key]) {
          dataMap[key].projects += 1;
        }
      });

      return months.map(m => dataMap[m]);
    }

    return data;
  }, [invoices, projects, timeRange]);

  return (
    <Box sx={{ width: '100%', height: 400, minWidth: 0, mt: 2 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 3, justifyContent: 'flex-end' }}>
        {ranges.map((range) => (
          <Button
            key={range.value}
            size="small"
            variant={timeRange === range.value ? "contained" : "text"}
            onClick={() => setTimeRange(range.value)}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              fontWeight: 600,
              px: 2,
              color: timeRange === range.value ? 'white' : 'text.secondary',
              bgcolor: timeRange === range.value ? 'primary.main' : 'transparent',
              '&:hover': {
                bgcolor: timeRange === range.value ? 'primary.dark' : 'action.hover',
              }
            }}
          >
            {range.label}
          </Button>
        ))}
      </Stack>
      <ResponsiveContainer width="100%" height={320} debounce={50}>
        <AreaChart
          data={chartData}
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
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fontWeight: 500, fill: theme.palette.text.secondary }}
            interval={0}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fontWeight: 500, fill: theme.palette.text.secondary }}
            tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
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
