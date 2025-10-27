async function calculateMacros() {
  const desiredWeight = parseFloat(document.getElementById("goalWeight").value);
  if (isNaN(desiredWeight) || desiredWeight <= 0) {
    alert("Please enter a valid weight.");
    return null;
  }

  // Get current weight from backend
  const response = await fetch("/current-weight");
  if (!response.ok) {
    alert("Error fetching current weight. Please log in.");
    return null;
  }

  const data = await response.json();
  const currentWeight = parseFloat(data.weight);

  // Calculate macros
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

  // Update UI
  document.getElementById("proteinPerDay").textContent = protein.toFixed(1);
  document.getElementById("carbsPerDay").textContent = carbs.toFixed(1);

  return { currentWeight, desiredWeight, protein, carbs };
}

async function saveMacros(data) {
  if (!data) return;

  const res = await fetch("/calculate-goal-weight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    alert("Your goal and macros have been saved!");
  } else {
    alert("Error saving data.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnCalculate");
  if (btn) {
    btn.addEventListener("click", async () => {
      const data = await calculateMacros();
      await saveMacros(data);
    });
  }
});
