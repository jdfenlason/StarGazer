/* exported observationData */
/* exported astronomyData */
/* exported weatherData */
/* exported nasaData */

var observationData = {
  observations: [],
  editing: null,
  nextObvId: 1,
  view: 'observations'
};

var astronomyData = {
  zipCode: null
};

var weatherData = {
  zipCode: null
};

var nasaData = {
  image: null
};

var previousobservationDataJSON = localStorage.getItem('observationData-storage');
var previousAstronomyDataJSON = localStorage.getItem('astronomyData-storage');
var previousWeatherDataJSON = localStorage.getItem('weatherData-storage');
var previousNasaDataJSON = localStorage.getItem('nasaData-storage');

if (previousobservationDataJSON !== null) {
  observationData = JSON.parse(previousobservationDataJSON);
}

if (previousAstronomyDataJSON !== null) {
  astronomyData = JSON.parse(previousAstronomyDataJSON);
}

if (previousWeatherDataJSON !== null) {
  weatherData = JSON.parse(previousWeatherDataJSON);
}
if (previousNasaDataJSON !== null) {
  nasaData = JSON.parse(previousNasaDataJSON);
}

function storeData(event) {
  var observationDataJSON = JSON.stringify(observationData);
  localStorage.setItem('observationData-storage', observationDataJSON);
  var astronomyDataJSON = JSON.stringify(astronomyData);
  localStorage.setItem('astronomyData-storage', astronomyDataJSON);
  var weatherDataJSON = JSON.stringify(weatherData);
  localStorage.setItem('weatherData-storage', weatherDataJSON);
  var nasaDataJSON = JSON.stringify(nasaData);
  localStorage.setItem('nasaData-storage', nasaDataJSON);
}

window.addEventListener('beforeunload', storeData);
