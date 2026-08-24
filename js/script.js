let dataForecast;
const API_KEY=""
const ville =
    localStorage.getItem("villeActuelle") || "Angers";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${API_KEY}&units=metric&lang=fr`;

const temperatureElement =
    document.getElementById("temperature");
        if (temperatureElement){
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
        const heroLeft = document.querySelector(".hero-left");

if (heroLeft) {

    if (weather === "Clear") {
        heroLeft.style.backgroundImage =
            "url('images/background/clear.jpg')";
    }

    else if (weather === "Clouds") {
        heroLeft.style.backgroundImage =
            "url('images/background/clouds.jpg')";
    }

    else if (weather === "Rain" || weather === "Drizzle") {
        heroLeft.style.backgroundImage =
            "url('images/background/rain.jpg')";
    }

    else if (weather === "Snow") {
        heroLeft.style.backgroundImage =
            "url('images/background/snow.jpg')";
    }

    else if (weather === "Thunderstorm") {
        heroLeft.style.backgroundImage =
            "url('images/background/thunderstorm.jpg')";
    }

    else {
        heroLeft.style.backgroundImage =
            "url('images/background/clouds.jpg')";
    }
}
        

        const weatherIcon = getWeatherIcon(
    weather,
    data.weather[0].icon
        );
        
    
        // Afficher l'icône choisie sur la page
        document.getElementById("weather_icon").src =
            weatherIcon;
        
        // Convertir le timestamp de l'API en date et heure lisibles
        const date = new Date(data.dt*1000);

        // Afficher la date et l'heure au format français
        document.getElementById("datetime").textContent =
            date.toLocaleString("fr-FR") ; 
/*
        const maintenant = data.dt;
const lever = data.sys.sunrise;
const coucher = data.sys.sunset;

const estNuit = maintenant < lever || maintenant > coucher;

console.log("Lever :", new Date(lever * 1000).toLocaleTimeString("fr-FR"));
console.log("Coucher :", new Date(coucher * 1000).toLocaleTimeString("fr-FR"));
console.log("Est-ce la nuit ?", estNuit);
*/

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
    }


// Choisir le nom du pays à partir de son code
function obtenirNomPays(codePays) {

    const nomsPays =
        new Intl.DisplayNames(
            ["fr"],
            { type: "region" }
        );

    return nomsPays.of(codePays);
}

// Choisir l'icône personnalisée correspondant à la météo
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


// Liste des grandes villes à afficher
const grandesVilles = [
    { ville: "Paris", pays: "France" },
    { ville: "Londres", pays: "Royaume-Uni" },
    { ville: "Madrid", pays: "Espagne" },
    { ville: "Rome", pays: "Italie" },
    { ville: "Berlin", pays: "Allemagne" }
];



// Récupérer les données météo d'une ville depuis l'API
async function getWeather(city) {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
}

// Récupérer le conteneur qui accueillera les villes
const citiesContainer = document.getElementById("cities-container");
if (citiesContainer) {

// Récupérer la météo des grandes villes et les afficher dans le tableau
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

// Afficher les grandes villes
afficherVilles();
}
// Récupérer les prévisions météo d'une ville depuis l'API
async function getForecast(city) {

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fr`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
}


// Récupérer le conteneur des prévisions horaires
const hourlyForecast = document.querySelector(".hourly-forecast");

if (hourlyForecast) {
// Récupérer et afficher les prévisions météo des prochaines heures
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

// Afficher les prévisions météo
afficherPrevisions();
}



const dailyForecast =
    document.querySelector(".daily-forecast");



