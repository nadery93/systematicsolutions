document.addEventListener('DOMContentLoaded', () => {
    const watchlist = document.getElementById('watchlist');
    const stockInfo = document.getElementById('stock-info');
    const searchInput = document.getElementById('search');
    const stockTableBody = document.querySelector('#stock-table tbody');

    let watchlistStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 150.54, change: 0.5 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2800.66, change: -1.2 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3401.46, change: 2.1 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 299.35, change: -0.3 }
    ];

    const allStocks = [/* Your existing allStocks array */];

    function fetchStockData(symbol) {
        // Your existing fetchStockData function
        const mockData = {/* Your existing mockData object */};
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockData[symbol]), 50);
        });
    }

    function displayStockInfo(stock) {
        fetchStockData(stock.symbol)
            .then((data) => {
                const changeClass = data.change >= 0 ? 'positive' : 'negative';
                stockInfo.innerHTML = `
                    <h3>${stock.name} (${stock.symbol})</h3>
                    <p>Price: $${data.price.toFixed(2)}</p>
                    <p class="${changeClass}">Change: ${data.change}%</p>
                `;
            });
    }

    function updateWatchlist() {
        watchlist.innerHTML = '';
        watchlistStocks.forEach((stock) => {
            const li = document.createElement('li');
            li.textContent = `${stock.name} (${stock.symbol}) `;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove');
            removeButton.addEventListener('click', () => {
                watchlistStocks = watchlistStocks.filter(item => item.symbol !== stock.symbol);
                updateWatchlist();
                displayStockTable(allStocks);
            });
            li.appendChild(removeButton);
            li.addEventListener('click', () => {
                displayStockInfo(stock);
            });
            watchlist.appendChild(li);
        });
    }

    function displayStockTable(stocks) {
        stockTableBody.innerHTML = '';
        stocks.forEach((stock) => {
            const changeClass = stock.change >= 0 ? 'positive' : 'negative';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${stock.name}</td>
                <td>$${stock.price.toFixed(1)}</td>
                <td class="${changeClass}">${stock.change}%</td>
                <td class="actions"></td>
            `;
            const actionsTd = tr.querySelector('.actions');

            if (!watchlistStocks.some(item => item.symbol === stock.symbol)) {
                const addButton = document.createElement('button');
                addButton.textContent = 'Add';
                addButton.classList.add('add');
                addButton.addEventListener('click', () => {
                    watchlistStocks.push(stock);
                    updateWatchlist();
                    displayStockTable(allStocks);
                });
                actionsTd.appendChild(addButton);
            } else {
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.classList.add('remove');
                removeButton.addEventListener('click', () => {
                    watchlistStocks = watchlistStocks.filter(item => item.symbol !== stock.symbol);
                    updateWatchlist();
                    displayStockTable(allStocks);
                });
                actionsTd.appendChild(removeButton);
            }

            tr.addEventListener('click', () => {
                displayStockInfo(stock);
            });

            stockTableBody.appendChild(tr);
        });
    }

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredStocks = allStocks.filter(stock => 
            stock.name.toLowerCase().includes(searchTerm) || 
            stock.symbol.toLowerCase().includes(searchTerm)
        );
        displayStockTable(filteredStocks);
    });

    // Initial display of all stocks
    displayStockTable(allStocks);
    updateWatchlist();
});
