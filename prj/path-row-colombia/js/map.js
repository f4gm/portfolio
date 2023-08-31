// Functions

function pathRowLayerStyle(feature) {
    return {
        fillColor: "#000000",
        fillOpacity: 0,
        color: "#35155D",
        weight: 1
    }
};

function highlight(event) {
    var layer = event.target;

    layer.setStyle({
        color: "#8CABFF"
    });
    layer.bringToFront();
};

function unhighlight(event) {
    var layer = event.target;
    layer.setStyle(pathRowLayerStyle());
};

function zoomToLayer(event) {
    map.flyToBounds(event.target._bounds);
};

function generalZoom() {
    map.flyToBounds(departamentos.getBounds());
}

function showPathRow(event) {
    var layer = event.target;
    var pathHtml = document.getElementById("path");
    var rowHtml = document.getElementById("row");

    pathHtml.innerHTML = layer.feature.properties.PATH;
    rowHtml.innerHTML = layer.feature.properties.ROW;
};

function hidePathRow(event) {
    var layer = event.target;
    var pathHtml = document.getElementById("path");
    var rowHtml = document.getElementById("row");

    pathHtml.innerHTML = "N/A";
    rowHtml.innerHTML = "N/A";
};
 
// Layers
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const departamentos = L.geoJson(departamentosGJS);

const wrs1_ascending = L.geoJson(wrs1_ascendingGJS, {
    style: pathRowLayerStyle,
    onEachFeature: (feature, layer) => {
        layer.on({
            mouseover: (event) => {
                highlight(event);
                showPathRow(event)
            },
            mouseout: (event) => {
                unhighlight(event);
                hidePathRow(event);
            },
            contextmenu: zoomToLayer
        });
    }
});

const wrs1_descending = L.geoJson(wrs1_descendingGJS, {

    style: pathRowLayerStyle,
    onEachFeature: (feature, layer) => {
        layer.on({
            mouseover: (event) => {
                highlight(event);
                showPathRow(event)
            },
            mouseout: (event) => {
                unhighlight(event);
                hidePathRow(event);
            },
            contextmenu: zoomToLayer
        });
    }
});

const wrs2_ascending = L.geoJson(wrs2_ascendingGJS, {
    style: pathRowLayerStyle,
    onEachFeature: (feature, layer) => {
        layer.on({
            mouseover: (event) => {
                highlight(event);
                showPathRow(event)
            },
            mouseout: (event) => {
                unhighlight(event);
                hidePathRow(event);
            },
            contextmenu: zoomToLayer
        });
    }
});

const wrs2_descending = L.geoJson(wrs2_descendingGJS,{
    style: pathRowLayerStyle,
    onEachFeature: (feature, layer) => {
        layer.on({
            mouseover: (event) => {
                highlight(event);
                showPathRow(event)
            },
            mouseout: (event) => {
                unhighlight(event);
                hidePathRow(event);
            },
            contextmenu: zoomToLayer
        });
    }
});

// Maps

var map = L.map('map', {
    center: departamentos.getBounds().getCenter(), 
    zoom: 5,
    layers: [osm, wrs2_descending]
});

// Controls

var overlays = {
    "WRS1-Ascending": wrs1_ascending,
    "WRS1-Descending": wrs1_descending,
    "WRS2-Ascending": wrs2_ascending,
    "WRS2-Descending": wrs2_descending
};

var baseLayers = {
    "Open Steet Maps": osm
};

var controlLayers = L.control.layers(baseLayers, overlays, {
    position: "bottomleft"
});
controlLayers.addTo(map);

var pathRow = L.control({
    position: "topright"
});
pathRow.onAdd = (map) => {
    var div = L.DomUtil.create("div", "path-row");
    div.innerHTML = `
    <p>Path: <span id="path">N/A</span></p>
    <p>Row: <span id="row">N/A</span></p>`;
    return div;
};
pathRow.addTo(map);

var home = L.control({
    position: "topleft"
});
home.onAdd = (map) => {
    var div = L.DomUtil.create("div", "leaflet-bar");
    div.innerHTML = `
    <a role="button" onclick="generalZoom()">
        <i class="bi bi-house-door"></i>
    </a>`;
    return div;
};
home.addTo(map);