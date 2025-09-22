import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AddIngredients from "./pages/AddIngredients";
import Camera from "./pages/Camera";
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";
import Favorites from "./pages/Favorites";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import ShoppingListPage from "./pages/ShoppingList";
import MealPlanner from "./pages/MealPlanner";
import Auth from "./pages/Auth";
import RecipeManagement from "./pages/RecipeManagement";
import NotFound from "./pages/NotFound";
import Community from "./pages/Community";
import AIRecommendations from "./pages/AIRecommendations";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add-ingredients" element={<AddIngredients />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/recipe-management" element={<RecipeManagement />} />
          <Route path="/community" element={<Community />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
