const descripciontiempo = require("../src/descripciontiempo");

const obtenInformacionMeteo = async (latitud, longitud) => {
  if (typeof latitud !== "number" || typeof longitud !== "number") {
    throw new Error("Latitud y longitud deben ser números válidos");
  }

  try {
    const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current_weather=true`;
    const respuestaAPI = await fetch(apiURL);
    const datos = await respuestaAPI.json();

    const weatherData = procesaInformacionMeteo(datos);

    return weatherData;

  } catch (error) {
    console.error(`Error al obtener datos meteorológicos: ${error.message}`);
  }
};

const procesaInformacionMeteo = (respuesta) => {
  if (!respuesta.current_weather) {
    console.error("Datos meteorológicos no encontrados.");
    return null;
  }

  const weatherData = {
    temperature: respuesta.current_weather.temperature,
    windSpeed: respuesta.current_weather.windspeed,
    windDirection: {
      degrees: respuesta.current_weather.winddirection,
      cardinal: procesaDireccionViento(respuesta.current_weather.winddirection),
    },
  };

  return weatherData;
};

const procesaDireccionViento = (grados) => {
  if (grados < 0 || grados >= 360) return "Desconocido";

  if (grados >= 337.5 || grados < 22.5) return "Norte";
  if (grados >= 22.5 && grados < 67.5) return "Noreste";
  if (grados >= 67.5 && grados < 112.5) return "Este";
  if (grados >= 112.5 && grados < 157.5) return "Sureste";
  if (grados >= 157.5 && grados < 202.5) return "Sur";
  if (grados >= 202.5 && grados < 247.5) return "Suroeste";
  if (grados >= 247.5 && grados < 292.5) return "Oeste";
  return "Noroeste";
};

module.exports = { obtenInformacionMeteo, procesaDireccionViento };
