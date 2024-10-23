const ctx = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Complété', 'Restant'],
        datasets: [{
            data: [75, 25],  // 75% complété, 25% restant
            backgroundColor: ['#3498db', '#ecf0f1'],
        }]
    },
    options: {
        responsive: true,
        cutoutPercentage: 60,
    }
});