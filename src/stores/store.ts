import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Meal } from '../models/Meal.model';

interface AppState {
    selectedMeals: Meal[];
  }
  
  const initialState: AppState = {
    selectedMeals: [],
  };

interface SetSelectedMealsAction {
    type: 'SET_SELECTED_MEALS';
    payload: Meal[];
}

type AppAction = SetSelectedMealsAction;

const counterReducer = (state = initialState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_SELECTED_MEALS':
            return { ...state, selectedMeals: action.payload };
        default:
            return state;
    }
};

const store = configureStore({
    reducer: counterReducer,
});

export default store;
