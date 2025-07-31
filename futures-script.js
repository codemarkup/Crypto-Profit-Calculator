console.log("Futures Calculator is connected!");

// Function to calculate futures P&L
function calculateFuturesPL(entryPrice, exitPrice, quantity, leverage, positionType, usdPrice) {
    const priceDifference = exitPrice - entryPrice;
    let profitLoss;
    
    if (positionType === "long") {
        profitLoss = priceDifference * quantity * leverage;
    } else { // short position
        profitLoss = (entryPrice - exitPrice) * quantity * leverage;
    }
    
    const profitLossPKR = profitLoss * usdPrice;
    const investment = entryPrice * quantity;
    const roi = (profitLoss / investment) * 100;
    
    return {
        profitLoss,
        profitLossPKR,
        roi,
        positionType
    };
}

document.getElementById("futures-calculator-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Fetch and parse the input values
    const entryPrice = parseFloat(document.getElementById("entryPrice").value);
    const exitPrice = parseFloat(document.getElementById("exitPrice").value);
    const quantity = parseFloat(document.getElementById("quantity").value);
    const leverage = parseFloat(document.getElementById("leverage").value);
    const positionType = document.getElementById("positionType").value;
    const usdPrice = parseFloat(document.getElementById("usdPriceFutures").value);

    // Validate all inputs
    if (isNaN(entryPrice) || isNaN(exitPrice) || isNaN(quantity) || isNaN(leverage) || isNaN(usdPrice)) {
        document.getElementById("futures-results").innerHTML = "<p>Please enter valid numeric values.</p>";
        return;
    }

    // Perform calculations
    const result = calculateFuturesPL(entryPrice, exitPrice, quantity, leverage, positionType, usdPrice);

    // Get current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    // Determine profit/loss class
    const plClass = result.profitLoss >= 0 ? "profit-positive" : "profit-negative";
    const roiClass = result.roi >= 0 ? "roi-positive" : "roi-negative";

    // Display results
    document.getElementById("futures-results").innerHTML = `
        <div class="result-item">
            <div class="result-label"><i class="fas fa-${result.positionType === "long" ? "arrow-up" : "arrow-down"}"></i> Position Type</div>
            <div class="result-value">${result.positionType.charAt(0).toUpperCase() + result.positionType.slice(1)}</div>
        </div>
        <div class="result-item">
            <div class="result-label"><i class="fas fa-expand"></i> Leverage</div>
            <div class="result-value">${leverage}x</div>
        </div>
        <div class="result-item">
            <div class="result-label"><i class="fas fa-dollar-sign"></i> P&L (USD)</div>
            <div class="result-value ${plClass}">${result.profitLoss >= 0 ? '+' : ''}${result.profitLoss.toFixed(4)} USD</div>
        </div>
        <div class="result-item">
            <div class="result-label"><i class="fas fa-rupee-sign"></i> P&L (PKR)</div>
            <div class="result-value ${plClass}">${result.profitLoss >= 0 ? '+' : ''}${result.profitLossPKR.toFixed(4)} Rs</div>
        </div>
        <div class="result-item">
            <div class="result-label"><i class="fas fa-percentage"></i> ROI</div>
            <div class="result-value ${roiClass}">${result.roi >= 0 ? '+' : ''}${result.roi.toFixed(2)}%</div>
        </div>
        <div class="result-item">
            <div class="result-label"><i class="far fa-clock"></i> Last Updated</div>
            <div class="result-value">${formattedDate}</div>
        </div>
    `;
});