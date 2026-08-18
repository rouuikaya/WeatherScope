let dataForecast;
const API_KEY="0de7ca009ae8b8285e591666457dfdfa"
const ville="Angers"; 
const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${API_KEY}&units=metric&lang=fr`;
fetch(url)
        .then(response => response.json())
        .then(data => {console.log(data)
        
        document.getElementById("temperature").textContent =
            data.main.temp +"°C" ; 
        document.getElementById("humidity").textContent =
            data.main.humidity + "%";  
        document.getElementById("wind").textContent =
            (data.wind.speed * 3.6).toFixed(1) + " Km/h" ; 
        document.getElementById("pressure").textContent =
            data.main.pressure +" hPa" ; 
        document.getElementById("feels-like").textContent=
            data.main.feels_like + "°C" ; 
        document.getElementById("description").textContent  =
            data.weather[0].description ; 
        document.getElementById("city").textContent =
            data.name ; 
        const weather = 
            data.weather[0].main;

        console.log("Météo :", weather);

        const weatherIcon = getWeatherIcon(
    weather,
    data.weather[0].icon
);

        console.log("Mon icône :", weatherIcon);

        document.getElementById("weather_icon").src =
            weatherIcon;

        const date = new Date(data.dt*1000);
        document.getElementById("datetime").textContent =
            date.toLocaleString("fr-FR") ; 

        const maintenant = data.dt;
const lever = data.sys.sunrise;
const coucher = data.sys.sunset;

const estNuit = maintenant < lever || maintenant > coucher;

console.log("Lever :", new Date(lever * 1000).toLocaleTimeString("fr-FR"));
console.log("Coucher :", new Date(coucher * 1000).toLocaleTimeString("fr-FR"));
console.log("Est-ce la nuit ?", estNuit);

        const map=L.map('map').setView([20,0] , 2) ; 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' , {
        attribution:'&copy; OpenStreetMap contributors'
        }).addTo(map) ;
        L.tileLayer(
    `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    {
        opacity: 1
    }
).addTo(map);
        const marker = L.marker([data.coord.lat, data.coord.lon]).addTo(map)
marker.bindPopup(`
<div class="weather-popup">
        <h3>${data.name}</h3>
        <div class="popup-temp">
        <img src="${weatherIcon}" alt="Météo">
        <span>${Math.round(data.main.temp)}°C</span>
    </div>
    </div>
`);
marker.openPopup();
        });

function getWeatherIcon(weather, iconCode) {

    // Nuit : ciel dégagé
    if (iconCode && iconCode.endsWith("n")) {

        if (weather.includes("Clear")) {
            return "images/weather/moon_icon.png";
        }

        if (weather.includes("Clouds")) {
            return "images/weather/night_clouds_icon.png";
        }
    }

    // Jour : quelques nuages
    if (iconCode === "02d") {
        return "images/weather/weather_icon.png";
    }

    // Jour
    if (weather.includes("Thunderstorm")) {
        return "images/weather/thunder_icon.png";
    }

    if (weather.includes("Drizzle")) {
        return "images/weather/rainy-day_icon.png";
    }

    if (weather.includes("Rain")) {
        return "images/weather/rainy-day_icon.png";
    }

    if (weather.includes("Snow")) {
        return "images/weather/snow_icon.png";
    }

    if (
        weather.includes("Mist") ||
        weather.includes("Fog") ||
        weather.includes("Haze") ||
        weather.includes("Smoke")
    ) {
        return "images/weather/cloudy_icon.png";
    }

    if (weather.includes("Clear")) {
        return "images/weather/sun_icon.png";
    }

    if (weather.includes("Clouds")) {
        return "images/weather/cloudy_icon.png";
    }

    return "images/weather/cloudy_icon.png";
}



const grandesVilles = [
    { ville: "Paris", pays: "France" },
    { ville: "Londres", pays: "Royaume-Uni" },
    { ville: "Madrid", pays: "Espagne" },
    { ville: "Rome", pays: "Italie" },
    { ville: "Berlin", pays: "Allemagne" }
];
const citiesContainer = document.getElementById("cities-container");

async function getWeather(city) {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
}

