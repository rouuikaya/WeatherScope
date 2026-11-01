from fastapi import FastAPI
from dotenv import load_dotenv
import os
import requests
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def accueil():
    cle = os.getenv("OPENWEATHER_API_KEY")

    if cle:
        return {"message": "La clé OpenWeather est bien chargée !"}
    else:
        return {"message": "La clé OpenWeather n'est pas trouvée."}


@app.get("/weather")
def meteo(city: str):
    cle = os.getenv("OPENWEATHER_API_KEY")

    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "q": city,
        "appid": cle,
        "units": "metric",
        "lang": "fr"
    }

    reponse = requests.get(url, params=params)

    donnees = reponse.json()

    return {
    "cod": 200,
    "coord": {
        "lat": donnees["coord"]["lat"],
        "lon": donnees["coord"]["lon"]
    },
    "weather": [
        {
            "main": donnees["weather"][0]["main"],
            "description": donnees["weather"][0]["description"],
            "icon": donnees["weather"][0]["icon"]
        }
    ],
    "main": {
        "temp": donnees["main"]["temp"],
        "feels_like": donnees["main"]["feels_like"],
        "pressure": donnees["main"]["pressure"],
        "humidity": donnees["main"]["humidity"],
        "temp_min": donnees["main"]["temp_min"],
        "temp_max": donnees["main"]["temp_max"]
    },
    "visibility": donnees["visibility"],
    "wind": {
        "speed": donnees["wind"]["speed"]
    },
    "dt": donnees["dt"],
    "sys": {
        "country": donnees["sys"]["country"]
    },
    "name": donnees["name"]
}

@app.get("/forecast")
def previsions(city: str):
    cle = os.getenv("OPENWEATHER_API_KEY")

    url = "https://api.openweathermap.org/data/2.5/forecast"

    params = {
        "q": city,
        "appid": cle,
        "units": "metric",
        "lang": "fr"
    }

    reponse = requests.get(url, params=params)
    donnees = reponse.json()

    return donnees

@app.get("/weather-position")
def meteo_position(lat: float, lon: float):
    cle = os.getenv("OPENWEATHER_API_KEY")

    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "lat": lat,
        "lon": lon,
        "appid": cle,
        "units": "metric",
        "lang": "fr"
    }

    reponse = requests.get(url, params=params)
    donnees = reponse.json()

    return donnees