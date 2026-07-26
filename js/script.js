const API_KEY="my_api_adresse"
const ville="Angers"; 
const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${API_KEY}&units=metric&lang=fr`;
fetch(url)
        .then(response => response.json())
        .then(data => {console.log(data)
        
        document.getElementById("temperature").textContent=data.main.temp +"°C" ; 
        document.getElementById("humidity").textContent=data.main.humidity + "%"; 
        console.log(data.wind.speed) ; 
        document.getElementById("wind").textContent=(data.wind.speed * 3.6).toFixed(1) + " Km/h" ; 
        document.getElementById("pressure").textContent=data.main.pressure +" hPa" ; 
        document.getElementById("feels-like").textContent=data.main.feels_like + "°C" ; 
        document.getElementById("description").textContent=data.weather[0].description ; 
        document.getElementById("city").textContent=data.name ; 
        const icon = data.weather[0].icon ; 
        document.getElementById("weather_icon").src=`https://openweathermap.org/img/wn/${icon}@2x.png`;
        const date = new Date(data.dt*1000);
        document.getElementById("datetime").textContent=date.toLocaleString("fr-FR") ; 

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
const marker = L.marker([data.coord.lat, data.coord.lon]).addTo(map);
marker.bindPopup(`
<div class="weather-popup">
        <h3>${data.name}</h3>
        <div class="popup-temp">
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Météo">
        <span>${Math.round(data.main.temp)}°C</span>
    </div>
    </div>
`);
marker.openPopup();
        });


        

        