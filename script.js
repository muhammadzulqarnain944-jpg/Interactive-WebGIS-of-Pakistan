/* =========================================================
   INTERACTIVE WEB GIS OF PAKISTAN
   JavaScript file
   ========================================================= */

/* 1. Create the map and set the starting view of Pakistan. */
const map = L.map("map").setView([30.3753, 69.3451], 5);

/* 2. Create OpenStreetMap base map. */
const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

/* 3. Create Satellite Imagery base map. */
const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri"
    }
);

/* 4. Empty layer groups for the two GIS layers. */
const citiesLayer = L.layerGroup().addTo(map);
const stationsLayer = L.layerGroup().addTo(map);

/* 5. City marker symbol. */
function cityMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: "#d62828",
        fillOpacity: 0.9
    });
}

/* 6. Weather station marker symbol. */
function stationMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: "#1464a0",
        fillOpacity: 0.9
    });
}

/* 7. Create city popup using its attributes. */
function cityPopup(feature) {
    const p = feature.properties;
    return `
        <div class="popup-box">
            <h3>${p.name}</h3>
            <p><strong>Province:</strong> ${p.province}</p>
            <p><strong>Type:</strong> ${p.type}</p>
        </div>
    `;
}

/* 8. Create weather station popup using all required attributes. */
function stationPopup(feature) {
    const p = feature.properties;
    return `
        <div class="popup-box">
            <h3>${p.name}</h3>
            <p><strong>Province:</strong> ${p.province}</p>
            <p><strong>Type:</strong> ${p.type}</p>
            <hr>
            <p><strong>Temperature:</strong> ${p.temperature} °C</p>
            <p><strong>Rainfall:</strong> ${p.rainfall} mm</p>
            <p><strong>Wind Speed:</strong> ${p.wind_speed} km/h</p>
        </div>
    `;
}

/* 9. Load the 15 city features from GeoJSON. */
fetch("data/cities.geojson")
    .then(response => {
        if (!response.ok) throw new Error("cities.geojson could not be loaded");
        return response.json();
    })
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: cityMarker,
            onEachFeature: (feature, layer) => layer.bindPopup(cityPopup(feature))
        }).addTo(citiesLayer);
    })
    .catch(error => console.error("City data error:", error));

/* 10. Load the 15 weather station features from GeoJSON. */
fetch("data/weather_stations.geojson")
    .then(response => {
        if (!response.ok) throw new Error("weather_stations.geojson could not be loaded");
        return response.json();
    })
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: stationMarker,
            onEachFeature: (feature, layer) => layer.bindPopup(stationPopup(feature))
        }).addTo(stationsLayer);
    })
    .catch(error => console.error("Station data error:", error));

/* 11. Add base-map switching and layer on/off control. */
const baseMaps = {
    "OpenStreetMap": osm,
    "Satellite Imagery": satellite
};

const overlays = {
    "Cities": citiesLayer,
    "Weather Stations": stationsLayer
};

L.control.layers(baseMaps, overlays, { collapsed: false }).addTo(map);

/* 12. Add a scale bar. */
L.control.scale({ imperial: false }).addTo(map);

/* 13. Reset button returns the map to Pakistan's initial view. */
document.getElementById("resetMap").addEventListener("click", function () {
    map.setView([30.3753, 69.3451], 5);
});

/* 14. Message in the browser console for testing. */
console.log("Interactive Web GIS of Pakistan loaded successfully.");
