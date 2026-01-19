const citySelect = new Choices("#citySelect", {
  searchEnabled: false,
  shouldSort: false,
  placeholder: true,
  placeholderValue: "Выберите город",
});

// Geocoding
async function searchCities(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=ru`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.results) return [];

  return data.results.map(city => ({
    value: JSON.stringify({
      lat: city.latitude,
      lon: city.longitude,
      name: city.name,
      country: city.country
    }),
    label: `${city.name}, ${city.country}`
  }));
}

const input = document.getElementById("cityInput");
let debounceTimer;

input.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  const query = input.value.trim();

  if (query.length < 3) return;

  debounceTimer = setTimeout(async () => {
    const cities = await searchCities(query);

    citySelect.clearChoices();
    citySelect.setChoices(cities, "value", "label", true);
  }, 400);
});

async function getWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: "temperature_2m,weather_code",
    timezone: "auto"
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`
  );

  return response.json();
}

document.getElementById("getWeatherBtn").addEventListener("click", async () => {
  const selected = citySelect.getValue(true);

  if (!selected) return;

  const city = JSON.parse(selected);

  const weather = await getWeather(city.lat, city.lon);

  renderWeather(city.name, city.country, weather);
});

function renderWeather(name, country, data) {
  const main = document.getElementById("main");

  const temp = data.current.temperature_2m;

  main.innerHTML = `
    <div class="weather-card">
      <h2>📍 ${name}, ${country}</h2>
      <p>🌡 Температура: ${temp} °C</p>
    </div>
  `;
}
