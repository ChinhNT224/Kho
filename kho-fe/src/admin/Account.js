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

export default function Account({ setSelectedItem }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/accounts-with-employees');
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ backend:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredUsers = users.filter(user => {
    return (
      user.account.loginname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (user) => {
    const { account } = user;
    console.log(account);
    const editingAccountId = account.accountid; 
    localStorage.setItem('editingAccountId', editingAccountId);
    setSelectedItem('User Edit');
  };
  

  const handleDelete = async (user) => {
    try {
      const token = getToken();
      await axios.delete(`http://localhost:3000/admin/accounts/${user.account.accountid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(users.filter(u => u.account.accountid !== user.account.accountid));
      console.log('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleAddUser = () => {
    setSelectedItem('Add User');
  };

  return (
    <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
      <Grid container spacing={2} alignItems="center" style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Search by login name, email, or employee name"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
          <Button variant="contained" color="primary" onClick={handleAddUser}>
            Add User
          </Button>
        </Grid>
      </Grid>
      <TableContainer style={{ border: '1px solid #ccc', borderRadius: '4px', marginTop: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account ID</TableCell>
              <TableCell>Login Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                <TableRow key={user.account.accountid}>
                  <TableCell>{user.account.accountid}</TableCell>
                  <TableCell>{user.account.loginname}</TableCell>
                  <TableCell>{user.account.email}</TableCell>
                  <TableCell>{user.employee.name}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(user)}>
                      Delete
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
                colSpan={7}
                count={filteredUsers.length}
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
