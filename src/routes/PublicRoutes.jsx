import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router'
import { AuthContext } from '../context/AuthProvider.jsx';

export const PublicRoutes = ({ hasRol: rol, ...rest }) => {


  const { stateUser } = useContext(AuthContext);

  if (stateUser.isAuthenticated) return <Redirect to="/" />;

  return (
    <Route {...rest} />
  )
}
