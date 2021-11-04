import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCollection, updateDocument } from '../config/CustomHooks.jsx';
import { collectionTypes } from '../types/databaseTypes.js';
import { Loading } from './Loading.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

export const Roles = () => {
  const [listaUsuarios, setListaUsuarios] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cargarListaUsuarios()
  }, [setListaUsuarios])


  const cargarListaUsuarios = async () => {
    setLoading(true)
    const usuarios = await getCollection(collectionTypes.USERS)
    console.log(usuarios)
    setListaUsuarios(usuarios)
    setLoading(false)
  }

  const handleActive = async ({ estado, ...rest }) => {
    setLoading(true)
    const userTemporal = {
      estado: !estado,
      ...rest
    }
    console.log(userTemporal)
    await updateDocument(collectionTypes.USERS, userTemporal, userTemporal.id)
    setLoading(false)
    await cargarListaUsuarios()
  }

  const handleRoleUser = async (e, { role, ...rest }) => {
    setLoading(true)
    const { target: { value } } = e;
    const userTemporal = {
      role: value,
      ...rest
    }
    console.log(userTemporal)
    await updateDocument(collectionTypes.USERS, userTemporal, userTemporal.id)
    setLoading(false)
    await cargarListaUsuarios()
  }

  const handleNombre = async (e, { nombre, ...rest }) => {
    setLoading(true)
    const { target: { value } } = e;
    const userTemporal = {
      nombre: value,
      ...rest
    }
    console.log(userTemporal)
    await updateDocument(collectionTypes.USERS, userTemporal, userTemporal.id)
    setLoading(false)
    await cargarListaUsuarios()
  }


  return (
    <div className="mt-3">
      <h2>Lista de Usuarios
        <Link to={`/roles/create-${listaUsuarios.length + 1}`}>
                <button
                  className="btn btn-success float-end"
                >
                  <FontAwesomeIcon
                    size="1x"
                    className="icon"
                    icon={faPlus} />
                  <span className="ps-2">Nuevo</span>
                </button>
              </Link>
      </h2>

      {
        loading ?
          <div className="loading d-flex align-items-center justify-content-center">
            <Loading />
          </div>
          :

          <table className="table table-hover table-bordered mt-5">
            <thead className="table-devapps">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombres</th>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>
                <th scope="col" className="text-center">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                listaUsuarios.map((usuario, index) => (
                  <tr key={usuario.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.role}</td>
                    <td>{(usuario.estado)? 'Activo' : 'Inactivo'}</td>
                    <td className="text-center">
                      <Link className="btn btn-primary btn-sm" to={`/roles/${usuario.id}`}>
                        <FontAwesomeIcon
                          size="1x"
                          className="icon"
                          icon={faEdit} />
                      </Link>
                    </td>
                  </tr>
                )
                )
              }
            </tbody>
          </table>
      }
    </div>
  )
}