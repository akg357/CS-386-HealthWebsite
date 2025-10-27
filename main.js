document.addEventListener("DOMContentLoaded", () => {
  const btnBmi = document.getElementById("btnFind");
  btnBmi.addEventListener("click", calculateBMI);
});

// This function runs when the button is pressed
    function calculateBMI() {
      // Get the values from the text boxes
      const h = document.getElementById("height").value;
      const w = document.getElementById("weight").value;
      const heightunits = document.getElementById("heightUnit").value;
      const weightunits = document.getElementById("weightUnit").value;

      // Convert them to numbers
      const height = parseFloat(h);
      const weight = parseFloat(w);

      // Check for valid input
      if (isNaN(height) || isNaN(weight)) {
        document.getElementById("bmiResult").textContent = "Please enter valid numbers.";
        return;
      }

      let result;

      if (heightunits == "cm" && weightunits == "kg")
      {
        result = bmi_metric(height, weight);
      }
      else if (heightunits == "in" && weightunits == "lb")
      {
        result = bmi_imperial(height, weight);
      }

      // Display the result
      document.getElementById("bmiResult").textContent = `Result: ${result}`;
    }

    // Example function that uses the two inputs
    export function bmi_metric(height, weight) 
    {
        heightm = height / 100;
        let bmi = weight / (heightm * heightm);
        let rounded = bmi.toFixed(2);
        return rounded;
    }

    export function bmi_imperial(height, weight) 
    {
        let bmi = (703 * weight) / (height * height);
        let rounded = bmi.toFixed(2);
        return rounded;
    }
