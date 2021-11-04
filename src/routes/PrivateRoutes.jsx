import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router'
import { AuthContext } from '../context/AuthProvider.jsx';

export const PrivateRoutes = ({ hasRol: rol, ...rest }) => {


  const { stateUser } = useContext(AuthContext);

  if (!stateUser.isAuthenticated) return <Redirect to="/login" />;

  if (rol && stateUser.user.role !== rol) return <Redirect to="/" />

  return (
    <Route {...rest} />
  )
}
