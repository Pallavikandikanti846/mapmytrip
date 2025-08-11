const searchBtn = document.getElementById('searchBtn');
const locateBtn = document.getElementById('locationBtn');
const resultsDiv = document.getElementById('resultsDiv');

searchBtn.addEventListener('click', () => {
    const location = document.getElementById('locationInput').value.trim();
    const type = document.getElementById('dropdown').value;

    if (!location) {
        alert('Please enter a location first!');
        return;
    }

    fetch(`/search?location=${encodeURIComponent(location)}&type=${type}`)
        .then(res => res.json())
        .then(showResults)
        .catch(err => console.error(err));
});

locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        const type = document.getElementById('typeSelect').value;

        fetch(`/nearby?lat=${latitude}&lng=${longitude}&type=${type}`)
            .then(res => res.json())
            .then(showResults)
            .catch(err => console.error(err));
    }, () => {
        alert('Unable to retrieve your location.');
    });
});

function showResults(places) {
    resultsDiv.innerHTML = '';

    if (!places.length) {
        resultsDiv.innerHTML = '<p>No magical spots found...</p>';
        return;
    }

    // sort by rating if available
    places.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    places.forEach(p => {
        const card = document.createElement('div');
        card.className = 'place-card';

        const imgUrl = p.photos
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photos[0].photo_reference}&key=${'YOUR_API_KEY'}`
            : 'https://via.placeholder.com/400';

        card.innerHTML = `
            <img src="${imgUrl}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>⭐ ${p.rating || 'No rating'}</p>
            <p>${p.formatted_address || p.vicinity || ''}</p>
            <a href="https://www.google.com/maps/place/?q=place_id:${p.place_id}" target="_blank">View on Map</a>
        `;

        resultsDiv.appendChild(card);
    });
}
