import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import { Link, useHistory } from 'react-router-dom';
import { actualizarDocumentoDatabase, consultarDocumentoDatabase, guardarDatabase } from '../config/firebase.jsx';
import { getCollection, getFilterCollection } from '../config/CustomHooks';
import { collectionTypes, collectionOperators } from '../types/databaseTypes.js';
import { Loading } from './Loading.jsx';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Venta = () => {
  const initialProducto = {
    id: '',
    nombre: '',
    cantidad: '',
    precio: '',
  }
  const initialState = {
    nombre: '',
    identificacion: '',
    fecha: '',
    precioTotal: '',
    estado: '',
    encargado: {id: '', nombre: ''},
    productos: []
  }
  const { id } = useParams();
  const [loading, setLoading] = useState(false)
  const [venta, setVenta] = useState(initialState)
  const [responsables, setResponsables] = useState([])
  const [productos, setProductos] = useState([])
  const history = useHistory();

  const consultarVenta = React.useCallback(async () => {
    const ventaTemp = await consultarDocumentoDatabase(collectionTypes.VENTAS, id)
    console.log('consultar', ventaTemp);
    setVenta(
      {
        nombre: ventaTemp.nombre,
        identificacion: ventaTemp.identificacion,
        fecha: ventaTemp.fecha,
        precioTotal: ventaTemp.precioTotal,
        estado: ventaTemp.estado,
        encargado: ventaTemp.encargado,
        productos: ventaTemp.productos
      }
    )
  }, [id])

  useEffect(() => {
    setLoading(true);
    cargarListaResponsables();
    cargarListaProductos();
    if (!id.includes('create')) {
      consultarVenta();
    } else {
      let productos = [];
      productos.push(initialProducto);
      setVenta({
        ...venta,
        productos: productos
      })
    }
    setLoading(false);
  }, [id])

  const cargarListaResponsables = async () => {
    const responsables = await getFilterCollection(collectionTypes.USERS, "role", collectionOperators.EQUAL, "vendedor");
    setResponsables(responsables);
  }

  const cargarListaProductos = async () => {
    const respuesta = await getFilterCollection(collectionTypes.PRODUCTOS, "estado", collectionOperators.EQUAL, true);
    setProductos(respuesta);
  }

  const handleVendedor = async (e) => {
    e.preventDefault();
    const { target: { value } } = e;
    const element = responsables;
    let index = element.findIndex(x => x.id === value);
    setVenta({
      ...venta,
      encargado : {id : ((index >= 0)? element[index].id : '') , nombre : ((index >= 0)? element[index].nombre : '')}
    })
    return false;
  }

  const handleProducto = async (e, id, key) => {
    e.preventDefault();
    const { target: { value } } = e;
    const element = venta.productos;
    let index = element.findIndex(x => x.id === id);
    if (index >= 0) {
      element[index][key] = value;
      if(key == 'id'){
        const listProductos = productos;
        let indexPro = listProductos.findIndex(x => x.id === value);
        if(indexPro >= 0){
          element[index].precio = listProductos[indexPro].precio;
        }
      }
      setVenta({
        ...venta,
        productos: element
      });
    }
    return false;
  }

  const handleCantidadProducto = async (e, id) => {
    e.preventDefault();
    const { target: { value } } = e;
    const element = venta.productos;
    let index = element.findIndex(x => x.id === id);
    if (index >= 0 && id != '') {
      element[index].cantidad = value;
      setVenta({
        ...venta,
        precioTotal : getPrecioTotal(element),
        productos: element
      });
    }
    return false;
  }

  const getPrecioTotal = (element) => {
    let total = 0;
    element.map((value)=>{
        console.log((parseInt(value.cantidad) * parseInt(value.precio)));
        if(value.cantidad && value.precio){
          total += (parseInt(value.cantidad) * parseInt(value.precio));
        }
    })
    return total;
  }


  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    console.log(venta);
    const element = venta.productos;
    let index = element.findIndex(x => x.id === '');
    if (!(index >= 0)) {
      element.push(initialProducto);
      setVenta({
        ...venta,
        productos: element
      });
    }
  }

  const handleBorrarProducto = async (e, id) => {
    e.preventDefault();
    const element = venta.productos;
    let index = element.findIndex(x => x.id === id);
    if (index >= 0 && id != '') {
      element.splice(index, 1);
      setVenta({
        ...venta,
        precioTotal : getPrecioTotal(element),
        productos: element
      });
    }
  }

  const handleVenta = async (e) => {
    e.preventDefault();
    setLoading(true);
    await guardarDatabase(collectionTypes.VENTAS, venta);
    setVenta(initialState);
    Swal.fire({
      title: 'Venta creada exitosamente!',
      icon: 'success',
      showConfirmButton: false,
    })
    setTimeout(function () {
      setLoading(false);
      history.push('/ventas')
    }, 500)
  }

  const handleActualizarVenta = async (e) => {
    e.preventDefault()
    setLoading(true);
    await actualizarDocumentoDatabase(collectionTypes.VENTAS, id, venta)
    setVenta(initialState);
    Swal.fire({
      title: 'Venta editada exitosamente!',
      icon: 'success',
      showConfirmButton: false,
    })
    setTimeout(function () {
      setLoading(false);
      history.push('/ventas')
    }, 500)
  }

  return (
    <div className="container">
      <h2>
        {
          id.includes('create') ? 'Crear ' : 'Editar '
        }
        Venta
      </h2>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/ventas">Lista de Ventas</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{id.includes('create') ?
            'Crear' : 'Editar'
          } Venta</li>
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
            <form onSubmit={id.includes('create') ? handleVenta : handleActualizarVenta}>
              <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Nombre Cliente</label>
                        <input
                          type="text"
                          className="form-control"
                          value={venta.nombre}
                          required
                          onChange={(e) => setVenta({ ...venta, nombre: e.target.value })}
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Identificacion Cliente</label>
                        <input
                          type="text"
                          className="form-control"
                          value={venta.identificacion}
                          required
                          onChange={(e) => setVenta({ ...venta, identificacion: e.target.value })}
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Fecha Factura</label>
                        <input
                          type="date"
                          className="form-control"
                          value={venta.fecha}
                          required
                          onChange={(e) => setVenta({ ...venta, fecha: e.target.value })}
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Precio Total</label>
                        <input
                          minLength={2}
                          type="text"
                          className="form-control"
                          value={venta.precioTotal}
                          disabled
                          required
                          onChange={(e) => setVenta({ ...venta, precioTotal: e.target.value })}
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Vendedor</label>
                        <select className="form-select"
                          value={venta.encargado.id}
                          onChange={(e) => handleVendedor(e)}
                        >
                          <option value="">Selecciona</option>
                          {
                            responsables.map(responsable => (
                              <option key={responsable.id} name={responsable.nombre} data-remove={responsable.nombre} value={responsable.id}>{responsable.nombre}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Estado Venta</label>
                        <select className="form-select text-capitalize"
                          value={venta.estado}
                          required
                          onChange={(e) => setVenta({ ...venta, estado: e.target.value })}
                        >
                          <option value="">Selecciona</option>
                          <option value="proceso">Proceso</option>
                          <option value="cancelado">Cancelado</option>
                          <option value="entregado">Entregado</option>
                        </select>
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Productos</label>
                        <div className="row">
                          <div className="offset-9 col-3">
                            <button className="btn btn-success float-end"
                              onClick={e => handleAgregarProducto(e)}
                            >
                              <FontAwesomeIcon
                                size="1x"
                                className="icon"
                                icon={faPlus} />
                              <span className="ps-2">Agregar Producto</span>
                            </button>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-10 offset-md-1">
                            <table className="table table-hover table-bordered mt-2">
                              <thead className="table-devapps">
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Nombre</th>
                                  <th scope="col">Cantidad</th>
                                  <th scope="col">Precio Unitario</th>
                                  <th scope="col">Eliminar</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  venta.productos.map((producto, index) => {
                                    return (<tr key={producto.id}>
                                      <th scope="row">{index + 1}</th>
                                      <td>
                                        <select className="form-select"
                                          value={producto.id}
                                          onChange={e => handleProducto(e, producto.id, 'id')}
                                          >
                                          <option value="">Selecciona</option>
                                          {
                                            productos.map(producto => (
                                              <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                                              ))
                                          }
                                        </select>
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          value={producto.cantidad}
                                          required
                                          onChange={e => handleCantidadProducto(e, producto.id)}
                                          />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          value={producto.precio}
                                          disabled
                                          required
                                        />
                                      </td>
                                      <td className="text-center">
                                        {
                                          (producto.id) &&
                                          <button className="btn btn-danger btn-sm"
                                            onClick={e => handleBorrarProducto(e, producto.id)}
                                          >
                                            <FontAwesomeIcon
                                              size="1x"
                                              className="icon"
                                              icon={faTrash} />
                                          </button>
                                        }
                                      </td>
                                    </tr>)
                                  })
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
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
