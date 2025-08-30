const apiKey = mapToken; // Defined in your EJS template
console.log(coordinates); // Make sure coordinates are [lng, lat]

const map = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
    center: coordinates, // [lng, lat]
    zoom: 9
});

// No need to swap coordinates if they are already [lng, lat]
const marker = new maplibregl.Marker({ color: "#0000FF" })
    .setLngLat(coordinates).addTo(map);
