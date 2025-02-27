// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    const authLinks = document.getElementById('authLinks');
    const userMenu = document.getElementById('userMenu');
    const userNameDisplay = document.getElementById('userNameDisplay');

    if (user) {
        const userData = JSON.parse(user);
        if (authLinks) authLinks.classList.add('hidden');
        if (userMenu) {
            userMenu.classList.remove('hidden');
            userNameDisplay.textContent = userData.name;
        }
    } else {
        if (authLinks) authLinks.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
}

// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Handle signup form submission
document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
    };

    // Store user data (in a real app, this would be sent to a server)
    localStorage.setItem('user', JSON.stringify(userData));
    window.location.href = 'dashboard.html';
});

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    // Simple login check (in a real app, this would verify with a server)
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.email === email && storedUser.password === password) {
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password');
    }
});

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', checkAuth);