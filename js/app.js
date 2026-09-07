const cityInput=document.getElementById("cityInput");
const searchBtn=document.getElementById("searchBtn");
const statusEl=document.getElementById("status");
const card=document.getElementById("weatherCard");

const weatherText={0:"Clear sky",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Rime fog",51:"Light drizzle",53:"Drizzle",55:"Heavy drizzle",61:"Light rain",63:"Rain",65:"Heavy rain",71:"Light snow",73:"Snow",75:"Heavy snow",80:"Rain showers",81:"Rain showers",82:"Heavy rain showers",95:"Thunderstorm",96:"Thunderstorm with hail",99:"Thunderstorm with hail"};

async function getWeather(){
  const city=cityInput.value.trim();
  if(!city){statusEl.textContent="Please enter a city name.";return;}
  statusEl.textContent="Loading...";
  card.classList.add("hidden");
  try{
    const geo=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    if(!geo.ok) throw new Error("Geocoding request failed");
    const geoData=await geo.json();
    if(!geoData.results?.length) throw new Error("City not found");
    const place=geoData.results[0];
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`;
    const res=await fetch(url);
    if(!res.ok) throw new Error("Weather request failed");
    const data=await res.json();
    const c=data.current;
    document.getElementById("cityName").textContent=`${place.name}, ${place.country}`;
    document.getElementById("condition").textContent=weatherText[c.weather_code]||"Current conditions";
    document.getElementById("temperature").textContent=Math.round(c.temperature_2m);
    document.getElementById("humidity").textContent=`${c.relative_humidity_2m}%`;
    document.getElementById("wind").textContent=`${c.wind_speed_10m} km/h`;
    document.getElementById("feels").textContent=`${Math.round(c.apparent_temperature)}°C`;
    document.getElementById("jsonOutput").textContent=JSON.stringify(data,null,2);
    statusEl.textContent=`Updated for ${place.name}.`;
    card.classList.remove("hidden");
  }catch(err){statusEl.textContent=`Error: ${err.message}. Try another city.`;}
}
searchBtn.addEventListener("click",getWeather);
cityInput.addEventListener("keydown",e=>{if(e.key==="Enter")getWeather()});
getWeather();
