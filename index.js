const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const grantAccess = document.querySelector("[data-grantAccess]");
const searchForm = document.querySelector("[data-formcontainer]");
const loadingScreen = document.querySelector("[data-loadingScreen]");
const userWeatherInfo = document.querySelector("[data-userInfoContainer]");
const forecast = document.querySelector("[data-forecastbtn]");


let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

userTab.addEventListener("click", ()=> {
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=> {
    switchTab(searchTab);
});

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        // console.log("this function works fine");

        if(!searchForm.classList.contains("active")){
            userWeatherInfo.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
           
        }else{
            searchForm.classList.remove("active");
            userWeatherInfo.classList.remove("active");
            errWindow.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

function  getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccess.classList.add("active");
       
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        
    }
    
}


async function  fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    grantAccess.classList.remove("active");

    loadingScreen.classList.add("active");

    try {
        const  response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userWeatherInfo.classList.add("active");
        renderWeatherInfo(data); 
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherCondition = document.querySelector("[data-weatherCondition]");
    const weatherIcon = document.querySelector("[data-weatherConditionImg]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherCondition.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all} %`;

}

const grantAccessBtn = document.querySelector("[data-grantBtn]");

grantAccessBtn.addEventListener("click", getLocation);

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        //gchvh
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const searchInput = document.querySelector("[data-searchInput]");

async function getCityIndiceFromAcuweather(city) {
    const url = `http://dataservice.accuweather.com/locations/v1/search?apikey=N6jhEkJqMrKuiKrJxhumbGvZBcU2Y5uM&q=${city}`;
  
    const response = await fetch(url)
      .then((res) => res.json())
      .then((res) => {
        window.location.href = `https://www.accuweather.com/en/in/${city}/${res[0].Key}/daily-weather-forecast/${res[0].Key}`;
      });
  }

  forecast.addEventListener("click", (e) => {
    e.preventDefault();

    const cityName = document.querySelector("[data-cityName]").innerHTML;

    getCityIndiceFromAcuweather(cityName);
});

searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "") {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})



async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userWeatherInfo.classList.remove("active");
    grantAccess.classList.remove("active");

   try{
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
    const data = await response.json();

    if(!data.name){
        throw new Error("City Not available")
    }

    loadingScreen.classList.remove("active");
    userWeatherInfo.classList.add("active");
    errWindow.classList.remove("active");
    renderWeatherInfo(data);
   }
  catch(error){
   console.error(error);
   loadingScreen.classList.remove("active");
   userWeatherInfo.classList.remove("active");
   errWindow.classList.add("active");
  }
    
}

const errWindow = document.querySelector("[data-errorWindow]");