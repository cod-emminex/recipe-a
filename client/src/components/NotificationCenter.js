// client/src/components/NotificationCenter.js
import {
  IconButton,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { useNotifications } from "../context/NotificationContext";

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const getNotificationContent = (notification) => {
    switch (notification.type) {
      case "COMMENT":
        return `${notification.sender.username} commented on your recipe "${notification.recipe.title}"`;
      case "LIKE":
        return `${notification.sender.username} liked your recipe "${notification.recipe.title}"`;
      case "FOLLOW":
        return `${notification.sender.username} started following you`;
      default:
        return notification.message;
    }
  };

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box position="relative" display="inline-block">
          <IconButton
            icon={<BellIcon />}
            aria-label="Notifications"
            variant="ghost"
          />
          {unreadCount > 0 && (
            <Badge
              colorScheme="red"
              position="absolute"
              top="-1"
              right="-1"
              borderRadius="full"
            >
              {unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent width="300px">
        <PopoverBody p={0}>
          <VStack spacing={0} align="stretch" maxH="400px" overflowY="auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Box
                  key={notification._id}
                  p={4}
                  borderBottomWidth={1}
                  bg={notification.read ? "white" : "gray.50"}
                  _hover={{ bg: "gray.100" }}
                  cursor="pointer"
                  onClick={() => markAsRead(notification._id)}
                >
                  <Text fontSize="sm">
                    {getNotificationContent(notification)}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </Text>
                </Box>
              ))
            ) : (
              <Box p={4} textAlign="center">
                <Text color="gray.500">No notifications</Text>
              </Box>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
