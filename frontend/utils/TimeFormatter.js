export function formatTimestamp(timestamp) {
  const now = Date.now();
    const messageTime = new Date(timestamp).getTime();
    const diff = now - messageTime;
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    return `${Math.floor(diff / 86400000)} days ago`
  }



export function formatLiveChatTimeStamp(timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }); 
}


export const formatConversationTime = (timestamp) => {
  if (!timestamp) return "";

  const messageDate = new Date(timestamp);
  const now = new Date();

  // Create dates at midnight for accurate day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );

  const diffTime = today - msgDay;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays === 0) {
    // Today -> show time
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (diffDays === 1) {
    // Yesterday
    return "Yesterday";
  }

  // Older -> show date in dd/mm/yyyy
  const day = String(messageDate.getDate()).padStart(2, "0");
  const month = String(messageDate.getMonth() + 1).padStart(2, "0");
  const year = messageDate.getFullYear();

  return `${day}/${month}/${year}`;
};