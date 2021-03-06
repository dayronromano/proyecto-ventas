import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCollection, getCustomFilterCollection } from '../config/CustomHooks.jsx';
import { collectionTypes } from '../types/databaseTypes.js';
import { Loading } from './Loading.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'

export const Ventas = () => {
  const [listaVentas, setListaVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscar, setBuscar] = useState('');

  useEffect(() => {
    cargarProductos();
  }, [setListaVentas])

  const cargarProductos = async () => {
    setLoading(true)
    const respuesta = await getCollection(collectionTypes.VENTAS)
    console.log(respuesta);
    setListaVentas(respuesta);
    setLoading(false);
  }

  const filtrarVentas = async (search) => {
    setLoading(true);
    const respuesta = await getCustomFilterCollection(collectionTypes.VENTAS, "nombre", search);
    setListaVentas(respuesta);
    setLoading(false);
  }

  const handleBuscar = async (e) => {
    e.preventDefault()
    const search = buscar;
    if (!search.trim()) {
      await cargarProductos();
    } else {
      await filtrarVentas(search);
    }
  }

  return (
    <div className="mt-3">
      <h2>Lista de Ventas
        <Link to={`/ventas/create-${listaVentas.length + 1}`}>
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
          <>
            <div className="row mt-4">
              <div className="col-11">
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon
                    size="1x"
                    className="icon"
                    icon={faSearch} /></span>
                  <input type="text" className="form-control"
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-1">
                <button className="btn btn-primary ms-3"
                  onClick={handleBuscar}
                >
                  <span>Buscar</span>
                </button>
              </div>
            </div>
            <table className="table table-hover table-bordered mt-2">
              <thead className="table-devapps">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nombre Cliente</th>
                  <th scope="col">Precio total</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Fecha venta</th>
                  <th scope="col">Encargado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>

                {
                  listaVentas.map((venta, index) => (
                    <tr key={venta.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{venta.nombre}</td>
                      <td>{venta.precioTotal}</td>
                      <td>{venta.estado}</td>
                      <td>{venta.fecha}</td>
                      <td>{venta.encargado.nombre}</td>
                      <td className="text-center">
                        <Link className="btn btn-primary btn-sm" to={`/ventas/${venta.id}`}>
                          <FontAwesomeIcon
                            size="1x"
                            className="icon"
                            icon={faEdit} />
                        </Link>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </>
      }
    </div>
  )
}