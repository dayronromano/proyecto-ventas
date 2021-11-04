import React, { useContext } from 'react'
import { Sidebar } from '../components/Sidebar.jsx';
import {
  BrowserRouter as Router,
  Switch
} from 'react-router-dom';
import { Home } from '../components/Home.jsx';
import { Login } from '../components/Login.jsx';
import { Roles } from '../components/Roles.jsx';
import { Ventas } from '../components/Ventas.jsx';
import { Venta } from '../components/Venta.jsx';
import { Usuario } from '../components/Usuario';
import { Productos } from '../components/Productos.jsx';
import { Producto } from '../components/Producto.jsx';
import { NavBar } from '../components/NavBar.jsx';
import { AuthContext } from '../context/AuthProvider.jsx';
import { PrivateRoutes } from './PrivateRoutes.jsx';
import { PublicRoutes } from './PublicRoutes.jsx';


export const AppRouting = () => {
  const { stateUser } = useContext(AuthContext);

  return (
    <>
      <Router>
        {
          stateUser.isAuthenticated && <Sidebar />
        }
        <div className={`d-flex flex-column main ${(!stateUser.isAuthenticated)? 'bg-login' : ''}`}>
          {
            stateUser.isAuthenticated &&
            <NavBar />
          }

          <div className="container mt-4">

            <Switch>

              <PrivateRoutes exact path="/" component={Home} />
              <PublicRoutes exact path="/login" component={Login} />
              <PublicRoutes exact path="/registrarse" component={Login} />
              <PrivateRoutes hasRole={stateUser.user.role} exact path="/roles" component={Roles} />
              <PrivateRoutes hasRole={stateUser.user.role} exact path="/roles/:id" component={Usuario} />
              <PrivateRoutes exact path="/ventas" component={Ventas} />
              <PrivateRoutes exact path="/ventas/:id" component={Venta} />
              <PrivateRoutes exact path="/productos" component={Productos} />
              <PrivateRoutes exact path="/productos/:id" component={Producto} />

            </Switch>

          </div>

        </div>
      </Router>
    </>
  )
}
