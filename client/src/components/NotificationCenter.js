// src/components/NotificationCenter.js
import React from "react";
import { Box, Alert, AlertIcon, CloseButton, VStack } from "@chakra-ui/react";
import { useNotifications } from "../context/NotificationContext";

const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <Box
      position="fixed"
      top="20px"
      right="20px"
      zIndex="toast"
      maxWidth="400px"
    >
      <VStack spacing={2}>
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            status={notification.status}
            variant="solid"
            borderRadius="md"
          >
            <AlertIcon />
            {notification.message}
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => removeNotification(notification.id)}
            />
          </Alert>
        ))}
      </VStack>
    </Box>
  );
};

export default NotificationCenter;
