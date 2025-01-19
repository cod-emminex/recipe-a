// client/src/components/RecipeCarousel.js
import React from "react";
import { Box, Image, Text, Heading, Link } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { Link as RouterLink } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const featuredRecipes = [
  {
    id: 1,
    title: "Classic Margherita Pizza",
    description: "Italian-style pizza with fresh basil",
    image:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Creamy Mushroom Risotto",
    description: "Rich and authentic Italian risotto",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Grilled Salmon Bowl",
    description: "Fresh salmon with quinoa and vegetables",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Thai Green Curry",
    description: "Authentic Thai curry with coconut milk",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    title: "Chocolate Lava Cake",
    description: "Decadent dessert with molten center",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
  },
];

const RecipeCarousel = () => {
  return (
    <Box py={8} px={4}>
      <Heading
        textAlign="center"
        mb={6}
        fontFamily="Montserrat"
        color="teal.700"
        size="lg"
      >
        Featured Recipes
      </Heading>
      <Box maxW="1200px" mx="auto">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{
            padding: "20px 5px",
          }}
        >
          {featuredRecipes.map((recipe) => (
            <SwiperSlide key={recipe.id}>
              <Link
                as={RouterLink}
                to={`/recipe/${recipe.id}`}
                _hover={{ textDecoration: "none" }}
              >
                <Box
                  bg="white"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="lg"
                  transition="transform 0.3s, box-shadow 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "xl",
                  }}
                  height="100%"
                >
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    objectFit="cover"
                    h="200px"
                    w="100%"
                    fallback={
                      <Box
                        h="200px"
                        w="100%"
                        bg="gray.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="gray.500">Loading...</Text>
                      </Box>
                    }
                  />
                  <Box p={4}>
                    <Text
                      fontFamily="Montserrat"
                      fontSize="lg"
                      fontWeight="semibold"
                      color="teal.700"
                      noOfLines={1}
                      mb={2}
                    >
                      {recipe.title}
                    </Text>
                    <Text fontSize="m" color="gray.600" noOfLines={2}>
                      {recipe.description}
                    </Text>
                  </Box>
                </Box>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default RecipeCarousel;
