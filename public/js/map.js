

mapboxgl.accessToken = 'pk.eyJ1IjoibXNhZ3JlcyIsImEiOiJja25lcjVjajUyb2FuMnhueGp0ZmZ4anJkIn0.oLhRtDwausBfSHbMtEo5Ig';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 11,
    center: [2.481875, 48.906008]
});

//Fetch stores from API
async function getStores() {
    const res = await fetch('/api/v1/stores');
    const data = await res.json();

    const stores = data.data.map(store => {
        /* return {
             'type': 'Feature',
             'geometry': {
                 'type': 'Point',
                 'coordinates': [store.location.coordinates[0], store.location.coordinates[1]]
             },
             properties: {
                 storeId: store.storeId,
                 icon: 'shop'
             }
         }*/
        return {
            'type': 'Feature',
            'properties': {
                'description': store.storeId,
                'icon': 'marker'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [store.location.coordinates[0], store.location.coordinates[1]]
            }
        }
    });

    loadMap(stores);
}

//Load map with stores
function loadMap(stores) {
    /*    map.on('load', function () {
    // Load an image from an external URL.
    // Add a data source containing one point feature.
            map.addSource('point', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': stores
                }
            });

    // Add a layer to use the image to represent the data.
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'point', // reference the data source
                'layout': {
                    'icon-image': '{icon}-15', // reference the image
                    'icon-size': 1.5,
                    'text-field': '{storeId}',
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 0.9],
                    'text-anchor': 'top'
                }
            });
        });*/
    map.on('load', function () {
        map.addSource('places', {
// This GeoJSON contains features that include an "icon"
// property. The value of the "icon" property corresponds
// to an image in the Mapbox Streets style's sprite.
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': stores
            }
        });
// Add a layer showing the places.
        map.addLayer({
            'id': 'places',
            'type': 'symbol',
            'source': 'places',
            'layout': {
                'icon-image': '{icon}-15',
                'icon-allow-overlap': true,
                'icon-size': 3,
                'text-field': '{storeId}',
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.9],
                'text-anchor': 'top'
            }
        });

// When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
        map.on('click', 'places', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

// Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

// Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', function () {
            map.getCanvas().style.cursor = '';
        });
    });
}

/*
loadMap();*/
getStores();