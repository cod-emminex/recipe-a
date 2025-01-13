// client/src/utils/dateTime.js
import { formatDistance, format, parseISO } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "MMM d, yyyy");
};

export const formatDateTime = (date) => {
  if (!date) return "";
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "MMM d, yyyy h:mm a");
};

export const timeAgo = (date) => {
  if (!date) return "";
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return formatDistance(parsedDate, new Date(), { addSuffix: true });
};

export const formatDuration = (minutes) => {
  if (!minutes || isNaN(minutes)) return "";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours && remainingMinutes) {
    return `${hours}h ${remainingMinutes}m`;
  } else if (hours) {
    return `${hours}h`;
  }
  return `${remainingMinutes}m`;
};
