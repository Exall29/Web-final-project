function openSidebar() {
    document.getElementById("mySidebar").style.left = "0";
    document.getElementById("mainContent").classList.add("shift");
    document.querySelector(".open-btn").style.display = "none"; // Masque le bouton
}

function closeSidebar() {
    document.getElementById("mySidebar").style.left = "-250px";
    document.getElementById("mainContent").classList.remove("shift");
    document.querySelector(".open-btn").style.display = "block"; // Réaffiche le bouton
}

let cityInput = document.getElementById("city-input");
let searchBtn = document.getElementById("searchBtn");
let locationBtn = document.getElementById("locationBtn");
const api_key = "f77fa5e077b189eebf85a55751d51bed";
const currentWeatherCard = document.querySelectorAll(".left .cards")[0],
fiveDaysForecastCard = document.querySelector(".day-forecast");
aqiCard = document.querySelectorAll(".highlights .cards")[0];
sunriseCard = document.querySelectorAll(".highlights .cards")[1];
humidityVal = document.getElementById("humidityVal")
feelsVal = document.getElementById("feelsLikeVal")
windSpeedVal = document.getElementById("windSpeedVal")
visibilityVal = document.getElementById("visibilityVal")
hourlyForecastCard = document.querySelector(".hourly-forecast");
aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    let AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    const days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ];
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let {co, no, no2, o3,so2, pm2_5, pm10, nh3} = data.list[0].components;
        aqiCard.innerHTML = `
                        <div class="cards-head">
                            <p>Air quality index</p>
                            <p class="air-quality aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
                        </div>
                        <div class="air-data">
                            <div class="data">
                                <img src="image/wind.png" alt="" id="wind">
                            </div>
                            <div class="data">
                                <p>PM2.5</p>
                                <h2>${pm2_5}</h2>
                            </div>
                            <div class="data">
                                <p>PM10</p>
                                <h2>${pm10}</h2>
                            </div>
                            <div class="data">
                                <p>SO2</p>
                                <h2>${so2}</h2>
                            </div>
                            <div class="data">
                                <p>CO</p>
                                <h2>${co}</h2>
                            </div>
                            <div class="data">
                                <p>NO</p>
                                <h2>${no}</h2>
                            </div>
                            <div class="data">
                                <p>NO2</p>
                                <h2>${no2}</h2>
                            </div>
                            <div class="data">
                                <p>NH3</p>
                                <h2>${nh3}</h2>
                            </div>
                            <div class="data">
                                <p>O3</p>
                                <h2>${o3}</h2>
                            </div>
                        </div>
        `;

    }).catch(() => {
        alert('Failed to fetch Air Quality Index')
    })

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        console.log(data);
        let date = new Date();
        currentWeatherCard.innerHTML = `
        <div class="weather-now">
        <div class="now">
        <p>Now</p>
        <h2>${(data.main.temp - 273.15).toFixed(2)}°C</h2>
        <p>${data.weather[0].description}</p>
        </div>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="" id="weather">
        </div>
        <hr>
        <div class="calendar">
        <img src="image/calendar.png" alt="calendar logo" id="logo">
        <p>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
        </div>
        <div class="location">
        <img src="image/location.png" alt="location logo" id="logo">
        <p>${name}, ${country}</p>
        </div>
        `;

        let {sunrise, sunset} = data.sys;
        let {timezone, visibility} = data;
        let {humidity, feels_like} = data.main;
        let {speed} = data.wind;
        sRiseTime = moment.utc(sunrise, "X").add(timezone, "seconde").format("hh:mm A");
        sSetTime = moment.utc(sunset, "X").add(timezone, "seconde").format("hh:mm A");
        sunriseCard.innerHTML = `
         <div class="cards-head">
                            <p>Sunrise & sunset </p>
                        </div>
                        <div class="sun">
                            <div class="sunSituation">
                                <img src="image/sunrise.png" alt="" id="sun">
                                <h2>${sRiseTime}</h2>
                            </div>
                            <br>
                            <div class="sunSituation">
                                <img src="image/sunset.png" alt="" id="sun">
                                <h2>${sSetTime}</h2>
                            </div>
                        </div>
        `;

        humidityVal.innerHTML = `${humidity}%`;
        feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}°C`;
        windSpeedVal.innerHTML = `${speed}m/s`
        visibilityVal.innerHTML = `${visibility / 1000}km`
    }).catch(() => {
        alert("Failed to fetch current weather");
    });


    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let hourlyForecast = data.list;
        hourlyForecastCard.innerHTML = ``;
        for(i=0; i<=7; i++){
            let hrForecastDate = new Date (hourlyForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a = "PM";
            if(hr < 12) a = "AM";
            if(hr ==0) hr = 12;
            if(hr > 12) hr = hr - 12;
            hourlyForecastCard.innerHTML += `
            <div class="cards">
                        <p>${hr} ${a}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                        <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}°C</p>
                    </div>
            `;
            }

        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        console.log(fiveDaysForecast)
        fiveDaysForecastCard.innerHTML = '';
        for (i = 0; i< fiveDaysForecast.length; i++){
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                        <div class="forecast">
                        <div class="weather-forecast">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="weather" id="weather-forecast-logo">
                            <span> ${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}°C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                        </div>       
            `;
        }
    }).catch(() => {
        alert("Failed to fetch forecast weather");
    });

}



function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = "";
    if (!cityName) return;

    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        console.log(data);
        let { name, lat, lon, country, state } = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_URl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URl).then(res => res.json()).then(data => {
            let {name, country, state} = data[0];
            getWeatherDetails(name,latitude,longitude,country,state);
        }).catch(() => {
            alert("Failed to fetch user coordiantes")
        });
    }, error => {
        if(error.code === error.PERMISSION_DENIED){
            alert("Geocalisation permission denied. Please reset location permisision to grant acces again")
        }
    });
}




// Initialisation de la carte Leaflet
const map = L.map('map').setView([48.8566, 2.3522], 13); // Centrée sur Paris par défaut

// Ajout de la couche OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Ajout d'un marqueur pour tester
const marker = L.marker([48.8566, 2.3522]).addTo(map);
marker.bindPopup("<b>Paris</b><br>Ville par défaut.").openPopup();

// Ajout de la géolocalisation de l'utilisateur
map.locate({setView: true, maxZoom: 16});

// Gestion de l'événement de géolocalisation
map.on('locationfound', function(e) {
    const userMarker = L.marker(e.latlng).addTo(map);
    userMarker.bindPopup("<b>Vous êtes ici !</b>").openPopup();
});

// Gestion des erreurs de géolocalisation
map.on('locationerror', function(e) {
    alert("La géolocalisation a échoué : " + e.message);
});



searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
window.addEventListener("load", getUserCoordinates());


