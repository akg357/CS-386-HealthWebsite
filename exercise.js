const btnExercise = document.getElementById("btnExercise");
const image = document.getElementById("exerciseImage");
const description = document.getElementById("exerciseDescription")

//for now just if statements based on what they selected as their experience level
//will implement a way to store more exercises in arrays with descriptions
window.displayExercise = function() {
    const experience = document.getElementById("experienceLevel");

    if (experience.selectedIndex === 0) {
        alert("Please select an experience level");
    } else if (experience.selectedIndex === 1) {
        image.src = "exercise images/squat_beginner.png";
        description.textContent = "Squat";
    } else if(experience.selectedIndex === 2) {
        image.src = "exercise images/push_up_intermediate.png";
        description.textContent = "Push Up";
    } else if(experience.selectedIndex === 3) {
        image.src = "exercise images/pull_up_advanced.png";
        description.textContent = "Pull Up"
    }
}

btnExercise.addEventListener("click", () => {
    console.log("clicked");
    displayExercise(); 
});