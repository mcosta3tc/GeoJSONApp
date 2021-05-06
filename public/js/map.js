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

    console.log(data);
}

//Load map with stores
function loadMap() {
    map.on('load', function (stores) {
// Load an image from an external URL.
// Add a data source containing one point feature.
        map.addSource('point', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': stores,
                /*'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [2.481875, 48.906008]
                        },
                        properties: {
                            storeId: '0001',
                            icon: 'shop'
                        }
                    }
                ]*/
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
                'text-offset': [0,0.9],
                'text-anchor': 'top'
            }
        });
    });
}

/*
loadMap();*/
getStores();