import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import moment from 'moment'; 

export default function EditProductForm({ setSelectedItem }) {
  const [product, setProduct] = useState({});
  const editingProductId = localStorage.getItem('editingProductId');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${editingProductId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProduct();
  }, [editingProductId]);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: name === 'quantity' || name === 'price' ? parseInt(value) : value
    }));
  };

  const handleSave = async () => {
    try {
      const token = getToken();

      const expirationDateIsValid = moment(product.expirationdate, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid();
      if (!expirationDateIsValid) {
        console.error('Expiration date is not in correct format');
        return; 
      }
      const formattedExpirationDate = moment(product.expirationdate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');

      const updatedProduct = {
        ...product,
        quantity: parseInt(product.quantity),
        price: parseFloat(product.price),
        expirationdate: formattedExpirationDate 
      };

      await axios.patch(`http://localhost:3000/admin/products/${editingProductId}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedItem('Product');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div>
      <TextField
        name="name"
        label="Name"
        value={product.name || ''}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        name="quantity"
        label="Quantity"
        value={product.quantity || ''}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        name="price"
        label="Price"
        value={product.price || ''}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        name="expirationdate"
        label="Expiration Date"
        value={product.expirationdate || ''}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
    </div>
  );
}
