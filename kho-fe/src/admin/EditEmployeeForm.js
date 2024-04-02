import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function EditEmployeeForm({ setSelectedItem }) {
  const [user, setUser] = useState({}); 
  const editingEmployeeId = localStorage.getItem('editingEmployeeId'); 

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/employees/${editingEmployeeId}`);
        setUser(response.data); 
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };
    fetchEmployee(); 
  }, [editingEmployeeId]); 

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

  const handleSave = async () => {
    try {
      const token = getToken(); 

      await axios.patch(`http://localhost:3000/employees/${editingEmployeeId}`, {
        name: user.name,
        phonenumber: user.phonenumber
      }, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      setSelectedItem('Employee'); 
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div>
      <TextField
        name="name"
        label="Name"
        value={user.name || ''} 
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        name="phonenumber"
        label="Phone Number"
        value={user.phonenumber || ''} 
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
    </div>
  );
}
