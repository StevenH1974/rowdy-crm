// ========== SECTION NAVIGATION ==========
function showSection(sectionId) {
    
    // Hide the dashboard stats and recent orders
    document.querySelector('.stats-row').style.display = 'none';
    document.querySelector('.recent-orders').style.display = 'none';

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Remove active class from all nav links
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.classList.remove('active');
    });

    // If dashboard is clicked show stats and recent orders
    if (sectionId === 'dashboard') {
        document.querySelector('.stats-row').style.display = 'flex';
        document.querySelector('.recent-orders').style.display = 'block';
    } else {
        // Show the selected section
        document.getElementById(sectionId).style.display = 'block';
    }

    // Set the active nav link
    event.target.classList.add('active');

    // Update the top bar title
    document.querySelector('.top-bar h2').textContent = sectionId.toUpperCase();
}