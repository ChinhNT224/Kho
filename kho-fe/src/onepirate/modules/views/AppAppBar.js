import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link'; // Import Link from @mui/material/Link
import AppBar from '../components/AppBar';
import Toolbar from '../components/Toolbar';
import { Link as RouterLink } from 'react-router-dom'; // Import Link as RouterLink from react-router-dom

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
};

function AppAppBar() {
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            component={RouterLink} // Use RouterLink as the component for Link
            to="/premium-themes/onepirate/" // Specify the 'to' prop
            sx={{ fontSize: 24 }}
          >
            {'Shop'}
          </Link>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              component={RouterLink} // Use RouterLink as the component for Link
              to="/sign-in/" // Specify the 'to' prop
              sx={rightLink}
            >
              {'Sign In'}
            </Link>
            <Link
              variant="h6"
              underline="none"
              component={RouterLink} // Use RouterLink as the component for Link
              to="/sign-up/" // Specify the 'to' prop
              sx={{ ...rightLink, color: 'secondary.main' }}
            >
              {'Sign Up'}
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default AppAppBar;
