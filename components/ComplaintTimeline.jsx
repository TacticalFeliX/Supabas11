import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Phone,
  MessageSquare,
  Eye,
  Download,
  ExternalLink
} from 'lucide-react';

export function ComplaintTimeline({ user, onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Mock complaints data
  const [complaints] = useState([
    {
      id: 'CR001234',
      title: 'UPI Fraud - Unauthorized Transaction',
      category: 'Financial Fraud',
      status: 'Under Investigation',
      priority: 'High',
      submittedAt: '2024-01-15T10:30:00Z',
      lastUpdated: '2024-01-16T14:20:00Z',
      assignedOfficer: 'Inspector Raj Kumar',
      description: 'Unauthorized UPI transaction of ₹25,000 from my account to unknown beneficiary.',
      financialLoss: '25000',
      timeline: [
        {
          status: 'Submitted',
          date: '2024-01-15T10:30:00Z',
          description: 'Complaint submitted successfully',
          officer: 'System',
          isCompleted: true
        },
        {
          status: 'Acknowledged',
          date: '2024-01-15T11:45:00Z',
          description: 'Complaint acknowledged and assigned to investigating officer',
          officer: 'Inspector Raj Kumar',
          isCompleted: true
        },
        {
          status: 'Under Investigation',
          date: '2024-01-16T09:15:00Z',
          description: 'Investigation started. Bank statements requested.',
          officer: 'Inspector Raj Kumar',
          isCompleted: true
        },
        {
          status: 'Evidence Review',
          date: null,
          description: 'Technical analysis of transaction details',
          officer: 'Cyber Forensics Team',
          isCompleted: false
        },
        {
          status: 'Resolution',
          date: null,
          description: 'Final action and closure',
          officer: 'Inspector Raj Kumar',
          isCompleted: false
        }
      ]
    },
    {
      id: 'CR001235',
      title: 'Fake Trading App Scam',
      category: 'Online Fraud',
      status: 'Resolved',
      priority: 'Medium',
      submittedAt: '2024-01-10T14:20:00Z',
      lastUpdated: '2024-01-14T16:30:00Z',
      assignedOfficer: 'Sub-Inspector Priya Singh',
      description: 'Lost money to fake trading app that promised high returns.',
      financialLoss: '15000',
      resolution: 'Fraudulent app blocked. Partial recovery initiated through bank.',
      timeline: [
        {
          status: 'Submitted',
          date: '2024-01-10T14:20:00Z',
          description: 'Complaint submitted successfully',
          officer: 'System',
          isCompleted: true
        },
        {
          status: 'Acknowledged',
          date: '2024-01-10T15:30:00Z',
          description: 'Complaint acknowledged and prioritized',
          officer: 'Sub-Inspector Priya Singh',
          isCompleted: true
        },
        {
          status: 'Under Investigation',
          date: '2024-01-11T10:00:00Z',
          description: 'App analyzed and found to be fraudulent',
          officer: 'Cyber Forensics Team',
          isCompleted: true
        },
        {
          status: 'Action Taken',
          date: '2024-01-12T12:00:00Z',
          description: 'App blocked on Google Play Store and Apple App Store',
          officer: 'Sub-Inspector Priya Singh',
          isCompleted: true
        },
        {
          status: 'Resolved',
          date: '2024-01-14T16:30:00Z',
          description: 'Case closed. Recovery process initiated with bank.',
          officer: 'Sub-Inspector Priya Singh',
          isCompleted: true
        }
      ]
    },
    {
      id: 'CR001236',
      title: 'Cyberstalking on Social Media',
      category: 'Women Safety',
      status: 'Pending',
      priority: 'High',
      submittedAt: '2024-01-18T09:15:00Z',
      lastUpdated: '2024-01-18T09:15:00Z',
      assignedOfficer: 'Not Assigned',
      description: 'Receiving threatening messages and fake profiles created using my photos.',
      timeline: [
        {
          status: 'Submitted',
          date: '2024-01-18T09:15:00Z',
          description: 'Complaint submitted successfully',
          officer: 'System',
          isCompleted: true
        },
        {
          status: 'Acknowledgment Pending',
          date: null,
          description: 'Waiting for officer assignment',
          officer: 'Pending',
          isCompleted: false
        }
      ]
    }
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'under investigation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'acknowledged': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderComplaintList = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by ID, title, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <p className="text-lg font-semibold text-blue-600">{complaints.filter(c => c.status !== 'Resolved').length}</p>
          <p className="text-xs text-slate-600">Active</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-lg font-semibold text-green-600">{complaints.filter(c => c.status === 'Resolved').length}</p>
          <p className="text-xs text-slate-600">Resolved</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-lg font-semibold text-slate-600">{complaints.length}</p>
          <p className="text-xs text-slate-600">Total</p>
        </Card>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filteredComplaints.map((complaint) => {
          const { date, time } = formatDate(complaint.lastUpdated);
          return (
            <Card key={complaint.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedComplaint(complaint)}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 text-sm">{complaint.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">ID: {complaint.id}</p>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-600">{complaint.category}</span>
                      <Badge className={`${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </Badge>
                    </div>
                    <div className="text-slate-500">
                      {date} {time}
                    </div>
                  </div>

                  {complaint.assignedOfficer !== 'Not Assigned' && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Eye className="w-3 h-3" />
                      <span>{complaint.assignedOfficer}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredComplaints.length === 0 && (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="font-medium text-slate-900 mb-2">No complaints found</h3>
          <p className="text-sm text-slate-600">
            {searchQuery ? 'Try adjusting your search terms' : 'You haven\'t filed any complaints yet'}
          </p>
        </Card>
      )}
    </div>
  );

  const renderComplaintDetail = () => {
    if (!selectedComplaint) return null;

    const { date: submittedDate, time: submittedTime } = formatDate(selectedComplaint.submittedAt);

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <Button variant="ghost" size="sm" onClick={() => setSelectedComplaint(null)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h2 className="font-medium text-slate-900">{selectedComplaint.title}</h2>
            <p className="text-sm text-slate-600">ID: {selectedComplaint.id}</p>
          </div>
        </div>

        {/* Status Overview */}
        <Card className="bg-slate-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Status</p>
                <Badge className={`mt-1 ${getStatusColor(selectedComplaint.status)}`}>
                  {selectedComplaint.status}
                </Badge>
              </div>
              <div>
                <p className="text-slate-600">Priority</p>
                <Badge className={`mt-1 ${getPriorityColor(selectedComplaint.priority)}`}>
                  {selectedComplaint.priority}
                </Badge>
              </div>
              <div>
                <p className="text-slate-600">Submitted</p>
                <p className="font-medium">{submittedDate} {submittedTime}</p>
              </div>
              <div>
                <p className="text-slate-600">Assigned Officer</p>
                <p className="font-medium">{selectedComplaint.assignedOfficer}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <h3 className="font-medium">Complaint Details</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Category</p>
              <p className="font-medium">{selectedComplaint.category}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Description</p>
              <p className="text-sm">{selectedComplaint.description}</p>
            </div>
            {selectedComplaint.financialLoss && (
              <div>
                <p className="text-sm text-slate-600">Financial Loss</p>
                <p className="font-medium text-red-600">₹{selectedComplaint.financialLoss}</p>
              </div>
            )}
            {selectedComplaint.resolution && (
              <div>
                <p className="text-sm text-slate-600">Resolution</p>
                <p className="text-sm text-green-700">{selectedComplaint.resolution}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <h3 className="font-medium">Investigation Timeline</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedComplaint.timeline.map((event, index) => {
                const isLast = index === selectedComplaint.timeline.length - 1;
                const eventDate = event.date ? formatDate(event.date) : null;
                
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        event.isCompleted 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white border-slate-300'
                      }`} />
                      {!isLast && (
                        <div className={`w-0.5 h-8 mt-1 ${
                          event.isCompleted ? 'bg-green-500' : 'bg-slate-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium ${
                          event.isCompleted ? 'text-slate-900' : 'text-slate-500'
                        }`}>
                          {event.status}
                        </h4>
                        {event.isCompleted && eventDate && (
                          <span className="text-xs text-slate-500">
                            {eventDate.date} {eventDate.time}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${
                        event.isCompleted ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {event.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Officer: {event.officer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="text-sm">
            <Phone className="w-4 h-4 mr-2" />
            Contact Officer
          </Button>
          <Button variant="outline" className="text-sm">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-medium text-slate-900">
                {selectedComplaint ? 'Complaint Details' : 'Track Complaints'}
              </h1>
              <p className="text-sm text-slate-600">
                {selectedComplaint ? selectedComplaint.id : 'Monitor your complaint status and timeline'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {selectedComplaint ? renderComplaintDetail() : renderComplaintList()}
      </div>
    </div>
  );
}