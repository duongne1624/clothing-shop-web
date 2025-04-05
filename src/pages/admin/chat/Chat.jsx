
import React from 'react'
import { Box, Typography } from '@mui/material';
import AdminChatPanel from '../../../components/Chat/AdminChatPanel'

const AdminChatPage = () => {
  return (
    <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ p: 2 }}>
        Quản lý trò chuyện
      </Typography>
      <Box sx={{ height: 'calc(100% - 60px)' }}>
        <AdminChatPanel />
      </Box>
    </Box>
  );
};

export default AdminChatPage;