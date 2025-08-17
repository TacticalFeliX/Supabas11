import { projectId, publicAnonKey } from './info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1276a223`;

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// --- User API ---
export const userAPI = {
  async register(userData) {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(email, password) {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async getProfile(userId) {
    return apiCall(`/user/profile/${userId}`);
  },

  async reportGrievance(reportData) {
    return apiCall('/grievance/report', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  },

  async getUserGrievances(userId) {
    return apiCall(`/grievance/user/${userId}`);
  },
  
  async reportSuspiciousEntity(reportData) {
    return apiCall('/suspicious/report', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  },
};

// --- Admin API ---
export const adminAPI = {
  async getGrievances() {
    return apiCall('/admin/grievances');
  },

  async updateGrievanceStatus(reportId, status, adminId) {
    return apiCall(`/admin/grievances/${reportId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, handled_by_admin: adminId }),
    });
  },

  async getSuspiciousEntities() {
    return apiCall('/admin/suspicious-entities');
  },
};

// Connection test utility
export const testSupabaseConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: 'Connected to Supabase successfully',
        data
      };
    } else {
      return {
        success: false,
        message: `Connection failed: HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error.message}`
    };
  }
};