//calcualte actual macros for desired weight 
async function calculateMacros() {
    const desiredWeight = document.getElementById("goalWeight").value;
    //will add pace functionality in the future 

    //check to make sure desired weight is a valid integer for calculation
    if (isNaN(desiredWeight) || desiredWeight <= 0) {
      alert("Please enter a valid weight");
      return null;
    }

    //retireves the weight of user from the data base 
    let currentWeight;
    try {
      const retrieval = await fetch("/current-weight");
      if(!retrieval.ok) throw new Error("No weight found");
      const data = await retrieval.json();
      currentWeight = parseFloat(data.weight);
  } catch (err) {
    console.error(err);
    alert("Error could not retireve weight from the database");
    return null
  }

  /*currently displaying weight based on their desired weight and if thats more or less then their current weight 
  these number can change this just made the most sense for now 
  also will need to update once the pace  functionality is implemented
  */
    let protein, carbs;
    if(desiredWeight > weight) {
      //trying to gain weight
      protein = (desiredWeight * 2.2);
      carbs = (desiredWeight * 5.0);
    } else if(desiredWeight < weight) {
      //trying to lose weight 
      protein = (desiredWeight * 1.8);
      carbs = (desiredWeight * 3.0)
    } else {
      //if weight the same then for maintance of current weight 
      protein = (desiredWeight * 2.0);
      carbs = (desiredWeight * 4.0);
    }

    document.getElementById("proteinPerDay").textContent = protein.toFixed(1);
    document.getElementById("carbsPerDay").textContent = carbs.toFixed(1);

    //return data so that it can be saved into the data table 
    return {
      weight: currentWeight,
      dersiredWeight,
      protein: protein,
      carbs: carbs
    }
}