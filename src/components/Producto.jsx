import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import { Link, useHistory } from 'react-router-dom';
import { actualizarDocumentoDatabase, consultarDocumentoDatabase, guardarDatabase } from '../config/firebase';
import { collectionTypes } from '../types/databaseTypes.js';
import { Loading } from './Loading.jsx';

export const Producto = () => {
  const initialState = {
    nombre: '',
    precio: 0,
    estado: false
  };
  const { id } = useParams();
  const [loading, setLoading] = useState(false)
  const [producto, setProducto] = useState(initialState)
  const history = useHistory();

  const consultarProducto = React.useCallback(async () => {
    setLoading(true)
    const produtoTemp = await consultarDocumentoDatabase(collectionTypes.PRODUCTOS, id)
    setProducto(
      {
        nombre: produtoTemp.nombre,
        precio: produtoTemp.precio,
        estado: produtoTemp.estado
      }
    )
    setLoading(false)
  }, [id])

  useEffect(() => {
    if (id !== 'create') {
      consultarProducto()
      return
    }
  }, [id, consultarProducto])

  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    setLoading(true);
    await guardarDatabase(collectionTypes.PRODUCTOS, producto);
    setProducto(initialState);
    Swal.fire({
      title: 'Producto creado exitosamente!',
      icon: 'success',
      showConfirmButton: false,
    })
    setTimeout(function () {
      setLoading(false);
      history.push('/productos')
    }, 500)
  }

  const handleActualizarProducto = async (e) => {
    e.preventDefault();
    const productoTemp = {
      ...producto
    }
    await actualizarDocumentoDatabase(collectionTypes.PRODUCTOS, id, productoTemp)
    setProducto(initialState);
    Swal.fire({
      title: 'Producto editado exitosamente!',
      icon: 'success',
      showConfirmButton: false,
    })
    history.push('/productos')
  }

  return (
    <div className="container">
      <h2>
        {
          id.includes('create') ? 'Crear ' : 'Editar '
        }
        Producto
      </h2>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/productos">Lista de Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{id.includes('create') ?
            'Crear' : 'Editar'
          } Producto</li>
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
            <form onSubmit={id.includes('create') ? handleGuardarProducto : handleActualizarProducto}>
              <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Nombre Producto</label>
                        <input
                          type="text"
                          className="form-control"
                          value={producto.nombre}
                          required
                          onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Precio Unitario</label>
                        <input
                          type="text"
                          className="form-control"
                          value={producto.precio}
                          required
                          onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Estado</label>
                        <select className="form-select text-capitalize"
                          value={(producto.estado)? "1" : "0"}
                          required
                          onChange={(e) => setProducto({ ...producto, estado: (parseInt(e.target.value) === 1)? true : false })}
                        >
                          <option value="">Selecciona</option>
                          <option value="1">Disponible</option>
                          <option value="0">No disponible</option>
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
