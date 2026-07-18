"use client";
import { useEffect, useState } from "react";
import { sellerConversationStorageKey, type SellerConversation } from "@/lib/seller-data";

export function useSellerConversations() {
  const [conversations, setConversations] = useState<SellerConversation[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const raw = localStorage.getItem(sellerConversationStorageKey);
      if (raw) { try { setConversations(JSON.parse(raw) as SellerConversation[]); } catch {} }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function save(next: SellerConversation[]) {
    setConversations(next);
    localStorage.setItem(sellerConversationStorageKey, JSON.stringify(next));
  }
  return { conversations, loaded, save };
}
