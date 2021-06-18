import React, { useEffect, useState } from 'react'
import DetallesProductos from "../components/layouts/DetallesProducto";
import useProductos from "../hooks/useProductos";
import Layout from "../components/layouts/Layout";
import { useRouter } from 'next/router';

export default function Buscar() {
  const router = useRouter();
  const { query : {q} } = router;

  // todos los productos 
  const {productos } = useProductos('creado');
  const [resultado, setResultado] = useState([]);

  useEffect(() => {
    const busqueda = q.toLowerCase();
    const filtro = productos.filter(producto => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) || 
        producto.descripcion.toLowerCase().includes(busqueda)
      )
    })
    setResultado(filtro);
  }, [q, productos]);
  return (
    <div>
      <Layout>
        <div className='listado-productos'>
          <div className='contenedor'>
            <ul className='bg-white'>
              {resultado.map(producto => (
                <DetallesProductos
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
}
