import { setAddress } from './form.js';
import { createCardsMarkup } from './popup.js';
import { enableForm, addOnChangeForFilters, getFilteredAdverts } from './filter.js';
import { debounce } from './utils.js';

const MAP_COORDINATES = {
  lat: 35.68951,
  lng: 139.69201,
};
const MAIN_ICON_WIDTH = 50;
const MAIN_ICON_HEIGHT = 82;
const ICON_WIDTH = 25;
const ICON_HEIGHT = 41;
const VIEW_DISTANCE = 10;
const RERENDER_DELAY = 500;

const map = L.map('map-canvas');

const mainPinIcon = L.icon({
  iconUrl: '../leaflet/images/marker-icon-2x.png',
  iconSize: [MAIN_ICON_WIDTH, MAIN_ICON_HEIGHT],
  iconAnchor: [MAIN_ICON_WIDTH / 2, MAIN_ICON_HEIGHT],
});

const pinIcon = L.icon({
  iconUrl: '../leaflet/images/marker-icon-2x.png',
  iconSize: [ICON_WIDTH, ICON_HEIGHT],
  iconAnchor: [ICON_WIDTH / 2, ICON_HEIGHT],
});

const mainMarker = L.marker(MAP_COORDINATES, { draggable: true, icon: mainPinIcon });

const markers = L.layerGroup().addTo(map);

function initMap(adverts) {
  map
    .on('load', () => {
      enableForm();
      setAddress(MAP_COORDINATES);
    })
    .setView(MAP_COORDINATES, VIEW_DISTANCE);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  setPositionMainMarker(MAP_COORDINATES);

  mainMarker.on('move', (evt) => {
    setAddress(evt.target.getLatLng());
  });

  mainMarker.addTo(map);

  if (adverts && adverts.length) {
    addOnChangeForFilters(debounce(() => createMarkers(getFilteredAdverts(adverts)), RERENDER_DELAY));
    createMarkers(getFilteredAdverts(adverts));
  }

  return map;
}

function setPositionMainMarker(coords) {
  mainMarker.setLatLng(coords);
}

function resetMainMarker(coords) {
  setAddress(coords);
  setPositionMainMarker(coords);
}

function createMarkers(array) {
  markers.clearLayers();
  array.forEach((item) => {
    const marker = L.marker({ lat: item.location.lat, lng: item.location.lng }, { icon: pinIcon });
    marker.addTo(markers).bindPopup(createCardsMarkup([item]).cloneNode(true).firstChild);
  });
}

export { initMap, MAP_COORDINATES, map, setPositionMainMarker, createMarkers, resetMainMarker };
