// HealthService.js
const { fetchUserMeals } = require("./apiClient");

// small service that sums calories from meals
class HealthService 
{
    async getDailyCalories(userId) 
    {
        const data = await fetchUserMeals(userId);
        return data.meals.reduce((sum, meal) => sum + meal.calories, 0);
    }
}

module.exports = HealthService;
