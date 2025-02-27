// Sample trending artworks data
const trendingArtworks = [
    {
        id: '1',
        title: 'Krishna',
        artist: 'Heni K. Mehta',
        price: 499,
        imageUrl:  'images/art1.jpg'
    },
    {
        id: '2',
        title: 'Sun set',
        artist: 'Heni K. Mehta',
        price: 399,
        imageUrl: 'images/art2.jpg'
    },
    {
        id: '3',
        title: 'Tom - Jerry',
        artist: 'Heni K. Mehta',
        price: 449,
        imageUrl: 'images/art3.jpg'
    }
];

// Render trending artworks
function renderTrendingArtworks() {
    const container = document.getElementById('trendingArtworks');
    if (!container) return;

    container.innerHTML = trendingArtworks.map(artwork => `
        <div class="artwork-card">
            <img src="${artwork.imageUrl}" alt="${artwork.title}" class="artwork-image">
            <div class="artwork-info">
                <h3 class="artwork-title">${artwork.title}</h3>
                <p class="artwork-artist">by ${artwork.artist}</p>
                <p class="artwork-price">Rs.${artwork.price}</p>
            </div>
        </div>
    `).join('');
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    renderTrendingArtworks();
});