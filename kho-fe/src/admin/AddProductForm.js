import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AddProductForm = ({ setSelectedItem }) => { 
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    price: 0,
    expirationdate: new Date().toISOString()
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
      formData.quantity !== '' && 
      formData.price !== '' && 
      formData.expirationdate !== ''
    );
  }, [formData]);

  const expirationDateWithSeconds = `${formData.expirationdate}:00`;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = getToken();

      const requestData = {
        ...formData,
        quantity: parseInt(formData.quantity), 
        price: parseFloat(formData.price), 
        expirationdate: expirationDateWithSeconds
      };

      await axios.post('http://localhost:3000/admin/products', requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Sản phẩm mới đã được tạo.');
      setSelectedItem('Product');
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
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
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleFieldChange}
              variant="outlined"
              color="secondary"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleFieldChange}
              variant="outlined"
              color="secondary"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              fullWidth
              label="Expiration Date"
              name="expirationdate"
              type="datetime-local"
              value={formData.expirationdate}
              onChange={handleFieldChange}
              variant="outlined"
              color="secondary"
              style={{ marginBottom: '10px' }}
              InputLabelProps={{ shrink: true }}
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

export default AddProductForm;
