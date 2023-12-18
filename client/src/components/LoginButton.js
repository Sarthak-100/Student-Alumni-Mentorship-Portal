import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const backgroundImageUrl = 'https://www.peoplegrove.com/wp-content/uploads/2022/07/8G2tiC2F-alumni-mentoring-00-header.png';
  const styles = {
    container: {
      background: `url(${backgroundImageUrl}) center/cover no-repeat fixed`,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Center the text horizontally
      justifyContent: 'flex-start', // Align text at the top
      color: 'black',
    },
    header: {
      padding: '20px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end', // Align button at the top right
    },
    button: {
      padding: '10px 20px',
      backgroundColor: 'blue',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    !isAuthenticated && (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Student Alumni Mentorship Portal</h1>
        </div>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => loginWithRedirect()}>
            Log In
          </button>
        </div>
      </div>
    )
  );
};

export default LoginButton;