import {useAuth0} from '@auth0/auth0-react';

const LogoutIconButton = () => {
    const {logout,isAuthenticated} = useAuth0();
    return (
        isAuthenticated && (
            <IconButton onClick={() => logout()}>
                Log Out
            </IconButton>
        )
    )
}

export default LogoutIconButton;