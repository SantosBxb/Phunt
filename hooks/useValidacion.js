import React, { useEffect, useState } from "react";

const useValidacion = (stateInicial, validar, fn) => {
  const [valores, setValores] = useState(stateInicial);
  const [errores, setErrores] = useState({});
  const [submitForm, setSubmitForm] = useState(false);

  useEffect(() => {
    if (submitForm) {
      const noErrores = Object.keys(errores).length === 0;

      if (noErrores) {
        fn();
      }
      setSubmitForm(false);
    }
  }, [errores]);

  //fn que se ejecuta cuando el usuario escribe
  const handleChange = (e) => {
    setValores({
      ...valores,
      [e.target.name]: e.target.value,
    });
  };
  // fn que se jecuta con submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const errorValidacion = validar(valores);
    setErrores(errorValidacion);
    setSubmitForm(true);
  };
  // fn cuando el usuario hace blur, sale del input 
  const handleBlur = () => {
    const errorValidacion = validar(valores);
    setErrores(errorValidacion);
  }


  return {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  };
};

export default useValidacion;
