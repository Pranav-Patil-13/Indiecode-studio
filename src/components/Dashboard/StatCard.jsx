import { Card, Box, Typography, Stack, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, trend, trendValue }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card 
        sx={{ 
          p: { xs: 2.5, sm: 3.5 }, 
          borderRadius: 6, 
          border: '1px solid', 
          borderColor: 'rgba(184, 134, 11, 0.3)', 
          boxShadow: `0 20px 40px -12px ${alpha('#B8860B', 0.2)}`,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #FDB931 0%, #D4AF37 50%, #AF9134 100%)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: { xs: 140, sm: 180 },
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 30px 60px -12px ${alpha('#B8860B', 0.3)}`,
            transform: 'translateY(-4px)'
          }
        }}
      >
        {/* Decorative Background Shapes */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -20, 
            right: -20, 
            width: 100, 
            height: 100, 
            borderRadius: '50%', 
            background: `radial-gradient(circle, ${alpha(color, 0.1)} 0%, transparent 70%)`,
            filter: 'blur(15px)',
            zIndex: 0
          }} 
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, position: 'relative', zIndex: 1 }}>
          <Box 
            sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: 3.5, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.05)',
              color: '#000000',
              boxShadow: '0 8px 16px -8px rgba(0,0,0,0.1)',
            }}
          >
            <Icon size={22} strokeWidth={2.5} />
          </Box>

          {trendValue && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: 2,
                bgcolor: isPositive ? alpha('#10b981', 0.08) : alpha('#f43f5e', 0.08),
                color: isPositive ? '#059669' : '#e11d48',
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            >
              {isPositive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
              {trendValue}
            </Box>
          )}
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, mt: 'auto' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 600, 
              letterSpacing: '-0.04em',
              color: '#000000',
              lineHeight: 1,
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2.25rem' }
            }}
          >
            {value}
          </Typography>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              color: 'rgba(0,0,0,0.6)',
              fontSize: '0.65rem',
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
