let map;

$(document).ready(function () {
    initMap();
    if (!map) {
        alert("Failed To Load Map, Reload The Page");
    }
});

function initMap() {
    let myLatlng = new google.maps.LatLng(
        24.738652251396996,
        46.68104288337918
    );
    let mapOptions = {
        zoom: 7,
        center: myLatlng,
        styles: mapStyle,
        disableDefaultUI: true,
    };
    map = new google.maps.Map(document.getElementById("map-cont"), mapOptions);
}

// dark mode style
mapStyle = [
    { elementType: "geometry", stylers: [{ color: "#1D314D" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#242f3e" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#000" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#000" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#000" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#000" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        // stylers: [{ color: '#2f3948' }],
        // stylers: [{ visibility: 'off' }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ visibility: "off" }],
        // stylers: [{ color: '#d59563' }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#051F45" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
    },
];
