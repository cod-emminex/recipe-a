// client/src/components/FavoriteButton.js
import { IconButton, Icon, useToast } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

const FavoriteButton = ({ recipeId }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const toast = useToast();
  const isFavorite = favorites.includes(recipeId);

  const handleClick = async () => {
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

    await toggleFavorite(recipeId);
  };

  return (
    <IconButton
      icon={<Icon as={isFavorite ? FaHeart : FaRegHeart} />}
      onClick={handleClick}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      colorScheme={isFavorite ? "red" : "gray"}
      variant="ghost"
    />
  );
};

export default FavoriteButton;
