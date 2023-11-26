import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
const PrivateRoute = () => {
    const { currentUser } = useSelector(state => state.user);
    const [cookies, setCookie] = useCookies("http://localhost:5173");
    return (

        (cookies['access_token'] && currentUser) ? <Outlet /> : <Navigate to='/signin' />

    )
}

export default PrivateRoute