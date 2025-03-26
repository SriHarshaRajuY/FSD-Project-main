document.addEventListener('DOMContentLoaded', () => {
    const sections = {
        dashboard: document.getElementById('dashboardSection'),
        tickets: document.getElementById('ticketsSection')
    };

    const navLinks = {
        dashboard: document.getElementById('dashboardLink'),
        tickets: document.getElementById('ticketsLink')
    };

    function showSection(sectionName) {
        Object.values(sections).forEach(section => section.classList.remove('active'));
        sections[sectionName].classList.add('active');

        Object.values(navLinks).forEach(link => link.classList.remove('active'));
        navLinks[sectionName].classList.add('active');
    }

    async function fetchTickets() {
        try {
            const response = await fetch('/api/tickets');
            const tickets = await response.json();
            updateDashboard(tickets);
            updateTicketList(tickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    }

    function updateDashboard(tickets) {
        const activeTickets = tickets.filter(t => t.status === 'Open').length;
        document.getElementById('activeTickets').textContent = activeTickets;

        const today = new Date().toISOString().split('T')[0];
        const resolvedToday = tickets.filter(t => t.status === 'Resolved' && t.created_at.includes(today)).length;
        document.getElementById('resolvedToday').textContent = resolvedToday;

        const recentTicketsBody = document.getElementById('recentTicketsBody');
        recentTicketsBody.innerHTML = tickets.slice(0, 5).map(ticket => `
            <tr>
                <td>${ticket.id}</td>
                <td>${ticket.requester}</td>
                <td>${ticket.subject}</td>
                <td>${ticket.status}</td>
                <td><a href="#" data-ticket="${ticket.id}">View</a></td>
            </tr>
        `).join('');
    }

    function updateTicketList(tickets) {
        const tbody = document.getElementById('ticketTableBody');
        tbody.innerHTML = tickets.map(ticket => `
            <tr>
                <td>${ticket.id}</td>
                <td>${ticket.requester}</td>
                <td>${ticket.subject}</td>
                <td>${ticket.type}</td>
                <td>${ticket.status}</td>
                <td><a href="#" data-ticket="${ticket.id}">View</a></td>
            </tr>
        `).join('');
    }

    Object.keys(navLinks).forEach(key => {
        navLinks[key].addEventListener('click', (e) => {
            e.preventDefault();
            showSection(key);
            if (key === 'tickets' || key === 'dashboard') fetchTickets();
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-ticket]')) {
            e.preventDefault();
            alert(`Viewing ticket ${e.target.dataset.ticket} - Implement ticket details view here!`);
        }
    });

    showSection('dashboard');
    fetchTickets();
});