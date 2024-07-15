import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const LargeToast = ({ isOpen, onClose, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <Paper 
              elevation={6} 
              sx={{ 
                p: 4, 
                borderRadius: 4, 
                bgcolor: 'success.main', 
                color: 'white',
                width: '300px',
                textAlign: 'center',
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, times: [0, 0.8, 1] }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 100, mb: 2 }} />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Typography variant="h4" gutterBottom>
                    {message}
                  </Typography>
                </motion.div>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default LargeToast;