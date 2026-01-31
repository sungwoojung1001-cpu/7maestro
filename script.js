document.addEventListener('DOMContentLoaded', () => {
    console.log("MAESTRO | 7th Business Unit Platform Initialized");

    initializeDashboard();
    setupAdminToggle();
    setupSlider();
});

/* --- DATA STATE --- */
let userState = {
    targetAP: 500,
    dailyAP: 0,
    monthlyHistory: [10, 45, 80, 120, 150, 180, 210] // Mock history
};

/* --- DASHBOARD LOGIC --- */
let growthChartInstance = null;
let goalPieChartInstance = null;

function initializeDashboard() {
    renderCharts();
    populateAdminRanking();
}

function setupSlider() {
    const slider = document.getElementById('target-ap-slider');
    const display = document.getElementById('target-ap-value');

    slider.addEventListener('input', (e) => {
        display.textContent = e.target.value;
        userState.targetAP = parseInt(e.target.value);
        updateCharts();
    });
}

function updateAPData() {
    const todayInput = document.getElementById('today-ap-input');
    const val = parseInt(todayInput.value);

    if (isNaN(val)) return;

    userState.dailyAP = val;
    // Simulate adding to history
    const currentTotal = userState.monthlyHistory[userState.monthlyHistory.length - 1];
    userState.monthlyHistory.push(currentTotal + val);

    alert(`Updated! Added ${val} AP.`);
    todayInput.value = '';

    updateCharts();
    // In real app, call saveToAirtable();
}

function renderCharts() {
    const ctx1 = document.getElementById('growthChart').getContext('2d');
    const ctx2 = document.getElementById('goalPieChart').getContext('2d');

    // Gradient for line chart
    const gradient = ctx1.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.5)'); // Gold
    gradient.addColorStop(1, 'rgba(0, 13, 26, 0.0)');

    // 1. Growth Chart (Line)
    growthChartInstance = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: Array.from({ length: userState.monthlyHistory.length }, (_, i) => `Day ${i + 1}`),
            datasets: [{
                label: 'Cumulative AP',
                data: userState.monthlyHistory,
                borderColor: '#D4AF37',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: 'white' } },
                title: { display: true, text: 'AP Growth Trend', color: '#F7E7CE' }
            },
            scales: {
                y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
        }
    });

    // 2. Goal vs Achievement (Pie/Doughnut)
    updatePieChartData(ctx2);
}

function updateCharts() {
    // Update Line Chart
    growthChartInstance.data.labels = Array.from({ length: userState.monthlyHistory.length }, (_, i) => `Day ${i + 1}`);
    growthChartInstance.data.datasets[0].data = userState.monthlyHistory;
    growthChartInstance.update();

    // Update Pie Chart
    updatePieChartData();
}

function updatePieChartData(ctx = null) {
    const currentTotal = userState.monthlyHistory[userState.monthlyHistory.length - 1];
    const remaining = Math.max(0, userState.targetAP - currentTotal);

    const data = {
        labels: ['Achieved', 'Remaining'],
        datasets: [{
            data: [currentTotal, remaining],
            backgroundColor: ['#D4AF37', 'rgba(255, 255, 255, 0.1)'],
            borderWidth: 0
        }]
    };

    if (goalPieChartInstance) {
        goalPieChartInstance.data = data;
        goalPieChartInstance.update();
    } else if (ctx) {
        goalPieChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'white' } },
                    title: { display: true, text: 'Goal Achievement By %', color: '#F7E7CE' }
                }
            }
        });
    }
}

/* --- ADMIN TOGGLE --- */
function setupAdminToggle() {
    const toggle = document.getElementById('admin-toggle');
    const userView = document.getElementById('user-dashboard');
    const adminView = document.getElementById('admin-dashboard');

    toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            userView.classList.add('hidden');
            adminView.classList.remove('hidden');
        } else {
            userView.classList.remove('hidden');
            adminView.classList.add('hidden');
        }
    });
}

function populateAdminRanking() {
    const tbody = document.getElementById('ranking-list');
    const mockData = [
        { name: "Kim Ji-soo", ap: 1250, percent: 125 },
        { name: "Lee Min-ho", ap: 980, percent: 98 },
        { name: "Park Seo-jun", ap: 850, percent: 85 },
        { name: "Choi Woo-shik", ap: 720, percent: 72 },
        { name: "Song Hye-kyo", ap: 650, percent: 65 },
    ];

    tbody.innerHTML = mockData.map((user, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td style="color: #D4AF37; font-weight: bold;">${user.ap}</td>
            <td>${user.percent}%</td>
        </tr>
    `).join('');
}

/* --- MODAL LOGIC --- */
function openModal(type, title) {
    const modal = document.getElementById('content-modal');
    const body = document.getElementById('modal-body');
    const fileName = type === 'video' ? 'Video Player' : 'PDF Viewer';

    modal.classList.remove('hidden');

    body.innerHTML = `
        <h2 style="color: white; margin-bottom: 20px;">${title}</h2>
        <div style="background: #000; height: 400px; display: flex; align-items: center; justify-content: center; color: #888; border: 1px solid #333;">
            [${fileName} Placeholder]<br>
            Content would load here.
        </div>
    `;
}

function closeModal() {
    document.getElementById('content-modal').classList.add('hidden');
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('content-modal');
    if (event.target == modal) {
        closeModal();
    }
}
