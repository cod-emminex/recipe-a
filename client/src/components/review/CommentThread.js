// client/src/components/review/CommentThread.js
import React, { useState, useRef } from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Avatar,
  Input,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Collapse,
  Divider,
} from "@chakra-ui/react";
import { FaEllipsisV, FaReply, FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import { useAuth } from "../../hooks/useAuth";
import { apiClient } from "../../services/api/apiClient";

export const CommentThread = ({ recipeId, comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments);
  const [replyTo, setReplyTo] = useState(null);
  const { user } = useAuth();
  const toast = useToast();
  const commentInputRef = useRef(null);

  const handleAddComment = async (text, parentId = null) => {
    try {
      const newComment = await apiClient.post(`/recipes/${recipeId}/comments`, {
        text,
        parentId,
      });

      if (parentId) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? { ...comment, replies: [...comment.replies, newComment] }
              : comment
          )
        );
      } else {
        setComments((prev) => [newComment, ...prev]);
      }

      setReplyTo(null);
      toast({
        title: "Comment added",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        status: "error",
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {user && (
        <CommentInput
          onSubmit={handleAddComment}
          placeholder="Add a comment..."
          ref={commentInputRef}
        />
      )}

      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          recipeId={recipeId}
          onReply={(id) => {
            setReplyTo(id);
            setTimeout(() => commentInputRef.current?.focus(), 0);
          }}
          onUpdate={(updatedComment) => {
            setComments((prev) =>
              prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
            );
          }}
          onDelete={(id) => {
            setComments((prev) => prev.filter((c) => c.id !== id));
          }}
        />
      ))}
    </VStack>
  );
};

const CommentItem = ({ comment, recipeId, onReply, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const timeAgo = format(new Date(comment.createdAt), "PPp");

  const handleLike = async () => {
    try {
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to like comments",
          status: "warning",
        });
        return;
      }

      await apiClient.post(`/recipes/${recipeId}/comments/${comment.id}/like`);
      onUpdate({
        ...comment,
        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        isLiked: !comment.isLiked,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like comment",
        status: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/recipes/${recipeId}/comments/${comment.id}`);
      onDelete(comment.id);
      toast({
        title: "Comment deleted",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        status: "error",
      });
    }
  };

  return (
    <Box>
      <HStack spacing={4} align="start">
        <Avatar
          size="sm"
          src={comment.user.avatarUrl}
          name={comment.user.name}
        />

        <Box flex={1}>
          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">{comment.user.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {timeAgo}
              </Text>
            </VStack>

            {user?.id === comment.user.id && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaEllipsisV />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem
                    icon={<FaEdit />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem icon={<FaTrash />} onClick={handleDelete}>
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </HStack>

          {isEditing ? (
            <CommentInput
              initialValue={comment.text}
              onSubmit={async (text) => {
                try {
                  const updated = await apiClient.put(
                    `/recipes/${recipeId}/comments/${comment.id}`,
                    { text }
                  );
                  onUpdate(updated);
                  setIsEditing(false);
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to update comment",
                    status: "error",
                  });
                }
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Text mt={2}>{comment.text}</Text>
          )}

          <HStack mt={2} spacing={4}>
            <Button
              size="sm"
              leftIcon={<FaHeart />}
              variant={comment.isLiked ? "solid" : "ghost"}
              colorScheme={comment.isLiked ? "red" : "gray"}
              onClick={handleLike}
            >
              {comment.likes}
            </Button>

            <Button
              size="sm"
              leftIcon={<FaReply />}
              variant="ghost"
              onClick={() => onReply(comment.id)}
            >
              Reply
            </Button>
          </HStack>

          {comment.replies?.length > 0 && (
            <>
              <Button
                size="sm"
                variant="link"
                mt={2}
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? "Hide" : "Show"} {comment.replies.length} replies
              </Button>

              <Collapse in={showReplies}>
                <VStack spacing={4} pl={8} mt={4}>
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      recipeId={recipeId}
                      onReply={onReply}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  ))}
                </VStack>
              </Collapse>
            </>
          )}
        </Box>
      </HStack>
      <Divider mt={4} />
    </Box>
  );
};

const CommentInput = React.forwardRef(
  (
    {
      initialValue = "",
      onSubmit,
      onCancel,
      placeholder = "Write a comment...",
    },
    ref
  ) => {
    const [text, setText] = useState(initialValue);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
      if (!text.trim()) return;

      setIsSubmitting(true);
      await onSubmit(text.trim());
      setIsSubmitting(false);
      setText("");
    };

    return (
      <VStack spacing={2} align="stretch">
        <Input
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          size="sm"
        />
        <HStack justify="flex-end">
          {onCancel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setText(initialValue);
                onCancel();
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            colorScheme="teal"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </HStack>
      </VStack>
    );
  }
);
