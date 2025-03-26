// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const themeSelectorBtn = document.getElementById('theme-selector-btn');

// Load saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeButton(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
});

function updateThemeButton(theme) {
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const moonIcon = themeToggle.querySelector('.fa-moon');
    if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// Mobile Menu Management
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const sidebar = document.querySelector('.sidebar');
const overlay = document.getElementById('overlay');

function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
}

mobileMenuToggle.addEventListener('click', toggleSidebar);
sidebarClose.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

// Navigation
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.parentElement.dataset.page;
        navigateToPage(page);
    });
});

function navigateToPage(page) {
    // Update active state in sidebar
    document.querySelectorAll('.sidebar-nav li').forEach(li => {
        li.classList.toggle('active', li.dataset.page === page);
    });

    // Show selected page
    document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('active', p.id === `${page}-page`);
    });

    // Close mobile menu if open
    if (window.innerWidth <= 1024) {
        toggleSidebar();
    }

    // Load page-specific data
    loadPageData(page);
}

// Page Data Loading
async function loadPageData(page) {
    try {
        switch (page) {
            case 'dashboard':
                await loadDashboardData();
                break;
            case 'orders':
                await loadOrdersData();
                break;
            case 'agents':
                await loadAgentsData();
                break;
            case 'routes':
                await loadRoutesData();
                break;
            case 'analytics':
                await loadAnalyticsData();
                break;
            case 'settings':
                await loadSettingsData();
                break;
        }
    } catch (error) {
        console.error(`Error loading ${page} data:`, error);
        showError(`Failed to load ${page} data`);
    }
}

// Dashboard Data
async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard/metrics');
        const data = await response.json();
        updateDashboardMetrics(data);
        initializeCharts(data);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateDashboardMetrics(data) {
    // Update metric cards
    Object.entries(data.metrics).forEach(([key, value]) => {
        const element = document.querySelector(`[data-metric="${key}"]`);
        if (element) {
            element.textContent = value;
        }
    });
}

function initializeCharts(data) {
    // Delivery Performance Chart
    const deliveryCtx = document.getElementById('delivery-chart').getContext('2d');
    new Chart(deliveryCtx, {
        type: 'line',
        data: {
            labels: data.charts.deliveryPerformance.labels,
            datasets: [{
                label: 'Deliveries',
                data: data.charts.deliveryPerformance.data,
                borderColor: '#4CAF50',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Delivery Status Chart
    const statusCtx = document.getElementById('status-chart').getContext('2d');
    new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: data.charts.deliveryStatus.labels,
            datasets: [{
                data: data.charts.deliveryStatus.data,
                backgroundColor: [
                    '#FFC107', // Pending
                    '#2196F3', // Processing
                    '#4CAF50', // In Transit
                    '#66BB6A', // Delivered
                    '#F44336'  // Cancelled
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Orders Management
async function loadOrdersData() {
    try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        updateOrdersTable(data);
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function updateOrdersTable(orders) {
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.address}</td>
            <td>${order.date}</td>
            <td>${order.agent || 'Unassigned'}</td>
            <td><span class="status ${order.statusClass}">${order.status}</span></td>
            <td>
                <button class="action-btn" onclick="viewOrder(${order.id})"><i class="fas fa-eye"></i></button>
                <button class="action-btn" onclick="editOrder(${order.id})"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
}

// Agent Management
async function loadAgentsData() {
    try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        updateAgentsTable(data);
    } catch (error) {
        console.error('Error loading agents:', error);
    }
}

function updateAgentsTable(agents) {
    const tbody = document.querySelector('#agents-table tbody');
    tbody.innerHTML = agents.map(agent => `
        <tr>
            <td>${agent.id}</td>
            <td>${agent.name}</td>
            <td>${agent.email}</td>
            <td>${agent.area}</td>
            <td>${agent.load}</td>
            <td><span class="status ${agent.statusClass}">${agent.status}</span></td>
            <td>
                <button class="action-btn" onclick="viewAgent(${agent.id})"><i class="fas fa-eye"></i></button>
                <button class="action-btn" onclick="editAgent(${agent.id})"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
}

// Route Planning
async function loadRoutesData() {
    try {
        const response = await fetch('/api/routes');
        const data = await response.json();
        updateRoutesTable(data);
        initializeMap(data);
    } catch (error) {
        console.error('Error loading routes:', error);
    }
}

function updateRoutesTable(routes) {
    const tbody = document.querySelector('#routes-table tbody');
    tbody.innerHTML = routes.map(route => `
        <tr>
            <td>${route.id}</td>
            <td>${route.agent}</td>
            <td>${route.date}</td>
            <td>${route.zone}</td>
            <td>${route.orders}</td>
            <td><span class="status ${route.statusClass}">${route.status}</span></td>
            <td>
                <button class="action-btn" onclick="viewRoute(${route.id})"><i class="fas fa-eye"></i></button>
                <button class="action-btn" onclick="editRoute(${route.id})"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
}

function initializeMap(routes) {
    // Initialize Google Maps
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 12
    });

    // Add markers for each route
    routes.forEach(route => {
        new google.maps.Marker({
            position: route.coordinates,
            map: map,
            title: `Route ${route.id}`
        });
    });
}

// Analytics
async function loadAnalyticsData() {
    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        updateAnalyticsMetrics(data);
        initializeAnalyticsCharts(data);
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function updateAnalyticsMetrics(data) {
    // Update analytics metric cards
    Object.entries(data.metrics).forEach(([key, value]) => {
        const element = document.querySelector(`[data-analytics-metric="${key}"]`);
        if (element) {
            element.textContent = value;
        }
    });
}

function initializeAnalyticsCharts(data) {
    // Weekly Performance Chart
    const weeklyCtx = document.getElementById('weekly-performance-chart').getContext('2d');
    new Chart(weeklyCtx, {
        type: 'line',
        data: {
            labels: data.charts.weeklyPerformance.labels,
            datasets: [{
                label: 'Deliveries',
                data: data.charts.weeklyPerformance.data,
                borderColor: '#4CAF50',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Zone Performance Chart
    const zoneCtx = document.getElementById('zone-performance-chart').getContext('2d');
    new Chart(zoneCtx, {
        type: 'bar',
        data: {
            labels: data.charts.zonePerformance.labels,
            datasets: [{
                label: 'Average Delivery Time (min)',
                data: data.charts.zonePerformance.data,
                backgroundColor: '#4CAF50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Settings
async function loadSettingsData() {
    try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        updateSettingsForm(data);
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function updateSettingsForm(settings) {
    const form = document.getElementById('settings-form');
    Object.entries(settings).forEach(([key, value]) => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = value;
        }
    });
}

// Form Submission
document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settings = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });

        if (response.ok) {
            showSuccess('Settings updated successfully');
        } else {
            throw new Error('Failed to update settings');
        }
    } catch (error) {
        console.error('Error updating settings:', error);
        showError('Failed to update settings');
    }
});

// Utility Functions
function showSuccess(message) {
    // Implement success notification
    alert(message);
}

function showError(message) {
    // Implement error notification
    alert(message);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load initial page data
    const currentPage = document.querySelector('.page.active')?.id.replace('-page', '') || 'dashboard';
    loadPageData(currentPage);
}); 