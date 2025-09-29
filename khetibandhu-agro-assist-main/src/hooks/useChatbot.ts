import { useState, useCallback } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  source?: string;
};

export function useChatbot(apiBase: string = import.meta.env.VITE_API_BASE || "http://localhost:8000") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string, opts?: { userId?: string; language?: string }) => {
    const userId = opts?.userId || "anon";
    const language = opts?.language || "en";
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/chatbot/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: text, language }),
      });
      const data = await res.json();
      const botMsg: ChatMessage = { role: "assistant", content: data?.reply || "", source: data?.source };
      setMessages(prev => [...prev, botMsg]);
    } catch (e: any) {
      setError(e?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }, [apiBase]);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isSending, error, sendMessage, reset };
}

export default useChatbot;


