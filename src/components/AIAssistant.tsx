import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MapPin, 
  Calendar,
  Utensils,
  Camera,
  Route
} from 'lucide-react';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion';
}

const suggestions = [
  { icon: <MapPin className="w-4 h-4" />, text: "Best places to visit in Ranchi", category: "destinations" },
  { icon: <Calendar className="w-4 h-4" />, text: "Plan a 3-day itinerary", category: "itinerary" },
  { icon: <Utensils className="w-4 h-4" />, text: "Traditional food recommendations", category: "food" },
  { icon: <Route className="w-4 h-4" />, text: "How to reach Hundru Falls?", category: "transport" },
  { icon: <Camera className="w-4 h-4" />, text: "Best photography spots", category: "activities" },
];

export const AIAssistant = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Jharkhand travel assistant. I can help you plan your trip, recommend places to visit, suggest local food, and answer any questions about traveling in Jharkhand. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
  if (!content.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    content,
    sender: 'user',
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsLoading(true);

  try {
    // ✅ Call Gemini instead of Supabase
    const result = await model.generateContent(content);
    const response = result.response.text();

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    console.error('Gemini API error:', error);

    // fallback response
    const fallbackMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: getDefaultResponse(content),
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, fallbackMessage]);
  } finally {
    setIsLoading(false);
  }
};


  const getDefaultResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('ranchi')) {
      return "Ranchi is the capital of Jharkhand and offers great attractions like Tagore Hill, Rock Garden, and Kanke Dam. The city is also a gateway to many waterfalls and natural spots. Would you like specific recommendations for places to visit in Ranchi?";
    }
    
    if (lowercaseMessage.includes('waterfall')) {
      return "Jharkhand is famous for its beautiful waterfalls! Some must-visit ones include Hundru Falls (98m high), Jonha Falls, Dassam Falls, and Hirni Falls. Each offers unique beauty and trekking opportunities. Which waterfall interests you most?";
    }
    
    if (lowercaseMessage.includes('food') || lowercaseMessage.includes('eat')) {
      return "Jharkhand's cuisine is rich and diverse! Try traditional dishes like Litti Chokha, Dhuska, Rugra (mushroom curry), and Handia (rice beer). Local street food and tribal cuisine offer authentic flavors. Would you like restaurant recommendations?";
    }
    
    if (lowercaseMessage.includes('itinerary') || lowercaseMessage.includes('plan')) {
      return "I can help you plan a perfect Jharkhand itinerary! For a 3-day trip, I'd suggest: Day 1 - Explore Ranchi city, Day 2 - Visit waterfalls like Hundru and Jonha, Day 3 - Cultural sites and local markets. How many days are you planning to stay?";
    }
    
    if (lowercaseMessage.includes('transport') || lowercaseMessage.includes('reach')) {
      return "Jharkhand is well-connected by air, rail, and road. Ranchi airport connects to major cities. Train services are extensive. Local transport includes buses, taxis, and auto-rickshaws. Which specific destination do you need transport information for?";
    }
    
    return "I'd be happy to help you explore Jharkhand! While my AI capabilities are currently being set up, I can still provide information about destinations, food, transportation, and help plan your itinerary. Feel free to ask specific questions about places to visit, local culture, or travel tips for Jharkhand.";
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Travel Assistant
          <Badge variant="secondary" className="ml-auto">
            Jharkhand Expert
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' ? 'bg-primary text-white' : 'bg-muted'
                  }`}>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 opacity-70 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
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