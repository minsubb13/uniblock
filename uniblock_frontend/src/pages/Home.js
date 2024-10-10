import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, CircularProgress } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { getPosts } from '../services/api';
import PostCard from '../components/PostCard';

const Home = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.nickname || user?.username || 'Guest'}!
        </Typography>
        <Button
          component={RouterLink}
          to="/create-post"
          variant="contained"
          color="primary"
          sx={{ mt: 2, mb: 4 }}
        >
          Create New Post
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.pk}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;