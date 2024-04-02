import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function AddUserForm({ setSelectedItem }) { 
  const [formData, setFormData] = useState({
    loginname: '',
    password: '',
    email: '',
    employeeid: 0,
    roleid: 0
  });

  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [isEmployeeIdNumber, setIsEmployeeIdNumber] = useState(true);
  const [isRoleIdNumber, setIsRoleIdNumber] = useState(true);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setIsFormCompleted(
      formData.loginname !== '' &&
      formData.password !== '' &&
      formData.email !== '' &&
      formData.employeeid !== 0 &&
      formData.roleid !== 0 &&
      isEmployeeIdNumber &&
      isRoleIdNumber
    );
  }, [formData, isEmployeeIdNumber, isRoleIdNumber]);

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    if (!isFormCompleted) {
      alert('Vui lòng nhập đầy đủ thông tin và đảm bảo Employee ID và Role ID là số trước khi gửi.');
      return;
    }
    try {
      const requestData = {
        ...formData,
        employeeid: parseInt(formData.employeeid), 
        roleid: parseInt(formData.roleid)
      };
      console.log('Dữ liệu truyền vào:', requestData);
      const response = await axios.post('http://localhost:3000/accounts', requestData);
      console.log('Tài khoản mới đã được tạo:', response.data);
      setFormData({
        loginname: '',
        password: '',
        email: '',
        employeeid: 0,
        roleid: 0
      });
      setSelectedItem('Account');
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản mới:', error);
    }
  };

  const handleCancel = () => {
    setSelectedItem('Account');
  };

  useEffect(() => {
    setIsEmployeeIdNumber(!isNaN(formData.employeeid));
  }, [formData.employeeid]);

  useEffect(() => {
    setIsRoleIdNumber(!isNaN(formData.roleid));
  }, [formData.roleid]);

  useEffect(() => {
    if (!isEmployeeIdNumber) {
      console.log('Employee ID không phải là số.');
    }
  }, [isEmployeeIdNumber]);

  useEffect(() => {
    if (!isRoleIdNumber) {
      console.log('Role ID không phải là số.');
    }
  }, [isRoleIdNumber]);

  return (
    <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
      <Grid container spacing={2} alignItems="center" style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
        <Grid item xs={12} sm={6}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Login Name"
              name="loginname"
              value={formData.loginname}
              onChange={handleFieldChange}
              variant="outlined"
              color="secondary"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleFieldChange}
              variant="outlined"
              color="secondary"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleFieldChange}
              variant="outlined"
              color="secondary"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              fullWidth
              label="Employee ID"
              name="employeeid"
              type="number"
              value={formData.employeeid}
              onChange={handleFieldChange}
              variant="outlined"
              color="secondary"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              fullWidth
              label="Role ID"
              name="roleid"
              type="number"
              value={formData.roleid}
              onChange={handleFieldChange}
              variant="outlined"
              color="secondary"
              style={{ marginBottom: '10px' }}
            />
            <Button type="submit" variant="contained" color="primary" disabled={!isFormCompleted} style={{ marginRight: '40px' }}>
              Submit
            </Button>
            <Button variant="contained" color="primary" onClick={handleCancel}>
              Back
            </Button>
          </form>
        </Grid>
      </Grid>
    </Paper>
  );
}
