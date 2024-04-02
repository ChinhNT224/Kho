import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AddEmployeeForm = ({ setSelectedItem }) => { 
  const [formData, setFormData] = useState({
    name: '',
    phonenumber: ''
  });

  const [isFormCompleted, setIsFormCompleted] = useState(false);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setIsFormCompleted(
      formData.name !== '' &&
      formData.phonenumber !== ''
    );
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = getToken();

      await axios.post('http://localhost:3000/admin/employees', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Nhân viên mới đã được tạo.');
      setSelectedItem('Employee');
    } catch (error) {
      console.error('Lỗi khi thêm nhân viên:', error);
    }
  };

  return (
    <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
      <Grid container spacing={2} alignItems="center" style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
        <Grid item xs={12} sm={6}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              variant="outlined"
              color="secondary"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleFieldChange}
              variant="outlined"
              color="secondary"
              style={{ marginBottom: '10px' }}
            />
            <Button type="submit" variant="contained" color="primary" disabled={!isFormCompleted}>
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddEmployeeForm;
