import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PasswordIcon from '@mui/icons-material/Password';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink } from 'react-router-dom'; 

const categories = [
  {
    id: '',
    children: [
      {
        id: 'Order',
        icon: <PostAddIcon />,
      },
    ],
  },
  {
    id: 'Setting',
    children: [
      { id: 'User Profile', icon: <PersonIcon /> },
      { id: 'Change password', icon: <PasswordIcon /> },
      { id: 'Log out', icon: <LogoutIcon /> },
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

const clearAllLocalStorage = () => {
  localStorage.clear();
};

export default function Navigator({ onNavigationChange, handleLogout, ...other }) {
  const [activeCategory, setActiveCategory] = useState('Authentication');

  const handleNavigationItemClick = (itemId) => {
    setActiveCategory(itemId); 
    onNavigationChange(itemId); 
  };

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}>
          Paperbase
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Project Overview</ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon }) => (
              <ListItem
                disablePadding
                key={childId}
                onClick={() => handleNavigationItemClick(childId)} 
                sx={{ bgcolor: activeCategory === childId ? '#37474F' : '#101F33' }}
              >
                {childId === 'Log out' ? (
                  <ListItemButton sx={item} onClick={() => { handleLogout(); clearAllLocalStorage(); }} component={RouterLink} to="/sign-in"> {}
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{childId}</ListItemText>
                  </ListItemButton>
                ) : (
                  <ListItemButton selected={activeCategory === childId} sx={item}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{childId}</ListItemText>
                  </ListItemButton>
                )}
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
