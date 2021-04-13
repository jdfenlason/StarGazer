/* eslint-disable no-console */
var $zipCodeInput = document.querySelector('.zip-code');
var $weatherHomeBtn = document.querySelector('#weather-home-button');
var weatherData = {};

$zipCodeInput.addEventListener('keyup', enterZip);
$weatherHomeBtn.addEventListener('click', weatherHomeClick);

function enterZip(event) {
  console.log(event.target.value);
}

function weatherHomeClick(event) {
  console.log(event.target);
}

function getWeatherData() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'http://api.weatherapi.com/v1/forecast.json?key=747120ab42924582925172532211204&q=92128&days=1&aqi=no&alerts=no');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.response);

    weatherData.latlon = xhr.response.location.lat + ' ' + 'N' + ' ' + xhr.response.location.lon + ' ' + 'W';
    weatherData.time = xhr.response.location.localtime.slice(11, 16);
    weatherData.date = xhr.response.location.localtime.slice(6, 10) + '-2021';
    weatherData.temp = xhr.response.current.temp_f;
    weatherData.feels = xhr.response.current.feelslike_f;
    weatherData.wind = xhr.response.current.wind_mph + ' ' + xhr.response.current.wind_dir;
    weatherData.moonrise = xhr.response.forecast.forecastday[0].astro.moonrise;
    weatherData.sunset = xhr.response.forecast.forecastday[0].astro.sunset;
    weatherData.moonset = xhr.response.forecast.forecastday[0].astro.moonset;
    weatherData.moon_phase = xhr.response.forecast.forecastday[0].astro.moon_phase;
    weatherData.moon_illumination = xhr.response.forecast.forecastday[0].astro.moon_illumination;
  });
  xhr.send();
}
getWeatherData();

// function getAstronomyData() {
//    var xhr = new XMLHttpRequest();
//   xhr.open(
//     'GET',
//     ''
//   );
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', function () {
//     console.log(xhr.response);

// }
