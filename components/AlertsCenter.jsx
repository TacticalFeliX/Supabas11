import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Shield, 
  AlertTriangle, 
  Phone, 
  MessageSquare,
  Smartphone,
  Wifi,
  Bell,
  Settings,
  X,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

export function AlertsCenter({ user, onBack }) {
  const [alertSettings, setAlertSettings] = useState({
    scamCalls: true,
    phishingSMS: true,
    maliciousApps: true,
    suspiciousIPs: false,
    weeklyReports: true,
    realTimeAlerts: true
  });

  // Mock alerts data
  const [alerts] = useState([
    {
      id: 1,
      type: 'scam_call',
      title: 'Scam Call Blocked',
      description: 'Incoming call from +91-9876543210 identified as potential scam and blocked automatically',
      timestamp: '2024-01-18T14:30:00Z',
      severity: 'high',
      isRead: false,
      details: {
        phoneNumber: '+91-9876543210',
        reportedBy: '2,847 users',
        reason: 'Fake lottery/prize call'
      }
    },
    {
      id: 2,
      type: 'phishing_sms',
      title: 'Phishing SMS Detected',
      description: 'SMS containing suspicious link detected: "Congratulations! Click to claim ₹50,000..."',
      timestamp: '2024-01-18T12:15:00Z',
      severity: 'high',
      isRead: true,
      details: {
        sender: 'VK-REWARD',
        content: 'Congratulations! You won ₹50,000. Click: fake-link.com/claim',
        reason: 'Contains malicious link'
      }
    },
    {
      id: 3,
      type: 'malicious_app',
      title: 'Suspicious App Found',
      description: 'App "Quick Loan Pro" may be collecting personal data without permission',
      timestamp: '2024-01-18T09:45:00Z',
      severity: 'medium',
      isRead: true,
      details: {
        appName: 'Quick Loan Pro',
        permissions: ['Access Contacts', 'Read SMS', 'Camera Access'],
        riskLevel: 'Medium',
        recommendation: 'Uninstall recommended'
      }
    },
    {
      id: 4,
      type: 'suspicious_ip',
      title: 'Unusual Network Activity',
      description: 'Your device connected to a suspicious network that may be monitoring traffic',
      timestamp: '2024-01-17T20:30:00Z',
      severity: 'low',
      isRead: true,
      details: {
        networkName: 'Free_WiFi_2024',
        location: 'Public Area',
        risk: 'Data interception possible'
      }
    }
  ]);

  const [threatStats] = useState({
    today: {
      blocked: 5,
      detected: 8,
      protected: 12
    },
    thisWeek: {
      blocked: 34,
      detected: 52,
      protected: 89
    },
    safetyScore: 85
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'scam_call': return <Phone className="w-4 h-4" />;
      case 'phishing_sms': return <MessageSquare className="w-4 h-4" />;
      case 'malicious_app': return <Smartphone className="w-4 h-4" />;
      case 'suspicious_ip': return <Wifi className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  const renderDashboard = () => (
    <div className="space-y-4">
      {/* Security Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Security Score</h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">{threatStats.safetyScore}%</p>
              <p className="text-sm text-blue-700">Good protection level</p>
            </div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-lg font-semibold text-red-600">{threatStats.today.blocked}</p>
          <p className="text-xs text-slate-600">Blocked Today</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg font-semibold text-amber-600">{threatStats.today.detected}</p>
          <p className="text-xs text-slate-600">Detected Today</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-lg font-semibold text-green-600">{threatStats.today.protected}</p>
          <p className="text-xs text-slate-600">Protected Actions</p>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Recent Alerts</h3>
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg border ${!alert.isRead ? 'bg-blue-50 border-blue-200' : 'bg-slate-50'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-slate-900">{alert.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">{formatTime(alert.timestamp)}</span>
                    <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-auto p-4 flex-col gap-2">
          <Smartphone className="w-6 h-6 text-blue-600" />
          <span className="text-sm">Run Security Scan</span>
        </Button>
        <Button variant="outline" className="h-auto p-4 flex-col gap-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <span className="text-sm">View Report</span>
        </Button>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`${!alert.isRead ? 'border-blue-200 bg-blue-50' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-900">{alert.title}</h3>
                  {!alert.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span>{formatTime(alert.timestamp)}</span>
                  <Badge className={`${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </Badge>
                </div>
                
                {/* Alert Details */}
                <div className="mt-3 p-3 bg-slate-50 rounded border text-xs space-y-1">
                  {Object.entries(alert.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h3 className="font-medium">Alert Preferences</h3>
          <p className="text-sm text-slate-600">
            Configure what types of security alerts you want to receive
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(alertSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {key === 'scamCalls' && 'Block and alert about suspicious calls'}
                  {key === 'phishingSMS' && 'Detect phishing messages and links'}
                  {key === 'maliciousApps' && 'Scan for harmful applications'}
                  {key === 'suspiciousIPs' && 'Monitor network connections'}
                  {key === 'weeklyReports' && 'Receive weekly safety summaries'}
                  {key === 'realTimeAlerts' && 'Get instant threat notifications'}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) => 
                  setAlertSettings(prev => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-medium">Weekly Safety Report</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>This Week's Summary</span>
              <span className="text-slate-600">Jan 15-21, 2024</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-red-50 rounded">
                <p className="font-semibold text-red-600">{threatStats.thisWeek.blocked}</p>
                <p className="text-xs text-red-700">Threats Blocked</p>
              </div>
              <div className="p-3 bg-amber-50 rounded">
                <p className="font-semibold text-amber-600">{threatStats.thisWeek.detected}</p>
                <p className="text-xs text-amber-700">Risks Detected</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="font-semibold text-green-600">{threatStats.thisWeek.protected}</p>
                <p className="text-xs text-green-700">Safe Actions</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Download Full Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
              <h1 className="font-medium text-slate-900">Security Alerts</h1>
              <p className="text-sm text-slate-600">Monitor threats and safety alerts</p>
            </div>
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{unreadCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>
          
          <TabsContent value="alerts">
            {renderAlerts()}
          </TabsContent>
          
          <TabsContent value="settings">
            {renderSettings()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}