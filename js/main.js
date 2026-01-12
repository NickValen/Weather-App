const latInput = document.querySelector('.lat')
const longInput = document.querySelector('.lon')
const main = document.querySelector('.main')
const button = document.querySelector('.getWeatherBtn')

getWeatherBtn.addEventListener('click', () => {
    const latitude = latInput.value;
    const longitude = longInput.value;

    fetch(`/weather?lat=${latitude}&lon=${longitude}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Ошибка:', error);
    });
});



async function getWeather() {
  const params = new URLSearchParams({
  latitude: latInput.value,
  longitude: lonInput.value,
  hourly: "temperature_2m,rain",
  timezone: "auto"
});

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;


  try {
    const response = await fetch(url);
    const data = await response.json();

    // Берём первый час (условно "сейчас")
    const time = data.hourly.time[0];
    const temperature = data.hourly.temperature_2m[0];
    const rain = data.hourly.rain[0];

    renderWeatherCard(time, temperature, rain);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

function renderWeatherCard(time, temperature, rain) {
  main.innerHTML = ""; // очищаем старую карточку

  const card = document.createElement("div");
  card.className = "weather-card";

  card.innerHTML = `
    <h2>Погода на сегодня</h2>
    <div class="weather-item">📅 ${new Date(time).toLocaleDateString()}</div>
    <div class="weather-item">🌡 Температура: ${temperature} °C</div>
    <div class="weather-item">🌧 Осадки: ${rain} мм</div>
  `;

  main.appendChild(card);
}

button.addEventListener('click', getWeather);



