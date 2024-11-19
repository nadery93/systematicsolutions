// Constants and Configuration
const FINNHUB_API_KEY = 'FINNHUBAPIKEY';
const MARKET_INDICES = {
    '^GSPC': 'sp500',
    '^IXIC': 'nasdaq',
    '^DJI': 'djia'
};

// Page Navigation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize market data
    updateMarketIndices();
    setInterval(updateMarketIndices, 60000); // Update every minute

    // Page navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = item.getAttribute('data-page');
            
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Show target page, hide others
            pages.forEach(page => {
                page.style.display = page.id === `${targetPage}-page` ? 'block' : 'none';
            });
        });
    });

    // Initialize model portfolio data
    initializeModelPortfolio();
});

// Market Data Functions
async function updateMarketIndices() {
    for (const [symbol, elementId] of Object.entries(MARKET_INDICES)) {
        try {
            const quote = await getStockQuote(symbol);
            updateMarketItem(elementId, quote);
        } catch (error) {
            console.error(`Error updating ${symbol}:`, error);
        }
    }
}

async function getStockQuote(symbol) {
    try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        const data = await response.json();
        return {
            price: data.c,
            change: data.d,
            percentChange: data.dp
        };
    } catch (error) {
        console.error('Error fetching quote:', error);
        throw error;
    }
}

function updateMarketItem(elementId, quote) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const valueSpan = element.querySelector('.value');
    const changeSpan = element.querySelector('.change');

    valueSpan.textContent = formatPrice(quote.price);
    changeSpan.textContent = formatChange(quote.change, quote.percentChange);
    changeSpan.className = `change ${quote.change >= 0 ? 'positive' : 'negative'}`;
}

// Model Portfolio Functions
function initializeModelPortfolio() {
    const modelHoldings = [
        { symbol: 'NVDA', shares: 100, entryPrice: 485.50, currentPrice: 487.20 },
        { symbol: 'AAPL', shares: 200, entryPrice: 175.20, currentPrice: 178.50 },
        { symbol: 'MSFT', shares: 150, entryPrice: 325.80, currentPrice: 328.60 },
        // Add more holdings as needed
    ];

    updateModelPortfolio(modelHoldings);
}

function updateModelPortfolio(holdings) {
    const table = document.querySelector('#holdings-table tbody');
    if (!table) return;

    table.innerHTML = '';
    let totalValue = 0;

    holdings.forEach(holding => {
        const marketValue = holding.shares * holding.currentPrice;
        totalValue += marketValue;
        const return_pct = ((holding.currentPrice - holding.entryPrice) / holding.entryPrice * 100).toFixed(2);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${holding.symbol}</td>
            <td>${holding.shares}</td>
            <td>$${holding.entryPrice.toFixed(2)}</td>
            <td>$${holding.currentPrice.toFixed(2)}</td>
            <td>$${marketValue.toFixed(2)}</td>
            <td>${((marketValue / totalValue) * 100).toFixed(2)}%</td>
            <td class="${return_pct >= 0 ? 'positive' : 'negative'}">${return_pct}%</td>
        `;
        table.appendChild(row);
    });
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function formatChange(change, percentChange) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${percentChange.toFixed(2)}%)`;
}

// Initialize historical picks
function initializeHistoricalPicks() {
    const picksHistory = [
        { date: '2024-10-15', symbol: 'AMD', entry: 120.50, exit: 135.75, return: '+12.7%', status: 'Closed' },
        { date: '2024-09-01', symbol: 'TSLA', entry: 245.80, exit: 268.90, return: '+9.4%', status: 'Closed' },
        // Add more historical picks
    ];

    const table = document.querySelector('#picks-history tbody');
    if (!table) return;

    picksHistory.forEach(pick => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pick.date}</td>
            <td>${pick.symbol}</td>
            <td>$${pick.entry}</td>
            <td>$${pick.exit}</td>
            <td class="${pick.return.includes('+') ? 'positive' : 'negative'}">${pick.return}</td>
            <td>${pick.status}</td>
        `;
        table.appendChild(row);
    });
}

// Call initialization functions
document.addEventListener('DOMContentLoaded', () => {
    initializeHistoricalPicks();
    // Other initialization code...
});
