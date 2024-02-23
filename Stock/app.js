let chart; // Define a global variable to store the chart instance

function fetchStockPrice() {
    const stockSymbol = document.getElementById('stockInput').value.trim();
    if (!stockSymbol) {
        alert('Please enter a correct ticker symbol');
        return;
    }
    const apiKey = 'CGDBT67P8NV9WSG9';
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response error');
            }
            return response.json();
        })
        .then(data => {
            if (data['Error Message']) {
                throw new Error('Invalid ticker symbol');
            }
            const timeSeries = data['Time Series (Daily)'];
            const dates = Object.keys(timeSeries).slice(0, 30);
            const prices = dates.map(date => timeSeries[date]['4. close']);

            // Destroy the old chart instance if it exists
            if (chart) {
                chart.destroy();
            }

            // Draw a new chart
            drawChart(dates.reverse(), prices.reverse());
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
}

function drawChart(dates, prices) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    const canvas = document.getElementById('stockChart');

    canvas.style.backgroundColor = 'white';
    canvas.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)'; 

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Stock price (closing price)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                data: prices,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false, 
                }
            },
            responsive: true, 
            plugins: {
                title: {
                    display: true,
                    text: 'Stock Price Chart'
                }
            }
        }
    });
}

function updatePriceDisplay(price) {
    const priceDisplay = document.getElementById('priceDisplay');
    priceDisplay.innerText = `Latest price: $${price}`;
    priceDisplay.style.display = 'block';
}

document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    fetchStockPrice(); 
});