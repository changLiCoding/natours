/* eslint-disable */

console.log('Hello from the client side');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibGljaGFuZzAwNCIsImEiOiJjbGNsY3M3OWkxaDB5M25wODM4amRsanc3In0.xuOnkCGL4GQ4eO6a3W4OwQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/lichang004/clclili1n000014qtrnk6heqc',
  scrollZoom: false
  // interactive: false
  // center: [-118.113491, 34.111745],
  // zoom: 10
});
const bounds = new mapboxgl.LngLatBounds();

locations.forEach(location => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';
  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(location.coordinates)
    .addTo(map);
  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);
  // Extend map bounds to include current location
  bounds.extend(location.coordinates);
});
//  Map fit the bounds
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
