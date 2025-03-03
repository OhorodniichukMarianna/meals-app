import type { Meal } from './../models/Meal.model';

export const setSelectedMeals = (meals: Meal[]) => ({
    type: 'SET_SELECTED_MEALS',
    payload: meals,
});
