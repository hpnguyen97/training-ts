/* eslint-disable @typescript-eslint/space-before-function-paren */
import React from 'react';
import { Typography, Container, Box } from '@mui/material';

import FormLogin from '../components/FormLogin';

function Copyright(props: any): JSX.Element {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'© '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Login(): JSX.Element {
  const handleSubmit = (): void => {
    console.log('abcs');
  };
  return (
    <Box
      sx={{
        bgcolor: '#00bcd4',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
      }}
    >
      <Container maxWidth="xs" sx={{ marginTop: 7 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ color: '#fff', fontSize: '36px' }}
          mt={3}
        >
          TEST
        </Typography>
        <FormLogin handleSubmit={handleSubmit} />
        <Copyright sx={{ mb: 4 }} />
      </Container>
    </Box>
  );
}

export default Login;
