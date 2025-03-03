import './App.css';
import About from './pages/MealsPage';
import MealPage from './pages/MealPage';
import FavouritesPage from './pages/FavouritesPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import store from "./stores/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MealsPage from './pages/MealsPage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router basename="/meals-app">
          <Routes>
            <Route path="/" element={<MealsPage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
            <Route path='/meal/:id' element={<MealPage />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
