const fetch = require("node-fetch");
const descripciontiempoes = require("../src/descripciontiempo");

const obtenInformacionMeteo = async (latitud, longitud) => {
  try {
    const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current_weather=true`;
    const respuestaAPI = await fetch(apiURL);
    const datos = await respuestaAPI.json();
    procesaInformacionMeteo(datos);
  } catch (error) {
    console.error(`Error al obtener datos meteorológicos: ${error.message}`);
  }
};

const procesaInformacionMeteo = (respuesta) => {
  if (!respuesta.current_weather) {
    console.error("Datos meteorológicos no encontrados.");
    return;
  }

  const temperatura = `${respuesta.current_weather.temperature} °C`;
  console.log("Temperatura:", temperatura);

  const velocidadViento = `${respuesta.current_weather.windspeed} km/h`;
  console.log("Velocidad del viento:", velocidadViento);

  const direccionVientoGrados = respuesta.current_weather.winddirection;
  const direccionViento = procesaDireccionViento(direccionVientoGrados);
  console.log(`Dirección del viento: ${direccionViento} (${direccionVientoGrados}°)`);
};

function procesaDireccionViento(grados) {
  if (grados < 0 || grados >= 360) {
    return "Desconocido";
  } else {
    if (grados >= 337.5 || grados < 22.5) {
      return "Norte";
    } else {
      if (grados >= 22.5 && grados < 67.5) {
        return "Noreste";
      } else {
        if (grados >= 67.5 && grados < 112.5) {
          return "Este";
        } else {
          if (grados >= 112.5 && grados < 157.5) {
            return "Sureste";
          } else {
            if (grados >= 157.5 && grados < 202.5) {
              return "Sur";
            } else {
              if (grados >= 202.5 && grados < 247.5) {
                return "Suroeste";
              } else {
                if (grados >= 247.5 && grados < 292.5) {
                  return "Oeste";
                } else {
                  return "Noroeste";
                }
              }
            }
          }
        }
      }
    }
  }
}
module.exports = { obtenInformacionMeteo, procesaDireccionViento };
