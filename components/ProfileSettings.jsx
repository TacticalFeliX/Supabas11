import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  FileText, 
  Shield, 
  Camera, 
  Edit3,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ProfileSettings({ user, onBack, onUpdateUser }) {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    address: user.address || '',
    profilePicture: user.profilePicture || null
  });
  const [loading, setLoading] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const fileInputRef = useRef(null);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-1276a223`;

  // Load user's reports on component mount
  React.useEffect(() => {
    if (user?.userId) {
      loadUserReports();
    }
  }, [user]);

  const loadUserReports = async () => {
    try {
      setLoadingReports(true);
      const response = await fetch(`${API_BASE}/complaints/user/${user.userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUserReports(result.success ? result.complaints : []);
      }
    } catch (error) {
      console.error('Failed to load user reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  // Mock threats data for nearby threats
  const threatsNearby = [
    {
      id: 'THR001',
      type: 'Phishing Website',
      description: 'Fake SBI banking site detected',
      location: 'Vijay Nagar, Indore',
      reportedDate: '2025-01-12',
      status: 'active',
      riskLevel: 'high'
    },
    {
      id: 'THR002',
      type: 'Suspicious UPI ID',
      description: 'UPI ID used in multiple fraud cases',
      location: 'Palasia, Indore',
      reportedDate: '2025-01-11',
      status: 'blocked',
      riskLevel: 'high'
    },
    {
      id: 'THR003',
      type: 'Fake App',
      description: 'Malicious banking app on Play Store',
      location: 'Bhawar Kuan, Indore',
      reportedDate: '2025-01-09',
      status: 'removed',
      riskLevel: 'medium'
    }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you would upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, profilePicture: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call to update profile
    setTimeout(() => {
      const updatedUser = { ...user, ...profileData };
      onUpdateUser(updatedUser);
      localStorage.setItem('cyberapp_user', JSON.stringify(updatedUser));
      setLoading(false);
      setEditMode(false);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      investigating: { label: 'Investigating', className: 'bg-amber-100 text-amber-800' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
      under_review: { label: 'Under Review', className: 'bg-blue-100 text-blue-800' },
      reported: { label: 'Reported', className: 'bg-slate-100 text-slate-800' },
      active: { label: 'Active', className: 'bg-red-100 text-red-800' },
      blocked: { label: 'Blocked', className: 'bg-gray-100 text-gray-800' },
      removed: { label: 'Removed', className: 'bg-green-100 text-green-800' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getRiskBadge = (level) => {
    const riskConfig = {
      high: { label: 'High Risk', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Medium Risk', className: 'bg-amber-100 text-amber-800' },
      low: { label: 'Low Risk', className: 'bg-green-100 text-green-800' }
    };

    const config = riskConfig[level] || riskConfig.medium;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'investigating':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'under_review':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'active':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

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
              <h1>Profile Settings</h1>
              <p className="text-sm text-slate-600">Manage your account information</p>
            </div>
          </div>
          <User className="w-6 h-6 text-slate-400" />
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="threats">Nearby Threats</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2>Personal Information</h2>
                  {!editMode ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditMode(true)}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditMode(false);
                          setProfileData({
                            name: user.name || '',
                            address: user.address || '',
                            profilePicture: user.profilePicture || null
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSave}
                        disabled={loading}
                        className="cyber-gradient text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profileData.profilePicture} />
                      <AvatarFallback className="text-lg">
                        {profileData.name.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {editMode && (
                      <Button 
                        size="sm"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{user.name}</h3>
                    <p className="text-sm text-slate-600">Verified Account</p>
                    <Badge variant="outline" className="mt-2">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {editMode ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{user.name || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>+91 {user.phoneNumber}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">Verified</Badge>
                    </div>
                  </div>

                  {/* Aadhaar */}
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span>
                        {user.aadhaarNumber 
                          ? `**** **** ${user.aadhaarNumber.slice(-4)}`
                          : 'Not provided'
                        }
                      </span>
                      {user.aadhaarNumber && (
                        <Badge variant="secondary" className="ml-auto text-xs">Verified</Badge>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {editMode ? (
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        placeholder="Enter your address"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{user.address || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Member Since:</span>
                      <span className="ml-2 font-medium">
                        {new Date(user.loginTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Account Type:</span>
                      <span className="ml-2 font-medium capitalize">{user.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Last Login:</span>
                      <span className="ml-2 font-medium">
                        {new Date(user.loginTime).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Reports Filed:</span>
                      <span className="ml-2 font-medium">{userReports.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2>My Reports ({userReports.length})</h2>
              <Button 
                size="sm"
                onClick={() => onNavigate('report')}
                className="cyber-gradient text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>

            {userReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(report.status)}
                        <h3 className="font-medium">{report.type}</h3>
                      </div>
                      <p className="text-sm text-slate-600">{report.category}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {report.id}
                      </Badge>
                      <p className="text-sm text-slate-500">{report.reportedDate}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 mb-3 text-sm">{report.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(report.status)}
                      <Badge 
                        className={
                          report.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800'
                        }
                      >
                        {report.priority} priority
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Navigate to detailed view
                        console.log('View report details:', report.id);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Threats Tab */}
          <TabsContent value="threats" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2>Nearby Threats ({threatsNearby.length})</h2>
              <Badge variant="outline">Indore Area</Badge>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Stay alert! These threats have been reported in your area. Avoid interacting with suspicious websites, apps, or UPI IDs.
              </AlertDescription>
            </Alert>

            {threatsNearby.map((threat) => (
              <Card key={threat.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <h3 className="font-medium">{threat.type}</h3>
                      </div>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {threat.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">{threat.reportedDate}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 mb-3 text-sm">{threat.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(threat.status)}
                      {getRiskBadge(threat.riskLevel)}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Report similar threat or get more info
                        console.log('Get more info about threat:', threat.id);
                      }}
                    >
                      More Info
                    </Button>
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