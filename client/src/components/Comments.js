// client/src/components/Comments.js
import { useState } from "react";
import {
  VStack,
  Box,
  Text,
  Button,
  Textarea,
  Avatar,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { recipeAPI } from "../services/api";

const Comments = ({ recipeId, initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await recipeAPI.addComment(recipeId, {
        content: newComment,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
      toast({
        title: "Comment added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding comment",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await recipeAPI.deleteComment(recipeId, commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
      toast({
        title: "Comment deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting comment",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {user && (
        <Box as="form" onSubmit={handleSubmit}>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            resize="vertical"
            mb={2}
          />
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isLoading}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </Box>
      )}

      <VStack spacing={4} align="stretch">
        {comments.map((comment) => (
          <Box key={comment._id} p={4} bg="gray.50" borderRadius="md">
            <HStack spacing={4} mb={2}>
              <Avatar
                size="sm"
                name={comment.author.username}
                src={comment.author.avatar}
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">{comment.author.username}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </Text>
              </VStack>
            </HStack>
            <Text>{comment.content}</Text>
            {user && user.id === comment.author._id && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => handleDelete(comment._id)}
                mt={2}
              >
                Delete
              </Button>
            )}
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

export default Comments;
