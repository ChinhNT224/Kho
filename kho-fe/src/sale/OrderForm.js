import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { format } from 'date-fns';
import Paper from '@mui/material/Paper';

function OrderForm() {
  const [products, setProducts] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); 
  const [orderType, setOrderType] = useState(''); 
  const [price, setPrice] = useState(0); 
  const [orderDetails, setOrderDetails] = useState([]); 
  const [totalCost, setTotalCost] = useState(0); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      const availableProducts = data.filter(product => product.quantity > 0); 
      setProducts(availableProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleAddToOrder = async () => {
    if (selectedProduct) {
      const existingOrderDetailIndex = orderDetails.findIndex(detail => detail.productid === selectedProduct.productid);
      if (existingOrderDetailIndex !== -1) {
        const updatedOrderDetails = orderDetails.filter((_, index) => index !== existingOrderDetailIndex);
        const newOrderDetail = {
          productid: selectedProduct.productid,
          name: selectedProduct.name,
          price: orderType === 'nhập' ? price : selectedProduct.price, 
          quantity: quantity,
          total: (orderType === 'nhập' ? price : selectedProduct.price) * quantity 
        };
        setOrderDetails([...updatedOrderDetails, newOrderDetail]);
        setTotalCost(totalCost - (orderType === 'nhập' ? orderDetails[existingOrderDetailIndex].price : selectedProduct.price) * orderDetails[existingOrderDetailIndex].quantity + (orderType === 'nhập' ? price : selectedProduct.price) * quantity);
      } else {
        const newOrderDetail = {
          productid: selectedProduct.productid,
          name: selectedProduct.name,
          price: orderType === 'nhập' ? price : selectedProduct.price, 
          quantity: quantity,
          total: (orderType === 'nhập' ? price : selectedProduct.price) * quantity 
        };
        setOrderDetails([...orderDetails, newOrderDetail]);
        setTotalCost(totalCost + (orderType === 'nhập' ? price : selectedProduct.price) * quantity);
      }
      setSelectedProduct(null);
      setQuantity(1);
    } else {
      console.log('Please select a product.');
    }
  };  

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleProductChange = (event) => {
    const productId = event.target.value;
    const selected = products.find(product => product.productid === Number(productId));
    setSelectedProduct(selected);
    setPrice(selected?.price || 0); 
  };

  const submitOrder = async () => {
    try {
      const token = getToken();
      const currentDate = format(new Date(), 'yyyy-MM-dd'); 
      const requestBody = {
        order: {
          createdate: currentDate, 
          type: orderType,
        },
        orderDetails: orderDetails.map(detail => ({ productid: detail.productid, price: detail.price, quantity: detail.quantity })), 
      };
  
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        console.log('Order created successfully.');
        fetchProducts();
        clearOrderDetails(); 
      } else {
        console.error('Failed to create order:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const clearOrderDetails = () => {
    setOrderDetails([]); 
    setTotalCost(0); 
  };

  return (
    <div>
      <TextField
        select
        label="Order Type"
        value={orderType}
        onChange={(event) => {
          setOrderType(event.target.value);
          clearOrderDetails(); 
        }}
        SelectProps={{
          native: true,
        }}
        fullWidth
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: '20px' }}
      >
        <option value="">Select Order Type</option>
        <option value="nhập">Nhập</option>
        <option value="xuất">Xuất</option>
      </TextField>
      <TextField
        select
        label="Select Product"
        value={selectedProduct ? selectedProduct.id : ''}
        onChange={handleProductChange}
        SelectProps={{
          native: true,
        }}
        fullWidth
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: '20px' }}
      >
        <option value="">Select Product</option>
        {products.map((product) => (
          <option key={product.productid} value={product.productid}>
            {product.name}
          </option>
        ))}
      </TextField>
      {orderType === 'nhập' && (
        <TextField
          type="number"
          label="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)} 
          fullWidth
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: '20px' }}
        />
      )}
      <TextField
        type="number"
        label="Quantity"
        value={quantity}
        onChange={handleQuantityChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: '20px' }}
      />
      <Button variant="contained" onClick={handleAddToOrder} style={{ marginBottom: '30px' }}>Add to Order</Button>
      <Grid container spacing={2}>
        <TableContainer component={Paper}>
          <Table aria-label="Order Details">
            <TableBody>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
              {orderDetails.map((orderDetail, index) => (
                <TableRow key={index}>
                  <TableCell>{orderDetail.productid}</TableCell>
                  <TableCell>{orderDetail.name}</TableCell>
                  <TableCell>{orderDetail.price}</TableCell>
                  <TableCell>{orderDetail.quantity}</TableCell>
                  <TableCell>{orderDetail.total}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4}>Total Cost</TableCell>
                <TableCell>{totalCost}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Button variant="contained" color="primary" onClick={submitOrder} style={{ marginTop: '20px' }}>Submit</Button>
    </div>
  );
}

export default OrderForm;
