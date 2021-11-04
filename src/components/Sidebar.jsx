import { faClipboardList, faFileInvoiceDollar, faHome, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import '../App.css'
import { AuthContext } from '../context/AuthProvider.jsx'

export const Sidebar = () => {

  const { stateUser } = useContext(AuthContext);

  return (
    <div className="Sidebar text-white">
      <nav className="">
        <div className="container d-flex flex-column pt-4 text-center">
          <small className="mt-2"><strong>Bienvenido</strong><br/>
          {stateUser.user.email}
          <br/>
          {stateUser.user.role}
          </small>
        </div>
        <hr/>
        <ul className="SidebarList nav">
            <NavLink className="row-item d-flex p-2 align-items-center"
              activeClassName="row-active" to="/" exact
              >
              <FontAwesomeIcon
                color="white"
                size="1x"
                className="icon"
                icon={faHome} />
              <div className="title">Home</div>
            </NavLink>
          {
            stateUser.user.role === 'administrador' &&
            <NavLink className="row-item d-flex p-2 align-items-center"
              activeClassName="row-active" to="/roles" exact
            >
              <FontAwesomeIcon
                color="white"
                size="1x"
                className="icon"
                icon={faUsers} />
              <div className="title">Usuarios</div>
            </NavLink>
          }
          <NavLink className="row-item d-flex p-2 align-items-center"
            activeClassName="row-active" to="/ventas" exact
          >
            <FontAwesomeIcon
              color="white"
              size="1x"
              className="icon"
              icon={faFileInvoiceDollar} />
            <div className="title">Ventas</div>
          </NavLink>
          <NavLink className="row-item d-flex p-2 align-items-center"
            activeClassName="row-active" to="/productos" exact
          >
            <FontAwesomeIcon
              color="white"
              size="1x"
              className="icon"
              icon={faClipboardList} />
            <div className="title">Productos</div>
          </NavLink>
        </ul>
      </nav>
    </div>
  )
}
