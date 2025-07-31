console.log("JavaScript is connected!");

//realtime coin price from CoinGecko
async function fetchCoinPrice(coin) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin.toLowerCase()}&vs_currencies=usd`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[coin.toLowerCase()].usd; 
    } catch (error) {
        console.error("Error fetching the coin price:", error);
        return null; 
    }
}

// ===============================
// Spot
// ===============================
document.getElementById("calculator-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const dollars = parseFloat(document.getElementById("dollars").value);
    const investmentPrice = parseFloat(document.getElementById("investmentPrice").value);
    const sellingPrice = parseFloat(document.getElementById("sellingPrice").value);
    const usdPrice = parseFloat(document.getElementById("usdPrice").value);
    const coinName = document.getElementById("coinName").value;
    if (isNaN(dollars) || isNaN(investmentPrice) || isNaN(sellingPrice) || isNaN(usdPrice)) {
        document.getElementById("results").innerHTML = "<p>Please enter valid numeric values.</p>";
        return;
    }
    const realTimePrice = await fetchCoinPrice(coinName);
    const coins = dollars / investmentPrice;
    const profit = sellingPrice * coins - dollars;
    const profitInPKR = profit * usdPrice;
    const totalAssets = profit + dollars;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString(); 
    document.getElementById("results").innerHTML = `
        <p>Real-time Price of ${coinName}: ${realTimePrice !== null ? `$${realTimePrice.toFixed(6)}` : "Failed to fetch"}</p>
        <p>Coins Purchased: ${coins.toFixed(4)}</p>
        <p>Your Profit: ${profit.toFixed(4)} USD</p>
        <p>Your Profit in PKR: ${profitInPKR.toFixed(4)} Rs</p>
        <p>Total Assets: ${totalAssets.toFixed(4)} USD</p>
        <p>Last updated on: ${formattedDate}</p>
    `;
});

// ===============================
// Futures
// ===============================
document.getElementById("futures-calculator-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const entryPrice = parseFloat(document.getElementById("entryPrice").value);
    const exitPrice = parseFloat(document.getElementById("exitPrice").value);
    const quantity = parseFloat(document.getElementById("quantity").value);
    const leverage = parseFloat(document.getElementById("leverage").value);
    const positionType = document.getElementById("positionType").value;
    const usdRate = parseFloat(document.getElementById("usdPriceFutures").value);
    
    if (isNaN(entryPrice) || isNaN(exitPrice) || isNaN(quantity) || isNaN(leverage) || isNaN(usdRate)) {
        document.getElementById("futures-results").innerHTML = "<p>Please enter valid numeric values.</p>";
        return;
    }

    let profit;
    if (positionType === "long") {
        profit = (exitPrice - entryPrice) * quantity;
    } else if (positionType === "short") {
        profit = (entryPrice - exitPrice) * quantity;
    } else {
        document.getElementById("futures-results").innerHTML = "<p>Invalid position type selected.</p>";
        return;
    }

    const initialInvestment = (entryPrice * quantity) / leverage; // Correct investment with leverage
    const roi = (profit / initialInvestment) * 100;
    const profitPKR = profit * usdRate;

    document.getElementById("futures-results").innerHTML = `
        <p><strong>Position:</strong> ${positionType.toUpperCase()}</p>
        <p><strong>Profit/Loss:</strong> $${profit.toFixed(2)}</p>
        <p><strong>Profit/Loss in PKR:</strong> Rs ${profitPKR.toFixed(2)}</p>
        <p><strong>ROI:</strong> ${roi.toFixed(2)}%</p>
    `;
});























