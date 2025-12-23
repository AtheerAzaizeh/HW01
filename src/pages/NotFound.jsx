import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Box
            sx={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
            <Typography variant="h1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                404
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
                Oops! We can't find that page.
            </Typography>
            <Button
                variant="contained"
                component={Link}
                to="/"
                sx={{ px: 4, py: 1.5 }}
            >
                Back to Home
            </Button>
        </Box>
    );
};

export default NotFound;
