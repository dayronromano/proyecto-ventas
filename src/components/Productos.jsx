import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCollection } from '../config/CustomHooks.jsx'
import { collectionTypes } from '../types/databaseTypes.js'
import { Loading } from './Loading.jsx'
import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

export const Productos = () => {

  const [listaProductos, setListaProductos] = useState([])
  const [loading, setLoading] = useState(false)


  useEffect(() => {

    cargarProductos()


  }, [setListaProductos])

  const cargarProductos = async () => {
    setLoading(true)
    const respuesta = await getCollection(collectionTypes.PRODUCTOS)
    setListaProductos(respuesta)
    setLoading(false)
  }


  return (
    <>
      <div>

        <div className="mt-5">
          <h2>
            Lista Productos
            <Link to="/productos/create">
              <button
                className="btn btn-outline-primary float-end"
              >
                <FontAwesomeIcon
                  size="1x"
                  className="icon"
                  icon={faPlus} />
                <span className="ps-2">Adicionar Producto</span>
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
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Descripcion</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Precio Unitario</th>
                    <th scope="col">Accion</th>
                  </tr>
                </thead>
                <tbody>

                  {
                    listaProductos.map((producto, index) => (
                      <tr key={producto.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{producto.descripcion}</td>
                        <td>{producto.cantidad}</td>
                        <td>{producto.precioUnitario}</td>
                        <td className="text-center">
                          <Link className="btn btn-outline-primary btn-sm" to={`/productos/${producto.id}`}>
                            <FontAwesomeIcon
                              size="1x"
                              className="icon"
                              icon={faEdit} />
                            <span className="ps-2">Editar</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
          }



        </div>


      </div>
    </>
  )
}
