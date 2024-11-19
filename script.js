// Replace with your Finnhub API key
const FINNHUB_API_KEY = 'cstu199r01qour3sl6i0cstu199r01qour3sl6ig';

// Paper Trading Account Class
class PaperTradingAccount {
    constructor(initialBalance = 100000) {
        this.balance = initialBalance;
        this.positions = new Map();
        this.transactions = [];
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('paperTradingAccount');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.balance = data.balance;
            this.positions = new Map(JSON.parse(data.positions));
            this.transactions = data.transactions;
        }
    }

    saveToLocalStorage() {
        const data = {
            balance: this.balance,
            positions: JSON.stringify(Array.from(this.positions.entries())),
            transactions: this.transactions
        };
        localStorage.setItem('paperTradingAccount', JSON.stringify(data));
    }

    async buy(symbol, shares) {
        const quote = await getStockQuote(symbol);
        const totalCost = quote.price * shares;
        
        if (totalCost > this.balance) {
            throw new Error('Insufficient funds');
        }

        this.balance -= totalCost;
        
        if (this.positions.has(symbol)) {
            const position
