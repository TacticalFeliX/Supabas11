import { supabase } from './supabase/client';

// Generate a simple user ID
const generateUserId = () => {
  return 'CG' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// Hash password (simple for demo - use proper hashing in production)
const hashPassword = (password) => {
  return btoa(password + 'cyberguard_salt');
};

// Verify password
const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};

export const authService = {
  async register(userData) {
    try {
      const { name, aadhaarNumber, phoneNumber, address, userType, governmentId } = userData;
      
      // Generate user ID
      const userId = generateUserId();
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('aadhaar_number', aadhaarNumber)
        .single();

      if (existingUser) {
        return { success: false, error: 'User with this Aadhaar number already exists' };
      }

      // Create user record
      const { data, error } = await supabase
        .from('users')
        .insert([{
          user_id: userId,
          name,
          aadhaar_number: aadhaarNumber,
          phone_number: phoneNumber,
          address,
          user_type: userType,
          government_id: governmentId,
          is_verified: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      return { 
        success: true, 
        userId: data.user_id,
        requiresPassword: true,
        message: 'Registration successful. Please set your password.' 
      };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  },

  async setPassword(userId, password) {
    try {
      const passwordHash = hashPassword(password);
      
      const { error } = await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: 'Failed to set password' };
      }

      return { success: true, message: 'Password set successfully' };
    } catch (error) {
      console.error('Set password error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async login(userId, password) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !user) {
        return { success: false, error: 'Invalid User ID' };
      }

      // Check if password is set
      if (!user.password_hash) {
        return { 
          success: false, 
          requiresPassword: true, 
          userId: user.user_id,
          error: 'Please complete your registration by setting a password' 
        };
      }

      // Verify password
      if (!verifyPassword(password, user.password_hash)) {
        return { success: false, error: 'Invalid password' };
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', userId);

      // Remove sensitive data
      const { password_hash, aadhaar_number, ...safeUser } = user;

      return { 
        success: true, 
        user: {
          ...safeUser,
          userType: user.user_type,
          phoneNumber: user.phone_number,
          governmentId: user.government_id,
          isVerified: user.is_verified,
          createdAt: user.created_at,
          loginTime: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  },

  async forgotPassword(userId) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('phone_number')
        .eq('user_id', userId)
        .single();

      if (error || !user) {
        return { success: false, error: 'User ID not found' };
      }

      // In a real app, you would send SMS OTP here
      // For demo, we'll just return success
      return { success: true, message: 'OTP sent to your registered phone number' };

    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async resetPassword(userId, otp, newPassword) {
    try {
      // In demo, accept any 6-digit OTP
      if (otp !== '123456') {
        return { success: false, error: 'Invalid OTP' };
      }

      const passwordHash = hashPassword(newPassword);
      
      const { error } = await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: 'Failed to reset password' };
      }

      return { success: true, message: 'Password reset successfully' };

    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Network error' };
    }
  }
};