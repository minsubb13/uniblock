import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { getPost, voteOnPost, getTallyForPost } from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [voteResult, setVoteResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostAndTally = async () => {
      try {
        const [postData, tallyData] = await Promise.all([
          getPost(id),
          getTallyForPost(id)
        ]);
        setPost(postData);
        setVoteResult(tallyData);
      } catch (err) {
        setError('Failed to fetch post details. Please try again later.');
        console.error('Error fetching post details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndTally();
  }, [id]);

  const handleVote = async (choice) => {
    setVoting(true);
    setError('');
    try {
      await voteOnPost(id, choice);
      const newTally = await getTallyForPost(id);
      setVoteResult(newTally);
    } catch (err) {
      setError('Failed to submit your vote. Please try again.');
      console.error('Error voting:', err);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post?.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {post?.content}
        </Typography>
        <Box sx={{ mt: 4, mb: 2 }}>
          {voting ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleVote('O')} 
                sx={{ mr: 2 }}
                disabled={voting}
              >
                동의
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => handleVote('X')}
                disabled={voting}
              >
                비동의
              </Button>
            </>
          )}
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Typography>
        )}
        {voteResult && (
          <Typography variant="h6">
            투표 결과: 동의 {voteResult.O}, 비동의 {voteResult.X}
          </Typography>
        )}
        <Button onClick={() => navigate('/home')} sx={{ mt: 4 }}>
          목록으로 돌아가기
        </Button>
      </Box>
    </Container>
  );
};

export default PostDetail;