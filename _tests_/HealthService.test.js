// tests/HealthService.test.js
const HealthService = require("../HealthService");
const apiClient = require("../apiClient");

// this will teell Jest to mock the whole apiClient module
jest.mock("../apiClient");

describe("HealthService.getDailyCalories", () => 
    {
    test("sums calories from meals returned by apiClient", async () => {
        // SETUP: fake data returned by the mocked dependency
        apiClient.fetchUserMeals.mockResolvedValue({
            meals: [
                { name: "Breakfast", calories: 400 },
                { name: "Lunch", calories: 600 },
                { name: "Dinner", calories: 500 }
            ]
        });

        const service = new HealthService();

        // EXECUTION
        const total = await service.getDailyCalories("user-123");

        // ASSERTIONS
        expect(apiClient.fetchUserMeals).toHaveBeenCalledWith("user-123");
        expect(total).toBe(1500); // 400 + 600 + 500
    });
});
