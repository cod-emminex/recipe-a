// client/src/components/ActivityFeed.js
import {
  VStack,
  Box,
  Text,
  Avatar,
  HStack,
  Button,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { userAPI } from "../services/api";

const ActivityFeed = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchActivities();
  }, [userId]);

  const fetchActivities = async (loadMore = false) => {
    try {
      const currentPage = loadMore ? page + 1 : 1;
      const response = await userAPI.getActivities(userId, currentPage);

      setActivities((prev) =>
        loadMore
          ? [...prev, ...response.data.activities]
          : response.data.activities
      );
      setHasMore(response.data.hasMore);
      setPage(currentPage);
    } catch (error) {
      toast({
        title: "Error fetching activities",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case "RECIPE_CREATED":
        return `created a new recipe "${activity.recipe.title}"`;
      case "RECIPE_UPDATED":
        return `updated their recipe "${activity.recipe.title}"`;
      case "RECIPE_LIKED":
        return `liked the recipe "${activity.recipe.title}"`;
      case "COMMENT_ADDED":
        return `commented on "${activity.recipe.title}"`;
      case "FOLLOWED_USER":
        return `started following ${activity.targetUser.username}`;
      default:
        return "performed an action";
    }
  };

  if (loading) {
    return (
      <VStack spacing={4}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height="100px" width="100%" />
        ))}
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {activities.map((activity) => (
        <Box
          key={activity._id}
          p={4}
          borderWidth={1}
          borderRadius="md"
          shadow="sm"
        >
          <HStack spacing={4}>
            <Avatar
              size="sm"
              name={activity.user.username}
              src={activity.user.avatar}
            />
            <Box>
              <Text>
                <Text as="span" fontWeight="bold">
                  {activity.user.username}
                </Text>{" "}
                {getActivityMessage(activity)}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(activity.createdAt).toLocaleString()}
              </Text>
            </Box>
          </HStack>
          {activity.recipe && (
            <Button
              as={RouterLink}
              to={`/recipes/${activity.recipe._id}`}
              size="sm"
              variant="ghost"
              mt={2}
            >
              View Recipe
            </Button>
          )}
        </Box>
      ))}

      {hasMore && (
        <Button
          onClick={() => fetchActivities(true)}
          variant="outline"
          isLoading={loading}
        >
          Load More
        </Button>
      )}
    </VStack>
  );
};

export default ActivityFeed;
