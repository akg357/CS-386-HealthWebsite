const experience = document.getElementById("experienceLevel");
const image = document.getElementById("exerciseImage");
const description = document.getElementById("exerciseDescription");

//the test data for each expereince level and the information
const testCases = [
    {
        index: 1,
        expectedImage: "squat_beginner.png",
        expectedDescription: "Squat"
    },
    {
        index: 2,
        expectedImage: "push_up_intermediate.png",
        expectedDescription: "Push Up"
    },
    {
        index: 3,
        expectedImage: "pull_up_advanced.png",
        expectedDescription: "Pull Up"
    }
];

// Test function
function testDisplayExercise() {
    console.log("Running tests...");

    // Test all levels
    testCases.forEach(test => {
        experience.selectedIndex = test.index;
        displayExercise();

        console.assert(
            image.src.includes(test.expectedImage),
            `Test failed for index ${test.index}: expected image ${test.expectedImage}`
        );

        console.assert(
            description.textContent === test.expectedDescription,
            `Test failed for index ${test.index}: expected description "${test.expectedDescription}"`
        );
    });

    // Test default selection triggers alert
    experience.selectedIndex = 0;
    let alertTriggered = false;

    const originalAlert = window.alert;
    window.alert = () => { alertTriggered = true; };

    displayExercise();

    console.assert(
        alertTriggered,
        "Default selection test failed: alert was not triggered"
    );

    // Restore original alert
    window.alert = originalAlert;

    console.log("All tests completed.");
}

// Run the test
window.onload = () => {
    testDisplayExercise();
};
