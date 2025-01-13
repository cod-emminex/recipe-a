// client/src/components/RecipeAnalytics.js
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { recipeAPI } from "../services/api";

const RecipeAnalytics = ({ recipeId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const bgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    fetchAnalytics();
  }, [recipeId]);

  const fetchAnalytics = async () => {
    try {
      const response = await recipeAPI.getAnalytics(recipeId);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return <Progress size="xs" isIndeterminate />;
  }

  const viewsData = {
    labels: analytics.viewsHistory.map((h) => h.date),
    datasets: [
      {
        label: "Views",
        data: analytics.viewsHistory.map((h) => h.count),
        fill: false,
        borderColor: "teal",
        tension: 0.1,
      },
    ],
  };

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
      <VStack spacing={6} align="stretch">
        <Heading size="md">Recipe Analytics</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat>
            <StatLabel>Total Views</StatLabel>
            <StatNumber>{analytics.totalViews}</StatNumber>
            <StatHelpText>
              <StatArrow
                type={analytics.viewsTrend > 0 ? "increase" : "decrease"}
              />
              {Math.abs(analytics.viewsTrend)}% this week
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Favorites</StatLabel>
            <StatNumber>{analytics.favorites}</StatNumber>
            <StatHelpText>
              {((analytics.favorites / analytics.totalViews) * 100).toFixed(1)}%
              of viewers
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Average Rating</StatLabel>
            <StatNumber>{analytics.averageRating.toFixed(1)}</StatNumber>
            <StatHelpText>From {analytics.totalRatings} ratings</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Box>
          <Text mb={2}>Views Over Time</Text>
          <Line
            data={viewsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
            height={200}
          />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <Text mb={2}>Rating Distribution</Text>
            {[5, 4, 3, 2, 1].map((rating) => (
              <HStack key={rating} mb={2}>
                <Text width="30px">{rating}★</Text>
                <Progress
                  value={(analytics.ratingDistribution[rating] || 0) * 100}
                  size="sm"
                  width="full"
                  colorScheme="teal"
                />
                <Text width="40px">
                  {((analytics.ratingDistribution[rating] || 0) * 100).toFixed(
                    0
                  )}
                  %
                </Text>
              </HStack>
            ))}
          </Box>

          <Box>
            <Text mb={2}>Engagement Metrics</Text>
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text>Comments</Text>
                <Text fontWeight="bold">{analytics.totalComments}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Shares</Text>
                <Text fontWeight="bold">{analytics.totalShares}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Print/Save</Text>
                <Text fontWeight="bold">{analytics.totalPrints}</Text>
              </HStack>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default RecipeAnalytics;
