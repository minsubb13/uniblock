import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { getProfile, updateProfile } from '../services/api';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    nickname: '',
    department: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setFormData({
          nickname: data.nickname || '',
          department: data.department || ''
        });
      } catch (err) {
        setError('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const updatedProfile = await updateProfile(formData);
      updateUser(updatedProfile);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
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
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Edit Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nickname"
            label="Nickname"
            name="nickname"
            autoComplete="nickname"
            autoFocus
            value={formData.nickname}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="department"
            label="Department"
            name="department"
            autoComplete="department"
            value={formData.department}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Profile'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditProfile;