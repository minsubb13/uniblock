import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { useUser } from '../contexts/UserContext';

const Main = () => {
  const { user } = useUser();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
          Vote on online
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          "Trust in Every Vote, Secured by Blockchain"<br />
          블록체인을 이용한 온라인 투표 서비스 개발
        </Typography>
        <Typography component="h4" align="center" color="text.primary" gutterBottom>
          팀 uniblock
        </Typography>
        <Typography component="h6" align="center" color="text.primary" gutterBottom>
          최민섭 정보융합학부 2018204048<br />
          이경복 전자통신공학부 2022707006<br />
          이재윤 정보융합학부 2023204048<br />
          이주석 정보융합학부 2024404003<br />
          최세인 정보융합학부 2023204028
        </Typography>
        <Box sx={{ mt: 4 }}>
          {user ? (
            <Button
              component={RouterLink}
              to="/home"
              variant="contained"
              color="primary"
              size="large"
            >
              Go to Home
            </Button>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mr: 2 }}
              >
                Sign Up
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="primary"
                size="large"
              >
                Log In
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Main;