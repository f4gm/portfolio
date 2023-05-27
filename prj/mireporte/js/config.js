// Capas de informacion
//  Mapas base
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const esriWorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

const esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

//  Capas
var barrios = L.geoJson(barrios_geoJson, {
    style: barriosStyle,
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<p style="font-family:' + "'Jost'" + ', sans-serif;">' + feature.properties.barrio + '</p>')
    }
});

var reportes = L.geoJson(reportes_geoJson, {
    onEachFeature: function (feature, layer) {
        layer.on('mouseover', function(ev) {
            openPanPoint(ev);
            attReport(ev.target.feature);
        });
    },
    pointToLayer: function(geoJsonPoint, latlng) {
        return L.marker(latlng, {icon: reportes});
    }
});

const map = L.map('map', {
    center: reportes.getBounds().getCenter(),
    zoom: 17,
    layers: [osm, reportes]
});

// Grupo de capas
var mapasBase = {
    'OpenStreetMaps': osm,
    'Esri World Street Map': esriWorldStreetMap,
    'Esri World Imagery': esriWorldImagery
};

var capas = {
    'Barrios': barrios,
    'Reportes': reportes
};

var grupoCapas = L.control.layers(mapasBase, capas, {collape: 'false'});

var marker = L.marker([0, 0], {icon: markerIcon});
map.on('contextmenu', mkReport);

map.on('click', removeMarker);

grupoCapas.addTo(map);

L.control.scale({
    metric: true
}).addTo(map);

L.easyButton({
    states: [{
        icon: 'bi bi-house-door-fill',
        title: 'Restaurar vista',
        onClick: function(btn, map) {
            map.setView(reportes.getBounds().getCenter(), 17);
        }
    }],
    position: 'topleft'
}).addTo(map);

var userLoc = L.control.locate({
    flyTo: true,
    drawMarker: false,
    drawCircle: false,
    cacheLocation: true,
    locateOptions: {
        enableHighAccuracy: true
    }
}).addTo(map);

map.on('locationfound', function (event) {
    mkReport(event);
    console.log('Location found!');
    setTimeout(() => {userLoc.stop();}, 3000);
});