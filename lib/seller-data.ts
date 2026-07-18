export type SellerConversation = {
  id: string;
  customer: string;
  channel: "Instagram" | "WhatsApp" | "Facebook";
  handle: string;
  preview: string;
  age: string;
  unread: number;
  priority: "High" | "Normal";
};

export const sellerConversationStorageKey = "vaidhurya-seller-conversations";
