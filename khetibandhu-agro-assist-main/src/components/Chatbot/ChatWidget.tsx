import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Custom AgroBot Icon Component
const AgroBotIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="agro-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="50%" stopColor="#06d6a0" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/> 
        </feMerge>
      </filter>
    </defs>
    
    {/* Outer circuit ring */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#agro-gradient)" strokeWidth="2" opacity="0.8"/>
    <circle cx="20" cy="30" r="2" fill="#10b981"/>
    <circle cx="80" cy="25" r="2" fill="#10b981"/>
    <circle cx="85" cy="60" r="2" fill="#10b981"/>
    <circle cx="15" cy="70" r="2" fill="#10b981"/>
    
    {/* Inner circuit ring */}
    <circle cx="50" cy="50" r="35" fill="none" stroke="url(#agro-gradient)" strokeWidth="1.5" opacity="0.6"/>
    <circle cx="30" cy="20" r="1.5" fill="#06d6a0"/>
    <circle cx="70" cy="20" r="1.5" fill="#06d6a0"/>
    <circle cx="80" cy="50" r="1.5" fill="#06d6a0"/>
    <circle cx="70" cy="80" r="1.5" fill="#06d6a0"/>
    <circle cx="30" cy="80" r="1.5" fill="#06d6a0"/>
    <circle cx="20" cy="50" r="1.5" fill="#06d6a0"/>
    
    {/* Central plant/leaf design */}
    <g transform="translate(50,50)" filter="url(#glow)">
      {/* Main stem */}
      <line x1="0" y1="15" x2="0" y2="-15" stroke="url(#agro-gradient)" strokeWidth="3" strokeLinecap="round"/>
      
      {/* Left leaf */}
      <path d="M 0,-10 Q -12,-8 -15,0 Q -12,8 0,5" fill="url(#agro-gradient)" opacity="0.9"/>
      
      {/* Right leaf */}
      <path d="M 0,-10 Q 12,-8 15,0 Q 12,8 0,5" fill="url(#agro-gradient)" opacity="0.9"/>
      
      {/* Bottom leaves */}
      <path d="M 0,5 Q -8,12 -12,18 Q -6,20 0,15" fill="url(#agro-gradient)" opacity="0.7"/>
      <path d="M 0,5 Q 8,12 12,18 Q 6,20 0,15" fill="url(#agro-gradient)" opacity="0.7"/>
    </g>
    
    {/* Circuit connections */}
    <path d="M 20,30 Q 30,25 40,35" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5"/>
    <path d="M 80,25 Q 70,30 60,35" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5"/>
    <path d="M 85,60 Q 75,65 65,60" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5"/>
    <path d="M 15,70 Q 25,65 35,65" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5"/>
  </svg>
);

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'नमस्ते! मैं KhetiBandhu का सहायक हूं। मैं आपकी खेती से जुड़ी समस्याओं में मदद कर सकता हूं।',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'or'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // API call to Django backend (new unified endpoint)
      const base = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';
      const response = await fetch(`${base}/api/chatbot/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          user_id: 'anonymous', // Replace with actual user ID from auth context
          language
        })
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || data.response || 'मुझे खुशी है कि आपने संपर्क किया। कृपया फिर से प्रयास करें।',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat API error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'क्षमा करें, अभी कुछ तकनीकी समस्या है। कृपया बाद में प्रयास करें।',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Floating Chat Button with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "h-16 w-16 rounded-full shadow-xl transition-all duration-300 hover:scale-110",
                "bg-white text-emerald-600",
                "border border-emerald-200",
                "hover:bg-emerald-50",
                isOpen && "scale-95"
              )}
              size="icon"
            >
              {isOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <AgroBotIcon className="h-10 w-10" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            sideOffset={8}
            className={cn(
              "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white",
              "border border-emerald-300/30 shadow-2xl rounded-xl px-4 py-3",
              "animate-in fade-in-0 zoom-in-95 duration-200",
              "before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2",
              "before:border-4 before:border-transparent before:border-t-emerald-500"
            )}
          >
            <div className="flex items-center gap-2 font-semibold text-sm">
              <div className="animate-pulse">🌱</div>
              <span className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                Ask Sathi!
              </span>
              <div className="animate-bounce">💬</div>
            </div>
            <div className="text-xs text-emerald-100 mt-1 font-medium">
              आपका कृषि सहायक
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Chat Interface */}
        {isOpen && (
          <div className={cn(
            "absolute bottom-20 right-0 w-80 h-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl",
            "border border-emerald-200/50 overflow-hidden",
            "animate-in slide-in-from-bottom-4 fade-in-0 zoom-in-95 duration-300",
            "dark:bg-slate-900/95 dark:border-slate-700/50"
          )}>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-4 animate-pulse">🌾</div>
                <div className="absolute top-6 right-6 animate-bounce" style={{ animationDelay: '0.5s' }}>🌱</div>
                <div className="absolute bottom-2 left-12 animate-pulse" style={{ animationDelay: '1s' }}>🌿</div>
              </div>
              
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 relative z-10">
                <AgroBotIcon className="h-6 w-6" />
              </div>
              <div className="relative z-10 flex-1">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  KhetiBandhu सहायक
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full border border-white/30">AI</span>
                </h3>
                <p className="text-xs text-emerald-100 font-medium">कृषि विशेषज्ञ • 24/7 उपलब्ध</p>
              </div>
              {/* Language selector */}
              <div className="relative z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white/20 border-white/40 text-white hover:bg-white/30">
                      <Languages className="h-4 w-4 mr-1" />
                      {language.toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('hi')}>हिन्दी</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('or')}>ଓଡ଼ିଆ</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 h-64 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.sender === 'bot' && (
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-3 w-3 text-emerald-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                        message.sender === 'user'
                          ? "bg-emerald-500 text-white rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      )}
                    >
                      {message.text}
                    </div>
                    {message.sender === 'user' && (
                      <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-emerald-600" />
                    </div>
                    <div className="bg-muted text-foreground rounded-lg rounded-bl-none px-3 py-2 text-sm">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-t border-emerald-200/30">
              <div className="flex gap-3 items-center">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="अपना सवाल पूछें... 🌱"
                    className={cn(
                      "text-sm pr-12 border-2 border-emerald-200/50 rounded-xl",
                      "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20",
                      "bg-white/80 backdrop-blur-sm placeholder:text-emerald-600/60",
                      "transition-all duration-200 hover:border-emerald-300"
                    )}
                    disabled={isLoading}
                  />
                  {/* Decorative plant icon inside input */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400/60">
                    🌿
                  </div>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className={cn(
                    "h-10 w-10 rounded-full transition-all duration-300",
                    "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600",
                    "hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700",
                    "shadow-lg hover:shadow-emerald-500/30 hover:scale-110",
                    "disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none",
                    isLoading && "animate-pulse"
                  )}
                  size="icon"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-4 w-4 text-white" />
                  )}
                </Button>
              </div>
              
              {/* Typing indicator hint */}
              <div className="mt-2 text-xs text-emerald-600/70 text-center flex items-center justify-center gap-1">
                <span>🚀</span>
                <span>Press Enter to send</span>
                <span>•</span>
                
               
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};