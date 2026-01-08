// Éléments du DOM
const amountElement = document.getElementById('amount');
const fromCurrencyElement = document.getElementById('from-currency');
const toCurrencyElement = document.getElementById('to-currency');
const resultElement = document.getElementById('result');
const rateElement = document.getElementById('rate-info');
const swapBtn = document.getElementById('swap');

// Taux de change par défaut (sera mis à jour via l'API)
let rates = {
    'XOF': 1,      // 1 XOF = 1 XOF
    'EUR': 0.0015, // 1 XOF = 0.0015 EUR (approximatif)
    'USD': 0.0017  // 1 XOF = 0.0017 USD (approximatif)
};

// Mettre à jour les taux de change depuis l'API
async function updateRates() {
    try {
        const baseCurrency = 'XOF';
        const response = await fetch(`https://api.exchangerate.host/latest?base=${baseCurrency}&symbols=EUR,USD`);
        const data = await response.json();
        
        if (data.success) {
            rates = {
                'XOF': 1,
                'EUR': data.rates.EUR,
                'USD': data.rates.USD
            };
            updateRateInfo();
            calculate();
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des taux de change:', error);
        // Utiliser les taux par défaut en cas d'erreur
        updateRateInfo();
    }
}

// Mettre à jour l'affichage du taux de change
function updateRateInfo() {
    const from = fromCurrencyElement.value;
    const to = toCurrencyElement.value;
    const rate = rates[to] / rates[from];
    rateElement.textContent = `1 ${from} = ${rate.toFixed(6)} ${to}`;
}

// Effectuer la conversion
function calculate() {
    const amount = parseFloat(amountElement.value) || 0;
    const fromCurrency = fromCurrencyElement.value;
    const toCurrency = toCurrencyElement.value;
    
    // Calcul du taux de change
    const rate = rates[toCurrency] / rates[fromCurrency];
    const result = (amount * rate).toFixed(2);
    
    // Mise à jour de l'interface
    resultElement.value = result;
    updateRateInfo();
}

// Échanger les devises
function swapCurrencies() {
    const temp = fromCurrencyElement.value;
    fromCurrencyElement.value = toCurrencyElement.value;
    toCurrencyElement.value = temp;
    calculate();
}

// Événements
document.addEventListener('DOMContentLoaded', () => {
    // Charger les taux de change
    updateRates();
    
    // Écouteurs d'événements
    amountElement.addEventListener('input', calculate);
    fromCurrencyElement.addEventListener('change', calculate);
    toCurrencyElement.addEventListener('change', calculate);
    swapBtn.addEventListener('click', swapCurrencies);
    
    // Calcul initial
    calculate();
});

// Gestion du clavier pour une meilleure accessibilité
amountElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        calculate();
    }
});

// Gestion du copier-coller
resultElement.addEventListener('click', function() {
    this.select();
    document.execCommand('copy');
    
    // Feedback visuel
    const originalValue = this.value;
    this.value = 'Copié !';
    setTimeout(() => {
        this.value = originalValue;
    }, 1000);
});
