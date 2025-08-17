import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Bell, CheckCircle, Clock, AlertTriangle, FileText, Phone, MapPin, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function NotificationCenter({ user, onBack, onNavigate }) {
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock notification data
  const notifications = [
    {
      id: 'RPT001',
      type: 'complaint_update',
      title: 'Case Status Updated',
      message: 'Your online fraud complaint has been assigned to Investigation Team',
      timestamp: '2 hours ago',
      status: 'investigating',
      priority: 'high',
      read: false
    },
    {
      id: 'RPT002',
      type: 'complaint_resolved',
      title: 'Case Resolved',
      message: 'Your phishing website report has been successfully resolved',
      timestamp: '1 day ago',
      status: 'resolved',
      priority: 'medium',
      read: false
    },
    {
      id: 'RPT003',
      type: 'new_alert',
      title: 'Security Alert',
      message: 'New phishing attempts detected in your area (Indore)',
      timestamp: '3 days ago',
      status: 'alert',
      priority: 'high',
      read: true
    }
  ];

  // Mock report details
  const reportDetails = {
    'RPT001': {
      id: 'RPT001',
      type: 'Financial Fraud',
      category: 'Online Banking Fraud',
      status: 'investigating',
      priority: 'high',
      reportedDate: '2025-01-10',
      lastUpdate: '2025-01-12',
      assignedOfficer: 'Inspector Sharma',
      officerContact: '+91-9876543210',
      description: 'Unauthorized transaction of ₹25,000 from my bank account through suspicious UPI transaction',
      location: 'Vijay Nagar, Indore',
      evidence: ['Bank Statement', 'Transaction Screenshot'],
      timeline: [
        {
          date: '2025-01-10',
          status: 'reported',
          description: 'Complaint filed by user',
          officer: 'System'
        },
        {
          date: '2025-01-10',
          status: 'acknowledged',
          description: 'Complaint acknowledged and case number assigned',
          officer: 'Auto System'
        },
        {
          date: '2025-01-11',
          status: 'under_review',
          description: 'Initial review completed, case prioritized as HIGH',
          officer: 'Inspector Sharma'
        },
        {
          date: '2025-01-12',
          status: 'investigating',
          description: 'Investigation team assigned. Bank contacted for transaction details.',
          officer: 'Inspector Sharma'
        }
      ]
    },
    'RPT002': {
      id: 'RPT002',
      type: 'Cyber Threat',
      category: 'Phishing Website',
      status: 'resolved',
      priority: 'medium',
      reportedDate: '2025-01-08',
      lastUpdate: '2025-01-11',
      assignedOfficer: 'Constable Patel',
      officerContact: '+91-9876543211',
      description: 'Fake banking website attempting to steal login credentials',
      location: 'Palasia, Indore',
      evidence: ['Website Screenshot', 'URL Details'],
      timeline: [
        {
          date: '2025-01-08',
          status: 'reported',
          description: 'Suspicious website reported',
          officer: 'System'
        },
        {
          date: '2025-01-09',
          status: 'investigating',
          description: 'Website verified as fraudulent. Blocking process initiated.',
          officer: 'Constable Patel'
        },
        {
          date: '2025-01-11',
          status: 'resolved',
          description: 'Website successfully blocked. Case closed.',
          officer: 'Constable Patel'
        }
      ]
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'investigating':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      investigating: { label: 'Investigating', variant: 'secondary' },
      resolved: { label: 'Resolved', variant: 'default' },
      under_review: { label: 'Under Review', variant: 'outline' },
      reported: { label: 'Reported', variant: 'outline' },
      acknowledged: { label: 'Acknowledged', variant: 'secondary' },
      alert: { label: 'Alert', variant: 'destructive' }
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant} className="capitalize">{config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { label: 'High', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Medium', className: 'bg-amber-100 text-amber-800' },
      low: { label: 'Low', className: 'bg-green-100 text-green-800' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <Badge className={config.className}>
        {config.label} Priority
      </Badge>
    );
  };

  if (selectedReport) {
    const report = reportDetails[selectedReport];
    
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notifications
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 max-w-2xl mx-auto">
          {/* Report Overview */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl mb-2">{report.type}</h2>
                  <p className="text-slate-600">{report.category}</p>
                  <div className="flex gap-2 mt-3">
                    {getStatusBadge(report.status)}
                    {getPriorityBadge(report.priority)}
                  </div>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>Case ID: <span className="font-medium">{report.id}</span></p>
                  <p>Last Updated: {report.lastUpdate}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-slate-700">{report.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-slate-600 mb-1">Assigned Officer</h4>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="font-medium">{report.assignedOfficer}</p>
                      <p className="text-sm text-slate-500">{report.officerContact}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-slate-600 mb-1">Location</h4>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <p>{report.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-slate-600 mb-2">Evidence Submitted</h4>
                <div className="flex gap-2">
                  {report.evidence.map((item, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <h3>Case Timeline</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        index === report.timeline.length - 1 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'bg-green-500 border-green-500'
                      }`} />
                      {index < report.timeline.length - 1 && (
                        <div className="w-px h-12 bg-slate-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(event.status)}
                        <span className="text-sm text-slate-500">{event.date}</span>
                      </div>
                      <p className="text-slate-700 mb-1">{event.description}</p>
                      <p className="text-sm text-slate-500">Updated by: {event.officer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1>Notifications</h1>
              <p className="text-sm text-slate-600">Track your reports and alerts</p>
            </div>
          </div>
          <Bell className="w-6 h-6 text-slate-400" />
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'border-blue-200 bg-blue-50/30' : ''
                }`}
                onClick={() => {
                  if (notification.type === 'complaint_update' || notification.type === 'complaint_resolved') {
                    setSelectedReport(notification.id);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(notification.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <span className="text-sm text-slate-500">{notification.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{notification.message}</p>
                      <div className="flex items-center gap-2">
                        {notification.id && (
                          <Badge variant="outline" className="text-xs">
                            {notification.id}
                          </Badge>
                        )}
                        {getPriorityBadge(notification.priority)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 mt-6">
            {notifications
              .filter(n => n.type === 'complaint_update' || n.type === 'complaint_resolved')
              .map((notification) => (
                <Card 
                  key={notification.id} 
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => setSelectedReport(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(notification.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          <span className="text-sm text-slate-500">{notification.timestamp}</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{notification.message}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.id}
                          </Badge>
                          {getPriorityBadge(notification.priority)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4 mt-6">
            {notifications
              .filter(n => n.type === 'new_alert')
              .map((notification) => (
                <Card key={notification.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(notification.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          <span className="text-sm text-slate-500">{notification.timestamp}</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{notification.message}</p>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(notification.priority)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}