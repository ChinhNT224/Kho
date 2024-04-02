import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function EditUserForm({ setSelectedItem }) {
  const [user, setUser] = useState({}); 
  const editingAccountId = localStorage.getItem('editingAccountId'); 

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/accounts/${editingAccountId}`);
        setUser({
          ...response.data,
          password: '' 
        });
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    };
    fetchAccount(); 
  }, [editingAccountId]); 
  

  const getToken = () => {
    return localStorage.getItem('token');
  };  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: name === 'employeeid' || name === 'roleid' ? parseInt(value) : value 
    }));
  };

  const handleCancel = () => {
    setSelectedItem('Account');
  };

  const handleSave = async () => {
    try {
      const token = getToken();
  
      const userDataToSend = { ...user };
      if (!user.password) {
        delete userDataToSend.password;
      }
  
      await axios.patch(`http://localhost:3000/admin/accounts/${editingAccountId}`, userDataToSend, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      setSelectedItem('Account'); 
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };
  

  return (
    <div>
      {}
      <TextField
        name="loginname"
        label="Login Name"
        value={user.loginname || ''} 
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        name="email"
        label="Email"
        value={user.email || ''} 
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        name="employeeid"
        label="Employee ID"
        value={user.employeeid || ''} 
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        name="roleid"
        label="Role ID"
        value={user.roleid || ''} 
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSave} style={{ marginRight: '40px' }}>Save</Button>
      <Button variant="contained" color="primary" onClick={handleCancel}>Back</Button>
    </div>
  );
}
