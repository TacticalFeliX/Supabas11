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
  CreditCard,
  CheckCircle,
  Clock,
  Users,
  Scale
} from 'lucide-react';

export function RAGChatBot({ onBack, context }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with context-specific welcome message
  useEffect(() => {
    if (context) {
      const welcomeMessage = generateWelcomeMessage(context);
      setMessages([{
        id: '1',
        type: 'bot',
        content: welcomeMessage.content,
        timestamp: new Date(),
        suggestions: welcomeMessage.suggestions
      }]);
    } else {
      // Default welcome message
      setMessages([{
        id: '1',
        type: 'bot',
        content: "Hello! I'm here to provide you with specific guidance based on your complaint. <strong>What would you like to know about your next steps?</strong>",
        timestamp: new Date(),
        suggestions: [
          "What should I do immediately?",
          "What legal actions can I take?",
          "How do I preserve evidence?",
          "Who should I contact?"
        ]
      }]);
    }
  }, [context]);

  const generateWelcomeMessage = (context) => {
    const { category, subcategory, financialLoss, urgencyLevel } = context;
    
    let content = `<strong>Thank you for submitting your ${category} complaint!</strong><br/><br/>`;
    content += `Based on your specific case details, I'll provide personalized guidance for your next steps.<br/><br/>`;
    
    if (category === 'Financial Fraud') {
      content += `<strong>🏦 Immediate Financial Protection:</strong><br/>`;
      content += `• Contact your bank immediately<br/>`;
      content += `• Block affected cards/accounts<br/>`;
      content += `• Report to bank's fraud department<br/><br/>`;
    } else if (category === 'Women Safety') {
      content += `<strong>🛡️ Immediate Safety Measures:</strong><br/>`;
      content += `• Block the harasser on all platforms<br/>`;
      content += `• Save all evidence screenshots<br/>`;
      content += `• Inform trusted contacts<br/><br/>`;
    }
    
    content += `<strong>What specific guidance do you need?</strong>`;

    const suggestions = [
      "What are my immediate next steps?",
      "What legal rights do I have?",
      "How do I collect more evidence?",
      "Who else should I report this to?",
      "What compensation can I claim?",
      "How long will the process take?"
    ];

    return { content, suggestions };
  };

  const getRAGResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Context-aware responses based on complaint type
    const complaintCategory = context?.category || '';
    const hasFinancialLoss = context?.financialLoss && parseFloat(context.financialLoss) > 0;

    if (message.includes('immediate') || message.includes('next steps') || message.includes('what should')) {
      if (complaintCategory === 'Financial Fraud') {
        return {
          content: `<strong>🚨 Immediate Action Plan for Financial Fraud:</strong><br/><br/>
          
<strong>Step 1: Secure Your Finances (Next 2 Hours)</strong><br/>
• Call your bank's 24/7 fraud helpline immediately<br/>
• Request to block/freeze affected accounts and cards<br/>
• Get reference number for your fraud report<br/>
• Change all banking passwords and PINs<br/><br/>

<strong>Step 2: Official Reporting (Today)</strong><br/>
• Call Cyber Crime Helpline: 1930<br/>
• File FIR at nearest police station<br/>
• Report to bank's nodal officer<br/>
• Submit complaint on cybercrime.gov.in<br/><br/>

<strong>Step 3: Evidence Collection (Next 24 Hours)</strong><br/>
• Screenshot all transaction alerts<br/>
• Download bank statements<br/>
• Save communication with fraudsters<br/>
• Photograph physical evidence if any<br/><br/>

<strong>Timeline: Act within 24-48 hours for best recovery chances!</strong>`,
          suggestions: [
            "Which bank numbers should I call?",
            "How to file an FIR properly?",
            "What evidence is most important?",
            "Can I get my money back?"
          ]
        };
      } else if (complaintCategory === 'Women Safety') {
        return {
          content: `<strong>🛡️ Immediate Safety Action Plan:</strong><br/><br/>
          
<strong>Step 1: Ensure Your Safety (Right Now)</strong><br/>
• Block the harasser on all social media platforms<br/>
• Change privacy settings to "private/friends only"<br/>
• Don't respond to or engage with the harasser<br/>
• Inform trusted friends and family members<br/><br/>

<strong>Step 2: Legal Protection (Within 24 Hours)</strong><br/>
• File complaint under IPC Section 354D (Stalking)<br/>
• Report under IT Act Section 66E (Privacy violation)<br/>
• Consider restraining order application<br/>
• Contact Women Helpline: 181<br/><br/>

<strong>Step 3: Evidence Preservation (Ongoing)</strong><br/>
• Screenshot all threatening messages<br/>
• Record dates, times, and platforms<br/>
• Save fake profiles using your photos<br/>
• Document any offline incidents<br/><br/>

<strong>Remember: This is not your fault, and you have strong legal protection!</strong>`,
          suggestions: [
            "How to apply for restraining order?",
            "What are my legal rights?",
            "How to deal with fake profiles?",
            "Getting psychological support"
          ]
        };
      } else {
        return {
          content: `<strong>📋 General Cybercrime Response Plan:</strong><br/><br/>
          
<strong>Step 1: Immediate Protection</strong><br/>
• Change all compromised passwords<br/>
• Enable two-factor authentication<br/>
• Scan devices for malware<br/>
• Monitor accounts for suspicious activity<br/><br/>

<strong>Step 2: Official Reporting</strong><br/>
• File complaint on cybercrime.gov.in<br/>
• Call 1930 for guidance<br/>
• Visit local cyber crime police station<br/>
• Keep all reference numbers safe<br/><br/>

<strong>Step 3: Follow-up Actions</strong><br/>
• Track complaint status regularly<br/>
• Respond to police inquiries promptly<br/>
• Maintain evidence systematically<br/>
• Seek legal consultation if needed</strong>`,
          suggestions: [
            "How to track my complaint?",
            "What if police don't respond?",
            "Legal consultation options",
            "Preventing future incidents"
          ]
        };
      }
    }

    if (message.includes('legal') || message.includes('rights') || message.includes('law')) {
      return {
        content: `<strong>⚖️ Your Legal Rights & Options:</strong><br/><br/>
        
<strong>Under Information Technology Act 2000:</strong><br/>
• Section 43: Right to compensation for damages<br/>
• Section 66: Punishment for hacking (up to 3 years)<br/>
• Section 66B: Identity theft punishment<br/>
• Section 66C: Fraud using computer resources<br/>
• Section 66E: Privacy violation punishment<br/><br/>

<strong>Under Indian Penal Code:</strong><br/>
• Section 354A: Sexual harassment<br/>
• Section 354D: Stalking<br/>
• Section 420: Cheating and fraud<br/>
• Section 500: Defamation<br/>
• Section 506: Criminal intimidation<br/><br/>

<strong>Your Rights as a Victim:</strong><br/>
• Right to file complaint without jurisdiction issues<br/>
• Right to speedy investigation<br/>
• Right to compensation for losses<br/>
• Right to privacy protection<br/>
• Right to legal aid if financially unable<br/><br/>

<strong>Free Legal Aid Available:</strong><br/>
• National Legal Services Authority (NALSA)<br/>
• State Legal Services Authority<br/>
• District Legal Aid Committees</strong>`,
        suggestions: [
          "How to claim compensation?",
          "Finding free legal aid",
          "What punishment can offenders get?",
          "Filing civil suit for damages"
        ]
      };
    }

    if (message.includes('evidence') || message.includes('proof') || message.includes('collect')) {
      return {
        content: `<strong>📸 Evidence Collection Guide:</strong><br/><br/>
        
<strong>Digital Evidence (Most Important):</strong><br/>
• Screenshots with timestamps visible<br/>
• Screen recordings of suspicious activity<br/>
• Email headers and metadata<br/>
• Transaction receipts and confirmations<br/>
• Chat conversations and call logs<br/><br/>

<strong>Documentation Standards:</strong><br/>
• Don't edit or crop images<br/>
• Save original files, not copies<br/>
• Maintain chronological order<br/>
• Create backup copies securely<br/>
• Note down incident details immediately<br/><br/>

<strong>Technical Evidence:</strong><br/>
• IP addresses and server logs<br/>
• Browser history and cache<br/>
• Mobile app data and logs<br/>
• Network traffic records<br/>
• Device forensic reports<br/><br/>

<strong>Chain of Custody:</strong><br/>
• Number each piece of evidence<br/>
• Maintain detailed records<br/>
• Avoid sharing evidence on social media<br/>
• Store securely with multiple backups<br/><br/>

<strong>Pro Tip: Take photos of your screen if screenshots aren't working!</strong>`,
        suggestions: [
          "How to take legal screenshots?",
          "Preserving WhatsApp evidence",
          "Banking transaction evidence",
          "Social media evidence collection"
        ]
      };
    }

    if (message.includes('money') || message.includes('compensation') || message.includes('recover') || message.includes('refund')) {
      const lossAmount = context?.financialLoss ? `₹${parseFloat(context.financialLoss).toLocaleString()}` : '';
      
      return {
        content: `<strong>💰 Recovery & Compensation Options:</strong><br/><br/>
        
${lossAmount ? `<strong>Your Reported Loss: ${lossAmount}</strong><br/><br/>` : ''}

<strong>Immediate Recovery Steps:</strong><br/>
• Contact bank for chargeback/reversal<br/>
• File for insurance claims if applicable<br/>
• Request payment gateway to freeze funds<br/>
• Approach Reserve Bank Ombudsman<br/><br/>

<strong>Legal Compensation Routes:</strong><br/>
• Claim under IT Act Section 43 (up to ₹5 crore)<br/>
• Criminal compensation from court<br/>
• Civil suit for actual damages<br/>
• Consumer court complaint<br/><br/>

<strong>Recovery Timeline:</strong><br/>
• Bank reversals: 7-90 days<br/>
• Insurance claims: 30-180 days<br/>
• Legal compensation: 6 months-2 years<br/>
• Criminal recovery: 1-3 years<br/><br/>

<strong>Required Documentation:</strong><br/>
• Original transaction receipts<br/>
• Bank statements and communications<br/>
• Police complaint copy<br/>
• Loss calculation worksheet<br/>
• Medical bills (if applicable)<br/><br/>

<strong>Success Rate: 70% for cases reported within 48 hours!</strong>`,
        suggestions: [
          "Bank chargeback process",
          "Insurance claim procedures",
          "Consumer court filing",
          "Calculating total damages"
        ]
      };
    }

    if (message.includes('time') || message.includes('how long') || message.includes('duration')) {
      return {
        content: `<strong>⏰ Investigation Timeline & Expectations:</strong><br/><br/>
        
<strong>Initial Response:</strong><br/>
• Complaint acknowledgment: 24-48 hours<br/>
• Preliminary inquiry start: 3-7 days<br/>
• Evidence collection: 1-2 weeks<br/>
• Suspect identification: 2-4 weeks<br/><br/>

<strong>Investigation Process:</strong><br/>
• Technical analysis: 2-6 weeks<br/>
• Cross-verification: 1-3 weeks<br/>
• Legal procedure: 1-2 months<br/>
• Charge sheet filing: 2-4 months<br/><br/>

<strong>Court Proceedings:</strong><br/>
• Trial commencement: 3-6 months<br/>
• Evidence presentation: 6-12 months<br/>
• Final judgment: 1-2 years<br/>
• Appeals process: 1-3 years<br/><br/>

<strong>Factors Affecting Timeline:</strong><br/>
• Complexity of the case<br/>
• Quality of evidence provided<br/>
• Cooperation of financial institutions<br/>
• Court calendar and backlog<br/>
• Cross-state jurisdiction issues<br/><br/>

<strong>Stay Updated:</strong><br/>
• Check complaint status monthly<br/>
• Respond to police queries promptly<br/>
• Maintain regular contact with IO<br/>
• Keep all documents ready<br/><br/>

<strong>Remember: Quick reporting leads to faster resolution!</strong>`,
        suggestions: [
          "How to speed up investigation?",
          "What if there's no progress?",
          "Escalation procedures",
          "Status tracking methods"
        ]
      };
    }

    // Default contextual response
    const category = context?.category || 'cybercrime';
    return {
      content: `I understand you need help with your <strong>${category}</strong> case. <br/><br/>I have comprehensive guidance on:<br/><br/>
      
<strong>🎯 Immediate Actions:</strong> What to do right now<br/>
<strong>⚖️ Legal Procedures:</strong> Your rights and options<br/>
<strong>📋 Evidence Collection:</strong> How to preserve proof<br/>
<strong>💰 Financial Recovery:</strong> Getting your money back<br/>
<strong>⏰ Timeline Expectations:</strong> How long the process takes<br/>
<strong>📞 Contact Information:</strong> Who to reach out to<br/><br/>

<strong>What specific aspect would you like detailed guidance on?</strong>`,
      suggestions: [
        "Immediate action plan",
        "Legal rights and procedures", 
        "Evidence collection guide",
        "Financial recovery options",
        "Timeline and expectations",
        "Important contact numbers"
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

    // Simulate bot processing delay
    setTimeout(() => {
      const botResponse = getRAGResponse(content);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-medium text-slate-900">Next Steps Assistant</h1>
              <p className="text-sm text-blue-600">Personalized guidance for your case</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">RAG Powered</Badge>
          </div>
        </div>
      </div>

      {/* Context Display */}
      {context && (
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Your Complaint Context</span>
          </div>
          <div className="text-sm text-blue-800">
            <strong>Category:</strong> {context.category} - {context.subcategory}<br/>
            <strong>Priority:</strong> {context.urgencyLevel}<br/>
            {context.financialLoss && (
              <>
                <strong>Financial Loss:</strong> ₹{parseFloat(context.financialLoss).toLocaleString()}<br/>
              </>
            )}
            <strong>Status:</strong> Complaint submitted successfully
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
            {message.type === 'bot' && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
              <Card className={`${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border-blue-200'
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
                      className="text-xs h-auto py-1 px-2 border-blue-200 hover:bg-blue-50"
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
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Card className="bg-white border-blue-200">
              <CardContent className="p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
            placeholder="Ask about your next steps..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
            className="flex-1"
          />
          <Button 
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Shield className="w-3 h-3 text-blue-500" />
          <p className="text-xs text-slate-600">
            Personalized guidance based on your specific complaint details
          </p>
        </div>
      </div>
    </div>
  );
}