import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  AlertTriangle,
  Camera,
  Paperclip,
  Globe,
  Smartphone,
  CreditCard,
  Phone,
  User,
  Link
} from 'lucide-react';
import { complaintsService } from '../utils/complaints';

export function ReportSuspicious({ user, onBack }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    entityType: '',
    entityValue: '',
    suspicionReason: '',
    description: '',
    riskLevel: 'medium',
    encounteredWhere: '',
    additionalInfo: '',
    evidence: []
  });

  const entityTypes = {
    'Website/URL': {
      icon: Globe,
      placeholder: 'https://suspicious-site.com',
      examples: ['Fake e-commerce sites', 'Phishing websites', 'Fake news sites', 'Malicious downloads']
    },
    'Mobile App': {
      icon: Smartphone,
      placeholder: 'App Name or Package ID',
      examples: ['Fake banking apps', 'Data stealing apps', 'Fake government apps', 'Malicious games']
    },
    'Phone Number': {
      icon: Phone,
      placeholder: '+91-9876543210',
      examples: ['Scam callers', 'Fake customer service', 'Extortion calls', 'Fake lottery calls']
    },
    'UPI ID': {
      icon: CreditCard,
      placeholder: 'suspicious@paytm',
      examples: ['Fake merchant UPI', 'Scammer payment IDs', 'Money mule accounts']
    },
    'Social Media Profile': {
      icon: User,
      placeholder: 'Username or Profile Link',
      examples: ['Fake profiles', 'Romance scammers', 'Impersonation accounts', 'Fraud promoters']
    },
    'Email Address': {
      icon: Link,
      placeholder: 'suspicious@example.com',
      examples: ['Phishing emails', 'Fake support emails', 'Spam senders', 'Scam promoters']
    }
  };

  const suspicionReasons = [
    'Asking for personal information',
    'Requesting money/payments',
    'Too good to be true offers',
    'Threatening/intimidating behavior',
    'Impersonating legitimate entity',
    'Suspicious links/downloads',
    'Fake reviews/ratings',
    'Poor grammar/spelling',
    'Pressure to act quickly',
    'Unsolicited contact',
    'Other (specify in description)'
  ];

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

  const handleSubmit = async () => {
    try {
      const result = await complaintsService.reportSuspiciousEntity({
        ...formData,
        userId: user.userId
      });

      if (result.success) {
        setStep(4); // Success step
      } else {
        alert('Failed to submit report: ' + result.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Network error. Please try again.');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label>What type of suspicious entity?</Label>
        <Select value={formData.entityType} onValueChange={(value) => 
          setFormData(prev => ({ ...prev, entityType: value, entityValue: '' }))
        }>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select entity type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(entityTypes).map(type => {
              const Icon = entityTypes[type].icon;
              return (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {type}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {formData.entityType && (
        <>
          <div>
            <Label>{formData.entityType} Details</Label>
            <Input
              value={formData.entityValue}
              onChange={(e) => setFormData(prev => ({ ...prev, entityValue: e.target.value }))}
              placeholder={entityTypes[formData.entityType].placeholder}
              className="mt-1"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Common Examples:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              {entityTypes[formData.entityType].examples.map((example, index) => (
                <li key={index}>• {example}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div>
        <Label>Risk Level Assessment</Label>
        <Select value={formData.riskLevel} onValueChange={(value) => 
          setFormData(prev => ({ ...prev, riskLevel: value }))
        }>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - Mildly suspicious</SelectItem>
            <SelectItem value="medium">Medium - Likely threat</SelectItem>
            <SelectItem value="high">High - Clear threat</SelectItem>
            <SelectItem value="critical">Critical - Immediate danger</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={() => setStep(2)}
        disabled={!formData.entityType || !formData.entityValue}
        className="w-full cyber-gradient text-white"
      >
        Continue
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label>Why is this suspicious? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {suspicionReasons.map((reason, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50">
              <input 
                type="checkbox" 
                id={`reason-${index}`}
                checked={formData.suspicionReason.includes(reason)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      suspicionReason: prev.suspicionReason ? `${prev.suspicionReason}, ${reason}` : reason
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      suspicionReason: prev.suspicionReason.split(', ').filter(r => r !== reason).join(', ')
                    }));
                  }
                }}
                className="rounded"
              />
              <label htmlFor={`reason-${index}`} className="text-sm cursor-pointer flex-1">
                {reason}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Where did you encounter this?</Label>
        <Input
          value={formData.encounteredWhere}
          onChange={(e) => setFormData(prev => ({ ...prev, encounteredWhere: e.target.value }))}
          placeholder="e.g., WhatsApp message, Google search, social media ad"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Detailed Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Provide detailed information about why you find this suspicious. Include any interactions, messages, or behavior you observed..."
          className="mt-1 min-h-24"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={() => setStep(3)}
          disabled={!formData.suspicionReason || !formData.description}
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
        <Label>Upload Evidence (Recommended)</Label>
        <p className="text-sm text-slate-600 mt-1">
          Screenshots, recordings, or documents that support your report
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
              Take Screenshot
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Mic className="w-3 h-3 mr-1" />
              Record Audio
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label>Additional Information (Optional)</Label>
        <Textarea
          value={formData.additionalInfo}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
          placeholder="Any other relevant details that might help in analysis..."
          className="mt-1 min-h-16"
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-800">
            <p className="font-medium">Reporting Guidelines</p>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Only report entities you genuinely suspect</li>
              <li>Provide clear, factual information</li>
              <li>Include evidence whenever possible</li>
              <li>False reporting may have legal consequences</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex-1 cyber-gradient text-white">
          Submit Report
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
        <h3 className="font-medium text-slate-900">Report Submitted Successfully!</h3>
        <p className="text-sm text-slate-600 mt-1">
          Your suspicious entity report has been submitted for analysis.<br/>
          Report ID: <strong>SR{Date.now().toString().slice(-6)}</strong>
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
        <h4 className="font-medium text-blue-900 text-sm">What happens next?</h4>
        <ul className="text-xs text-blue-800 mt-2 space-y-1">
          <li>• Our AI system will analyze the reported entity</li>
          <li>• Cross-reference with existing threat databases</li>
          <li>• Verified threats will be added to protection lists</li>
          <li>• Community will be protected from this threat</li>
          <li>• You'll receive updates if action is taken</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2 justify-center">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Thank you for keeping the community safe!</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back to Home
        </Button>
        <Button onClick={() => setStep(1)} className="flex-1 cyber-gradient text-white">
          Report Another
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
              <h1 className="font-medium text-slate-900">Report Suspicious Entity</h1>
              <p className="text-sm text-slate-600">
                Step {step} of 4 - Help protect the community
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
              {step === 1 && 'Entity Type & Details'}
              {step === 2 && 'Suspicion Details'}
              {step === 3 && 'Evidence & Additional Info'}
              {step === 4 && 'Report Submitted'}
            </h2>
            <p className="text-sm text-slate-600">
              {step === 1 && 'Tell us what suspicious entity you encountered'}
              {step === 2 && 'Explain why you find this entity suspicious'}
              {step === 3 && 'Upload evidence and provide additional context'}
              {step === 4 && 'Your report is being processed'}
            </p>
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