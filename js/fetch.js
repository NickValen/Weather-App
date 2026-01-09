
async function getWeather() {
  const params = new URLSearchParams({
    latitude: 42.6975,
    longitude: 23.3241,
    hourly: "temperature_2m,rain",
    timezone: "auto"
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const currentTemp = data.hourly.temperature_2m[0];
    const currentRain = data.hourly.rain[0];

    console.log("Температура:", currentTemp);
    console.log("Дождь:", currentRain);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}


