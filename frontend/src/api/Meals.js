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
        // DELETE 요청은 보통 204 No Content를 반환하므로 data가 없을 수 있음
        return response.status === 204 || response.status === 200;
    } catch (error) {
        console.error("Failed to delete meal:", error);
        throw error;
    }
}

export const postFoods=async(mealId, foods)=>{
    try {
        const response = await apiClient.post(`/meals/${mealId}/foods`, { foods });
        return response.data;
    } catch (error) {
        console.error("Failed to add foods to meal:", error);
        throw error;
    }
}
export const getFoodsAll=async()=>{
    try {
        const response = await apiClient.get('/foods');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch foods:", error);
        throw error;
    }   
}

export const createFood = async (foodData) => {
    try {
        const response = await apiClient.post('/foods', foodData);
        return response.data;
    } catch (error) {
        console.error("Failed to create food:", error);
        throw error;
    }
}

export const searchFoods = async (params) => {
    try {
        const response = await apiClient.get('/foods/search', { params });
        return response.data;
    } catch (error) {
        console.error("Failed to search foods:", error);
        throw error;
    }
}
export default {
    createMeal,
    mealByDate,
    updateMeal,
    deleteMeal,
    postFoods,
    getFoodsAll,
    createFood,
    searchFoods
};