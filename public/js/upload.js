// Check if user is logged in and is an artist
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email || user.role !== 'artist') {
        window.location.href = 'login.html';
    }
});

// Handle image preview
document.getElementById('artwork')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = document.getElementById('preview');
    preview.style.display = 'block';
    preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Preview">`;
});

// Handle upload form submission
document.getElementById('uploadForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const artworkData = {
        title: formData.get('title'),
        price: formData.get('price'),
        description: formData.get('artist'),
        file: formData.get('artwork'),
    };

    // Store artwork data (in a real app, this would be sent to a server)
    const artworks = JSON.parse(localStorage.getItem('artworks') || '[]');
    artworks.push({
        ...artworkData,
        id: Date.now().toString(),
        artist: JSON.parse(localStorage.getItem('user')).name,
        imageUrl: URL.createObjectURL(artworkData.file)
    });
    localStorage.setItem('artworks', JSON.stringify(artworks));

    alert('Artwork uploaded successfully!');
    window.location.href = 'dashboard.html';
});