import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { 
  FileText, 
  AlertTriangle, 
  MessageCircle, 
  Bell, 
  Settings, 
  Shield, 
  TrendingUp,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  User,
  LogOut,
  Plus,
  Eye,
  Users
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Dashboard({ user, onNavigate, onLogout }) {
  const [dashboardData, setDashboardData] = useState({
    recentComplaints: [],
    notifications: [],
    stats: {
      totalReports: 0,
      resolvedCases: 0,
      pendingCases: 0,
      threatsNearby: 0
    },
    loading: true,
    error: null
  });

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-1276a223`;

  useEffect(() => {
    if (user?.userId) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      // Load user's complaints
      const complaintsResponse = await fetch(`${API_BASE}/complaints/user/${user.userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      let complaints = [];
      if (complaintsResponse.ok) {
        const complaintsResult = await complaintsResponse.json();
        complaints = complaintsResult.success ? complaintsResult.complaints : [];
      }

      // Calculate stats
      const totalReports = complaints.length;
      const resolvedCases = complaints.filter(c => c.status === 'resolved').length;
      const pendingCases = complaints.filter(c => c.status !== 'resolved').length;

      // Mock data for notifications and nearby threats
      const mockNotifications = [
        {
          id: 1,
          type: 'case_update',
          title: 'Case Status Updated',
          message: 'Your report has been assigned to investigation team',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: 2,
          type: 'security_alert',
          title: 'Security Alert',
          message: 'New phishing attempts detected in your area',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: false
        }
      ];

      setDashboardData({
        recentComplaints: complaints.slice(0, 3), // Show only recent 3
        notifications: mockNotifications,
        stats: {
          totalReports,
          resolvedCases,
          pendingCases,
          threatsNearby: 5 // Mock data
        },
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard data'
      }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'investigating':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'reported':
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      reported: { label: 'Reported', className: 'bg-blue-100 text-blue-800' },
      investigating: { label: 'Investigating', className: 'bg-amber-100 text-amber-800' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || statusConfig.reported;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN') + ' at ' + date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const unreadNotifications = dashboardData.notifications.filter(n => !n.read).length;

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">CyberGuard Dashboard</h1>
                <p className="text-sm text-slate-600">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('notifications')}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('profile')}
              >
                <User className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* User Info Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">User ID: {user.userId}</h2>
                <div className="flex items-center gap-4 mt-2 text-blue-100">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>+91 {user.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.address || 'Indore, MP'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Verified Account</span>
                </div>
                <p className="text-sm text-blue-100">
                  Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Reports</p>
                  <p className="text-2xl font-semibold">{dashboardData.stats.totalReports}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Resolved Cases</p>
                  <p className="text-2xl font-semibold text-green-600">{dashboardData.stats.resolvedCases}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending Cases</p>
                  <p className="text-2xl font-semibold text-amber-600">{dashboardData.stats.pendingCases}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Threats Nearby</p>
                  <p className="text-2xl font-semibold text-red-600">{dashboardData.stats.threatsNearby}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => onNavigate('report')}
                className="h-16 cyber-gradient text-white"
              >
                <Plus className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Report Cybercrime</div>
                  <div className="text-xs opacity-90">File a new complaint</div>
                </div>
              </Button>

              <Button 
                onClick={() => onNavigate('suspicious')}
                variant="outline"
                className="h-16"
              >
                <AlertTriangle className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Report Suspicious Activity</div>
                  <div className="text-xs text-slate-600">Websites, Apps, UPI IDs</div>
                </div>
              </Button>

              <Button 
                onClick={() => onNavigate('chatbot')}
                variant="outline"
                className="h-16"
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Get Help</div>
                  <div className="text-xs text-slate-600">AI Assistant</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Complaints */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium">Recent Reports</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('timeline')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {dashboardData.recentComplaints.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentComplaints.map((complaint) => (
                    <div key={complaint.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(complaint.status)}
                          <h4 className="font-medium">{complaint.type || 'Cybercrime Report'}</h4>
                        </div>
                        {getStatusBadge(complaint.status)}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {complaint.description || 'Report description not available'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>ID: {complaint.id}</span>
                        <span>{formatDate(complaint.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No reports filed yet</p>
                  <Button 
                    onClick={() => onNavigate('report')}
                    size="sm"
                    className="mt-3"
                  >
                    File Your First Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium">Notifications</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('notifications')}
              >
                <Bell className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {notification.type === 'case_update' ? (
                        <FileText className="w-4 h-4 text-blue-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {formatDate(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {dashboardData.notifications.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Services */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Additional Services</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={() => onNavigate('alerts')}
                variant="outline"
                className="h-20 flex-col"
              >
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="text-sm">Threat Alerts</span>
              </Button>

              <Button 
                onClick={() => onNavigate('rag-chatbot')}
                variant="outline"
                className="h-20 flex-col"
              >
                <MessageCircle className="w-6 h-6 mb-2" />
                <span className="text-sm">What Should I Do?</span>
              </Button>

              <Button 
                onClick={() => onNavigate('timeline')}
                variant="outline"
                className="h-20 flex-col"
              >
                <Clock className="w-6 h-6 mb-2" />
                <span className="text-sm">Case Timeline</span>
              </Button>

              <Button 
                onClick={() => onNavigate('profile')}
                variant="outline"
                className="h-20 flex-col"
              >
                <Settings className="w-6 h-6 mb-2" />
                <span className="text-sm">Profile Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {dashboardData.error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                <span>{dashboardData.error}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}