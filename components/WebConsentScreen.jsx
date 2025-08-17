import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Shield, FileText, Eye, Lock, Phone, UserCheck } from 'lucide-react';

export function WebConsentScreen({ onConsentGiven }) {
  const [consents, setConsents] = useState({
    dataProcessing: false,
    aadhaarVerification: false,
    communicationConsent: false,
    termsAccepted: false
  });

  const handleConsentChange = (consentType, checked) => {
    setConsents(prev => ({
      ...prev,
      [consentType]: checked
    }));
  };

  const allConsentsGiven = Object.values(consents).every(Boolean);

  const handleProceed = () => {
    if (allConsentsGiven) {
      onConsentGiven();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-white text-3xl font-semibold">CyberGuard</h1>
            <p className="text-blue-100 text-lg mt-2">
              Indore Cybercrime Reporting & Alert System
            </p>
            <p className="text-blue-200 text-sm mt-2">
              Secure • Confidential • Government Verified
            </p>
          </div>
        </div>

        {/* Consent Card */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl">Privacy Consent & Terms</h2>
                <p className="text-sm text-slate-600">
                  Please review and accept the following to continue
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Processing Consent */}
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox 
                id="dataProcessing"
                checked={consents.dataProcessing}
                onCheckedChange={(checked) => handleConsentChange('dataProcessing', checked)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <label htmlFor="dataProcessing" className="font-medium cursor-pointer">
                    Data Processing Consent
                  </label>
                </div>
                <p className="text-sm text-slate-600">
                  I consent to the processing of my personal data for cybercrime reporting, 
                  investigation, and prevention purposes. Data will be stored securely and 
                  used only for legitimate law enforcement activities.
                </p>
              </div>
            </div>

            {/* Aadhaar Verification Consent */}
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox 
                id="aadhaarVerification"
                checked={consents.aadhaarVerification}
                onCheckedChange={(checked) => handleConsentChange('aadhaarVerification', checked)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <label htmlFor="aadhaarVerification" className="font-medium cursor-pointer">
                    Aadhaar Verification Consent
                  </label>
                </div>
                <p className="text-sm text-slate-600">
                  I authorize the use of my Aadhaar number for identity verification purposes. 
                  This ensures secure authentication and prevents misuse of the reporting system. 
                  Aadhaar data will be encrypted and protected as per UIDAI guidelines.
                </p>
              </div>
            </div>

            {/* Communication Consent */}
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox 
                id="communicationConsent"
                checked={consents.communicationConsent}
                onCheckedChange={(checked) => handleConsentChange('communicationConsent', checked)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-orange-600" />
                  <label htmlFor="communicationConsent" className="font-medium cursor-pointer">
                    Communication Consent
                  </label>
                </div>
                <p className="text-sm text-slate-600">
                  I consent to receiving SMS notifications, OTP messages, and official 
                  communications regarding my complaints and security alerts on my registered 
                  phone number. These communications are essential for case updates.
                </p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox 
                id="termsAccepted"
                checked={consents.termsAccepted}
                onCheckedChange={(checked) => handleConsentChange('termsAccepted', checked)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <label htmlFor="termsAccepted" className="font-medium cursor-pointer">
                    Terms & Conditions
                  </label>
                </div>
                <p className="text-sm text-slate-600">
                  I have read and accept the{' '}
                  <button className="text-blue-600 hover:underline">Terms of Service</button> and{' '}
                  <button className="text-blue-600 hover:underline">Privacy Policy</button>. 
                  I understand that providing false information is a punishable offense under 
                  Indian law.
                </p>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">Important Notice</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Your data is protected with end-to-end encryption</li>
                <li>• Only authorized personnel can access your complaint details</li>
                <li>• You can withdraw consent at any time (may affect service)</li>
                <li>• All activities are logged for security and audit purposes</li>
                <li>• Emergency cases will be prioritized automatically</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleProceed}
                disabled={!allConsentsGiven}
                className={`flex-1 h-12 ${
                  allConsentsGiven 
                    ? 'cyber-gradient text-white' 
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Shield className="w-5 h-5 mr-2" />
                {allConsentsGiven ? 'Proceed Securely' : 'Accept All Consents to Continue'}
              </Button>
            </div>

            {/* Footer Info */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-slate-500">
                By proceeding, you acknowledge that you are 18+ years old and have the legal 
                capacity to provide consent. This system is operated by the Government of 
                Madhya Pradesh in collaboration with Indore Police.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <div className="text-center">
          <p className="text-blue-200 text-sm">
            🔒 Powered by Government of India's Digital Infrastructure
          </p>
          <p className="text-blue-300 text-xs mt-1">
            System Status: Active • Last Updated: January 2025
          </p>
        </div>
      </div>
    </div>
  );
}