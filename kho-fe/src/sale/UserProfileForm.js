import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const UserProfileForm = ({ setSelectedItem }) => {
  const [profileData, setProfileData] = useState({
    loginname: '',
    email: ''
  });
  const [error, setError] = useState('');

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:3000/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const { loginname, email } = response.data;
        setProfileData({ loginname, email });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to fetch user profile. Please try again.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleLoginnameChange = (event) => {
    setProfileData({ ...profileData, loginname: event.target.value });
  };

  const handleEmailChange = (event) => {
    setProfileData({ ...profileData, email: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = getToken();
      const response = await axios.patch('http://localhost:3000/users/update-profile', {
        loginname: profileData.loginname,
        email: profileData.email
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Profile updated successfully:', response.data);
      setSelectedItem('Account');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Login Name"
          value={profileData.loginname}
          onChange={handleLoginnameChange}
          variant="outlined"
          color="secondary"
          style={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          label="Email"
          value={profileData.email}
          onChange={handleEmailChange}
          variant="outlined"
          color="secondary"
          style={{ marginBottom: '10px' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default UserProfileForm;
