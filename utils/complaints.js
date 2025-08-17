import { supabase } from './supabase/client';

export const complaintsService = {
  async submitComplaint(complaintData) {
    try {
      const complaintId = 'CR' + Date.now().toString().slice(-6);
      
      const { data, error } = await supabase
        .from('complaints')
        .insert([{
          id: complaintId,
          user_id: complaintData.userId,
          category: complaintData.category,
          subcategory: complaintData.subcategory,
          title: complaintData.title,
          description: complaintData.description,
          incident_date: complaintData.incidentDate,
          location: complaintData.location,
          suspicious_entity: complaintData.suspiciousEntity,
          financial_loss: complaintData.financialLoss ? parseFloat(complaintData.financialLoss) : null,
          urgency_level: complaintData.urgencyLevel,
          is_anonymous: complaintData.isAnonymous,
          status: 'submitted',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Submit complaint error:', error);
        return { success: false, error: 'Failed to submit complaint' };
      }

      return { success: true, complaint: data, complaintId };

    } catch (error) {
      console.error('Submit complaint error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async getUserComplaints(userId) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get complaints error:', error);
        return { success: false, error: 'Failed to load complaints' };
      }

      return { success: true, complaints: data || [] };

    } catch (error) {
      console.error('Get complaints error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async reportSuspiciousEntity(reportData) {
    try {
      const reportId = 'SR' + Date.now().toString().slice(-6);
      
      const { data, error } = await supabase
        .from('suspicious_entities')
        .insert([{
          id: reportId,
          user_id: reportData.userId,
          entity_type: reportData.entityType,
          entity_value: reportData.entityValue,
          suspicion_reason: reportData.suspicionReason,
          description: reportData.description,
          risk_level: reportData.riskLevel,
          encountered_where: reportData.encounteredWhere,
          additional_info: reportData.additionalInfo,
          status: 'under_analysis',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Report suspicious entity error:', error);
        return { success: false, error: 'Failed to submit report' };
      }

      return { success: true, report: data, reportId };

    } catch (error) {
      console.error('Report suspicious entity error:', error);
      return { success: false, error: 'Network error' };
    }
  }
};