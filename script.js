document.addEventListener('DOMContentLoaded', () => {
    const watchlist = document.getElementById('watchlist');
    const stockInfo = document.getElementById('stock-info');
    const searchInput = document.getElementById('search');
    const stockTableBody = document.querySelector('#stock-table tbody');

    // Enhanced stock data with more details
    let watchlistStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 150.54, change: 0.5, volume: '75.2M', sector: 'Technology' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2800.66, change: -1.2, volume: '2.1M', sector: 'Technology' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3401.46, change: 2.1, volume: '3.5M', sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 299.35, change: -0.3, volume: '25.6M', sector: 'Technology' }
    ];

    // Keep your existing allStocks array but add volume and sector properties
    const allStocks = [/* Your existing allStocks array with added properties */];

    function fetchStockData(symbol) {
        // Enhanced mock data with more details
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = {
                    price: Math.random() * 1000,
                    change: (Math.random() * 4) - 2,
                    volume: `${Math.floor(Math.random() * 100)}M`,
                    dayRange: {
                        low: Math.random() * 900,
                        high: Math.random() * 1100
                    },
                    marketCap: `$${Math.floor(Math.random() * 1000)}B`,
                    peRatio: (Math.random() * 30).toFixed(2)
                };
                resolve(mockData);
            }, 50);
        });
    }

    function formatNumber(num) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    function displayStockInfo(stock) {
        fetchStockData(stock.symbol)
            .then((data) => {
                const changeClass = data.change >= 0 ? 'positive' : 'negative';
                const changeSymbol = data.change >= 0 ? '▲' : '▼';
                stockInfo.innerHTML = `
                    <div class="stock-header">
                        <h3>${stock.name} (${stock.symbol})</h3>
                        <div class="stock-price">
                            <span class="price">$${formatNumber(data.price)}</span>
                            <span class="${changeClass}">
                                ${changeSymbol} ${Math.abs(data.change).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    <div class="stock-grid">
                        <div class="stock-stat">
                            <span class="label">Volume</span>
                            <span class="value">${data.volume}</span>
                        </div>
                        <div class="stock-stat">
                            <span class="label">Day Range</span>
                            <span class="value">$${formatNumber(data.dayRange.low)} - $${formatNumber(data.dayRange.high)}</span>
                        </div>
                        <div class="stock-stat">
                            <span class="label">Market Cap</span>
                            <span class="value">${data.marketCap}</span>
                        </div>
                        <div class="stock-stat">
                            <span class="label">P/E Ratio</span>
                            <span class="value">${data.peRatio}</span>
                        </div>
                    </div>
                `;
            });
    }

    function updateWatchlist() {
        watchlist.innerHTML = '';
        watchlistStocks.forEach((stock) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="stock-info
