// client/src/components/review/RatingAggregation.js
import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Progress,
  Stat,
  StatNumber,
  StatHelpText,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

export const RatingAggregation = ({ ratings }) => {
  const totalRatings = ratings.reduce((acc, curr) => acc + curr.count, 0);
  const averageRating =
    ratings.reduce((acc, curr) => acc + curr.stars * curr.count, 0) /
    totalRatings;

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="sm">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {/* Average Rating Display */}
        <VStack spacing={2} align="center">
          <Stat textAlign="center">
            <StatNumber fontSize="4xl">{averageRating.toFixed(1)}</StatNumber>
            <HStack justify="center" spacing={1}>
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  as={FaStar}
                  color={
                    i < Math.round(averageRating) ? "yellow.400" : "gray.300"
                  }
                />
              ))}
            </HStack>
            <StatHelpText>
              {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
            </StatHelpText>
          </Stat>
        </VStack>

        {/* Rating Distribution */}
        <VStack spacing={2} align="stretch">
          {ratings
            .slice()
            .reverse()
            .map((rating) => (
              <HStack key={rating.stars} spacing={2}>
                <Text minW="30px">{rating.stars}★</Text>
                <Progress
                  value={(rating.count / totalRatings) * 100}
                  size="sm"
                  colorScheme="yellow"
                  flex={1}
                />
                <Text minW="40px" fontSize="sm">
                  {rating.count}
                </Text>
              </HStack>
            ))}
        </VStack>
      </SimpleGrid>
    </Box>
  );
};
