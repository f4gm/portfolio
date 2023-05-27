// Clases
//  Icono de marcadores: Marcadores cuando se seleciona una posición para reportar
var markerIcon = L.icon({
    iconUrl: './data/img/icons/mk-report.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
});

var reportes = L.icon({
    iconUrl: './data/img/icons/trash.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

// Funciones
//  Constructor de rutas Google Maps: Construye la ruta para llegar al punto indicado con Google Maps
function googleStreetUrl(lat, lon) {
    url = "https://www.google.com/maps/dir//" + lat + "," + lon + "/@" + lat + "," + lon + ",19z";
    return url
};

//  Constructor de rutas Google Street Maps: Construye la ruta que dirige al punto en Google Street Maps
function googleViewUrl(lat, lon) {
    url = "http://maps.google.com/maps?q=&layer=c&cbll=" + lat + "," + lon;
    return url
};

//  Abrir panel: Abre el panel de atributos al presionar sobre una feature
function openPanPoint(event) {
    var point = document.getElementsByClassName("leaflet-marker-icon")[parseInt(event.target.feature.properties.id) - 1];
    //punto.setAttribute("role", "button")
    point.setAttribute("data-bs-toggle", "offcanvas");
    point.setAttribute("data-bs-target", "#pan");
    //console.log(punto);
};

//  Mostrar atributos: Funciones para mostrar los atributos segun la capa de informacion
//      Atributos de reportes: Muestra los atributos de los reportes anteriores hechos por otros usuarios

//      Atributos de puntos de recogida: Muestra los atributos de las zonas donde se pueden depositar residups
function attReport(feature) {
    var title = document.getElementById("panTitle")
    title.innerHTML = "Identificación del reporte: " + feature.properties.id;

    var content = document.getElementById("panContent");
    imagePath = "./data/img/reportes/";
    googleStreet = googleStreetUrl(feature.properties.latitud, feature.properties.longitud);
    content.innerHTML = "<img id='img' src=" + "'" + imagePath + feature.properties.id + ".webp'" + " class='rounded img-fluid'" + " alt='Imagen del reporte número "+ feature.properties.id + "'>" + 
        "<p class='p'><strong>Dirección: </strong>" + feature.properties.direccion + "</p>" +
        "<p class='p'><strong>Clase: </strong>" + feature.properties.clase + "</p>" +
        "<p class='p'><strong>Contiene: </strong>" + feature.properties.contiene + "</p>" +
        "<a class='btn btn-success' target='_blanck' href='" + googleStreet + "'role='button'>¿Cómo llegar?</a>" + 
        "<br><br><a class='btn btn-secondary' target='_blanck' href='" + form(feature.properties.latitud, feature.properties.longitud, 2) + "'role='button'>¿Alguna novedad?</a>";
};

//      Atrobutos rutas: Muestra los atributos de las rutas de los camión de basura

//      Atributos de barrios: Muestra los atributos de los barrios en el panel
function attBarrios(feature) {
    var title = document.getElementById("panTitle")
    title.innerHTML = "Nombre del barrio: " + feature.properties.barrio;

    var content = document.getElementById("panContent");
    content.innerHTML = "<p class='lead'> Identificación catastral: " + feature.properties.id_barrio + "</p>";
};

//  Abrir modal: Abre la ventana con información adicional sobre el punto que se desea reportar
function openModal(lat, lon) {
    var body = document.getElementById("body");
    body.setAttribute("class", "modal-open");
    body.setAttribute("data-bs-padding-right", "0px");

    var modal = document.getElementById("reporte");
    modal.removeAttribute("aria-hidden", "true");
    modal.classList.add('show');
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("style", "display: block;");

    var streetBtn = document.getElementById("boton-street");
    streetBtn.setAttribute("href", googleViewUrl(lat, lon));
    streetBtn.setAttribute("target", "_blanck");

    var divFade = document.createElement("div");
    divFade.classList.add("offcanvas-backdrop", "fade", "show");
    divFade.setAttribute("id", "borrar");
    body.appendChild(divFade);
};

//  Cerrar modal: Cierra la ventana de reportes y elimina el marcador creado
function removeMarker(pop) {
    document.querySelectorAll("#rmMarker").forEach(el => el.remove());
    if (pop == 1) {
        document.querySelectorAll(".leaflet-popup").forEach(el => el.remove());
    }
    userLoc.stop();
};

//  Programacion del reporte
function mkReport(event) {
    if (event.latlng.lat != marker._latlng.lat && event.latlng.lng != marker._latlng.lng) {
        marker.remove();
        marker = L.marker([event.latlng.lat, event.latlng.lng], {icon: markerIcon});
        marker.addTo(map);
        marker.getElement().setAttribute("id", "rmMarker");

        var reportBtn = document.getElementById("reportBtn");
        var viewBtn = document.getElementById("googleViewBtn");
        viewBtn.setAttribute("href", googleViewUrl(event.latlng.lat, event.latlng.lng))
        reportBtn.setAttribute("href", form(event.latlng.lat, event.latlng.lng, 1));
    };
    marker.bindPopup('<button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#reportModal">¡Reportar!</button>').openPopup();
    console.log(event.latlng.lat, event.latlng.lng);
};

//  Llenar formulario
function form(lat, lon, type) {
    // 2 es Actualizar
    var formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdY1gN6KXK7TOGcZ82eLM0MS13EYn5iohvkbyotOzJxzyWSWg/viewform?usp=pp_url&';
    if (type == 1) {
        // 1 es para un nuevo reporte
        formUrl += 'entry.2129838264=Nuevo&entry.535134601=' + lat + '&entry.1133370860=' + lon;
    } else if (type == 2) {
        // 2 es para actualizar un reporte existente
        formUrl += 'entry.2129838264=Actualizar&entry.535134601=' + lat + '&entry.1133370860=' + lon;
    } else {
        // Si no cumple ninguna devolver el formulario original
        formUrl = 'https://forms.gle/u1gpFoUgWtAn12cd9';
    }
    return formUrl
};

// Estilos
var barriosStyle = {
    'fillColor': 'rgba(2, 195, 154, 0.5)',
    'color': '#02c39a',
    'opacity': 1,
    'weight': 2
};