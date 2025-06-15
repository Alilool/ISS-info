const longitudeEle = document.getElementById("longitude");
const latitudeEle = document.getElementById("latitude");
const altitudeEle = document.getElementById("altitude");
const speedEle = document.getElementById("speed");
const mapsEle = document.getElementById("maps");
const cityEle = document.getElementById("city");
const liveMap = document.getElementById("live-map");

let lat = 0;
let lon = 0;

// Initialize map
const map = L.map("map").setView([0, 0], 3);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Add marker
const issIcon = L.icon({
  iconUrl: "./satellite.gif", // Path to your ISS icon image
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

const issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

async function getData() {
  let response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
  let data = await response.json();
  longitudeEle.innerText = data.longitude.toFixed(2) + "°";
  latitudeEle.innerText = data.latitude.toFixed(2) + "°";
  lat = data.latitude;
  lon = data.longitude;
  altitudeEle.innerText = data.altitude.toFixed(2) + " km";
  speedEle.innerText = data.velocity.toFixed(2) + " km/h";
  mapsEle.href = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;

  issMarker.setLatLng([lat, lon]);
  map.panTo([lat, lon], { animate: true, duration: 0.5 });
}

let lastLat = 0;
let lastLon = 0;
async function getCity() {
  try {
    console.log("new city");
    const apiKey = "pk.a4bf10885ef3324a2b166e205f061481"; // Replace with your actual key
    const response = await fetch(
      `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    lastLat = lat;
    lastLon = lon;
    const city = data.address.city || "Unknown";
    const country = data.address.country || "Unknown";
    cityEle.innerText = `${city}, ${country}`;
  } catch (error) {
    console.error("Error fetching city data:", error);
    cityEle.innerText = "Unable to find city";
  }
}

function UpdateCity() {
  const needToUpdate =
    Math.abs(lat - lastLat) > 1 || Math.abs(lon - lastLat) > 1;
  if (needToUpdate) {
    getCity();
  }
}

getCity();
setInterval(getData, 1000);
setInterval(UpdateCity, 5000);
