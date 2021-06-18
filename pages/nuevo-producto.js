import React, { useState, useContext } from "react";
import Router, { useRouter } from "next/router";

import {
  Error,
  Formulario,
  Campo,
  InputSubmit,
} from "../components/ui/Formulario";
import Layout from "../components/layouts/Layout";
import { css } from "@emotion/react";
// importar el index de firebase, contiene firebase y su context
import { FirebaseContext } from "../firebase";

// importar fileuploader
import FileUploader from "react-firebase-file-uploader";

import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";
import Error404 from "../components/layouts/404";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  imagen: "",
  url: "",
  descripcion: "",
};

export default function NuevoProducto() {
  // state imagenes
  const [nombreImg, setNombreImg] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImg, setUrlImg] = useState("");

  const [error, setError] = useState(false);

  // context las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);
  const router = useRouter();

  async function crearProducto() {
    // si no hay usuario
    if (!usuario) {
      return router.push("/login");
    }

    // crear el objeto del nuevo producto
    const producto = {
      nombre,
      empresa,
      imagen,
      url,
      urlImg,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName,
      },
      haVotado:[]
    };

    // insertar en la base de datos
    await firebase.db.collection("productos").add(producto);

    return router.push("/");
  }

  const { valores, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };

  const handleProgress = (progreso) => setProgreso({ progreso });

  const handleUploadError = (error) => {
    setSubiendo(error);
    console.error(error);
  };

  const handleUploadSuccess = (nombre) => {
    setProgreso(100);
    setSubiendo(false);
    setNombreImg(nombre);
    firebase.storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        setUrlImg(url);
      });
  };

  return (
    <div>
      <Layout>
        {!usuario ? (
          <Error404 msg="Debe iniciar Sesión"/>
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              Nuevo producto
            </h1>
            <Formulario onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>Información General</legend>

                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre del Producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Nombre Empresa o Compañia"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>
                {errores.imagen && <Error>{errores.imagen}</Error>}

                <Campo>
                  <label htmlFor="url">URL</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    value={url}
                    placeholder="URL de tu Producto"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.url && <Error>{errores.url}</Error>}
              </fieldset>

              <fieldset>
                <legend>Sobre tu Producto</legend>
                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>

              <InputSubmit type="Submit" value="Crear Producto" readOnly />

              {error && (
                <Error
                  css={css`
                    margin-top: 3rem;
                    transform: translateX(-75px);
                  `}
                >
                  {error}
                </Error>
              )}
            </Formulario>
          </>
        )}
      </Layout>
    </div>
  );
}
