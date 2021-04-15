/* global weatherData */
/* global astronomyData */

var $zipCodeInput = document.querySelector('.zip-code');
var $zipCodeTitle = document.querySelector('.zip-code-title');
var $loading = document.querySelector('.fa-moon');
var $headerBookIcon = document.querySelector('#book-header');
var $footerBookIcon = document.querySelector('#book-footer');
var $headerMoonIcon = document.querySelector('#header-moon');
var $footerMoonIcon = document.querySelector('#moon-footer');
$zipCodeInput.addEventListener('keyup', enterZip);
window.addEventListener('keypress', submit);

$footerBookIcon.addEventListener('click', bookClick);
$footerMoonIcon.addEventListener('click', moonClick);

function bookClick(event) {
  $headerMoonIcon.className = 'fas fa-cloud-moon hidden';
  $headerBookIcon.className = 'fas fa-book';
}

function moonClick(event) {
  $headerBookIcon.className = 'fas fa-book hidden';
  $headerMoonIcon.className = 'fas fa-cloud-moon';
}

function enterZip(event) {
  if ($zipCodeInput.value.length > 5) {
    $zipCodeInput.className = 'zip-code-error';
  }
  if ($zipCodeInput.value.length === 5) {
    $zipCodeInput.className = 'zip-code';
    astronomyData.zipCode = $zipCodeInput.value;
    weatherData.zipCode = $zipCodeInput.value;
  }
}
function spinIcon() {
  $loading.className = 'fas fa-moon invisible';
}
function submit(event) {
  if (
    event.key === 'Enter' &&
    Number($zipCodeInput.value && weatherData.zipCode !== null)
  ) {
    $loading.className = 'fas fa-moon loading';
    getWeatherData();
  }
}

function getWeatherData() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'http://api.weatherapi.com/v1/forecast.json?key=747120ab42924582925172532211204&q=' +
      weatherData.zipCode +
      '&days=1&aqi=no&alerts=no'
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    weatherData.latlon =
      xhr.response.location.lat +
      '° N, ' +
      ' ' +
      xhr.response.location.lon +
      '° W';
    weatherData.time = xhr.response.location.localtime.slice(11, 16);
    weatherData.date = xhr.response.location.localtime.slice(6, 10) + '-2021';
    weatherData.temp = xhr.response.current.temp_f + '°';
    weatherData.feels = xhr.response.current.feelslike_f + '°';
    weatherData.wind =
      xhr.response.current.wind_mph + ' ' + xhr.response.current.wind_dir;
    weatherData.moonrise = xhr.response.forecast.forecastday[0].astro.moonrise;
    weatherData.sunset = xhr.response.forecast.forecastday[0].astro.sunset;
    weatherData.moonset = xhr.response.forecast.forecastday[0].astro.moonset;
    weatherData.moon_phase =
      xhr.response.forecast.forecastday[0].astro.moon_phase;
    weatherData.moon_illumination =
      xhr.response.forecast.forecastday[0].astro.moon_illumination;
    getAstronomyData();
  });
  xhr.send();
}

function getAstronomyData() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://api.ipgeolocation.io/astronomy?apiKey=269e58c8ced7450593d0b670723b7b18&location=US'
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    astronomyData.dayLength = xhr.response.day_length;
    astronomyData.moon_distance = Math.floor(xhr.response.moon_distance);
    renderData();
  });
  xhr.send();
}

function renderData() {
  $zipCodeTitle.textContent = $zipCodeInput.value;
  $zipCodeInput.value = null;
  var $latitude = document.querySelector('.latitude');
  $latitude.textContent = weatherData.latlon;
  var $date = document.querySelector('.date');
  $date.textContent = weatherData.date;
  var $time = document.querySelector('.time');
  $time.textContent = weatherData.time;
  var $temp = document.querySelector('.temp');
  $temp.textContent = weatherData.temp;
  var $feels = document.querySelector('.feels');
  $feels.textContent = weatherData.feels;
  var $wind = document.querySelector('.wind');
  $wind.textContent = weatherData.wind;
  var $moonrise = document.querySelector('.moonrise');
  $moonrise.textContent = weatherData.moonrise;
  var $sunset = document.querySelector('.sunset');
  $sunset.textContent = weatherData.sunset;
  var $moonset = document.querySelector('.moonset');
  $moonset.textContent = weatherData.moonset;
  var $moonphase = document.querySelector('.moonphase');
  $moonphase.textContent = weatherData.moon_phase;
  var $moonIll = document.querySelector('.moonIll');
  $moonIll.textContent = weatherData.moon_illumination;
  var $dayLength = document.querySelector('.dayLength');
  $dayLength.textContent = astronomyData.dayLength + ' HRS.';
  var $moonDistance = document.querySelector('.moon-distance');
  $moonDistance.textContent = astronomyData.moon_distance + ' Miles';
  spinIcon();
}
