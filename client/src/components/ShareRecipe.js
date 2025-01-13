// client/src/components/ShareRecipe.js
import {
  Button,
  IconButton,
  HStack,
  useToast,
  useClipboard,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ShareIcon, CopyIcon, EmailIcon } from "@chakra-ui/icons";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

const ShareRecipe = ({ recipe }) => {
  const shareUrl = window.location.href;
  const { hasCopied, onCopy } = useClipboard(shareUrl);
  const toast = useToast();

  const shareData = {
    title: `Check out this recipe: ${recipe.title}`,
    text: `${recipe.title} - ${recipe.description}`,
    url: shareUrl,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    }
  };

  const handleEmailShare = () => {
    const emailBody = `Check out this recipe: ${recipe.title}%0D%0A%0D%0A${shareUrl}`;
    window.location.href = `mailto:?subject=Recipe: ${recipe.title}&body=${emailBody}`;
  };

  const socialShareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareData.text
    )}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${shareData.text} ${shareUrl}`
    )}`,
  };

  return (
    <HStack spacing={2}>
      {navigator.share ? (
        <Button
          leftIcon={<ShareIcon />}
          onClick={handleShare}
          colorScheme="teal"
        >
          Share
        </Button>
      ) : (
        <Menu>
          <MenuButton as={Button} leftIcon={<ShareIcon />} colorScheme="teal">
            Share
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<FaFacebook />}
              onClick={() => window.open(socialShareUrls.facebook, "_blank")}
            >
              Share on Facebook
            </MenuItem>
            <MenuItem
              icon={<FaTwitter />}
              onClick={() => window.open(socialShareUrls.twitter, "_blank")}
            >
              Share on Twitter
            </MenuItem>
            <MenuItem
              icon={<FaWhatsapp />}
              onClick={() => window.open(socialShareUrls.whatsapp, "_blank")}
            >
              Share on WhatsApp
            </MenuItem>
            <MenuItem icon={<EmailIcon />} onClick={handleEmailShare}>
              Share via Email
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      <IconButton
        icon={<CopyIcon />}
        onClick={onCopy}
        aria-label="Copy link"
        colorScheme={hasCopied ? "green" : "gray"}
      />
    </HStack>
  );
};

export default ShareRecipe;
