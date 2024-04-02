import React, { useState } from 'react';
import Navigator from './Navigator';
import Account from './Account';
import Product from './Product'; 
import Employee from './Employee';
import Content3 from './Dashboard';
import AddUserForm from './AddUserForm';
import AddEmployeeForm from './AddEmployeeForm';
import AddProductForm from './AddProductForm';
import EditUserForm from './EditUserForm';
import EditEmployeeForm from './EditEmployeeForm';
import EditProductForm from './EditProductForm';
import ChangePasswordForm from './ChangePasswordForm';
import UserProfileForm from './UserProfileForm';
import Order from './Order';
import OrderDetail from './OrderDetail';
import Header from './Header';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

let theme = createTheme({
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#081627',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          margin: '0 16px',
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up('md')]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(255,255,255,0.15)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#4fc3f7',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 'auto',
          marginRight: theme.spacing(2),
          '& svg': {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

const drawerWidth = 256;

export default function Admin() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigationChange = (item) => { 
    setSelectedItem(item);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              onNavigationChange={handleNavigationChange} 
            />
          )}

          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
            onNavigationChange={handleNavigationChange} 
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onDrawerToggle={handleDrawerToggle} selectedItem={selectedItem} />
          <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
            {selectedItem === 'Account' && <Account setSelectedItem={setSelectedItem}  />} 
            {selectedItem === 'Employee' && <Employee setSelectedItem={setSelectedItem} />} 
            {selectedItem === 'Product' && <Product setSelectedItem={setSelectedItem} />} 
            {selectedItem === 'Dashboard' && <Content3 setSelectedItem={setSelectedItem} />} 
            {selectedItem === 'Order' && <Order setSelectedItem={setSelectedItem}  />}
            {selectedItem === 'Order detail' && <OrderDetail setSelectedItem={setSelectedItem}  />}
            {selectedItem === 'Add User' && <AddUserForm setSelectedItem={setSelectedItem}  />} 
            {selectedItem === 'Add Employee' && <AddEmployeeForm setSelectedItem={setSelectedItem}  />} 
            {selectedItem === 'Add Product' && <AddProductForm setSelectedItem={setSelectedItem}  />} 
            {selectedItem === 'User Edit' && <EditUserForm setSelectedItem={setSelectedItem} />} 
            {selectedItem === 'Employee Edit' && <EditEmployeeForm setSelectedItem={setSelectedItem} />} 
            {selectedItem === 'Product Edit' && <EditProductForm setSelectedItem={setSelectedItem} />} 
            {selectedItem === 'Change password' && <ChangePasswordForm setSelectedItem={setSelectedItem} />}
            {selectedItem === 'User Profile' && <UserProfileForm setSelectedItem={setSelectedItem} />}
            {!selectedItem && <Account setSelectedItem={setSelectedItem}  />} 
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
