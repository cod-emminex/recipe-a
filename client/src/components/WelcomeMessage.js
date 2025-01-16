// client/src/components/WelcomeMessage.js
import React from "react";
import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import {
  GiCook, // Chef's hat
  GiCookingPot, // Cooking pot
  GiKnifeFork, // Knife and fork
} from "react-icons/gi"; // Using Game Icons set which has great culinary icons

const WelcomeMessage = () => {
  const { user } = useAuth();

  return (
    <VStack spacing={4} textAlign="center" py={8}>
      <HStack spacing={2} align="center" flexWrap="wrap" justify="center">
        <Text
          fontSize={{ base: "xxl", md: "5xl" }}
          fontWeight="bold"
          fontFamily="Montserrat"
          color="teal.600"
        >
          {user ? (
            <>
              Dear{" "}
              <Box
                as="span"
                color="violet"
                textShadow="1px 1px 2px rgba(0,0,0,0.1)"
                fontStyle="bold"
                letterSpacing="wider"
              >
                {user.username}
              </Box>
              ❗
            </>
          ) : (
            ""
          )}{" "}
          Welcome to Recipe Haven
        </Text>
        <HStack spacing={2}>
          <GiCook size="32" color="peru" className="welcome-icon chef-icon" />
          <GiCookingPot
            size="32"
            color="violet"
            className="welcome-icon pot-icon"
          />
          <GiKnifeFork
            size="32"
            color="#319795"
            className="welcome-icon utensils-icon"
          />
        </HStack>
      </HStack>
    </VStack>
  );
};

// Add enhanced CSS animations for the culinary icons
const style = document.createElement("style");
style.textContent = `
  .welcome-icon {
    transition: all 0.3s ease;
  }

  .welcome-icon:hover {
    transform: scale(1.2);
    cursor: pointer;
    color: #2C7A7B; /* darker teal on hover */
  }

  .chef-icon {
    animation: bobble 3s ease-in-out infinite;
  }

  .pot-icon {
    animation: simmer 2s ease-in-out infinite;
  }

  .utensils-icon {
    animation: dine 2.5s ease-in-out infinite;
  }

  @keyframes bobble {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-8px) rotate(5deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }

  @keyframes simmer {
    0% {
      transform: translateY(0);
    }
    25% {
      transform: translateY(-3px) rotate(-3deg);
    }
    50% {
      transform: translateY(0) rotate(0deg);
    }
    75% {
      transform: translateY(-3px) rotate(3deg);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes dine {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-8deg);
    }
    75% {
      transform: rotate(8deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  /* Steam effect for pot icon */
  .pot-icon:hover::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    animation: steam 1s infinite ease-out;
  }

  @keyframes steam {
    0% {
      transform: translateY(0) translateX(-50%) scale(0.5);
      opacity: 0.3;
    }
    100% {
      transform: translateY(-15px) translateX(-50%) scale(1.5);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

export default WelcomeMessage;
