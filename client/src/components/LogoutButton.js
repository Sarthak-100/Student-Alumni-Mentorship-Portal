import { IconButton } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import the exit icon

const LogoutIconButton = () => {
  const { logout, isAuthenticated } = useAuth0();
  
  return (
    isAuthenticated && (
      <IconButton onClick={() => logout({ returnTo: 'http://localhost:5000' }) } color="inherit">
        <ExitToAppIcon style={{ fontSize: '2rem' }} />
      </IconButton>
    )
  );
};

export default LogoutIconButton;