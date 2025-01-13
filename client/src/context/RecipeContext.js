// client/src/context/RecipeContext.js
import { createContext, useContext, useReducer } from "react";

const RecipeContext = createContext();

const initialState = {
  recipes: [],
  categories: [],
  filters: {
    search: "",
    category: "",
    sortBy: "newest",
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 9,
  },
  loading: false,
  error: null,
};

const recipeReducer = (state, action) => {
  switch (action.type) {
    case "SET_RECIPES":
      return {
        ...state,
        recipes: action.payload,
      };
    case "ADD_RECIPE":
      return {
        ...state,
        recipes: [action.payload, ...state.recipes],
      };
    case "UPDATE_RECIPE":
      return {
        ...state,
        recipes: state.recipes.map((recipe) =>
          recipe._id === action.payload._id ? action.payload : recipe
        ),
      };
    case "DELETE_RECIPE":
      return {
        ...state,
        recipes: state.recipes.filter(
          (recipe) => recipe._id !== action.payload
        ),
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case "SET_PAGINATION":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const RecipeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
};
