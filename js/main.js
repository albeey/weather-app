const ABSTRACT_IP_API = "de13d712c7624bba97e73279aa5b2ee7";
const OPEN_WEATHER_API = "579ef5899a2078dd338306c337bfa4c2";

let userIp;
let userDetails;
let weather;

const weatherConditions = {
  Clear: { day: "\img/clear-day.png", night: "\img/clear-night.png" },
  Clouds: { day: "\img/clouds-day.png", night: "\img/clouds-night.png" },
  Rain: { day: "\img/rain-day.png", night: "\img/rain-night.png" },
  Snow: { day: "\img/snow-day.png", night: "\img/snow-night.png" },
  Thunderstorm: { day: "\img/thunderstorm-day.png", night: "\img/thunderstorm-night.png" },
  Haze: { day: "\img/haze-day.png", night: "\img/haze-night.png" },
  default: { day: "\img/default-day.png", night: "\img/default-night.png" },
};

const startBtn = document.querySelector(".startBtn");
startBtn.addEventListener("click", displayData);

function displayData() {
  startBtn.style.display = "none";
  document.querySelector(".loadingAnimation").style.display = "block";

  getUserIp();
  setTimeout(() => getUserDetails(), 4000);
  setTimeout(() => getWeather(), 4500);
  setTimeout(() => displayWeather(), 5000);
}

function displayWeather() {
  const currentTime = new Date();

  document.querySelector(".welcomeScreen").style.display = "none";
  document.querySelector(".weatherInfo").style.display = "flex";

  document.querySelector(".city").innerText = userDetails.city;
  document.querySelector(".date").innerText = getCurrentDate(currentTime);

  setBackground(currentTime);

  document.querySelector(".weatherImg").style.backgroundImage = `url('${getWeatherImage(currentTime)}')`;

  document.querySelector(".minTemp span").innerText = Math.round(weather.minTemp) + "°";
  document.querySelector(".currentTemp .temp").innerText = Math.round(weather.temp) + "°";
  document.querySelector(".condition").innerText = weather.description;
  document.querySelector(".maxTemp span").innerText = Math.round(weather.maxTemp) + "°";
}

function getWeatherImage(currentTime) {
  currentTime = currentTime.getHours();
  const condition = weather.description in weatherConditions ? weather.description : "default";
  const dayTime = currentTime >= 8 && currentTime < 20 ? "day" : "night";

  return weatherConditions[condition][dayTime];
}

function setBackground(currentTime) {
  currentTime = currentTime.getHours();
  const body = document.querySelector("body");

  if (currentTime < 20 && (weather.description === "Rain" || weather.description === "Snow" || weather.description === "Thunderstorm")) {
    body.style.background = "rgb(135,152,203)";
    body.style.background = "radial-gradient(circle, rgba(135,152,203,1) 0%, rgba(114,120,138,1) 100%)";
  } else if (currentTime >= 7 && currentTime <= 18) {
    body.style.background = "rgb(141,173,255)";
    body.style.background = "radial-gradient(circle, rgba(141,173,255,1) 0%, rgba(74,121,243,1) 100%)";
  } else if (currentTime >= 18 && currentTime < 20) {
    body.style.background = "rgb(249,191,135)";
    body.style.background = "radial-gradient(circle, rgba(249,191,135,1) 0%, rgba(253,155,61,1) 100%)";
  }
}

function getCurrentDate(date) {
  return date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}

function getUserIp() {
  fetch("https://jsonip.com")
    .then((res) => res.json())
    .then((data) => {
      userIp = data.ip;
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

function getUserDetails() {
  fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${ABSTRACT_IP_API}&ip_address=${userIp}`)
    .then((res) => res.json())
    .then((data) => {
      userDetails = {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country,
      };
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

function getWeather() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${userDetails.latitude}&lon=${userDetails.longitude}&units=metric&appid=${OPEN_WEATHER_API}`)
    .then((res) => res.json())
    .then((data) => {
      weather = {
        temp: data.main.temp,
        minTemp: data.main.temp_min,
        maxTemp: data.main.temp_max, 
        description: data.weather[0].main,
      }
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}