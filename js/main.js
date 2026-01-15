// Ждем загрузки DOM, чтобы не было ошибки "reading addEventListener"
document.addEventListener('DOMContentLoaded', () => {
    
    const latInput = document.querySelector('.lat');
    const lonInput = document.querySelector('.lon');
    const main = document.querySelector('.main');
    const button = document.querySelector('.getWeatherBtn');

    // Проверка: нашли ли мы кнопку?
    if (!button) {
        console.error("Кнопка с классом .getweatherBtn не найдена! Проверь HTML.");
        return;
    }

    async function getWeather() {
        const lat = latInput.value;
        const lon = lonInput.value;

        if (!lat || !lon) {
            alert("Пожалуйста, введите широту и долготу");
            return;
        }

        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            hourly: "temperature_2m,rain",
            timezone: "auto"
        });

        const url = `https://api.open-meteo.com/v1/forecast?${params}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.hourly) {
                // Берем данные за первый доступный час [0]
                const time = data.hourly.time[0];
                const temperature = data.hourly.temperature_2m[0];
                const rain = data.hourly.rain[0];

                renderWeatherCard(time, temperature, rain);
            } else {
                main.innerHTML = "<p>Ошибка: Неверные координаты.</p>";
            }
        } catch (error) {
            console.error("Ошибка запроса:", error);
        }
    }

    function renderWeatherCard(time, temperature, rain) {
        main.innerHTML = "";
        const card = document.createElement("div");
        card.className = "weather-card";

        const dateFormatted = new Date(time).toLocaleString();

        card.innerHTML = `
            <h2>Погода</h2>
            <h3>Город: ${city}</h3>
            <div>📅 Время: ${dateFormatted}</div>
            <div>🌡️ Температура: ${temperature} °C</div>
            <div>🌧️ Осадки: ${rain} мм</div>
        `;
        main.appendChild(card);
    }

    button.addEventListener('click', getWeather);
});