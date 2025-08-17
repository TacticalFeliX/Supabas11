import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Shield, 
  Phone, 
  AlertTriangle,
  FileText,
  MessageCircle,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Lock,
  CreditCard
} from 'lucide-react';

export function ChatBot({ onBack }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm CyberBot, your cybercrime learning assistant. 📚<br/><br/>I'm here to help you learn about:<br/><br/><strong>🛡️ Cybercrime Prevention</strong><br/><strong>📖 Cyber Laws & Rights</strong><br/><strong>🔍 Fraud Detection Techniques</strong><br/><strong>💡 Safety Best Practices</strong><br/><strong>⚖️ Legal Procedures</strong><br/><strong>🚨 Emergency Protocols</strong><br/><br/><strong>What would you like to learn about today?</strong>",
      timestamp: new Date(),
      suggestions: [
        "How do cybercriminals operate?",
        "What are my legal rights?",
        "How to identify phishing attempts?",
        "Best practices for online safety"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [learningProgress, setLearningProgress] = useState({
    basics: 3,
    advanced: 1,
    legal: 2,
    prevention: 4
  });
  const messagesEndRef = useRef(null);

  const learningTopics = [
    {
      icon: Shield,
      title: "Cybercrime Basics",
      progress: learningProgress.basics,
      total: 5,
      question: "What are the most common types of cybercrime?"
    },
    {
      icon: Lock,
      title: "Prevention Techniques",
      progress: learningProgress.prevention,
      total: 5,
      question: "How can I protect myself online?"
    },
    {
      icon: GraduationCap,
      title: "Legal Knowledge",
      progress: learningProgress.legal,
      total: 5,
      question: "What cyber laws protect me in India?"
    },
    {
      icon: AlertTriangle,
      title: "Advanced Threats",
      progress: learningProgress.advanced,
      total: 5,
      question: "What are emerging cyber threats?"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('common') && message.includes('cybercrime')) {
      return {
        content: "<strong>📊 Most Common Cybercrimes in India:</strong><br/><br/>1. <strong>Financial Frauds (65%)</strong><br/>   • UPI/Digital wallet frauds<br/>   • Credit card scams<br/>   • Investment frauds<br/>   • Loan app harassment<br/><br/>2. <strong>Online Harassment (20%)</strong><br/>   • Cyberstalking<br/>   • Fake profiles<br/>   • Morphing/deepfakes<br/>   • Sextortion<br/><br/>3. <strong>Phishing & Scams (10%)</strong><br/>   • Fake websites<br/>   • Email phishing<br/>   • SMS scams<br/>   • Job frauds<br/><br/>4. <strong>Ransomware & Malware (5%)</strong><br/>   • Data encryption attacks<br/>   • Banking trojans<br/>   • Spyware<br/>   • Fake apps<br/><br/><strong>📈 Trending:</strong> AI-powered scams, deepfake videos, crypto frauds",
        suggestions: [
          "How do financial frauds work?",
          "Signs of online harassment",
          "How to spot phishing attempts?",
          "Latest cybercrime trends"
        ]
      };
    }
    
    if (message.includes('financial') && (message.includes('fraud') || message.includes('work'))) {
      return {
        content: "<strong>💰 How Financial Cyber Frauds Work:</strong><br/><br/><strong>Phase 1: Target Selection</strong><br/>• Social engineering research<br/>• Data harvesting from breaches<br/>• Targeting vulnerable demographics<br/>• Mass messaging campaigns<br/><br/><strong>Phase 2: Initial Contact</strong><br/>• Fake customer service calls<br/>• Phishing emails/SMS<br/>• Social media friend requests<br/>• Fake investment opportunities<br/><br/><strong>Phase 3: Trust Building</strong><br/>• Impersonating legitimate entities<br/>• Creating urgency/fear<br/>• Offering attractive returns<br/>• Sharing fake credentials<br/><br/><strong>Phase 4: The Scam</strong><br/>• Requesting OTP/PIN<br/>• Fake payment links<br/>• Screen sharing for 'help'<br/>• Investment in fake schemes<br/><br/><strong>🚨 Remember: Banks NEVER ask for OTP over calls!</strong>",
        suggestions: [
          "How to verify legitimate calls?",
          "What to do if I shared my OTP?",
          "How to identify fake investment schemes?",
          "UPI safety tips"
        ]
      };
    }
    
    if (message.includes('legal') && (message.includes('rights') || message.includes('laws') || message.includes('protect'))) {
      return {
        content: "<strong>⚖️ Your Legal Rights Under Indian Cyber Laws:</strong><br/><br/><strong>Information Technology Act 2000:</strong><br/>• Section 43: Compensation for damages<br/>• Section 66: Hacking punishment (3 years + fine)<br/>• Section 66B: Identity theft (3 years + ₹1 lakh)<br/>• Section 66C: Fraud using computer (3 years + ₹1 lakh)<br/>• Section 66D: Cheating by impersonation (3 years + ₹1 lakh)<br/>• Section 66E: Privacy violation (3 years + ₹2 lakh)<br/><br/><strong>Indian Penal Code Sections:</strong><br/>• 354A: Sexual harassment<br/>• 354C: Voyeurism<br/>• 354D: Stalking<br/>• 420: Cheating<br/>• 506: Criminal intimidation<br/><br/><strong>Your Rights:</strong><br/>✅ Right to compensation<br/>✅ Right to privacy<br/>✅ Right to speedy investigation<br/>✅ Right to legal representation<br/>✅ Right to victim protection",
        suggestions: [
          "How to file a legal complaint?",
          "What compensation can I get?",
          "Women-specific cyber laws",
          "How to get legal aid?"
        ]
      };
    }
    
    if (message.includes('phishing') || message.includes('spot') || message.includes('identify')) {
      return {
        content: "<strong>🎣 Master Guide to Spotting Phishing:</strong><br/><br/><strong>Email Red Flags:</strong><br/>🚩 Generic greetings (\"Dear Customer\")<br/>🚩 Urgent action required<br/>🚩 Grammar/spelling mistakes<br/>🚩 Suspicious sender addresses<br/>🚩 Unexpected attachments<br/><br/><strong>SMS Red Flags:</strong><br/>🚩 Unknown senders with official names<br/>🚩 Links to claim money/prizes<br/>🚩 Requests for bank details<br/>🚩 Threats of account closure<br/><br/><strong>Website Red Flags:</strong><br/>🚩 No HTTPS (lock symbol missing)<br/>🚩 Slight spelling changes in URLs<br/>🚩 Poor design/quality<br/>🚩 Asking for excessive information<br/><br/><strong>Voice Call Red Flags:</strong><br/>🚩 Asking for OTP/PIN<br/>🚩 Pressure to act immediately<br/>🚩 Offering unrealistic rewards<br/>🚩 Requesting screen sharing<br/><br/><strong>🔍 Pro Tip:</strong> Hover over links (don't click) to see real destination!",
        suggestions: [
          "How to verify suspicious links?",
          "What if I clicked a phishing link?",
          "How to report phishing attempts?",
          "Browser security settings"
        ]
      };
    }
    
    if (message.includes('online safety') || message.includes('best practices') || message.includes('protect myself')) {
      return {
        content: "<strong>🛡️ Ultimate Online Safety Guide:</strong><br/><br/><strong>Password Security:</strong><br/>• Use 12+ characters with mixed case, numbers, symbols<br/>• Unique passwords for each account<br/>• Enable 2-factor authentication everywhere<br/>• Use password managers (Google, Bitwarden)<br/><br/><strong>Social Media Safety:</strong><br/>• Check privacy settings monthly<br/>• Don't share personal details publicly<br/>• Be cautious with friend requests<br/>• Avoid geo-tagging sensitive locations<br/><br/><strong>Financial Safety:</strong><br/>• Never share OTP, PIN, CVV with anyone<br/>• Use official banking apps only<br/>• Enable transaction alerts<br/>• Regular account monitoring<br/><br/><strong>Device Security:</strong><br/>• Keep software updated<br/>• Use reputable antivirus<br/>• Avoid public Wi-Fi for sensitive tasks<br/>• Regular backup of important data<br/><br/><strong>Communication Safety:</strong><br/>• Verify caller identity independently<br/>• Be skeptical of too-good-to-be-true offers<br/>• Don't click suspicious links<br/>• Report and block suspicious contacts",
        suggestions: [
          "Two-factor authentication setup",
          "How to use password managers?",
          "Social media privacy settings",
          "Safe online shopping tips"
        ]
      };
    }
    
    // Learning progress tracking
    if (message.includes('otp') || message.includes('shared')) {
      setLearningProgress(prev => ({ ...prev, basics: Math.min(prev.basics + 1, 5) }));
    }
    
    // Default learning-focused response
    return {
      content: "<strong>🤔 I'd love to help you learn about that topic!</strong><br/><br/>Here are some popular learning areas:<br/><br/><strong>📚 Cybercrime Education:</strong><br/>• Understanding different types of cybercrimes<br/>• How criminals operate and think<br/>• Real case studies and examples<br/><br/><strong>🔒 Prevention Strategies:</strong><br/>• Personal security best practices<br/>• Technical protection measures<br/>• Behavioral safety tips<br/><br/><strong>⚖️ Legal Knowledge:</strong><br/>• Your rights under cyber laws<br/>• How to seek legal remedy<br/>• Understanding complaint procedures<br/><br/><strong>🚨 Emergency Response:</strong><br/>• What to do if you're targeted<br/>• Evidence collection techniques<br/>• Recovery procedures<br/><br/><strong>What specific aspect interests you most?</strong>",
      suggestions: [
        "Teach me about social engineering",
        "How do ransomware attacks work?",
        "What are my rights as a victim?",
        "Emergency response procedures"
      ]
    };
  };

  const sendMessage = (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(content);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleTopicClick = (question) => {
    sendMessage(question);
  };

  const totalProgress = Object.values(learningProgress).reduce((sum, val) => sum + val, 0);
  const maxProgress = Object.keys(learningProgress).length * 5;
  const overallProgress = Math.round((totalProgress / maxProgress) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-medium text-slate-900">CyberBot Learning Assistant</h1>
              <p className="text-sm text-green-600">Online • Ready to teach</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600">Learning Progress</p>
              <p className="text-sm font-medium text-purple-600">{overallProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Topics */}
      {messages.length <= 1 && (
        <div className="p-4 bg-white border-b">
          <h3 className="text-sm font-medium text-slate-900 mb-3">Learning Topics</h3>
          <div className="grid grid-cols-1 gap-3">
            {learningTopics.map((topic, index) => {
              const Icon = topic.icon;
              const progress = (topic.progress / topic.total) * 100;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 flex items-center gap-3 text-left hover:bg-purple-50"
                  onClick={() => handleTopicClick(topic.question)}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-blue-100 text-blue-600' :
                    index === 1 ? 'bg-green-100 text-green-600' :
                    index === 2 ? 'bg-purple-100 text-purple-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{topic.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">{topic.progress}/{topic.total}</span>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
            {message.type === 'bot' && (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
              <Card className={`${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border-purple-200'
              }`}>
                <CardContent className="p-3">
                  <div 
                    className="text-sm whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </CardContent>
              </Card>
              
              {message.suggestions && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1 px-2 border-purple-200 hover:bg-purple-50"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Lightbulb className="w-3 h-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {message.type === 'user' && (
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Card className="bg-white border-purple-200">
              <CardContent className="p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about cybersecurity..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
            className="flex-1"
          />
          <Button 
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <BookOpen className="w-3 h-3 text-purple-500" />
          <p className="text-xs text-slate-600">
            Learn about cybercrimes, prevention techniques, legal rights, and safety measures
          </p>
        </div>
      </div>
    </div>
  );
}