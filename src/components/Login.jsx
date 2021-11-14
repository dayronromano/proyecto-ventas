import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2';
import { firebaseLogin, getDocument } from '../config/CustomHooks.jsx'
import { collectionTypes } from '../types/databaseTypes.js'

export const Login = ({ match: { path } }) => {
  const history = useHistory();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const mapaErrores = {
    'auth/invalid-email': 'email invalido, por favor revisar',
    'auth/user-disabled': 'Usuario deshabilitado',
    'auth/user-not-found': 'email y/o password incorrecto',
    'auth/wrong-password': 'email y/o password incorrecto',
    'auth/too-many-requests': 'Demasiados intentos fallidos, intente más tarde',
  }
  const handleLogin = (e) => {
    e.preventDefault()
    authfirebase(email, password)
  }

  const authfirebase = React.useCallback(async (email, password) => {
    try {
      const respuesta = await firebaseLogin(email, password)
      const user = await getDocument(collectionTypes.USERS, respuesta.id)

      if (user.role === "pendiente") {
        history.push('/login')
        setEmail('')
        setPassword('')
        return
      }
      history.push('/')
    } catch (error) {
      Swal.fire({
        title: mapaErrores[error.message],
        icon: 'error',
        showConfirmButton: false,
      });
    }
  }, [history])

  return (
    <div>
      <div className="contenido d-flex justify-content-center align-items-center flex-column">
        <div className="card col-md-4">
          <div className="card-header h3 text-center">
            DevApps
          </div>
          <div className="card-body">
            <div className="card-text">
              <div className="row">

                <form>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" required
                      minLength="6"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="d-grid gap-2 col-6 mx-auto">
                  <Link className="btn btn-primary align-items-center"
                    to="/login"
                    onClick={handleLogin}
                  >
                    Ingresar
                  </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
