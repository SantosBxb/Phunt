export default function validarCrearProducto(valores) {
  let errores = {};

  // validar  nombre
  if (!valores.nombre) {
    errores.nombre = "El nombre es Obligatorio";
  }
  // validar  empresa 
  if (!valores.empresa) {
    errores.empresa = "El nombre de Empresa es Obligatorio";
  }
  // validar  URL
  if (!valores.url) {
    errores.url = "La URL es Obligatoria";
  }else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
    errores.url = "La URL no es valida";
  }

  // validar imagen

  // validar descripcion 
  if (!valores.descripcion) {
    errores.descripcion = "Agrega una Descripción de tu Producto";
  }

  return errores;
}
