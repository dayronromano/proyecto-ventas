import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Link, useHistory } from 'react-router-dom';
import { actualizarDocumentoDatabase, consultarDocumentoDatabase, guardarDatabase, usuario } from '../config/firebase';
import { Loading } from './Loading.jsx';

export const Producto = () => {
  console.log(usuario.uid);
  console.log(useParams());
  const { id } = useParams();
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [producto, setProducto] = useState({ descripcion: '', cantidad: '', precioUnitario: '', idUsuario: '' })
  const [loading, setLoading] = useState(false)
  const history = useHistory();

  const consultarProducto = React.useCallback(async () => {
    setLoading(true)
    const produtoTemp = await consultarDocumentoDatabase('lista-productos', id)
    console.log(produtoTemp);
    setProducto(produtoTemp)
    setDescripcion(produtoTemp.descripcion)
    setCantidad(produtoTemp.cantidad)
    setPrecioUnitario(produtoTemp.precioUnitario)
    setLoading(false)
  }, [id])

  useEffect(() => {

    if (id !== 'create') {
      consultarProducto()
      return
    }
    setDescripcion('')
    setCantidad(0)
    setPrecioUnitario(0)
    setProducto({ descripcion: '', cantidad: 0, precioUnitario: 0, idUsuario: '' })
  }, [id, consultarProducto])



  const handleGuardarProducto = async (e) => {
    e.preventDefault()
    const productoTemp = { descripcion, cantidad, precioUnitario, idUsuario: usuario.uid };
    setProducto(productoTemp);
    await guardarDatabase('lista-productos', productoTemp)
    setDescripcion('')
    setCantidad(0)
    setPrecioUnitario(0)
    setProducto({ descripcion: '', cantidad: 0, precioUnitario: 0 })
    history.push('/productos')
  }

  const handleActualizarProducto = async (e) => {
    e.preventDefault()
    const productoTemp = { descripcion, cantidad: (+cantidad), precioUnitario: (+precioUnitario), idUsuario: usuario.uid }
    console.log(productoTemp);
    await actualizarDocumentoDatabase('lista-productos', id, productoTemp)
    setDescripcion('')
    setCantidad(0)
    setPrecioUnitario(0)
    setProducto({ descripcion: '', cantidad: 0, precioUnitario: 0, idUsuario: '' })
    history.push('/productos')
  }

  return (
    <div className="container">
      <h2>
        {
          id === 'create' ? 'Creación ' : 'Editar '
        }
        Producto
      </h2>
      <hr className="mt-3" />

      {
        loading ?
          <div className="loading d-flex align-items-center justify-content-center">
            <Loading />
          </div>
          :
          <div className="row">
            <div className="offset-md-3 col-md-6">
              <form>
                <div className="mb-3">
                  <label className="form-label">Descripcion</label>
                  <input
                    type="text"
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cantidad</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio Unitario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={precioUnitario}
                    onChange={(e) => setPrecioUnitario(e.target.value)}
                  />
                </div>
                <div className="d-flex p-2 align-items-center">
                  <Link
                    className="btn btn-danger"
                    to='/productos'>
                    <FontAwesomeIcon
                      color="white"
                      size="1x"
                      className="icon"
                      icon={faArrowLeft} />
                    <span className="ps-2">Regresar</span>
                  </Link>
                  <button
                    className="btn btn-primary ms-3"
                    onClick={id === 'create' ? handleGuardarProducto : handleActualizarProducto}>
                    <span className="pe-2">
                      {id === 'create' ?
                        'Guardar Producto' : 'Guardar Edición'
                      }</span>
                    <FontAwesomeIcon
                      color="white"
                      size="1x"
                      className="icon"
                      icon={faSave} />

                  </button>
                </div>

              </form>
            </div>
          </div>
      }



    </div>
  )
}
