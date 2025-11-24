document.addEventListener("DOMContentLoaded", () => {
    const btnBmi = document.getElementById("btnFind");
    btnBmi.addEventListener("click", calculateBMI);
});

function calculateBMI() {
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        document.getElementById("bmiResult").textContent = "Please enter valid numbers.";
        return;
    }

    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(2);

    document.getElementById("bmiResult").textContent = `Your BMI is ${bmi}`;
}
