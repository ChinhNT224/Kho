import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const currentMonth = new Date().getMonth(); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/orders'); 
        setOrders(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
      }
    };

    fetchOrders();
  }, []);

  const calculateMonthlyRevenue = (type, month) => {
    if (month > currentMonth) return 0; 
    return orders.reduce((total, order) => {
      const orderMonth = new Date(order.createdate).getMonth();
      if (order.type === type && orderMonth === month) {
        return total + parseFloat(order.totalcost);
      }
      return total;
    }, 0);
  };

  const monthlyRevenueData = Array.from({ length: currentMonth + 1 }, (_, month) => {
    return {
      month: month + 1,
      nhập: calculateMonthlyRevenue('nhập', month),
      xuất: calculateMonthlyRevenue('xuất', month),
    };
  });

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="h5" gutterBottom>
              Biểu đồ doanh thu hàng tháng
            </Typography>
            <LineChart width={600} height={300} data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="nhập" stroke="#8884d8" name="Doanh thu nhập" />
              <Line type="monotone" dataKey="xuất" stroke="#82ca9d" name="Doanh thu xuất" />
            </LineChart>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
