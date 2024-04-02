import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import { format } from 'date-fns';

export default function OrderDetail({ setSelectedItem }) {
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const detailOrderId = localStorage.getItem('detailOrderId');
    if (detailOrderId) {
      const fetchOrderDetail = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/orders/${detailOrderId}/products`);
          console.log(response);
          setOrder(response.data.order);
          setOrderDetails(response.data.orderDetails);
        } catch (error) {
          console.error('Error fetching order detail:', error);
        }
      };

      fetchOrderDetail();
    }
  }, []);

  const handleClose = () => {
    setSelectedItem('Order');
  };

  return (
    <Paper>
      <Typography variant="h6" align="center" gutterBottom>
        Order 
      </Typography>
      {order && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Create Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Total Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{format(new Date(order.createdate), 'yyyy-MM-dd')}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.totalcost}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
        Order Details
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.map(detail => (
              <TableRow key={detail.id}>
                <TableCell>{detail.name}</TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell>{detail.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleClose} color="primary" style={{ marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>
        Close
      </Button>
    </Paper>
  );
}
