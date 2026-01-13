import {apiClient} from "../lib/apiClient";

export const createMeal = async (mealData) => {
    try {
        const response = await apiClient.post('/meals', mealData);
        return response.data;
    } catch (error) {
        console.error("Failed to create meal:", error);
        throw error;
    }
}

export const mealByDate = async (date) => {
    try {
        const response = await apiClient.get('/meals', {
            params: { date }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch meals by date:", error);
        throw error;
    }
}

export const updateMeal = async (mealId, mealData) => {
    try {
        const response = await apiClient.put(`/meals/${mealId}`, mealData);
        return response.data;
    } catch (error) {
        console.error("Failed to update meal:", error);
        throw error;
    }
}

export const deleteMeal = async (mealId) => {
    try {
        const response = await apiClient.delete(`/meals/${mealId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete meal:", error);
        throw error;
    }
}
export default {
    createMeal,
    mealByDate,
    updateMeal,
    deleteMeal
};