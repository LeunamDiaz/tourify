var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 255,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
});

var Thunderforest_Transport = L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={apikey}', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: '<your apikey>',
    maxZoom: 22
});



L.control.locate().addTo(map);
lc = L.control
  .locate({
    strings: {
      title: "Show me where I am, yo!"
    }
  })
  .addTo(map);





// Luego, puedes añadir esta capa a tu mapa como se muestra a continuación
Thunderforest_Transport.addTo(map);

// Add the scale control to the map
var scaleControl = L.control.scale().addTo(map);

setInterval(function() {
    map.setView([0, 0]);

    setTimeout(function() {
        map.setView([60, 0]);
        // Refresh the scale control after changing the map's view
        map.removeControl(scaleControl);
        scaleControl.addTo(map);
    }, 2000);
}, 4000);

const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const osmAttrib = 'Map data © <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
let osm = new L.TileLayer(osmUrl, {
  attribution: osmAttrib,
  detectRetina: true
});

// please replace this with your own mapbox token!
const token = "pk.eyJ1IjoiZG9tb3JpdHoiLCJhIjoiY2s4a2d0OHp3MDFxMTNmcWoxdDVmdHF4MiJ9.y9-0BZCXJBpNBzEHxhFq1Q";
const mapboxUrl = "https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}@2x?access_token=" + token;
const mapboxAttrib = 'Map data © <a href="http://osm.org/copyright">OpenStreetMap</a> contributors. Tiles from <a href="https://www.mapbox.com">Mapbox</a>.';
let mapbox = new L.TileLayer(mapboxUrl, {
  attribution: mapboxAttrib,
  tileSize: 512,
  zoomOffset: -1
});

let map = new L.Map("map", {
  layers: [mapbox],
  center: [51.505, -0.09],
  zoom: 10,
  zoomControl: true
});

// add location control to global name space for testing only
// on a production site, omit the "lc = "!
