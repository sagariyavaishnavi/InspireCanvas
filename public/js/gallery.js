document.addEventListener('DOMContentLoaded', () => {
    // Get stored artworks from localStorage
    const artworks = JSON.parse(localStorage.getItem('artworks') || '[]');
    const artworkGrid = document.getElementById('artworkGrid');
    const modal = document.getElementById('artworkModal');
    const closeModal = document.querySelector('.close-modal');
    const sortFilter = document.getElementById('sortFilter');

    // Render artwork cards
    function renderArtworks(artworksToRender) {
        artworkGrid.innerHTML = artworksToRender.map(artwork => `
            <div class="artwork-card" data-id="${artwork.id}">
                <img src="${artwork.imageUrl}" alt="${artwork.title}" class="artwork-image">
                <div class="artwork-info">
                    <h3 class="artwork-title">${artwork.title}</h3>
                    <p class="artwork-artist">by ${artwork.artist}</p>
                    <p class="artwork-price">$${artwork.price}</p>
                </div>
            </div>
        `).join('');

        // Add click event listeners to artwork cards
        document.querySelectorAll('.artwork-card').forEach(card => {
            card.addEventListener('click', () => {
                const artworkId = card.dataset.id;
                const artwork = artworksToRender.find(a => a.id === artworkId);
                showArtworkModal(artwork);
            });
        });
    }

    // Show artwork modal
    function showArtworkModal(artwork) {
        document.getElementById('modalImage').src = artwork.imageUrl;
        document.getElementById('modalTitle').textContent = artwork.title;
        document.getElementById('modalArtist').textContent = `by ${artwork.artist}`;
        document.getElementById('modalPrice').textContent = `$${artwork.price}`;
        modal.classList.remove('hidden');
    }

    // Close modal when clicking the close button or outside the modal
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Handle buy now button
    document.getElementById('buyNowBtn').addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.email) {
            window.location.href = 'login.html';
            return;
        }
        // Implement purchase logic here
        alert('Purchase functionality will be implemented with backend integration');
    });

    // Handle add to cart button
    document.getElementById('addToCartBtn').addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.email) {
            window.location.href = 'login.html';
            return;
        }
        // Implement add to cart logic here
        alert('Add to cart functionality will be implemented with backend integration');
    });

    // Handle sorting
    sortFilter.addEventListener('change', () => {
        let sortedArtworks = [...artworks];
        switch (sortFilter.value) {
            case 'newest':
                sortedArtworks.reverse();
                break;
            case 'priceHigh':
                sortedArtworks.sort((a, b) => b.price - a.price);
                break;
            case 'priceLow':
                sortedArtworks.sort((a, b) => a.price - b.price);
                break;
        }
        renderArtworks(sortedArtworks);
    });

    // Initial render
    renderArtworks(artworks);
});