

    const btnCalculate = document.getElementById("btnCalculate")
    
    function calculateMacros() {
        const desiredWeight = parseFloat(document.getElementById("goalWeight").value);
        if (isNaN(desiredWeight) || desiredWeight <= 0) {
            alert("Please enter a valid weight");
            return;
        }

        const currentWeight = 200;

        let protein, carbs;

        if (desiredWeight > currentWeight) {
            protein = desiredWeight * 2.2;
            carbs = desiredWeight * 5.0;
        } else if (desiredWeight < currentWeight) {
            protein = desiredWeight * 1.8;
            carbs = desiredWeight * 3.0;
        } else {
            protein = desiredWeight * 2.0;
            carbs = desiredWeight * 4.0;
        }

        document.getElementById("proteinPerDay").textContent = protein.toFixed(1);
        document.getElementById("carbsPerDay").textContent = carbs.toFixed(1);
    }

   btnCalculate.addEventListener("click", () => {
    console.log("clicked");
    calculateMacros();
});




