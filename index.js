const { getWeatherForecast } = require("./src/tiempo");


const latitude = 19.4326;
const longitude = -99.1332;

getWeatherForecast(latitude, longitude);