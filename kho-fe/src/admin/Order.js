import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import { format } from 'date-fns';

export default function Order({ setSelectedItem }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/orders');
        setOrders(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleDetail = (order) => {
    const detailOrderId = order.orderid; 
    localStorage.setItem('detailOrderId', detailOrderId);
    setSelectedItem('Order detail');
  };

  const filteredOrders = orders.filter(order => {
    return (
      order.orderid.toString().includes(searchTerm) ||
      order.createdate.includes(searchTerm) ||
      order.type.toLowerCase().includes(searchTerm) ||
      order.totalcost.toString().includes(searchTerm) ||
      order.accountId.toString().includes(searchTerm)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
      <Grid container spacing={2} alignItems="center" style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Search by Order ID, Create Date, Type, Total Cost, or Account ID"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            color="secondary"
          />
        </Grid>
      </Grid>
      <TableContainer style={{ border: '1px solid #ccc', borderRadius: '4px', marginTop: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Create Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Total Cost</TableCell>
              <TableCell>Account ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">No orders found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                <TableRow key={order.orderid}>
                  <TableCell>{order.orderid}</TableCell>
                  <TableCell>{format(new Date(order.createdate), 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.totalcost}</TableCell>
                  <TableCell>{order.accountId}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleDetail(order)}>
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={6}
                count={filteredOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}
