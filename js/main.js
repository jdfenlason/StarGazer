/* eslint-disable no-console */
var $zipCodeInput = document.querySelector('.zip-code');
var $weatherHomeBtn = document.querySelector('#weather-home-button');

$zipCodeInput.addEventListener('keyup', enterZip);
$weatherHomeBtn.addEventListener('click', weatherHomeClick);

function enterZip(event) {
  console.log(event.target.value);
}

function weatherHomeClick(event) {
  console.log(event.target);
}
