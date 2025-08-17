import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Shield, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Settings,
  TrendingUp,
  Bell,
  LogOut,
  Search,
  Mail,
  Send,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Eye,
  Calendar,
  Users,
  Database,
  Zap,
  Flag,
  BarChart3,
  Activity,
  MapPin
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

export function AdminDashboard({ user, onNavigate, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('30d');
  const [complaints, setComplaints] = useState([]);
  const [suspiciousEntities, setSuspiciousEntities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    departmentStats: [],
    resolutionTrends: [],
    crimeByLocation: [],
    performanceMetrics: {}
  });

  // Mock data - Updated for Indore
  useEffect(() => {
    // Load mock complaints with enhanced data
    const mockComplaints = [
      {
        id: 'CR001234',
        title: 'UPI Fraud - Unauthorized Transaction',
        category: 'Financial Fraud',
        subcategory: 'UPI/Digital Wallet Fraud',
        status: 'Under Investigation',
        priority: 'high',
        submittedAt: '2024-01-15T10:30:00Z',
        deadline: '2024-01-20T23:59:59Z',
        lastUpdated: '2024-01-16T14:20:00Z',
        department: 'Cyber Crime Cell - Indore',
        location: 'Vijay Nagar, Indore',
        financialLoss: 25000,
        reporter: {
          name: 'Raj Kumar',
          phone: '+91-9876543210',
          isAnonymous: false
        },
        description: 'Unauthorized UPI transaction of ₹25,000 from my account to paytm-user@paytm',
        aiSummary: 'High-priority financial fraud case involving unauthorized UPI transfer. Pattern matches with 12 similar cases in past month. Suspicious UPI ID: paytm-user@paytm already flagged. Recommend immediate investigation and coordination with bank.',
        evidence: ['screenshot1.jpg', 'bank_statement.pdf'],
        assignedOfficer: 'Inspector Kumar',
        timeline: [
          { status: 'Submitted', date: '2024-01-15T10:30:00Z', officer: 'System' },
          { status: 'Acknowledged', date: '2024-01-15T11:45:00Z', officer: 'Inspector Kumar' },
          { status: 'Under Investigation', date: '2024-01-16T09:15:00Z', officer: 'Inspector Kumar' }
        ]
      },
      {
        id: 'CR001235',
        title: 'Cyberstalking via Social Media',
        category: 'Women Safety',
        subcategory: 'Cyberstalking',
        status: 'Pending',
        priority: 'high',
        submittedAt: '2024-01-18T09:15:00Z',
        deadline: '2024-01-20T23:59:59Z',
        lastUpdated: '2024-01-18T09:15:00Z',
        department: 'Women Safety Cell - Indore',
        location: 'Palasia, Indore',
        reporter: {
          name: 'Anonymous',
          phone: '+91-9876543211',
          isAnonymous: true
        },
        description: 'Receiving threatening messages on Instagram from fake profiles using my photos',
        aiSummary: 'Critical women safety case involving cyberstalking and identity theft. Multiple fake profiles detected using victims photos. Similar pattern reported in 5 other cases. Requires immediate action under IT Act Section 66E and IPC 354D.',
        evidence: ['instagram_screenshots.zip', 'fake_profiles.pdf'],
        timeline: [
          { status: 'Submitted', date: '2024-01-18T09:15:00Z', officer: 'System' }
        ]
      },
      {
        id: 'CR001236',
        title: 'Fake Investment App Scam',
        category: 'Online Fraud',
        subcategory: 'Investment Scam',
        status: 'Resolved',
        priority: 'medium',
        submittedAt: '2024-01-10T14:20:00Z',
        deadline: '2024-01-17T23:59:59Z',
        lastUpdated: '2024-01-14T16:30:00Z',
        department: 'Economic Offences Wing - Indore',
        location: 'Bhawar Kuan, Indore',
        financialLoss: 50000,
        assignedOfficer: 'SI Reddy',
        reporter: {
          name: 'Priya Sharma',
          phone: '+91-9876543212',
          isAnonymous: false
        },
        description: 'Lost ₹50,000 to fake trading app "QuickProfit Pro"',
        aiSummary: 'Investment fraud case resolved. App "QuickProfit Pro" blocked from app stores. 247 victims identified with total loss of ₹1.2 crores. Recovery process initiated.',
        evidence: ['app_screenshots.jpg', 'payment_receipts.pdf'],
        timeline: [
          { status: 'Submitted', date: '2024-01-10T14:20:00Z', officer: 'System' },
          { status: 'Under Investigation', date: '2024-01-11T10:00:00Z', officer: 'SI Reddy' },
          { status: 'Resolved', date: '2024-01-14T16:30:00Z', officer: 'SI Reddy' }
        ]
      }
    ];

    const mockSuspiciousEntities = [
      {
        id: 'SR001',
        type: 'UPI ID',
        value: 'paytm-user@paytm',
        reportedBy: 8,
        status: 'Verified Threat',
        aiVerification: 'High confidence threat - linked to 15+ fraud cases',
        submittedAt: '2024-01-10T10:00:00Z',
        lastSeen: '2024-01-18T14:30:00Z'
      },
      {
        id: 'SR002',
        type: 'Phone Number',
        value: '+91-8765432100',
        reportedBy: 12,
        status: 'Under Review',
        aiVerification: 'Medium confidence - patterns suggest lottery scam calls',
        submittedAt: '2024-01-12T15:30:00Z',
        lastSeen: '2024-01-17T11:20:00Z'
      },
      {
        id: 'SR003',
        type: 'Website',
        value: 'quickprofit-pro.com',
        reportedBy: 25,
        status: 'Blocked',
        aiVerification: 'Confirmed malicious - fake investment platform',
        submittedAt: '2024-01-08T12:00:00Z',
        lastSeen: '2024-01-14T09:00:00Z'
      }
    ];

    const mockAlerts = [
      {
        id: 'ALT001',
        type: 'Pattern Match',
        title: 'UPI ID Match Detected',
        description: 'UPI ID "paytm-user@paytm" from complaint CR001234 matches suspicious entity SR001',
        confidence: 'high',
        createdAt: '2024-01-18T15:00:00Z',
        relatedCases: ['CR001234', 'CR001220', 'CR001198']
      },
      {
        id: 'ALT002',
        type: 'Crime Pattern',
        title: 'Social Media Stalking Pattern',
        description: 'Similar cyberstalking pattern detected across 3 cases in Indore region',
        confidence: 'medium',
        createdAt: '2024-01-18T12:30:00Z',
        relatedCases: ['CR001235', 'CR001228', 'CR001203']
      }
    ];

    setComplaints(mockComplaints);
    setSuspiciousEntities(mockSuspiciousEntities);
    setAlerts(mockAlerts);

    // Generate analytics data for Indore
    const generateAnalyticsData = () => {
      const departments = [
        'Cyber Crime Cell - Indore',
        'Women Safety Cell - Indore', 
        'Economic Offences Wing - Indore',
        'Cyber Forensics Unit - Indore',
        'IT Crime Branch - Indore'
      ];

      const departmentStats = departments.map(dept => ({
        department: dept.split(' - ')[0],
        pending: Math.floor(Math.random() * 15) + 3,
        resolved: Math.floor(Math.random() * 30) + 10,
        overdue: Math.floor(Math.random() * 5) + 1,
        avgResolutionTime: Math.floor(Math.random() * 8) + 2
      }));

      // Resolution trends over time
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '3m' ? 90 : 365;
      const resolutionTrends = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        return {
          date: date.toISOString().split('T')[0],
          newCases: Math.floor(Math.random() * 15) + 5,
          resolved: Math.floor(Math.random() * 12) + 4,
          pending: Math.floor(Math.random() * 8) + 2
        };
      });

      // Crime by location - Indore areas
      const indoreAreas = [
        'Vijay Nagar', 
        'Palasia', 
        'Bhawar Kuan', 
        'Sapna Sangeeta', 
        'Rajwada', 
        'MG Road', 
        'AB Road', 
        'Scheme No. 78'
      ];
      const crimeByLocation = indoreAreas.map(location => ({
        location,
        total: Math.floor(Math.random() * 40) + 10,
        resolved: Math.floor(Math.random() * 25) + 8,
        pending: Math.floor(Math.random() * 15) + 2
      }));

      const performanceMetrics = {
        avgResolutionTime: 5.8,
        resolutionRate: 82,
        customerSatisfaction: 4.5,
        threatDetectionAccuracy: 94
      };

      return { departmentStats, resolutionTrends, crimeByLocation, performanceMetrics };
    };

    setAnalyticsData(generateAnalyticsData());
  }, [timeframe]);

  const stats = [
    { label: 'Total Complaints', value: complaints.length.toString(), icon: FileText, color: 'text-blue-600' },
    { label: 'Pending Cases', value: complaints.filter(c => c.status === 'Pending').length.toString(), icon: Clock, color: 'text-amber-600' },
    { label: 'High Priority', value: complaints.filter(c => c.priority === 'high').length.toString(), icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Resolved Today', value: complaints.filter(c => c.status === 'Resolved').length.toString(), icon: CheckCircle, color: 'text-green-600' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'under investigation': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const sendEmailToDepartment = (complaintId) => {
    alert(`Email sent to department for complaint ${complaintId}`);
  };

  const sendAllEmails = () => {
    alert(`Sending reports to all relevant departments (${complaints.length} reports)`);
  };

  const renderComplaintsPanel = () => (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={sendAllEmails} className="cyber-gradient text-white">
            <Send className="w-4 h-4 mr-1" />
            Send All Reports
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {complaints.map((complaint) => {
          const daysRemaining = getDaysRemaining(complaint.deadline);
          const isOverdue = daysRemaining < 0;
          
          return (
            <Card key={complaint.id} className={`${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900">{complaint.title}</h3>
                        <Badge className={getPriorityColor(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">ID: {complaint.id} • {complaint.category}</p>
                      <p className="text-sm text-slate-600">{complaint.department} • {complaint.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">
                        {isOverdue ? (
                          <span className="text-red-600 font-medium">
                            Overdue by {Math.abs(daysRemaining)} days
                          </span>
                        ) : (
                          <span>
                            {daysRemaining} days remaining
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">Due: {formatDate(complaint.deadline)}</p>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">AI Summary & Analysis</h4>
                    <p className="text-xs text-blue-800">{complaint.aiSummary}</p>
                  </div>

                  {/* Case Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-slate-600">Reporter</p>
                      <p className="font-medium">
                        {complaint.reporter.isAnonymous ? 'Anonymous' : complaint.reporter.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Submitted</p>
                      <p className="font-medium">{formatDate(complaint.submittedAt)}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Evidence</p>
                      <p className="font-medium">{complaint.evidence.length} files</p>
                    </div>
                    {complaint.financialLoss && (
                      <div>
                        <p className="text-slate-600">Loss Amount</p>
                        <p className="font-medium text-red-600">₹{complaint.financialLoss.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => sendEmailToDepartment(complaint.id)}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email Dept
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      Update Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderPendingCases = () => {
    const pendingCases = complaints.filter(c => {
      const daysRemaining = getDaysRemaining(c.deadline);
      return daysRemaining < 0 || c.status === 'Pending';
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Cases Requiring Immediate Attention</h3>
          <Badge className="bg-red-100 text-red-800">
            {pendingCases.length} cases
          </Badge>
        </div>

        {pendingCases.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 mb-2">All caught up!</h3>
            <p className="text-sm text-slate-600">No pending cases past deadline</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingCases.map((complaint) => {
              const daysOverdue = Math.abs(getDaysRemaining(complaint.deadline));
              return (
                <Card key={complaint.id} className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">{complaint.title}</h4>
                        <p className="text-sm text-slate-600">
                          ID: {complaint.id} • {complaint.department}
                        </p>
                        <p className="text-sm text-red-600 font-medium">
                          {complaint.status === 'Pending' ? 'Unassigned' : `Overdue by ${daysOverdue} days`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Urgent Action
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderReminders = () => {
    const todayReminders = complaints.filter(c => {
      const daysRemaining = getDaysRemaining(c.deadline);
      return daysRemaining <= 1 && daysRemaining >= 0;
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Today's Update Reminders</h3>
          <Badge className="bg-amber-100 text-amber-800">
            {todayReminders.length} reminders
          </Badge>
        </div>

        {todayReminders.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 mb-2">No reminders for today</h3>
            <p className="text-sm text-slate-600">All departments are up to date</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayReminders.map((complaint) => (
              <Card key={complaint.id} className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{complaint.department}</h4>
                      <p className="text-sm text-slate-600">
                        Update required for: {complaint.title} (ID: {complaint.id})
                      </p>
                      <p className="text-sm text-amber-700">
                        Deadline: {formatDate(complaint.deadline)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="border-amber-300">
                      <Bell className="w-4 h-4 mr-1" />
                      Send Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSuspiciousEntities = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Suspicious Entities Database</h3>
        <Button variant="outline" size="sm">
          <Database className="w-4 h-4 mr-1" />
          Sync Database
        </Button>
      </div>

      <div className="space-y-3">
        {suspiciousEntities.map((entity) => (
          <Card key={entity.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-slate-900">{entity.value}</h4>
                    <Badge variant="outline">{entity.type}</Badge>
                    <Badge className={
                      entity.status === 'Verified Threat' ? 'bg-red-100 text-red-800' :
                      entity.status === 'Blocked' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {entity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    Reported by {entity.reportedBy} users • Last seen: {formatDate(entity.lastSeen)}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">{entity.aiVerification}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  {entity.status === 'Under Review' && (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      <XCircle className="w-4 h-4 mr-1" />
                      Block
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Smart Alerts & Pattern Detection</h3>
        <Button variant="outline" size="sm">
          <Zap className="w-4 h-4 mr-1" />
          Run Analysis
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-slate-900">{alert.title}</h4>
                    <Badge className={
                      alert.confidence === 'high' ? 'bg-red-100 text-red-800' :
                      alert.confidence === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {alert.confidence} confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{formatDate(alert.createdAt)}</p>
                </div>
                <p className="text-sm text-slate-700">{alert.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Related cases:</span>
                  {alert.relatedCases.map((caseId) => (
                    <Badge key={caseId} variant="outline" className="text-xs">
                      {caseId}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{analyticsData.performanceMetrics.avgResolutionTime}d</p>
              <p className="text-xs text-slate-600">Avg Resolution</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{analyticsData.performanceMetrics.resolutionRate}%</p>
              <p className="text-xs text-slate-600">Resolution Rate</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{analyticsData.performanceMetrics.customerSatisfaction}/5</p>
              <p className="text-xs text-slate-600">Satisfaction</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{analyticsData.performanceMetrics.threatDetectionAccuracy}%</p>
              <p className="text-xs text-slate-600">AI Accuracy</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="font-medium">Department Performance</h3>
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="3m">3 months</SelectItem>
                  <SelectItem value="1y">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="department" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                  <Bar dataKey="overdue" fill="#ef4444" name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h3 className="font-medium">Resolution Trends</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.resolutionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN')}
                  />
                  <Area
                    type="monotone"
                    dataKey="newCases"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    name="New Cases"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    name="Resolved"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location-based Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <h3 className="font-medium">Cases by Area in Indore</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.crimeByLocation} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="location" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">CyberGuard Admin - Indore</h1>
                <p className="text-sm text-slate-600">
                  Welcome, {user?.name} • {user?.designation}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Admin Info Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-purple-600 text-white">
                  {user?.name?.split(' ').map((n) => n[0]).join('') || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">{user?.name}</h3>
                <p className="text-sm text-slate-600">
                  {user?.designation} • {user?.station}
                </p>
                <p className="text-sm text-slate-600">ID: {user?.governmentId}</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Admin Access</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-100`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Admin Panels */}
        <Tabs defaultValue="complaints" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="complaints">
              <FileText className="w-4 h-4 mr-1" />
              Complaints
            </TabsTrigger>
            <TabsTrigger value="pending">
              <Clock className="w-4 h-4 mr-1" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Bell className="w-4 h-4 mr-1" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="suspicious">
              <Flag className="w-4 h-4 mr-1" />
              Suspicious
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <Zap className="w-4 h-4 mr-1" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-1" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="complaints">
            {renderComplaintsPanel()}
          </TabsContent>
          
          <TabsContent value="pending">
            {renderPendingCases()}
          </TabsContent>
          
          <TabsContent value="reminders">
            {renderReminders()}
          </TabsContent>
          
          <TabsContent value="suspicious">
            {renderSuspiciousEntities()}
          </TabsContent>
          
          <TabsContent value="alerts">
            {renderAlerts()}
          </TabsContent>
          
          <TabsContent value="analytics">
            {renderAnalytics()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}