if (dailyForecast && hourlyForecast){
async function afficherPrevisionsJours() {

    const data = await getForecast(ville);

    dataForecast = data;

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



// Afficher les prévisions météo heure par heure pour le jour sélectionné
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
}

const forecastDetails =
    document.querySelector(".forecast-details");

if (forecastDetails) {
// Calculer et afficher les détails météo du jour sélectionné
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
}

const searchInput = document.getElementById("city-search");
const searchForm = document.getElementById("search-form");

if (searchForm) {

    searchForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const villeRecherchee = searchInput.value.trim();

        if (villeRecherchee === "") {
            return;
        }

        try {

            const data = await getWeather(villeRecherchee);

            if (data.cod !== 200) {
                console.log("Ville introuvable");
                return;
            }

            localStorage.setItem(
    "villeRecherchee",
    data.name
);

localStorage.setItem(
    "villeActuelle",
    data.name
);

            window.location.href = "previsions.html";

        } catch (error) {

            console.error(
                "Erreur lors de la recherche :",
                error
            );

        }

    });

}

const welcomeOverlay =
    document.getElementById("welcome-overlay");

if (welcomeOverlay) {

    // =========================================================
// ÉCRITURE DE "BIENVENUE"
// =========================================================

function ecrireBienvenue() {

    const message =
        document.getElementById("welcome-message");

    if (!message) {
        return;
    }

    const texte = "Bienvenue";

    message.textContent = "";
    message.classList.add("visible");

    let position = 0;

    const intervalle = setInterval(function() {

        message.textContent += texte[position];

        position++;

        if (position >= texte.length) {

            clearInterval(intervalle);

        }

    }, 150);
}


    setTimeout(function() {
        ecrireBienvenue();
    }, 3000);

    setTimeout(function() {

    const actions =
        document.querySelector(".welcome-actions");

    if (!actions) {
        return;
    }

    actions.classList.add("visible");

}, 5000);

// =====================================================
// BOUTON : UTILISER MA POSITION
// =====================================================

const boutonPosition =
    document.getElementById("welcome-location-button");

if (boutonPosition) {

    boutonPosition.addEventListener(
        "click",
        function() {

            if (!navigator.geolocation) {

                alert(
                    "La géolocalisation n'est pas disponible sur ce navigateur."
                );

                return;
            }

           navigator.geolocation.getCurrentPosition(

    function(position) {

        const latitude =
    position.coords.latitude;

const longitude =
    position.coords.longitude;

console.log("Latitude :", latitude);
console.log("Longitude :", longitude);

// Récupérer la météo de la position
const urlPosition =
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`;

fetch(urlPosition)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        console.log("Météo de ma position :", data);

        // Sauvegarder la ville trouvée
       localStorage.setItem(
    "villeLocalisation",
    data.name
);

localStorage.setItem(
    "villeActuelle",
    data.name
);
        // Fermer l'écran de bienvenue
        welcomeOverlay.classList.add("hidden");

    })
    .catch(function(error) {

        console.error(
            "Erreur lors de la récupération de la météo :",
            error
        );

    });

    },

    function(error) {

        console.log(
            "Géolocalisation refusée ou impossible :",
            error
        );

    }

);

        }
    );

}

// =====================================================
// BOUTON : RECHERCHER UNE VILLE
// =====================================================

const boutonRecherche =
    document.getElementById("welcome-search-button");

if (boutonRecherche) {

    boutonRecherche.addEventListener(
        "click",
        function() {

            const actions =
                document.querySelector(".welcome-actions");

            const message =
                document.getElementById("welcome-message");

            if (actions) {
                actions.classList.add("hidden");
            }

            if (message) {
                message.textContent =
                    "Recherchez votre ville";
            }

            const welcomeScreen =
    document.querySelector(".welcome-screen");

const searchBox =
    document.querySelector(".welcome-search");

if (welcomeScreen) {
    welcomeScreen.classList.add("search-mode");
}

if (searchBox) {
    setTimeout(function() {

        searchBox.classList.add("visible");

    }, 250);
}

        }
    );

}

// =====================================================
// RECHERCHE DEPUIS L'ÉCRAN DE BIENVENUE
// =====================================================

const welcomeSearchForm =
    document.getElementById("welcome-search-form");

const welcomeCitySearch =
    document.getElementById("welcome-city-search");

if (welcomeSearchForm) {

    welcomeSearchForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const ville =
                welcomeCitySearch.value.trim();

            if (ville === "") {
                return;
            }

            try {

                const data =
                    await getWeather(ville);

                if (data.cod !== 200) {

                    console.log(
                        "Ville introuvable"
                    );

                    return;
                }

                // Enregistrer la ville choisie
                localStorage.setItem(
                    "villeRecherchee",
                    data.name
                );

                localStorage.setItem(
                    "villeActuelle",
                    data.name
                );

                // Fermer l'écran de bienvenue
                welcomeOverlay.classList.add(
                    "hidden"
                );

                // Retourner à l'accueil
                //window.location.href = "index.html";

            } catch (error) {

                console.error(
                    "Erreur lors de la recherche :",
                    error
                );

            }

        }
    );

}
}
// =========================================================
// PAGE PRÉVISIONS
// =========================================================

const previsionPage = document.querySelector(".prevision-page");

if (previsionPage) {

    // =====================================================
    // VILLE TEMPORAIRE
    // =====================================================

    const villePrevision =
    localStorage.getItem("villeRecherchee") || "Angers";

    // Données des prévisions
    let previsionData = null;


    // =====================================================
    // METEO ACTUELLE
    // =====================================================

    async function afficherMeteoPrevision() {

        try {

            const data = await getWeather(villePrevision);

            // -------------------------
            // Ville
            // -------------------------

            const pays = obtenirNomPays(data.sys.country);

            document.getElementById("prevision-city").textContent =
                data.name + ", " + pays;


            // -------------------------
            // Coordonnées
            // -------------------------

            const latitude =
                data.coord.lat.toFixed(2);

            const longitude =
                data.coord.lon;

            let directionLongitude;

            if (longitude >= 0) {
                directionLongitude = "E";
            } else {
                directionLongitude = "O";
            }

            document.getElementById("prevision-coordinates").textContent =
                latitude + "° N · " +
                Math.abs(longitude).toFixed(2) + "° " +
                directionLongitude;


            // -------------------------
            // Température
            // -------------------------

            document.getElementById(
                "prevision-current-temperature"
            ).textContent =
                Math.round(data.main.temp) + "°C";


            // -------------------------
            // Description
            // -------------------------

            document.getElementById(
                "prevision-current-description"
            ).textContent =
                data.weather[0].description;


            // -------------------------
            // Ressenti
            // -------------------------

            document.getElementById(
                "prevision-feels-like"
            ).textContent =
                Math.round(data.main.feels_like) + "°C";


            // -------------------------
            // Humidité
            // -------------------------

            document.getElementById(
                "prevision-humidity"
            ).textContent =
                data.main.humidity + "%";


            // -------------------------
            // Vent
            // -------------------------

            document.getElementById(
                "prevision-wind"
            ).textContent =
                (data.wind.speed * 3.6).toFixed(1) + " km/h";


            // -------------------------
            // Pression
            // -------------------------

            document.getElementById(
                "prevision-pressure"
            ).textContent =
                data.main.pressure + " hPa";


            // -------------------------
            // Visibilité
            // -------------------------

            document.getElementById(
                "prevision-visibility"
            ).textContent =
                (data.visibility / 1000).toFixed(1) + " km";


            // -------------------------
            // Icône météo
            // -------------------------

            const weather =
                data.weather[0].main;

            const icon =
                getWeatherIcon(
                    weather,
                    data.weather[0].icon
                );

            document.getElementById(
                "prevision-current-icon"
            ).src = icon;


            // -------------------------
            // Heure
            // -------------------------

            const date =
                new Date(data.dt * 1000);

            document.getElementById(
                "prevision-current-time"
            ).textContent =
                date.toLocaleTimeString(
                    "fr-FR",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            // -------------------------
            // CONDITIONS ACTUELLES
            // -------------------------

            document.getElementById(
                "condition-humidity"
            ).textContent =
                data.main.humidity + "%";

            document.getElementById(
                "condition-wind"
            ).textContent =
                (data.wind.speed * 3.6).toFixed(1) + " km/h";

            document.getElementById(
                "condition-pressure"
            ).textContent =
                data.main.pressure + " hPa";

            document.getElementById(
                "condition-visibility"
            ).textContent =
                (data.visibility / 1000).toFixed(1) + " km";

            document.getElementById(
                "condition-feels-like"
            ).textContent =
                Math.round(data.main.feels_like) + "°C";


        } catch (error) {

            console.error(
                "Erreur météo actuelle :",
                error
            );

        }
    }


    // =====================================================
    // PRÉVISIONS DES 5 JOURS
    // =====================================================

    async function chargerPrevisions() {

    try {

        previsionData =
            await getForecast(villePrevision);


        const dateAujourdHui =
            obtenirDateDuJour();


        afficherPrevisionsHoraires(
            dateAujourdHui
        );


        afficherPrevisionsJours();


        // Afficher les détails d'aujourd'hui
        afficherDetailsJour(
            dateAujourdHui
        );


    } catch (error) {

        console.error(
            "Erreur prévisions :",
            error
        );

    }
}


    // =====================================================
    // DATE DU JOUR
    // =====================================================

    function obtenirDateDuJour() {

        const maintenant =
            new Date();

        const annee =
            maintenant.getFullYear();

        const mois =
            String(
                maintenant.getMonth() + 1
            ).padStart(2, "0");

        const jour =
            String(
                maintenant.getDate()
            ).padStart(2, "0");

        return annee + "-" + mois + "-" + jour;
    }


    // =====================================================
    // PRÉVISIONS HORAIRES
    // =====================================================

    function afficherPrevisionsHoraires(dateRecherchee) {

        const conteneur =
            document.getElementById(
                "prevision-hourly-chart"
            );

        if (!conteneur || !previsionData) {
            return;
        }


        // Vider l'ancien contenu

        conteneur.innerHTML = "";


        // Récupérer les prévisions du jour

        const previsions =
            previsionData.list.filter(
                function(forecast) {

                    return forecast.dt_txt.split(" ")[0]
                        === dateRecherchee;

                }
            );


        if (previsions.length === 0) {

            conteneur.innerHTML =
                "<p>Aucune prévision disponible.</p>";

            return;
        }


        // -------------------------------------------------
        // Conteneur des cartes horaires
        // -------------------------------------------------

        const listeHoraires =
            document.createElement("div");

        listeHoraires.classList.add(
            "prevision-hourly-items"
        );


        // -------------------------------------------------
        // Températures pour le graphique
        // -------------------------------------------------

        const temperatures = [];


        // -------------------------------------------------
        // Créer les prévisions horaires
        // -------------------------------------------------

        previsions.forEach(
            function(forecast) {

                const carte =
                    document.createElement("div");

                // IMPORTANT :
                // nom unique à previsions.html

                carte.classList.add(
                    "prevision-hourly-card"
                );


                const heure =
                    forecast.dt_txt
                        .split(" ")[1]
                        .slice(0, 5);


                const temperature =
                    Math.round(
                        forecast.main.temp
                    );


                const humidite =
                    forecast.main.humidity;


                const vent =
                    (
                        forecast.wind.speed * 3.6
                    ).toFixed(1);


                const weather =
                    forecast.weather[0].main;


                const icon =
                    getWeatherIcon(
                        weather,
                        forecast.weather[0].icon
                    );


                temperatures.push(
                    temperature
                );


                carte.innerHTML = `

                    <span class="prevision-hourly-time">
                        ${heure}
                    </span>

                    <img
                        class="prevision-hourly-icon"
                        src="${icon}"
                        alt="Météo"
                    >

                    <strong class="prevision-hourly-temperature">
                        ${temperature}°C
                    </strong>

                    <span class="prevision-hourly-humidity">
                        ${humidite}%
                    </span>

                    <span class="prevision-hourly-wind">
                        ${vent} km/h
                    </span>

                `;


                listeHoraires.appendChild(
                    carte
                );

            }
        );


        conteneur.appendChild(
            listeHoraires
        );


        // -------------------------------------------------
        // Créer la courbe des températures
        // -------------------------------------------------

        creerCourbeTemperature(
            conteneur,
            temperatures
        );
    }


    // =====================================================
    // COURBE DES TEMPÉRATURES
    // =====================================================

    function creerCourbeTemperature(
        conteneur,
        temperatures
    ) {

        if (temperatures.length === 0) {
            return;
        }


        const largeur =
            Math.max(
                temperatures.length * 120,
                700
            );

        const hauteur = 90;

        const marge = 15;


        const temperatureMin =
            Math.min(...temperatures);

        const temperatureMax =
            Math.max(...temperatures);


        const difference =
            temperatureMax - temperatureMin;


        const points = temperatures.map(
            function(temperature, index) {

                const x =
                    marge +
                    index *
                    (
                        (largeur - 2 * marge) /
                        Math.max(
                            temperatures.length - 1,
                            1
                        )
                    );


                let y;


                if (difference === 0) {

                    y =
                        hauteur / 2;

                } else {

                    y =
                        hauteur -
                        marge -
                        (
                            (temperature - temperatureMin)
                            / difference
                        )
                        *
                        (
                            hauteur - 2 * marge
                        );

                }


                return {
                    x: x,
                    y: y
                };

            }
        );


        // -------------------------------------------------
        // SVG
        // -------------------------------------------------

        const svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );

        svg.classList.add(
            "prevision-temperature-chart"
        );

        svg.setAttribute(
            "viewBox",
            `0 0 ${largeur} ${hauteur}`
        );


        // -------------------------------------------------
        // Ligne de la courbe
        // -------------------------------------------------

        const ligne =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "polyline"
            );


        ligne.setAttribute(
            "points",
            points
                .map(
                    function(point) {
                        return point.x + "," + point.y;
                    }
                )
                .join(" ")
        );


        ligne.setAttribute(
            "fill",
            "none"
        );

        ligne.setAttribute(
            "stroke",
            "#3b82f6"
        );

        ligne.setAttribute(
            "stroke-width",
            "3"
        );

        ligne.setAttribute(
            "stroke-linecap",
            "round"
        );

        ligne.setAttribute(
            "stroke-linejoin",
            "round"
        );


        svg.appendChild(
            ligne
        );


        // -------------------------------------------------
        // Petits points
        // -------------------------------------------------

        points.forEach(
            function(point) {

                const cercle =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );


                cercle.setAttribute(
                    "cx",
                    point.x
                );

                cercle.setAttribute(
                    "cy",
                    point.y
                );

                cercle.setAttribute(
                    "r",
                    "5"
                );

                cercle.setAttribute(
                    "fill",
                    "#3b82f6"
                );


                svg.appendChild(
                    cercle
                );

            }
        );


        conteneur.appendChild(
            svg
        );
    }


    // =====================================================
    // 5 PROCHAINS JOURS
    // =====================================================

    function afficherPrevisionsJours() {

        const conteneur =
            document.getElementById(
                "prevision-week-container"
            );

        if (!conteneur || !previsionData) {
            return;
        }


        conteneur.innerHTML = "";


        // -------------------------------------------------
        // Regrouper les données par date
        // -------------------------------------------------

        const jours = {};


        previsionData.list.forEach(
            function(forecast) {

                const date =
                    forecast.dt_txt.split(" ")[0];


                if (!jours[date]) {
                    jours[date] = [];
                }


                jours[date].push(
                    forecast
                );

            }
        );


        const dates =
            Object.keys(jours)
                .slice(0, 5);


        // -------------------------------------------------
        // Créer les 5 cartes
        // -------------------------------------------------

        dates.forEach(
            function(date, index) {

                const forecasts =
                    jours[date];


                let temperatureMin =
                    Infinity;

                let temperatureMax =
                    -Infinity;


                forecasts.forEach(
                    function(forecast) {

                        temperatureMin =
                            Math.min(
                                temperatureMin,
                                forecast.main.temp_min
                            );

                        temperatureMax =
                            Math.max(
                                temperatureMax,
                                forecast.main.temp_max
                            );

                    }
                );


                // Prévision proche de midi

                let forecastChoisie =
                    forecasts[0];


                forecasts.forEach(
                    function(forecast) {

                        const heure =
                            forecast.dt_txt
                                .split(" ")[1];


                        if (
                            heure.startsWith("12:00")
                        ) {

                            forecastChoisie =
                                forecast;

                        }

                    }
                );


                const weather =
                    forecastChoisie.weather[0].main;


                const icon =
                    getWeatherIcon(
                        weather,
                        forecastChoisie.weather[0].icon
                    );


                const dateObjet =
                    new Date(
                        date + "T12:00:00"
                    );


                let nomJour;


                if (index === 0) {

                    nomJour =
                        "Aujourd'hui";

                } else {

                    nomJour =
                        dateObjet.toLocaleDateString(
                            "fr-FR",
                            {
                                weekday: "long"
                            }
                        );

                }


                const dateAffichee =
                    dateObjet.toLocaleDateString(
                        "fr-FR",
                        {
                            day: "numeric",
                            month: "long"
                        }
                    );


                // -------------------------------------------------
                // CARTE UNIQUE À PREVISIONS.HTML
                // -------------------------------------------------

                const carte =
                    document.createElement("button");


                carte.type = "button";


                carte.classList.add(
                    "prevision-daily-card"
                );


                carte.dataset.date =
                    date;


                carte.innerHTML = `

                    <strong class="prevision-daily-day">
                        ${nomJour}
                    </strong>

                    <span class="prevision-daily-date">
                        ${dateAffichee}
                    </span>

                    <img
                        class="prevision-daily-icon"
                        src="${icon}"
                        alt="Météo"
                    >

                    <strong class="prevision-daily-max">
                        ${Math.round(temperatureMax)}°C
                    </strong>

                    <span class="prevision-daily-min">
                        ${Math.round(temperatureMin)}°C
                    </span>

                    <span class="prevision-daily-humidity">
                        ${forecastChoisie.main.humidity}%
                    </span>

                `;


                // -------------------------------------------------
                // Cliquer sur un jour
                // -------------------------------------------------

                carte.addEventListener(
                    "click",
                    function() {

                        document
                            .querySelectorAll(
                                ".prevision-daily-card"
                            )
                            .forEach(
                                function(carteJour) {

                                    carteJour.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        carte.classList.add(
                            "active"
                        );


                        afficherPrevisionsHoraires(date);
                        // Changer la carte des détails
                        afficherDetailsJour(date);

                    }
                );


                conteneur.appendChild(
                    carte
                );

            }
        );


        // Aujourd'hui sélectionné au départ

        const premiereCarte =
            conteneur.querySelector(
                ".prevision-daily-card"
            );


        if (premiereCarte) {

            premiereCarte.classList.add(
                "active"
            );

        }
    }


    // =====================================================
    // LANCEMENT
    // =====================================================

    afficherMeteoPrevision();

    chargerPrevisions();
    // =========================================================
// CHANGER LES DÉTAILS DU JOUR SÉLECTIONNÉ
// =========================================================

// =========================================================
// CHANGER LES DÉTAILS DU JOUR SÉLECTIONNÉ
// =========================================================

function afficherDetailsJour(date) {

    // Vérifier que les données existent
    if (!previsionData) {
        return;
    }

    // Récupérer les prévisions du jour sélectionné
    const previsionsJour =
        previsionData.list.filter(function(forecast) {

            return forecast.dt_txt.split(" ")[0] === date;

        });


    if (previsionsJour.length === 0) {
        return;
    }


    // =====================================================
    // VARIABLES
    // =====================================================

    let humidite = 0;
    let vent = 0;
    let pression = 0;
    let visibilite = 0;
    let ressenti = 0;


    // =====================================================
    // CALCULER LES MOYENNES
    // =====================================================

    for (const forecast of previsionsJour) {

        humidite += forecast.main.humidity;

        vent += forecast.wind.speed;

        pression += forecast.main.pressure;

        visibilite += forecast.visibility;

        ressenti += forecast.main.feels_like;

    }


    const nombre =
        previsionsJour.length;


    // =====================================================
    // METTRE À JOUR LA FICHE
    // =====================================================

    document.getElementById(
        "condition-humidity"
    ).textContent =
        Math.round(
            humidite / nombre
        ) + "%";


    document.getElementById(
        "condition-wind"
    ).textContent =
        (
            vent / nombre * 3.6
        ).toFixed(1) + " km/h";


    document.getElementById(
        "condition-pressure"
    ).textContent =
        Math.round(
            pression / nombre
        ) + " hPa";


    document.getElementById(
        "condition-visibility"
    ).textContent =
        (
            visibilite / nombre / 1000
        ).toFixed(1) + " km";


    document.getElementById(
        "condition-feels-like"
    ).textContent =
        Math.round(
            ressenti / nombre
        ) + "°C";
}

// =====================================================
    // CARTE MÉTÉO
    // =====================================================

    const boutonsCarte =
        document.querySelectorAll(
            ".prevision-map-filters .map-filter"
        );
    const previsionMap =
    document.getElementById("prevision-map");
    // Récupérer les coordonnées de la ville
async function initialiserCarte() {

    const data = await getWeather(villePrevision);

    const latitude = data.coord.lat;
    const longitude = data.coord.lon;

    console.log("Latitude :", latitude);
    console.log("Longitude :", longitude);

    const map = L.map("prevision-map").setView(
    [latitude, longitude],
    10
);
    L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

    const marker = L.marker(
    [latitude, longitude]
).addTo(map);

    marker.bindPopup(
    `<strong>${data.name}</strong>`
).openPopup();


    const temperatureLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    {
        opacity: 0.6
    }
).addTo(map);

    const pluieLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    {
        opacity: 0.6
    }
);

const nuagesLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    {
        opacity: 0.6
    }
);

const ventLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    {
        opacity: 0.6
    }
);
// =====================================================
// CHANGER DE COUCHE AVEC LES BOUTONS
// =====================================================

boutonsCarte.forEach(function(bouton) {

    bouton.addEventListener("click", function() {

        // Supprimer les couches météo actuellement affichées
        map.removeLayer(temperatureLayer);
        map.removeLayer(pluieLayer);
        map.removeLayer(nuagesLayer);
        map.removeLayer(ventLayer);


        // Retirer active de tous les boutons
        boutonsCarte.forEach(function(b) {
            b.classList.remove("active");
        });


        // Activer le bouton cliqué
        bouton.classList.add("active");


        // Afficher la bonne couche
        if (bouton.textContent.trim() === "Température") {
            temperatureLayer.addTo(map);
        }

        else if (bouton.textContent.trim() === "Pluie") {
            pluieLayer.addTo(map);
        }

        else if (bouton.textContent.trim() === "Nuages") {
            nuagesLayer.addTo(map);
        }

        else if (bouton.textContent.trim() === "Vent") {
            ventLayer.addTo(map);
        }

    });

});
}
initialiserCarte();
}