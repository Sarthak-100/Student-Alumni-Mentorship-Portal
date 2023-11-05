import React from 'react'
import LoginButton from '../components/LoginButton'
import Dashboard from '../components/Dashboard'
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
    const { isAuthenticated } = useAuth0();
    return (
        <div className="column">
            <LoginButton />
            {isAuthenticated && <Dashboard />}
        </div>
    )
}

export default Login
