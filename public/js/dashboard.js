document.addEventListener('DOMContentLoaded', () => {
    // Load user data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) {
        window.location.href = 'login.html';
        return;
    }

    // Fill profile form
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;

    // Handle profile form submission
    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedUser = {
            ...user,
            name: formData.get('name'),
        };
        if (formData.get('newPassword')) {
            updatedUser.password = formData.get('newPassword');
        }
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
        window.location.reload();
    });

    // Handle tab switching
    const menuLinks = document.querySelectorAll('.dashboard-menu a ');
    const sections = document.querySelectorAll('.dashboard-section');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);

            // Update active states
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show/hide sections
            sections.forEach(section => {
                section.classList.add('hidden');
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                }
            });
        });
    });

    // Load user's artworks if they're an artist
    if (user.role === 'artist') {
        const artworks = JSON.parse(localStorage.getItem('artworks') || '[]');
        const userArtworks = artworks.filter(artwork => artwork.artist === user.name);
        const artworksContainer = document.getElementById('userArtworks');

        if (artworksContainer) {
            artworksContainer.innerHTML = userArtworks.map(artwork => `
                <div class="artwork-card">
                    <img src="${artwork.imageUrl}" alt="${artwork.title}" class="artwork-image">
                    <div class="artwork-info">
                        <h3 class="artwork-title">${artwork.title}</h3>
                        <p class="artwork-price">$${artwork.price}</p>
                        <button class="btn-secondary" onclick="deleteArtwork('${artwork.id}')">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }
});

// Handle artwork deletion
function deleteArtwork(artworkId) {
    if (confirm('Are you sure you want to remove this artwork?')) {
        const artworks = JSON.parse(localStorage.getItem('artworks') || '[]');
        const updatedArtworks = artworks.filter(artwork => artwork.id !== artworkId);
        localStorage.setItem('artworks', JSON.stringify(updatedArtworks));
        window.location.reload();
    }
}