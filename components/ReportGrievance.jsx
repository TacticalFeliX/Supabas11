import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  FileText, 
  Image, 
  Video, 
  Mic,
  CheckCircle,
  AlertCircle,
  Camera,
  Paperclip,
  MessageCircle,
  Bot
} from 'lucide-react';

export function ReportGrievance({ user, onBack, onNavigate }) {
  const [step, setStep] = useState(1);
  const [complaintId, setComplaintId] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    incidentDate: '',
    location: '',
    suspiciousEntity: '',
    financialLoss: '',
    evidence: [],
    isAnonymous: false,
    urgencyLevel: 'medium'
  });

  const categories = {
    'Financial Fraud': [
      'UPI/Digital Wallet Fraud',
      'Credit/Debit Card Fraud',
      'Internet Banking Fraud',
      'Investment Scam',
      'Loan App Harassment',
      'Fake Trading Platforms'
    ],
    'Women Safety': [
      'Cyberstalking',
      'Morphing/Photo Manipulation',
      'Fake Profile Creation',
      'Blackmail/Sextortion',
      'Online Harassment'
    ],
    'Online Fraud': [
      'Fake Websites',
      'Phishing Emails/SMS',
      'Job/Lottery Scams',
      'Fake Social Media Profiles',
      'Online Shopping Fraud'
    ],
    'Cyberbullying': [
      'Social Media Harassment',
      'Defamation',
      'Identity Theft',
      'Revenge Porn',
      'Hate Speech'
    ],
    'Malicious Apps': [
      'Fake Apps',
      'Data Theft Apps',
      'Ransomware',
      'Spyware',
      'Adware'
    ]
  };

  const handleFileUpload = (files) => {
    if (!files) return;
    
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 
            file.type.startsWith('audio/') ? 'audio' : 'document'
    }));
    
    setFormData(prev => ({
      ...prev,
      evidence: [...prev.evidence, ...newFiles]
    }));
  };

  const removeFile = (fileId) => {
    setFormData(prev => ({
      ...prev,
      evidence: prev.evidence.filter(f => f.id !== fileId)
    }));
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = () => {
    // Generate complaint ID
    const newComplaintId = 'CR' + Date.now().toString().slice(-6);
    setComplaintId(newComplaintId);
    
    // Store in localStorage for demo
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const newComplaint = {
      ...formData,
      id: newComplaintId,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Submitted',
          date: new Date().toISOString(),
          description: 'Complaint submitted successfully',
          isCompleted: true
        }
      ]
    };
    
    complaints.push(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(complaints));
    
    setStep(4); // Success step
  };

  const handleWhatNextClick = () => {
    // Pass complaint context to RAG chatbot
    const context = {
      complaintId,
      category: formData.category,
      subcategory: formData.subcategory,
      urgencyLevel: formData.urgencyLevel,
      financialLoss: formData.financialLoss,
      hasEvidence: formData.evidence.length > 0,
      isAnonymous: formData.isAnonymous
    };
    
    onNavigate('rag-chatbot', context);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label>Complaint Category *</Label>
        <Select value={formData.category} onValueChange={(value) => 
          setFormData(prev => ({ ...prev, category: value, subcategory: '' }))
        }>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(categories).map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.category && (
        <div>
          <Label>Subcategory *</Label>
          <Select value={formData.subcategory} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, subcategory: value }))
          }>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {categories[formData.category]?.map(sub => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Incident Title *</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Brief description of the incident"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Urgency Level</Label>
        <Select value={formData.urgencyLevel} onValueChange={(value) => 
          setFormData(prev => ({ ...prev, urgencyLevel: value }))
        }>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - General inquiry</SelectItem>
            <SelectItem value="medium">Medium - Standard complaint</SelectItem>
            <SelectItem value="high">High - Urgent attention needed</SelectItem>
            <SelectItem value="critical">Critical - Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={() => setStep(2)}
        disabled={!formData.category || !formData.subcategory || !formData.title}
        className="w-full cyber-gradient text-white"
      >
        Continue
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label>Detailed Description *</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Provide detailed information about the incident, including what happened, when, and any relevant details..."
          className="mt-1 min-h-24"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Incident Date</Label>
          <Input
            type="date"
            value={formData.incidentDate}
            onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Location (Optional)</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Area in Indore"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label>Suspicious Entity (Optional)</Label>
        <Input
          value={formData.suspiciousEntity}
          onChange={(e) => setFormData(prev => ({ ...prev, suspiciousEntity: e.target.value }))}
          placeholder="Website URL, Phone number, UPI ID, App name, etc."
          className="mt-1"
        />
      </div>

      {(formData.category === 'Financial Fraud' || formData.category === 'Online Fraud') && (
        <div>
          <Label>Financial Loss (₹)</Label>
          <Input
            type="number"
            value={formData.financialLoss}
            onChange={(e) => setFormData(prev => ({ ...prev, financialLoss: e.target.value }))}
            placeholder="Amount lost (if any)"
            className="mt-1"
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          checked={formData.isAnonymous}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAnonymous: checked }))}
        />
        <Label className="text-sm">Report anonymously</Label>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={() => setStep(3)}
          disabled={!formData.description}
          className="flex-1 cyber-gradient text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label>Upload Evidence (Optional)</Label>
        <p className="text-sm text-slate-600 mt-1">
          You can upload screenshots, documents, audio recordings, or videos as evidence
        </p>
        
        <div className="mt-3 space-y-3">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="text-sm"
              >
                <Paperclip className="w-4 h-4 mr-1" />
                Choose Files
              </Button>
              <p className="text-xs text-slate-500">
                Max 10MB per file. Supported: Images, Videos, Audio, PDF, DOC
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Uploaded Files */}
          {formData.evidence.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files ({formData.evidence.length})</Label>
              {formData.evidence.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Camera className="w-3 h-3 mr-1" />
              Take Photo
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Mic className="w-3 h-3 mr-1" />
              Record Audio
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-800">
            <p className="font-medium">Evidence Guidelines</p>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Capture clear screenshots of messages, websites, or apps</li>
              <li>Record phone calls (if legally permitted)</li>
              <li>Save bank statements or transaction receipts</li>
              <li>Keep original files - don't edit or modify evidence</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex-1 cyber-gradient text-white">
          Submit Complaint
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="font-medium text-slate-900">Complaint Submitted Successfully!</h3>
        <p className="text-sm text-slate-600 mt-1">
          Your complaint has been registered and assigned ID: <strong>{complaintId}</strong>
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
        <h4 className="font-medium text-blue-900 text-sm">What happens next?</h4>
        <ul className="text-xs text-blue-800 mt-2 space-y-1">
          <li>• Your complaint will be reviewed within 24-48 hours</li>
          <li>• You'll receive SMS/email updates on progress</li>
          <li>• Investigation may take 7-15 days depending on complexity</li>
          <li>• You can track status anytime in the app</li>
        </ul>
      </div>

      {/* What do I do next feature */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Bot className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Need guidance on next steps?</h4>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            <strong>Get personalized advice based on your specific complaint type</strong>
          </p>
          <Button 
            onClick={handleWhatNextClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <strong>What Should I Do Next?</strong>
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back to Home
        </Button>
        <Button onClick={() => onNavigate('chatbot')} variant="outline" className="flex-1">
          <MessageCircle className="w-4 h-4 mr-1" />
          Learning Bot
        </Button>
        <Button onClick={() => setStep(1)} className="flex-1 cyber-gradient text-white">
          File Another
        </Button>
      </div>
    </div>
  );

  const progressValue = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="font-medium text-slate-900">Report Grievance</h1>
              <p className="text-sm text-slate-600">
                Step {step} of 4 - File your cybercrime complaint
              </p>
            </div>
          </div>
          <Progress value={progressValue} className="mt-3" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">
              {step === 1 && 'Complaint Category'}
              {step === 2 && 'Incident Details'}
              {step === 3 && 'Evidence & Submission'}
              {step === 4 && 'Submission Complete'}
            </h2>
          </CardHeader>
          <CardContent>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}