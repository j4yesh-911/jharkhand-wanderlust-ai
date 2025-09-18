import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  Send,
  Bot,
  User,
  Loader2,
  MapPin,
  Calendar,
  Utensils,
  Camera,
  Route,
} from "lucide-react";

import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "suggestion";
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const suggestions = [
  {
    icon: <MapPin className="w-4 h-4" />,
    text: "Best places to visit in Ranchi",
    category: "destinations",
  },
  {
    icon: <Calendar className="w-4 h-4" />,
    text: "Plan a 3-day itinerary",
    category: "itinerary",
  },
  {
    icon: <Utensils className="w-4 h-4" />,
    text: "Traditional food recommendations",
    category: "food",
  },
  {
    icon: <Route className="w-4 h-4" />,
    text: "How to reach Hundru Falls?",
    category: "transport",
  },
  {
    icon: <Camera className="w-4 h-4" />,
    text: "Best photography spots",
    category: "activities",
  },
];

export const AIAssistant = () => {
  const { toast } = useToast();

  const [chat, setChat] = useState(() => model.startChat({ history: [] }));

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your Jharkhand travel assistant. I can help you plan your trip, recommend places to visit, suggest local food, and answer any questions about traveling in Jharkhand. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const result = await chat.sendMessage(content);
      const fullResponse = result.response.text();

      const aiMessageId = (Date.now() + 1).toString();
      const newAiMessage: Message = {
        id: aiMessageId,
        content: "",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newAiMessage]);

      // Split response into lines and stream them
      const lines = fullResponse.split("\n").filter((l) => l.trim() !== "");
      let index = 0;

      const interval = setInterval(() => {
        if (index < lines.length) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: msg.content + (msg.content ? "\n" : "") + lines[index] }
                : msg
            )
          );
          index++;
        } else {
          clearInterval(interval);
          setIsLoading(false);
        }
      }, 400); // speed: one line every 0.4s
    } catch (error) {
      console.error("Gemini API error:", error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting to the AI. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="flex flex-col w-full h-auto max-h-[80vh] sm:max-h-[90vh]">
      <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Travel Assistant
          <Badge variant="secondary" className="ml-auto">
            Jharkhand Expert
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 w-full max-w-[80%] ${
                    message.sender === "user"
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  <div
                    className={`rounded-lg p-3 max-w-full break-words whitespace-pre-wrap ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 opacity-70 ${
                        message.sender === "user"
                          ? "text-white/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="p-4 border-t bg-muted/20">
            <p className="text-sm font-medium mb-2">Quick suggestions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="justify-start text-xs h-auto p-2"
                >
                  {suggestion.icon}
                  <span className="ml-2">{suggestion.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about Jharkhand travel..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
