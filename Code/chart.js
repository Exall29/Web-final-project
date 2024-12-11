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

document.addEventListener('DOMContentLoaded', () => {
    const api_key = "f77fa5e077b189eebf85a55751d51bed";

    const ctxLine = document.getElementById('lineChart').getContext('2d');
    const ctxBar = document.getElementById('barChart').getContext('2d');
    const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');

    const chartTypeSelector = document.getElementById('chartType');
    const chartsContainer = {
        line: document.getElementById('lineChartContainer'),
        bar: document.getElementById('barChartContainer'),
        doughnut: document.getElementById('doughnutChartContainer'),
    };

    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('searchBtn');
    const locationBtn = document.getElementById('locationBtn');

    // Variables pour les graphiques
    let lineChart, barChart, doughnutChart;

    function fetchWeatherAndAirData(city = null, lat = null, lon = null) {
        let promise;
        if (city) {
            const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`;
            promise = fetch(GEOCODING_API_URL)
                .then(res => res.json())
                .then(data => {
                    if (data.length === 0) throw new Error("City not found");
                    return { lat: data[0].lat, lon: data[0].lon };
                });
        } else if (lat && lon) {
            promise = Promise.resolve({ lat, lon });
        }

        promise
            .then(({ lat, lon }) =>
                Promise.all([
                    fetchWeatherData(lat, lon),
                    fetchAirQualityData(lat, lon)
                ])
            )
            .then(([weatherData, airData]) => {
                updateCharts(weatherData, airData);
            })
            .catch(err => {
                console.error(err);
                alert("Failed to fetch data: " + err.message);
            });
    }

    function fetchWeatherData(lat, lon) {
        const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
        return fetch(WEATHER_API_URL)
            .then(res => res.json())
            .then(data => {
                const timezone = data.city.timezone;  // Obtenir le fuseau horaire en secondes
                const temperatures = data.list.map(item => {
                    const localTime = moment.utc(item.dt_txt).add(timezone, 'seconds').format('YYYY-MM-DD HH:mm:ss');
                    return {
                        time: localTime,
                        temp: (item.main.temp - 273.15).toFixed(2) // Convertir de Kelvin en Celsius
                    };
                });
                return temperatures;
            });
    }
    

    function fetchAirQualityData(lat, lon) {
        const AIR_QUALITY_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
        return fetch(AIR_QUALITY_API_URL)
            .then(res => res.json())
            .then(data => {
                const pollutants = data.list[0].components;
                return {
                    PM2_5: pollutants.pm2_5,
                    PM10: pollutants.pm10,
                    CO: pollutants.co,
                    NO2: pollutants.no2,
                    SO2: pollutants.so2,
                    O3: pollutants.o3
                };
            });
    }

    function updateCharts(weatherData, airData) {
        const temperatureLabels = weatherData.map(item => item.time);
        const temperatureValues = weatherData.map(item => item.temp);

        const airLabels = Object.keys(airData);
        const airValues = Object.values(airData);

        // Mise à jour ou création des graphiques
        if (lineChart) lineChart.destroy();
        lineChart = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: temperatureLabels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatureValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        

        if (barChart) barChart.destroy();
        barChart = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: airLabels,
                datasets: [{
                    label: 'Air Quality Levels',
                    data: airValues,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
        

        if (doughnutChart) doughnutChart.destroy();
        doughnutChart = new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: {
                labels: airLabels,
                datasets: [{
                    label: 'Air Pollutants',
                    data: airValues,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
            },
        });
    }

    chartTypeSelector.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        for (const type in chartsContainer) {
            if (type === selectedType) {
                chartsContainer[type].style.display = 'block';
            } else {
                chartsContainer[type].style.display = 'none';
            }
        }
    });

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            fetchWeatherAndAirData(city);
        } else {
            alert("Please enter a city name");
        }
    });

    locationBtn.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherAndAirData(null, lat, lon);
        });
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherAndAirData(null, latitude, longitude);
        }, () => {
            alert("Failed to get your location.");
        });
    }
});

