// client/src/context/FavoritesContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@chakra-ui/react";
import { userAPI } from "../services/api";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await userAPI.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      toast({
        title: "Error fetching favorites",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (recipeId) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save favorites",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const isFavorite = favorites.includes(recipeId);
      if (isFavorite) {
        await userAPI.removeFavorite(recipeId);
        setFavorites(favorites.filter((id) => id !== recipeId));
        toast({
          title: "Recipe removed from favorites",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await userAPI.addFavorite(recipeId);
        setFavorites([...favorites, recipeId]);
        toast({
          title: "Recipe added to favorites",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error updating favorites",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    loading,
    toggleFavorite,
    clearFavorites,
    isFavorite: (recipeId) => favorites.includes(recipeId),
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export default FavoritesContext;
