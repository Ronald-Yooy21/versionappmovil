// src/utils/dateUtils.js

/**
 * Convierte YYYY-MM-DD a DD/MM/YYYY
 */
export const toDisplayDate = (dateString) => {
  if (!dateString) return "";
  // Si ya está en formato DD/MM/YYYY, devolver igual
  if (dateString.includes("/")) return dateString;
  // Si es YYYY-MM-DD
  const partes = dateString.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dateString;
};

/**
 * Convierte DD/MM/YYYY a YYYY-MM-DD (para enviar al backend)
 */
export const toBackendDate = (dateString) => {
  if (!dateString) return "";
  // Si ya está en formato YYYY-MM-DD
  if (dateString.includes("-") && dateString[4] === "-") return dateString;
  // Si es DD/MM/YYYY
  const partes = dateString.split("/");
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return dateString;
};

/**
 * Valida que la fecha tenga formato DD/MM/YYYY
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateString)) return false;

  const [, dia, mes, anio] = dateString.match(regex);
  const fecha = new Date(anio, mes - 1, dia);
  return (
    fecha.getFullYear() === parseInt(anio) &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === parseInt(dia)
  );
};
