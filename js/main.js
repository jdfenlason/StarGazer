/* global weatherData */
/* global astronomyData */
/* global nasaData */
/* global observationData */

var $zipCodeInput = document.querySelector('.zip-code');
var $zipCodeTitle = document.querySelector('.zip-code-title');
var $loading = document.querySelector('.fa-moon');
var $headerBookIcon = document.querySelector('#book-header');
var $footerBookIcon = document.querySelector('#book-footer');
var $headerMoonIcon = document.querySelector('#header-moon');
var $footerMoonIcon = document.querySelector('#moon-footer');
var $observationView = document.querySelector('.observation-container');
var $weatherView = document.querySelector('.container');
var recordObv = document.querySelector('.observation-form');
var $newButton = document.querySelector('.new-button');
var $observationRecordView = document.querySelector('.observation-record');
var $imageUrl = document.querySelector('.image-url');
var $userPhotoUrl = document.querySelector('#user-photoUrl');
var $newUlobservations = document.querySelector('.list-observations');

$newButton.addEventListener('click', newClick);
$zipCodeInput.addEventListener('keyup', enterZip);
window.addEventListener('keypress', submit);
$footerBookIcon.addEventListener('click', bookClick);
$footerMoonIcon.addEventListener('click', moonClick);
recordObv.addEventListener('submit', saveObvs);
$userPhotoUrl.addEventListener('input', imageUpdate);
window.addEventListener('DOMContentLoaded', loadObservations);
function newClick() {
  $observationRecordView.className = 'hidden observation-record';
  $observationView.className = 'observation-container';
  $headerMoonIcon.className = 'fas fa-cloud-moon hidden';
  $headerBookIcon.className = 'fas fa-book';
}

function moonClick(event) {
  $headerBookIcon.className = 'fas fa-book hidden';
  $headerMoonIcon.className = 'fas fa-cloud-moon';
  $observationView.className = 'hidden observation-container';
  $observationRecordView = 'hidden observation-record';
  $weatherView.className = 'container';
}
function bookClick(event) {
  $headerMoonIcon.className = 'fas fa-cloud-moon hidden';
  $headerBookIcon.className = 'fas fa-book';
  $weatherView.className = 'hidden';
  $observationView.className = 'hidden observation-container';
  $observationRecordView.className = 'observation-record';
}

function saveObvs(event) {
  event.preventDefault();
  if (observationData.editing === null) {
    var userInput = {};
    userInput.zipcode = recordObv.elements.zipcode.value;
    userInput.location = recordObv.elements.location.value;
    userInput.date = recordObv.elements.date.value;
    userInput.time = recordObv.elements.time.value;
    userInput.lunarPhase = recordObv.elements.lunarPhase.value;
    userInput.image = recordObv.elements.photo.value;
    userInput.observations = recordObv.elements.observations.value;
    observationData.observations.unshift(userInput);
    userInput.nextObvId = observationData.nextObvId;
    observationData.nextObvId++;
    var newNode = createObservation(observationData.observations[0]);
    $newUlobservations.prepend(newNode);
  } else {
    observationData.editing.zipcode = recordObv.elements.zipcode.value;
    observationData.editing.location = recordObv.elements.location.value;
    observationData.editing.date = recordObv.elements.date.value;
    observationData.editing.time = recordObv.elements.time.value;
    observationData.editing.lunarPhase = recordObv.elements.lunarPhase.value;
    observationData.editing.image = recordObv.elements.photo.value;
    observationData.editing.observations = recordObv.elements.observations.value;
    for (var i = 0; i < observationData.length; i++) {
      if (observationData.observations[i].nextObvId === observationData.editing.nextObvId) { observationData[i] = observationData.editing; }
      var $observationNode = document.querySelectorAll('.observation-entry');
      var editObservationItem = createObservation(observationData.editing);
      $observationNode[i].replaceWith(editObservationItem);
    }
  }
  $imageUrl.setAttribute('src', 'images/placeholder.jpeg');
  recordObv.reset();
  observationData.editing = null;
  bookClick();
}

function createObservation(observation) {
  var newList = document.createElement('li');
  newList.setAttribute('class', 'observation-entry');
  newList.setAttribute('observation-data-id', observation.nextObvId);

  var row = document.createElement('div');
  row.setAttribute('class', 'row');

  var columnhalf1 = document.createElement('div');
  columnhalf1.setAttribute('class', 'column-half');

  var columnhalf2 = document.createElement('div');
  columnhalf2.setAttribute('class', 'column-half');

  var flipContainer = document.createElement('div');
  flipContainer.setAttribute('class', 'flip-card-container');

  var flipCard = document.createElement('div');
  flipCard.setAttribute('class', flipCard);

  var flipfront = document.createElement('div');
  flipfront.setAttribute('class', 'image-container');
  flipfront.setAttribute('id', 'flip-card-front');

  var img = document.createElement('img');
  img.setAttribute('src', observation.image);
  img.setAttribute('class', 'image-url');

  var flipback = document.createElement('div');
  flipback.setAttribute('class', 'flip-card-back');

  var observationheader = document.createElement('div');
  observationheader.setAttribute('class', 'observation-header');
  var h2 = document.createElement('h2');
  h2.setAttribute('class', 'post-title');
  h2.textContent = observation.location;

  var editIcon = document.createElement('i');
  editIcon.setAttribute('class', 'fas fa-edit');

  var pElement = document.createElement('p');
  pElement.textContent = observation.observations;

  observationheader.appendChild(h2);
  observationheader.appendChild(editIcon);
  columnhalf2.appendChild(observationheader);
  columnhalf2.appendChild(pElement);
  columnhalf1.appendChild(img);
  row.appendChild(columnhalf1);
  row.appendChild(columnhalf2);
  newList.appendChild(row);

  return newList;
}

function loadObservations(event) {
  for (var i = 0; i < observationData.length; i++) {
    var $observationNode = createObservation(observationData.observations[i]);
    $newUlobservations.append($observationNode);
  }
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
    weatherData.lat = xhr.response.location.lat;
    weatherData.lon = xhr.response.location.lon;
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
    weatherData.city = xhr.response.location.name;
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
    getNasaData();
  });
  xhr.send();
}
function getNasaData() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://api.nasa.gov/planetary/apod?api_key=c39xLCyknC5Yk1SHwmpIVzqHud1ISaewFRDLhIp2'
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    nasaData.image = xhr.response.hdurl;
    renderData();
  });
  xhr.send();
}

function renderData() {
  $zipCodeTitle.textContent = $zipCodeInput.value;

  var zipcode = document.querySelector('#zipcode');
  zipcode.value = weatherData.zipCode;

  var $latitude = document.querySelector('.latitude');
  $latitude.textContent =
    weatherData.lat + '° N, ' + ' ' + weatherData.lon + '° W';

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

  var location = document.querySelector('#location');
  location.value = weatherData.city;

  var date = document.querySelector('#date');
  date.value = weatherData.date;

  var time = document.querySelector('#time');
  time.value = weatherData.time;

  var lunarPhase = document.querySelector('#lunarPhase');
  lunarPhase.value = weatherData.moon_phase;

  var imageurl = document.querySelector('#user-photoUrl');
  imageurl.value = nasaData.image;
  $imageUrl.setAttribute('src', nasaData.image);

  $zipCodeInput.value = null;
  nasaData.image = null;
  spinIcon();
}

function imageUpdate(event) {
  var newImage = event.target.value;
  $imageUrl.setAttribute('src', newImage);
}
