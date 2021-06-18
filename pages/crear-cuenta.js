import React, { useState } from "react";
import Router from "next/router";

import {
  Error,
  Formulario,
  Campo,
  InputSubmit,
} from "../components/ui/Formulario";
import Layout from "../components/layouts/Layout";
import { css } from "@emotion/react";

// importar el index de firebase, contiene firebase y su context
import firebase from "../firebase";

import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from "../validacion/validarCrearCuenta";

const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: "",
};

export default function Crearcuenta() {
  const [error, setError] = useState(false);

  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push("/")
    } catch (error) {
      console.error("Hubo un error al crear el usuario", error);
      setError(error.message);
    }
  }

  const { valores, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores;

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Crear una Cuenta{" "}
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeHolder="Tu Nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}
            <Campo>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeHolder="Tu Email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeHolder="********"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}

            <InputSubmit type="Submit" value="Crear Cuenta" />

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
      </Layout>
    </div>
  );
}
