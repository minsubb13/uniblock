import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

const PostCard = ({ post }) => {
  if (!post || !post.pk) {
    return null; // or return some placeholder/error component
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          By: {post.profile?.nickname || 'Anonymous'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Department: {post.profile?.department || 'N/A'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={`/post/${post.pk}`}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default PostCard;