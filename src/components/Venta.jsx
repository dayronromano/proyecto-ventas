import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { add, format } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react'
import { DebounceInput } from 'react-debounce-input';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { saveDocument } from '../config/CustomHooks.jsx';
import { consultarDocumentoDatabase } from '../config/firebase.jsx';
import { AuthContext } from '../context/AuthProvider.jsx';

import { collectionTypes } from '../types/databaseTypes.js';
import { Loading } from './Loading.jsx';



export const Venta = () => {
  const { stateUser: { user } } = useContext(AuthContext);
  const initialState = {
    descripcion: '',
    fechaFactura: format(new Date(), 'yyyy-MM-dd'),
    fechaVencimiento: format(add(new Date(), { months: 1 }), 'yyyy-MM-dd'),
    precioTotal: '',
    idVendedor: '',
    estadoVenta: 'creacion',
    idResponsable: '',
    idCreador: '',
  }


  console.log('Entro');

  const { id } = useParams();
  const numeroVenta = id.split('-')[1];
  const [loading, setLoading] = useState(false)
  const [venta, setVenta] = useState(initialState)
  const [usuario] = useState(user)
  // const user = currentUser()

  // const [descripcion, setDescripcion] = useState('')
  // const [fechaFactura, setFechaFactura] = useState(format(new Date(), 'yyyy-MM-dd'))
  // const [fechaVencimiento, setFechaVencimiento] = useState(format(add(new Date(), { months: 1 }), 'yyyy-MM-dd'))
  // const [precioTotal, setPrecioTotal] = useState('')
  // const [idVendedor, setIdVendedor] = useState('')
  // const [estadoVenta, setEstadoVenta] = useState('creacion')
  // const [idResponsable, setIdResponsable] = useState('')
  // const [idCreador, setIdCreador] = useState('')




  // const listaUsuarios = useGetCollection(collectionTypes.USERS)
  // console.log(listaUsuarios);
  // const [listaResponsables, setListaResponsables] = useState([])
  const [error, setError] = useState('')

  const consultarVenta = React.useCallback(async () => {
    setLoading(true)
    const ventaTemp = await consultarDocumentoDatabase(collectionTypes.VENTAS, id)
    console.log(ventaTemp);
    setVenta(
      {
        descripcion: ventaTemp.descripcion,
        fechaFactura: ventaTemp.fechaFactura,
        fechaVencimiento: ventaTemp.fechaVencimiento,
        precioTotal: ventaTemp.precioTotal,
        idVendedor: ventaTemp.idVendedor,
        estadoVenta: ventaTemp.estadoVenta,
        idResponsable: ventaTemp.idResponsable,
        idCreador: ventaTemp.idCreador,
      }
    )
    setLoading(false)
  }, [id])


  useEffect(() => {

    if (id !== 'create') {
      consultarVenta()
      return
    }



    // setLoading(true)

    // getCollection(collectionTypes.USERS)
    //   .then(usuarios => {
    //     setListaUsuarios(usuarios)
    //   })

    // getFilterCollection(collectionTypes.USERS, "role", collectionOperators.EQUAL, "vendedor")
    //   .then(responsables => {
    //     setListaResponsables(responsables)

    //   })

    // setLoading(false)

    // cargarListaResponsables().then(() => cargarListaUsuarios())

  }, [id, consultarVenta])

  // const cargarListaUsuarios = async () => {
  //   // setLoading(true)
  //   const usuarios = await getCollection(collectionTypes.USERS)
  //   // console.log(usuarios)
  //   // setListaUsuarios(usuarios)
  //   // setLoading(false)
  // }

  // const cargarListaResponsables = async () => {
  //   // setLoading(true)
  //   const responsables = await getFilterCollection(collectionTypes.USERS, "role", collectionOperators.EQUAL, "vendedor")
  //   // console.log(responsables)
  //   setListaResponsables(responsables)
  //   // setLoading(false)
  // }





  const handleVenta = async (e, { ...rest }, user) => {
    e.preventDefault()


    if (!venta.descripcion.trim()) {
      setError('Debe ingresar un producto')
      return
    }

    if (!venta.precioTotal.trim()) {
      setError('Debe ingresar un precio total')
      return
    }

    // setIdCreador(user.uid);
    // setIdVendedor(listaUsuarios[0]?.id);
    // setIdResponsable(listaResponsables[0]?.id);


    // debugger
    const ventaTemp = {
      idCreador: user.id, ...rest
    }
    // console.log(
    //   // descripcion,
    //   // fechaFactura,
    //   // fechaVencimiento,
    //   // precioTotal,
    //   idVendedor,
    //   // estadoVenta,
    //   idResponsable,
    //   idCreador,
    // );
    // const user = currentUser()
    // console.log(user.uid);
    setVenta(ventaTemp)
    console.log(venta);


    await saveDocument(collectionTypes.VENTAS, venta)
  }

  const handleActualizarVenta = async (e) => {
    e.preventDefault()


    // await updateDocument(collectionTypes.VENTAS, venta.id, venta)
    // history.push('/ventas')
  }


  return (

    <div className="container">
      <h2>
        {/* {
          id.includes('create') ? 'Creación ' : 'Editar '
        } */}
        Venta
      </h2>
      <hr className="mt-3" />

      {
        loading ?
          <div className="loading d-flex align-items-center justify-content-center">
            <Loading />
          </div>
          :
          <div className="row">

            <form onSubmit={
              e => handleVenta(e, venta, usuario)
            }>

              <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                <div className="card">
                  <div className="card-header">
                    Factura No.: <small className="text-primary">{`PSTORE-${numeroVenta}`}</small>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Detalle factura</h5>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Descripcion</label>
                        <DebounceInput
                          minLength={2}
                          debounceTimeout={1000}
                          type="text"
                          className="form-control"
                          value={venta.descripcion}
                          onChange={(e) => setVenta({ ...venta, descripcion: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Fecha Factura</label>
                        <input
                          type="date"
                          className="form-control"
                          disabled
                          value={venta.fechaFactura}
                          onChange={(e) => setVenta({ ...venta, fechaFactura: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Precio Total</label>
                        <DebounceInput
                          minLength={2}
                          debounceTimeout={1000}
                          type="text"
                          className="form-control"
                          value={venta.precioTotal}
                          onChange={(e) => setVenta({ ...venta, precioTotal: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Fecha Pago</label>
                        <input
                          type="date"
                          disabled
                          className="form-control text-danger"
                          value={venta.fechaVencimiento}
                          onChange={(e) => setVenta({ ...venta, fechaVencimiento: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      {/* <div className="col-md-6">
                        <label className="form-label">Vendedor</label>
                        <select className="form-select"
                          value={
                            venta.idVendedor
                          }
                          onChange={(e) => setVenta({ ...venta, idVendedor: e.target.value })}
                          selectedValue={venta.idVendedor}
                        >
                          {
                            listaUsuarios.map(usuario => (
                              <option key={usuario.id} value={usuario.id}>{usuario.nombre || usuario.email}</option>
                            ))
                          }

                        </select>
                      </div> */}
                      <div className="col-md-6">
                        <label className="form-label">Estado Venta</label>
                        <select className="form-select text-capitalize"
                          value={venta.estadoVenta}
                          onChange={(e) => setVenta({ ...venta, estadoVenta: e.target.value })}
                        >
                          <option value="creacion">creacion</option>
                          <option value="embalaje">embalaje</option>
                          <option value="despacho">despacho</option>
                          <option value="ruta">ruta</option>
                          <option value="recepcion">recepcion</option>
                        </select>
                      </div>
                    </div>

                    {/* <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Responsable</label>
                        <select className="form-select"
                          value={venta.idResponsable}
                          onChange={(e) => setVenta({ ...venta, idResponsable: e.target.value })}
                          selectedValue={venta.idResponsable}
                        >

                          {
                            listaResponsables.map(responsable => (
                              <option key={responsable.id} value={responsable.id}>{responsable.nombre || responsable.email}</option>
                            ))
                          }

                        </select>
                      </div>

                    </div> */}

                    {
                      error && <div className="alert alert-danger">{error}</div>
                    }

                    <div className="d-flex p-2 align-items-center">
                      <Link
                        className="btn btn-danger"
                        to='/ventas'>
                        <FontAwesomeIcon
                          color="white"
                          size="1x"
                          className="icon"
                          icon={faArrowLeft} />
                        <span className="ps-2">Regresar</span>
                      </Link>
                      <button
                        className="btn btn-primary ms-3"
                        onClick={

                          id.includes('create') ?
                            handleVenta : handleActualizarVenta

                        }
                      >
                        <span className="pe-2">
                          {id.includes('create') ?
                            'Crear Venta' : 'Guardar Edición'
                          }</span>
                        <FontAwesomeIcon
                          color="white"
                          size="1x"
                          className="icon"
                          icon={faSave} />

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
