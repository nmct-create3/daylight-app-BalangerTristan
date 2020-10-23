const getMinutes = function(date) {
	let mins = 0
	for ( let i = 0; i < date.getHours(); i++){
		mins += 60;
	}
	mins += date.getMinutes();
	return mins;

};

const minutesLeft = function(n) {
    return n < 10 ? '0' + n : n;
}

// Met de data van de API kunnen we de app opvullen
let showResult = function(json) {
	//millisecondjes krijgen 
	let sunriseMillis = json.city.sunrise * 1000;
	let sunsetMillis = json.city.sunset * 1000;
	let currentDateMillis = new Date().getTime();

	//Times waarmee we gaan werken
	let sunriseTime = new Date(sunriseMillis);
	let sunsetTime = new Date(sunsetMillis);
	let currentTime = new Date(currentDateMillis);
	

	//Minuten calculeren
	let sunsetMinutes = getMinutes(sunsetTime) + json.city.timezone;
	let sunriseMinutes = getMinutes(sunriseTime)+ json.city.timezone;
	let currentMinutes = getMinutes(currentTime)+ json.city.timezone;

	//Calculating percentage
	let percentage = Math.round(((currentMinutes - sunriseMinutes)/(sunsetMinutes - sunriseMinutes))*100);
	let dayLeft = sunsetMinutes - currentMinutes;
	//String die de sunrise tijd weergeeft
	let sunriseString = `${sunriseTime.getHours()}:${minutesLeft(sunriseTime.getMinutes())}`;
	//String die de sunset tijd weergeeft
	let sunsetString = `${sunsetTime.getHours()}:${minutesLeft(sunsetTime.getMinutes())}`;
	//String die de huidige tijd weergeeft
	let currentString = `${currentTime.getHours()}:${minutesLeft(currentTime.getMinutes())}`;

	//showing time
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	document.querySelector(`.js-sunrise`).innerHTML = sunriseString;
	document.querySelector(`.js-sunset`).innerHTML = sunsetString;
	document.querySelector(`.js-sun`).setAttribute(`data-time`, currentString);
	document.querySelector(`.js-time-left`).innerHTML = dayLeft + " ";
	document.querySelector(`.js-sun`).style.bottom = `${percentage}%`;
	document.querySelector(`.js-sun`).style.left = `${percentage}%`;
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	document.querySelector(`.js-location`).innerHTML = `${json.city.name}, ${json.city.country}`

};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {

	// Met de fetch API proberen we de data op te halen.
	let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=282b3ebd9db3e69640faeb50d4dba8ed&units=metric&lang=nl&cnt=1`;
    const endpoint = url;
    fetch(endpoint).then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
        showResult(json);
    }).catch(function(error) {
        console.error('An error occured, we handled it.', error);
    });
};

document.addEventListener('DOMContentLoaded', function() {
	getAPI(50.744020,3.619970);
});