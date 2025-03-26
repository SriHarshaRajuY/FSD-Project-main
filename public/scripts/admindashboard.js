document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarClose = document.getElementById('sidebar-close');

    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDarkTheme = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    // Page Navigation
    const navLinks = document.querySelectorAll('.sidebar-nav li');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });

            // Add active class to the clicked link
            link.classList.add('active');

            // Show the corresponding page
            const targetPage = link.getAttribute('data-page');
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `${targetPage}-page`) {
                    page.classList.add('active');
                }
            });
        });
    });

    // Initialize Charts
    const userGrowthChartCtx = document.getElementById('user-growth-chart').getContext('2d');
    const performanceChartCtx = document.getElementById('performance-chart').getContext('2d');
    const usageChartCtx = document.getElementById('usage-chart').getContext('2d');

    // User Growth Chart
    const userGrowthChart = new Chart(userGrowthChartCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'User Growth',
                data: [100, 200, 300, 400, 500, 600, 700],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // System Performance Chart
    const performanceChart = new Chart(performanceChartCtx, {
        type: 'bar',
        data: {
            labels: ['CPU', 'Memory', 'Disk', 'Network'],
            datasets: [{
                label: 'Performance',
                data: [85, 60, 45, 70],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#F44336'
                ],
                borderColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#F44336'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Usage Statistics Chart
    const usageChart = new Chart(usageChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Active Users', 'Inactive Users', 'New Users'],
            datasets: [{
                label: 'Usage Statistics',
                data: [300, 150, 50],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800'
                ],
                borderColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
});