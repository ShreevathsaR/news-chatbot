import { useState, useRef, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card } from "./components/ui/card";
import { ThemeProvider } from "./components/theme-provider";
import { MessageCircle, Send, RefreshCw } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import api from "./lib/api";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let id = localStorage.getItem("sessionId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("sessionId", id);
    }
    setSessionId(id);
    console.log("Stored Session ID:", id);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const getHistory = async () => {
      try {
        const response = await api.get(`/chat/history?sessionId=${sessionId}`);
        if (response.data.messages) setMessages(response.data.messages);
      } catch (error) {
        console.log("Error getting history", error);
      }
    };
    getHistory();
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.post("/chat/query", {
        query: input,
        sessionId,
      });

      console.log("Bot reply", response.data.answer);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.answer || "Sorry, I couldn't find an answer.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Something went wrong while fetching the response.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await api.delete(`/chat/history?sessionId=${sessionId}`);
      console.log("response", response);  
      setMessages([]);
    } catch (err) {
      console.error("Error resetting chat:", err);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="flex flex-col min-h-screen bg-[#000000]">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#111111] border-b border-[#333333]">
          <div className="container flex items-center justify-between h-16 px-4 mx-auto">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">News Assistant</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center space-x-1 border-[#333333] text-white hover:bg-[#222222]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
          <div className="flex flex-col space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-[80%] md:max-w-[70%] p-3 border-0 ${
                    message.sender === "user"
                      ? "bg-[#333333] text-white"
                      : "bg-[#111111] text-[#f1f1f1]"
                  }`}
                >
                  <p className="text-sm md:text-base">{message.content}</p>
                </Card>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Card className="max-w-[80%] md:max-w-[70%] p-3 bg-[#111111] text-[#f1f1f1] border-0">
                  <p className="text-sm md:text-base">Typing...</p>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-0 bg-[#111111] border-t border-[#333333] p-4">
          <div className="container mx-auto">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#222222] border-[#333333] text-white placeholder:text-[#888888] focus-visible:ring-[#444444]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={input.trim() === "" || isLoading}
                className="bg-white text-black hover:bg-[#e0e0e0]"
              >
                <Send className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
