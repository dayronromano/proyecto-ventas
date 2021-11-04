import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider.jsx'

export const NavBar = () => {

  const { stateUser, cerrarSession } = useContext(AuthContext);

  const handleLogout = () => {
    cerrarSession()
  }

  return (
    <>
      <div className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid d-flex justify-content-between">
          <span className="display-6">DevApps</span>
          {stateUser &&
            <div className="d-flex">
              {
                !stateUser.isAuthenticated ?
                  <>
                    <Link className="btn btn-outline-success d-flex align-items-center me-2"
                      to="/login">
                      <div className="me-2">
                        Ingresar
                      </div>
                      <FontAwesomeIcon
                        size="1x"
                        className="icon"
                        icon={faSignInAlt} />
                    </Link>
                  </>
                  :
                  <Link className="btn btn-danger d-flex align-items-center"
                    to="/login"
                    onClick={handleLogout}
                  >
                    <div className="me-2">
                      Salir
                    </div>
                    <FontAwesomeIcon
                      size="1x"
                      className="icon"
                      icon={faSignOutAlt} />
                  </Link>
              }
            </div>
          }
        </div>
      </div>
    </>
  )
}
