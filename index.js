const { obtenInformacionMeteo } = require("./src/tiempo");

const latitude = 19.4326;
const longitude = -99.1332;

async function main() {
  try {
    const weather = await obtenInformacionMeteo(latitude, longitude);

    if (!weather) {
      console.error("❌ No se pudo obtener la información del clima.");
      return;
    }

    console.log("🌡️ Temperatura:", weather.temperature, "°C");
    console.log("💨 Velocidad del viento:", weather.windSpeed, "km/h");
    console.log(`🌬️ Dirección del viento: ${weather.windDirection.cardinal} (${weather.windDirection.degrees}°)`);
    
  } catch (error) {
    console.error("Error al obtener los datos meteorológicos:", error.message);
  }
}

main();