async function afficherVilles() {

    for (const city of grandesVilles) {

        const data = await getWeather(city.ville);

        const row = document.createElement("div");
        row.classList.add("city-row");

        row.innerHTML = `
    <span>${city.ville}</span>
    <span>${city.pays}</span>
    <span>${Math.round(data.main.temp)}°C</span>
    <span>${data.weather[0].description}</span>
    <span>${data.main.humidity}%</span>
    <span>${(data.wind.speed * 3.6).toFixed(1)} km/h</span>
    <span>${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°</span>
`;
    citiesContainer.appendChild(row);
    }
}

afficherVilles();
async function getForecast(city) {

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fr`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
}


const hourlyForecast = document.querySelector(".hourly-forecast");


async function afficherPrevisions() {

    const data = await getForecast(ville);

    hourlyForecast.innerHTML = "";

    for (let i = 0; i < 8; i++) {

        const forecast = data.list[i];

        const card = document.createElement("div");
        card.classList.add("forecast-card");

        const heure = forecast.dt_txt.split(" ")[1].slice(0, 5);
        const temperature = Math.round(forecast.main.temp);
        const humidite = forecast.main.humidity;
        const vent = (forecast.wind.speed * 3.6).toFixed(1);
        const weather = forecast.weather[0].main;
        const icon = getWeatherIcon(
    weather,
    forecast.weather[0].icon
);

        card.innerHTML = `
            <span class="forecast-time">${heure}</span>
            <img src="${icon}" alt="Météo">
            <strong>${temperature}°C</strong>
            <span>${humidite}%</span>
            <span>${vent} km/h</span>
        `;

        hourlyForecast.appendChild(card);
    }
}

afficherPrevisions();

async function afficherPrevisionsJours() {

    const data = await getForecast(ville);

    dataForecast = data;

    const dailyForecast = document.querySelector(".daily-forecast");

    dailyForecast.innerHTML = "";

    // Regrouper les prévisions par jour
    const jours = {};

    for (const forecast of data.list) {

        const date = forecast.dt_txt.split(" ")[0];

        if (!jours[date]) {
            jours[date] = [];
        }

        jours[date].push(forecast);
    }

    const dates = Object.keys(jours);

    const boutonsJours = document.querySelectorAll(".forecast-days .day");

boutonsJours.forEach(function(bouton, index) {

    const date = dates[index];

    if (!date) {
        bouton.style.display = "none";
        return;
    }

    bouton.dataset.date = date;

    const dateObjet = new Date(date);

    if (index === 0) {
        bouton.textContent = "Aujourd'hui";
    } else {
        bouton.textContent = dateObjet.toLocaleDateString(
            "fr-FR",
            { weekday: "long" }
        );
    }

    bouton.addEventListener("click", function() {

        boutonsJours.forEach(function(b) {
            b.classList.remove("active");
        });

        bouton.classList.add("active");

        afficherPrevisionsHoraires(date);
        afficherDetailsJour(date);
    });
});

    // Créer une carte pour chaque jour
    for (const date in jours) {

        const forecasts = jours[date];

        let temperatureMin = Infinity;
        let temperatureMax = -Infinity;

        // Chercher min et max de la journée
        for (const forecast of forecasts) {

            temperatureMin = Math.min(
                temperatureMin,
                forecast.main.temp_min
            );

            temperatureMax = Math.max(
                temperatureMax,
                forecast.main.temp_max
            );
        }

        // Chercher une prévision vers midi pour l'icône
        let forecastMidi = forecasts[0];

        for (const forecast of forecasts) {

            const heure = forecast.dt_txt.split(" ")[1];

            if (heure.startsWith("12:00")) {
                forecastMidi = forecast;
                break;
            }
        }

        
        const weather = forecastMidi.weather[0].main;

        const icon = getWeatherIcon(
    weather,
    forecastMidi.weather[0].icon
);

        const dateObjet = new Date(date);

        const nomJour = dateObjet.toLocaleDateString(
            "fr-FR",
            { weekday: "long" }
        );

        const dateAffichee = dateObjet.toLocaleDateString(
            "fr-FR",
            {
                day: "numeric",
                month: "long"
            }
        );

        const card = document.createElement("button");

        card.classList.add("daily-card");

        card.dataset.date = date;

        card.innerHTML = `
            <strong class="daily-day">
                ${nomJour}
            </strong>

            <span class="daily-date">
                ${dateAffichee}
            </span>

            <img src="${icon}" alt="Météo">

            <strong class="daily-max">
                ${Math.round(temperatureMax)}°C
            </strong>

            <span class="daily-min">
                ${Math.round(temperatureMin)}°C
            </span>

            <span class="daily-humidity">
                ${forecastMidi.main.humidity}%
            </span>
        `;
        card.addEventListener("click", function() {

    document.querySelectorAll(".daily-card").forEach(function(c) {
        c.classList.remove("active");
    });

    card.classList.add("active");

    document.querySelectorAll(".forecast-days .day").forEach(function(bouton) {
        bouton.classList.remove("active");

        if (bouton.dataset.date === date) {
            bouton.classList.add("active");
        }
    });

    afficherPrevisionsHoraires(date);
    afficherDetailsJour(date);

});
        dailyForecast.appendChild(card);
    }
}

afficherPrevisionsJours();



function afficherPrevisionsHoraires(date) {

    hourlyForecast.innerHTML = "";

    for (const forecast of dataForecast.list) {

        const forecastDate = forecast.dt_txt.split(" ")[0];

        if (forecastDate !== date) {
            continue;
        }

        const card = document.createElement("div");

        card.classList.add("forecast-card");

        const heure = forecast.dt_txt
            .split(" ")[1]
            .slice(0, 5);

        const temperature = Math.round(forecast.main.temp);

        const humidite = forecast.main.humidity;

        const vent = (forecast.wind.speed * 3.6).toFixed(1);

        const weather = forecast.weather[0].main;
        
        console.log(
    heure,
    "météo =",
    weather,
    "description =",
    forecast.weather[0].description,
    "icon OpenWeather =",
    forecast.weather[0].icon
);



        const icon = getWeatherIcon(
    weather,
    forecast.weather[0].icon
);
        console.log(heure, weather, icon);
        card.innerHTML = `
            <span class="forecast-time">${heure}</span>

            <img src="${icon}" alt="Météo">

            <strong>${temperature}°C</strong>

            <span>${humidite}%</span>

            <span>${vent} km/h</span>
        `;

        hourlyForecast.appendChild(card);
    }
}

function afficherDetailsJour(date) {

    const previsionsJour = dataForecast.list.filter(function(forecast) {

        return forecast.dt_txt.split(" ")[0] === date;

    });

    if (previsionsJour.length === 0) {
        return;
    }

    let temperatureMin = Infinity;
    let temperatureMax = -Infinity;

    let humidite = 0;
    let vent = 0;
    let ressenti = 0;
    let pression = 0;
    let visibilite = 0;

    for (const forecast of previsionsJour) {

        temperatureMin = Math.min(
            temperatureMin,
            forecast.main.temp_min
        );

        temperatureMax = Math.max(
            temperatureMax,
            forecast.main.temp_max
        );

        humidite += forecast.main.humidity;
        vent += forecast.wind.speed;
        ressenti += forecast.main.feels_like;
        pression += forecast.main.pressure;
        visibilite += forecast.visibility;
    }

    const nombre = previsionsJour.length;

    const details = document.querySelectorAll(
        ".forecast-details .detail-row strong"
    );

    details[0].textContent =
        Math.round(temperatureMax) + "°C";

    details[1].textContent =
        Math.round(temperatureMin) + "°C";

    details[2].textContent =
        Math.round(humidite / nombre) + "%";

    details[3].textContent =
        (vent / nombre * 3.6).toFixed(1) + " km/h";

    details[4].textContent =
        Math.round(ressenti / nombre) + "°C";

    details[5].textContent =
        Math.round(pression / nombre) + " hPa";

    details[6].textContent =
        (visibilite / nombre / 1000).toFixed(1) + " km";

    details[7].textContent =
        "Non disponible";
}


const searchInput = document.getElementById("city-search") ; 
const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    console.log(searchInput.value);

});
