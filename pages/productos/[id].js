import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { FirebaseContext } from "../../firebase";
import Error404 from "../../components/layouts/404";
import Layout from "../../components/layouts/Layout";
import styled from "@emotion/styled";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }

  img {
    max-width: 100%;
  }
`;
const CreadorProduccto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da553fcf;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  border-radius: 3px;
`;

const Producto = () => {
  // state de producto
  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});
  const [consultarDB, setConsultarDB] = useState(true);

  // Routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  // context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  // para cada que cambie el id, extraer el producto correspondiente
  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          setProducto(producto.data()); // data() es una fn de fireba que se encarga de obtener la info del producto en este caso
          setConsultarDB(false);
        } else {
          setError(true);
          setConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando...";

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlImg,
    votos,
    creador,
    haVotado,
  } = producto;

  const votarProducto = () => {
    const nuevoVotos = votos + 1;

    if (haVotado.includes(usuario.uid)) {
      return;
    }
    // actualizar en la base de datos
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoVotos, haVotado: [...haVotado, usuario.uid] });

    // actualizar state
    setProducto({
      ...producto,
      votos: nuevoVotos,
      haVotado: [...haVotado, usuario.uid],
    });
    setConsultarDB(true);
  };

  // crear comentario
  const comentarioChange = (e) => {
    setComentario({ [e.target.name]: e.target.value });
  };
  const agregarComentario = (e) => {
    e.preventDefault();

    // informacion del creador del comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //
    const nuevosComentarios = [...comentarios, comentario];

    // actualizar BD
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ comentarios: nuevosComentarios });

    // actualizar state
    setProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });
    setConsultarDB(true); //hay un comentario, pues se consulta la bd
  };

  //identificar quien escribe el comentario
  const esCreador = (id) => {
    if (creador.id == id) {
      return true;
    }
  };

  //
  const puedeBorrar = () => {
    if (!usuario) return false;
    if (creador.id == usuario.uid) return true;
  };
  const eliminarProducto = async () => {
    try {
      await firebase.db.collection('productos').doc(id).delete();
      router.push('/')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout>
      <>
        {error ? (
          <Error404 msg="Producto no Existe" />
        ) : (
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>
            <ContenedorProducto>
              <div>
                <p>
                  Publicado hace:{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por: {creador.nombre} de {empresa}
                </p>
                <img src={urlImg} />
                <p>{descripcion}</p>

                {usuario && (
                  <>
                    <h2>Agrega un Comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          name="mensaje"
                          onChange={comentarioChange}
                        />
                      </Campo>
                      <InputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                )}

                <h2
                  css={css`
                    margin: 2.5rem 0;
                  `}
                >
                  Comentarios
                </h2>
                <ul>
                  {comentarios.map((comentario, i) => (
                    <li
                      key={`${comentario.usuario}-${i}`}
                      css={css`
                        border: 1px solid #e1e1e1;
                        padding: 2rem;
                      `}
                    >
                      <p>{comentario.mensaje}</p>
                      <p>
                        Escrito por:{" "}
                        <span
                          css={css`
                            font-weight: bold;
                          `}
                        >
                          {comentario.usuarioNombre}
                        </span>
                      </p>
                      {esCreador(comentario.usuarioId) && (
                        <CreadorProduccto>Autor</CreadorProduccto>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <aside>
                <Boton
                  css={css`
                    display: block;
                    margin: 5rem auto;
                    text-align: center;
                  `}
                  target="_blank"
                  bgColor="true"
                  href={url}
                >
                  Visitar URL
                </Boton>
                <p
                  css={css`
                    display: inline-block;
                  `}
                >
                  {votos} Votos
                </p>
                {usuario && (
                  <Boton
                    css={css`
                      float: right;
                    `}
                    onClick={votarProducto}
                  >
                    Votar
                  </Boton>
                )}
              </aside>
            </ContenedorProducto>

            {puedeBorrar() && 
              <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
              }
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
