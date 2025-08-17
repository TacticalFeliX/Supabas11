import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Shield, Phone, MessageSquare, MapPin, Bell, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

export function MobileConsentScreen({ onConsentGiven }) {
  const [consents, setConsents] = useState({
    callLogs: false,
    sms: false,
    location: false,
    notifications: false,
    deviceScan: false
  });

  const permissions = [
    {
      id: 'callLogs',
      icon: Phone,
      title: 'Call Log Access',
      description: 'To detect and alert about suspicious calls and numbers',
      required: true
    },
    {
      id: 'sms',
      icon: MessageSquare,
      title: 'SMS Access',
      description: 'To identify phishing messages and fraudulent content',
      required: true
    },
    {
      id: 'location',
      icon: MapPin,
      title: 'Location Access',
      description: 'For location-based safety alerts and emergency reporting',
      required: false
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Push Notifications',
      description: 'To receive real-time security alerts and updates',
      required: true
    },
    {
      id: 'deviceScan',
      icon: Shield,
      title: 'Device Security Scan',
      description: 'To scan for malicious apps and security vulnerabilities',
      required: false
    }
  ];

  const handleConsentChange = (permissionId, checked) => {
    setConsents(prev => ({
      ...prev,
      [permissionId]: checked
    }));
  };

  const handleSelectAllRequired = () => {
    const requiredPermissions = permissions.filter(p => p.required);
    const newConsents = { ...consents };
    requiredPermissions.forEach(permission => {
      newConsents[permission.id] = true;
    });
    setConsents(newConsents);
  };

  const handleSelectAll = () => {
    const newConsents = { ...consents };
    permissions.forEach(permission => {
      newConsents[permission.id] = true;
    });
    setConsents(newConsents);
  };

  const handleDeselectAll = () => {
    setConsents({
      callLogs: false,
      sms: false,
      location: false,
      notifications: false,
      deviceScan: false
    });
  };

  const allRequiredConsentsGiven = permissions
    .filter(p => p.required)
    .every(p => consents[p.id]);

  const allPermissionsSelected = permissions
    .every(p => consents[p.id]);

  const canProceed = allRequiredConsentsGiven;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-semibold">CyberGuard</h1>
            <p className="text-blue-100 text-sm mt-2">
              Your trusted companion for cyber safety and crime reporting
            </p>
          </div>
        </div>

        {/* Permissions Card */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg">App Permissions</h2>
            </div>
            <p className="text-sm text-slate-600">
              We need the following permissions to keep you safe
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllRequired}
                className="text-xs flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Select Required
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeselectAll}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>

            {permissions.map((permission) => {
              const Icon = permission.icon;
              return (
                <div key={permission.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-slate-900">
                        {permission.title}
                      </h3>
                      {permission.required && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {permission.description}
                    </p>
                  </div>
                  <Checkbox
                    checked={consents[permission.id]}
                    onCheckedChange={(checked) => 
                      handleConsentChange(permission.id, checked)
                    }
                    className="mt-1"
                  />
                </div>
              );
            })}
            
            {/* Privacy Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800">
                  <p className="font-medium">Privacy Commitment</p>
                  <p className="mt-1">
                    Your data is encrypted and used only for security purposes. 
                    We never share personal information with third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Status Display */}
            <div className="text-center">
              {allPermissionsSelected ? (
                <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  All permissions granted - Maximum protection enabled
                </p>
              ) : allRequiredConsentsGiven ? (
                <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Required permissions granted - Basic protection enabled
                </p>
              ) : (
                <p className="text-xs text-red-600">
                  Please grant required permissions to continue
                </p>
              )}
            </div>
            
            <Button 
              onClick={onConsentGiven}
              disabled={!canProceed}
              className="w-full cyber-gradient text-white border-0"
            >
              Continue to App
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-blue-200 text-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}