import React, { useContext, useEffect, useState } from 'react'
import { DebounceInput } from 'react-debounce-input';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import { Link, useHistory } from 'react-router-dom';
import { createUser} from '../config/CustomHooks.jsx';
import { consultarDocumentoDatabase, actualizarDocumentoDatabase } from '../config/firebase.jsx';
import { AuthContext } from '../context/AuthProvider.jsx';
import { collectionTypes } from '../types/databaseTypes.js';
import { Loading } from './Loading.jsx';

export const Usuario = () => {
  const { stateUser: { user } } = useContext(AuthContext);
  const initialState = {
    nombre: '',
    email: '',
    estado: true,
    role: '',
    password: ''
  };
  const { id } = useParams();
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState(initialState)
  const history = useHistory();

  const consultarUsuario = React.useCallback(async () => {
    setLoading(true)
    const usuarioTemp = await consultarDocumentoDatabase(collectionTypes.USERS, id)
    setRole(
      {
        nombre: usuarioTemp.nombre,
        email: usuarioTemp.email,
        estado: usuarioTemp.estado,
        role: usuarioTemp.role,
        password: ''
      }
    )
    setLoading(false)
  }, [id])

  useEffect(() => {
    if (id !== 'create') {
      consultarUsuario();
      return
    }
  }, [id, consultarUsuario])

  const handleRole = async (e) => {
    e.preventDefault();
    setLoading(true);
    await createUser(collectionTypes.USERS, role);
    setRole(initialState);
    setTimeout(function(){
      setLoading(false);
      Swal.fire({
        title: 'Usuario creado exitosamente!',
        icon: 'success',
        showConfirmButton: false,
      })
      history.push('/roles')
    }, 6500)
  }

  const handleActualizarRole = async (e) => {
    e.preventDefault();
    const roleTemp = {
      ...role
    }
    delete roleTemp.password;
    await actualizarDocumentoDatabase(collectionTypes.USERS, id, roleTemp);
    setRole(initialState);
    Swal.fire({
      title: 'Usuario editado exitosamente!',
      icon: 'success',
      showConfirmButton: false,
    })
    history.push('/roles')
  }

  return (
    <div className="container">
      <h2>
        {
          id.includes('create') ? 'Crear ' : 'Editar '
        }
        Usuario
      </h2>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/roles">Lista de Usuarios</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{id.includes('create') ?
            'Crear' : 'Editar'
          } Usuario</li>
        </ol>
      </nav>
      <hr className="mt-3" />
      {
        loading ?
          <div className="loading d-flex align-items-center justify-content-center">
            <Loading />
          </div>
          :
          <div className="row">
            <form onSubmit={id.includes('create')? handleRole : handleActualizarRole}>
              <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Nombres</label>
                        <DebounceInput
                          minLength={2}
                          debounceTimeout={1000}
                          type="text"
                          className="form-control"
                          value={role.nombre}
                          onChange={(e) => setRole({ ...role, nombre: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Email</label>
                        <input
                          type="text"
                          className="form-control"
                          readOnly={(!id.includes('create')) ? true : false}
                          value={role.email}
                          onChange={(e) => setRole({ ...role, email: e.target.value })}
                          required
                        />
                      </div>
                      {
                        (id.includes('create')) &&
                        <div className="col-md-12">
                          <label className="form-label">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={role.password}
                            onChange={(e) => setRole({ ...role, password: e.target.value })}
                            minLength="5"
                          />
                        </div>
                      }
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Role</label>
                        <select className="form-select text-capitalize"
                          value={role.role}
                          onChange={(e) => setRole({ ...role, role: e.target.value })}
                          required
                        >
                          <option value="">Seleccione</option>
                          <option value="administrador">Administrador</option>
                          <option value="vendedor">Vendedor</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Estado</label>
                        <select className="form-select text-capitalize"
                          value={role.estado}
                          onChange={(e) => setRole({ ...role, estado: e.target.value})}
                        >
                          <option value="">Seleccione</option>
                          <option value="autorizado">Autorizado</option>
                          <option value="No autorizado">No autorizado</option>
                          <option value="pendiente">Pendiente</option>
                        </select>
                      </div>
                    </div>
                    <div className="d-grid gap-2 col-6 mx-auto">
                      <button className="btn btn-primary ms-3">
                        <span className="pe-2">
                          {id.includes('create') ?
                            'Crear' : 'Editar'
                          }</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
      }
    </div>
  )
}
