import { Card, Box, Typography, Stack, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, trend, trendValue }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: { xs: 4, sm: 6 }, 
          border: '1px solid', 
          borderColor: alpha(color, 0.12), 
          boxShadow: `0 20px 40px -20px ${alpha(color, 0.15)}`,
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(145deg, #ffffff 0%, ${alpha(color, 0.03)} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: { xs: 130, sm: 160 },
        }}
      >
        {/* Abstract Background Glow */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -30, 
            right: -30, 
            width: { xs: 80, sm: 120 }, 
            height: { xs: 80, sm: 120 }, 
            borderRadius: '50%', 
            background: `radial-gradient(circle, ${alpha(color, 0.15)} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            zIndex: 0
          }} 
        />

        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
          <Box 
            sx={{ 
              width: { xs: 36, sm: 48 }, 
              height: { xs: 36, sm: 48 }, 
              borderRadius: { xs: 1.5, sm: 4 }, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
              color: '#fff',
              boxShadow: `0 10px 25px -8px ${color}`,
            }}
          >
            <Icon size={18} strokeWidth={2.5} />
          </Box>

          {trendValue && (
            <Box 
              sx={{ 
                display: { xs: 'none', sm: 'flex' }, 
                alignItems: 'center', 
                gap: 0.5,
                px: 1.2,
                py: 0.6,
                borderRadius: 2,
                bgcolor: isPositive ? alpha('#10b981', 0.1) : alpha('#f43f5e', 0.1),
                color: isPositive ? '#059669' : '#e11d48',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid',
                borderColor: isPositive ? alpha('#10b981', 0.2) : alpha('#f43f5e', 0.2),
              }}
            >
              {isPositive ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />}
              {trendValue}
            </Box>
          )}
        </Stack>

        <Box sx={{ position: 'relative', zIndex: 1, mt: 'auto' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              letterSpacing: '-0.03em',
              color: '#0f172a',
              lineHeight: 1.1,
              mb: 0.5,
              fontSize: { xs: '1.25rem', sm: '2.125rem' }
            }}
          >
            {value}
          </Typography>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.12em', 
              color: 'text.secondary',
              fontSize: { xs: '0.6rem', sm: '0.65rem' },
              opacity: 0.8
            }}
          >
            {label}
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
};

export default StatCard;
