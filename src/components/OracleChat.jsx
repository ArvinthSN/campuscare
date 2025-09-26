import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SendIcon, BotIcon, UserIcon, SparklesIcon } from 'lucide-react';

const OracleChat = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'oracle',
      text: "Hello! I'm your Oracle, here to provide support and guidance on your mental wellness journey. How are you feeling today? Remember, everything you share here is completely private and secure. 🌟",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulated Oracle responses (replace with real AI integration)
  const getOracleResponse = async (userMessage) => {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const responses = {
      anxiety: [
        "I understand you're feeling anxious. Try taking three deep breaths with me: breathe in for 4 counts, hold for 4, then breathe out for 6. Remember, anxiety is temporary and you have the strength to work through it. 🌸",
        "Anxiety can feel overwhelming, but you're not alone. Let's try grounding yourself: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This can help bring you back to the present moment.",
        "When anxiety visits, remember it's your mind trying to protect you. Acknowledge the feeling: 'I notice I'm feeling anxious.' Then ask yourself: 'What do I need right now?' Maybe it's rest, support, or simply being kind to yourself."
      ],
      stress: [
        "Stress is a sign that you care deeply about things. That's beautiful, but let's find ways to manage it. Have you tried progressive muscle relaxation? Start by tensing and then releasing each muscle group, beginning with your toes. 🧘‍♀️",
        "I hear that you're feeling stressed. Remember, you don't have to carry everything at once. What's one small thing you could do right now to take care of yourself? Even drinking a glass of water mindfully can be a gift to yourself.",
        "Stress often comes from feeling like we have too much to do and not enough time. Let's break it down: what's the most important thing you need to focus on right now? Sometimes clarity comes from simplifying."
      ],
      sad: [
        "It's okay to feel sad. Sadness is a natural part of the human experience and it shows your capacity to feel deeply. Would you like to talk about what's weighing on your heart? I'm here to listen without judgment. 💙",
        "Sadness can feel heavy, but remember that feelings are like weather - they pass through us. You don't have to feel better right now, just be present with what you're experiencing. You're brave for feeling.",
        "When we're sad, it can help to practice self-compassion. Imagine comforting a dear friend going through the same thing - what would you say to them? Can you offer that same kindness to yourself?"
      ],
      default: [
        "Thank you for sharing with me. Your feelings are valid, and it takes courage to acknowledge them. What would be most helpful for you right now - would you like some coping strategies, a listening ear, or perhaps some encouraging words? 🌟",
        "I'm here to support you on your wellness journey. Remember, seeking help and talking about your feelings is a sign of strength, not weakness. What's on your mind today?",
        "Every step you take toward understanding and caring for your mental health matters. You're doing important work by being here and being honest about your experiences. How can I best support you today?",
        "Mental wellness is a journey, not a destination. It's normal to have ups and downs. What matters is that you're here, you're trying, and you're not giving up on yourself. That's something to be proud of. ✨"
      ]
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('panic')) {
      return responses.anxiety[Math.floor(Math.random() * responses.anxiety.length)];
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      return responses.stress[Math.floor(Math.random() * responses.stress.length)];
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || lowerMessage.includes('upset')) {
      return responses.sad[Math.floor(Math.random() * responses.sad.length)];
    } else {
      return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const typingMessage = {
      id: 'typing',
      sender: 'oracle',
      text: 'Oracle is thinking...',
      time: '',
      typing: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const oracleText = await getOracleResponse(trimmed);
      
      setMessages(prev => {
        const withoutTyping = prev.filter(m => m.id !== 'typing');
        return [...withoutTyping, {
          id: Date.now().toString(),
          sender: 'oracle',
          text: oracleText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }];
      });
    } catch (error) {
      setMessages(prev => {
        const withoutTyping = prev.filter(m => m.id !== 'typing');
        return [...withoutTyping, {
          id: Date.now().toString(),
          sender: 'oracle',
          text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. Remember, you can always reach out to a counselor or trusted friend if you need immediate support. 💜",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }];
      });
      
      toast({
        title: "Connection Issue",
        description: "Unable to reach Oracle. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const quickMessages = [
    "I'm feeling anxious today",
    "I need help with stress",
    "Can you guide me through breathing exercises?",
    "I'm having trouble sleeping",
    "I feel overwhelmed with school"
  ];

  const sendQuickMessage = (message) => {
    setInput(message);
    setTimeout(() => sendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">
          Oracle Chat
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your AI companion for mental wellness support — completely anonymous and secure.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            🔒 100% Private
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            💬 24/7 Available
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            ✨ AI-Powered
          </Badge>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="glass h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <BotIcon className="w-5 h-5 text-primary" />
            Chat with Oracle
            {loading && <SparklesIcon className="w-4 h-4 text-primary animate-spin" />}
          </CardTitle>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  message.sender === 'user' 
                    ? 'bg-gradient-purple-pink' 
                    : 'bg-gradient-teal-blue'
                }`}>
                  {message.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <BotIcon className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-purple-pink text-white'
                    : message.typing
                    ? 'bg-muted animate-pulse'
                    : 'bg-card border'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                  </p>
                  {message.time && (
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.time}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </CardContent>

        {/* Quick Messages */}
        <div className="px-4 py-2 border-t bg-muted/20">
          <div className="flex flex-wrap gap-2">
            {quickMessages.map((msg, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => sendQuickMessage(msg)}
                disabled={loading}
                className="text-xs hover:bg-gradient-wellness hover:text-white transition-all"
              >
                {msg}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Share what's on your mind... completely anonymous"
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-purple-pink text-white hover:opacity-90"
            >
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • Your messages are private and not stored
          </p>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium text-primary">Important Note</h3>
            <p className="text-sm text-muted-foreground">
              Oracle provides supportive guidance but is not a replacement for professional mental health care. 
              If you're experiencing a crisis or having thoughts of self-harm, please contact a crisis helpline 
              or emergency services immediately.
            </p>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <span>📞 Crisis Text Line: Text HOME to 741741</span>
              <span>🆘 Emergency: 988 or 911</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OracleChat;
