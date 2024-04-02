import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ChangePasswordForm = ({ setSelectedItem }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = getToken(); 
      const response = await axios.patch('http://localhost:3000/users/change-password', {
        oldPassword: oldPassword,
        newPassword: newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      console.log('Password changed successfully:', response.data);
      setSelectedItem('Account'); 
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again.'); 
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="password"
          label="Old Password"
          value={oldPassword}
          onChange={handleOldPasswordChange}
          variant="outlined"
          color="secondary"
          style={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          type="password"
          label="New Password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          variant="outlined"
          color="secondary"
          style={{ marginBottom: '10px' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>} {}
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
