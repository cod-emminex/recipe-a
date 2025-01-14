// client/src/components/profile/ActivityFeed.js
import React from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Icon,
  Avatar,
  Link,
  Divider,
  Badge,
} from "@chakra-ui/react";
import {
  FaHeart,
  FaStar,
  FaComment,
  FaBookmark,
  FaUtensils,
  FaUserFriends,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { format } from "date-fns";

const ActivityTypes = {
  RECIPE_CREATED: {
    icon: FaUtensils,
    color: "green.500",
    getMessage: (activity) => `created a new recipe`,
  },
  RECIPE_LIKED: {
    icon: FaHeart,
    color: "red.500",
    getMessage: (activity) => `liked a recipe`,
  },
  RECIPE_RATED: {
    icon: FaStar,
    color: "yellow.500",
    getMessage: (activity) => `rated a recipe ${activity.data.rating} stars`,
  },
  RECIPE_COMMENTED: {
    icon: FaComment,
    color: "blue.500",
    getMessage: (activity) => `commented on a recipe`,
  },
  RECIPE_SAVED: {
    icon: FaBookmark,
    color: "purple.500",
    getMessage: (activity) => `saved a recipe`,
  },
  USER_FOLLOWED: {
    icon: FaUserFriends,
    color: "teal.500",
    getMessage: (activity) => `started following`,
  },
};

export const ActivityFeed = ({ activities, username }) => {
  return (
    <VStack spacing={4} align="stretch">
      {activities.map((activity, index) => (
        <React.Fragment key={activity.id}>
          <ActivityItem activity={activity} username={username} />
          {index < activities.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </VStack>
  );
};

const ActivityItem = ({ activity, username }) => {
  const activityType = ActivityTypes[activity.type];
  const timeAgo = format(new Date(activity.createdAt), "PPp");

  return (
    <HStack spacing={4} p={4}>
      <Avatar
        size="sm"
        src={activity.actor.avatarUrl}
        name={activity.actor.name}
      />

      <Box flex={1}>
        <HStack spacing={2} mb={1}>
          <Link
            as={RouterLink}
            to={`/profile/${username}`}
            fontWeight="bold"
            color="teal.500"
          >
            {username}
          </Link>

          <Icon as={activityType.icon} color={activityType.color} />

          <Text>{activityType.getMessage(activity)}</Text>

          {activity.target && (
            <Link
              as={RouterLink}
              to={`/recipes/${activity.target.id}`}
              color="teal.500"
            >
              {activity.target.title}
            </Link>
          )}
        </HStack>

        {activity.data?.comment && (
          <Box mt={2} p={3} bg="gray.50" borderRadius="md">
            <Text fontSize="sm">{activity.data.comment}</Text>
          </Box>
        )}

        <Text fontSize="sm" color="gray.500" mt={1}>
          {timeAgo}
        </Text>
      </Box>
    </HStack>
  );
};

// client/src/components/review/ReviewsSection.js
import React, { useState } from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Icon,
  Avatar,
  StarIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { apiClient } from "../../services/api/apiClient";
import { useAuth } from "../../hooks/useAuth";

export const ReviewsSection = ({ recipeId, reviews: initialReviews }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  const handleAddReview = async (reviewData) => {
    try {
      const newReview = await apiClient.post(
        `/recipes/${recipeId}/reviews`,
        reviewData
      );
      setReviews((prev) => [newReview, ...prev]);
      toast({
        title: "Review added",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add review",
        status: "error",
      });
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold">
          Reviews ({reviews.length})
        </Text>
        {user && (
          <Button colorScheme="teal" onClick={onOpen}>
            Write a Review
          </Button>
        )}
      </HStack>

      <VStack spacing={4} align="stretch">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </VStack>

      <AddReviewModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleAddReview}
      />
    </Box>
  );
};

const ReviewCard = ({ review }) => {
  const timeAgo = format(new Date(review.createdAt), "PPp");

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
      <HStack spacing={4} mb={3}>
        <Avatar size="sm" src={review.user.avatarUrl} name={review.user.name} />
        <Box flex={1}>
          <Text fontWeight="bold">{review.user.name}</Text>
          <HStack spacing={1}>
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                as={StarIcon}
                color={i < review.rating ? "yellow.400" : "gray.300"}
              />
            ))}
            <Text fontSize="sm" color="gray.500" ml={2}>
              {timeAgo}
            </Text>
          </HStack>
        </Box>
      </HStack>

      <Text>{review.comment}</Text>
    </Box>
  );
};

const AddReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        status: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    await onSubmit({ rating, comment });
    setIsSubmitting(false);
    onClose();
    setRating(0);
    setComment("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Write a Review</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <HStack spacing={2}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Icon
                  key={value}
                  as={FaStar}
                  boxSize={8}
                  color={value <= rating ? "yellow.400" : "gray.300"}
                  cursor="pointer"
                  onClick={() => setRating(value)}
                  _hover={{ color: "yellow.400" }}
                />
              ))}
            </HStack>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              rows={4}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Submit Review
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
