import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Shield, User, Settings, AlertCircle, UserPlus, Smartphone, Lock, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function AuthScreen({ onAuthenticated }) {
  const [userType, setUserType] = useState('user'); // 'user' or 'official'
  const [authMode, setAuthMode] = useState('choice'); // 'choice', 'login', 'register', 'forgot'
  const [step, setStep] = useState('form'); // 'form', 'otp', 'password'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Registration fields
    name: '',
    aadhaarNumber: '',
    phoneNumber: '',
    address: '',
    governmentId: '',
    // Login fields
    userId: '',
    password: '',
    // OTP field
    otp: '',
    // Generated user ID for new registrations
    generatedUserId: ''
  });

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-1276a223`;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const callAPI = async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  };

  // Registration flow
  const handleRegister = async () => {
    if (!formData.name || !formData.aadhaarNumber || !formData.phoneNumber || !formData.address) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.aadhaarNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (userType === 'official' && !formData.governmentId) {
      setError('Government ID is required for officials');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await callAPI('/auth/register', {
        name: formData.name,
        aadhaarNumber: formData.aadhaarNumber,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        userType: userType,
        governmentId: userType === 'official' ? formData.governmentId : null
      });

      if (result.success) {
        setFormData(prev => ({ ...prev, generatedUserId: result.userId }));
        setStep('otp');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // OTP verification for registration
  const handleVerifyRegistrationOTP = async () => {
    if (formData.otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await callAPI('/auth/verify-registration', {
        phoneNumber: formData.phoneNumber,
        otp: formData.otp
      });

      if (result.success) {
        if (result.requiresPassword) {
          setStep('password');
        }
      } else {
        setError(result.error || 'OTP verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Set password after registration
  const handleSetPassword = async () => {
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await callAPI('/auth/set-password', {
        userId: formData.generatedUserId,
        password: formData.password
      });

      if (result.success) {
        // Auto-login after password setup
        const loginResult = await callAPI('/auth/login', {
          userId: formData.generatedUserId,
          password: formData.password
        });

        if (loginResult.success) {
          onAuthenticated(loginResult.user);
        } else {
          setError('Registration completed. Please login with your credentials.');
          setAuthMode('login');
          setStep('form');
          setFormData(prev => ({ ...prev, userId: prev.generatedUserId, password: '' }));
        }
      } else {
        setError(result.error || 'Failed to set password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Set password error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Login flow
  const handleLogin = async () => {
    if (!formData.userId || !formData.password) {
      setError('Please enter both User ID and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await callAPI('/auth/login', {
        userId: formData.userId,
        password: formData.password
      });

      if (result.success) {
        onAuthenticated(result.user);
      } else {
        if (result.requiresPassword) {
          setError('Please complete your registration by setting a password');
          setFormData(prev => ({ ...prev, generatedUserId: result.userId }));
          setStep('password');
        } else {
          setError(result.error || 'Invalid credentials');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password flow
  const handleForgotPassword = async () => {
    if (!formData.userId) {
      setError('Please enter your User ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await callAPI('/auth/forgot-password', {
        userId: formData.userId
      });

      if (result.success) {
        setStep('otp');
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset password with OTP
  const handleResetPassword = async () => {
    if (formData.otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await callAPI('/auth/reset-password', {
        userId: formData.userId,
        otp: formData.otp,
        newPassword: formData.password
      });

      if (result.success) {
        setError('');
        alert('Password reset successfully! Please login with your new password.');
        setAuthMode('login');
        setStep('form');
        setFormData(prev => ({ ...prev, otp: '', password: '' }));
      } else {
        setError(result.error || 'Password reset failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderChoiceStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl">Welcome to CyberGuard</h2>
        <p className="text-sm text-slate-600 mt-2">
          Choose your authentication method
        </p>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={() => setAuthMode('login')}
          className="w-full h-12 justify-start bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200"
          variant="ghost"
        >
          <Lock className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Login</div>
            <div className="text-xs text-slate-600">Existing users</div>
          </div>
        </Button>

        <Button 
          onClick={() => setAuthMode('register')}
          className="w-full h-12 justify-start bg-green-50 hover:bg-green-100 text-green-900 border border-green-200"
          variant="ghost"
        >
          <UserPlus className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Register</div>
            <div className="text-xs text-slate-600">New users with Aadhaar</div>
          </div>
        </Button>
      </div>
    </div>
  );

  const renderRegistrationForm = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl">Register with Aadhaar</h2>
        <p className="text-sm text-slate-600 mt-2">
          Create your secure CyberGuard account
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="As per Aadhaar card"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="aadhaar">Aadhaar Number</Label>
          <Input
            id="aadhaar"
            type="text"
            placeholder="1234 5678 9012"
            value={formData.aadhaarNumber}
            onChange={(e) => handleInputChange('aadhaarNumber', e.target.value.replace(/\D/g, ''))}
            maxLength={12}
            className="tracking-widest"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex">
            <div className="flex items-center px-3 bg-slate-100 border border-r-0 rounded-l-md">
              <span className="text-sm text-slate-600">+91</span>
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="9876543210"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
              className="rounded-l-none"
              maxLength={10}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            type="text"
            placeholder="Current address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>

        {userType === 'official' && (
          <div>
            <Label htmlFor="govid">Government Employee ID</Label>
            <Input
              id="govid"
              type="text"
              placeholder="e.g., IND/CYB/2024/001"
              value={formData.governmentId}
              onChange={(e) => handleInputChange('governmentId', e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-xs text-amber-800">
          Your information is encrypted and used only for identity verification.
          We comply with all data protection regulations.
        </p>
      </div>

      <Button 
        onClick={handleRegister}
        disabled={loading}
        className="w-full cyber-gradient text-white"
      >
        {loading ? 'Registering...' : 'Register & Send OTP'}
      </Button>

      <Button 
        variant="ghost" 
        onClick={() => setAuthMode('choice')}
        className="w-full"
      >
        Back to Options
      </Button>
    </div>
  );

  const renderLoginForm = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl">Login to CyberGuard</h2>
        <p className="text-sm text-slate-600 mt-2">
          Enter your credentials to continue
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            type="text"
            placeholder="e.g., CG123456"
            value={formData.userId}
            onChange={(e) => handleInputChange('userId', e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            <Button 
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleLogin}
        disabled={loading}
        className="w-full cyber-gradient text-white"
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      <div className="flex justify-between text-sm">
        <Button 
          variant="ghost" 
          onClick={() => setAuthMode('forgot')}
          className="text-blue-600 hover:text-blue-800 p-0 h-auto"
        >
          Forgot Password?
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => setAuthMode('choice')}
          className="text-slate-600 hover:text-slate-800 p-0 h-auto"
        >
          Back to Options
        </Button>
      </div>
    </div>
  );

  const renderForgotPasswordForm = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl">Forgot Password</h2>
        <p className="text-sm text-slate-600 mt-2">
          Enter your User ID to reset password
        </p>
      </div>

      <div>
        <Label htmlFor="userId">User ID</Label>
        <Input
          id="userId"
          type="text"
          placeholder="e.g., CG123456"
          value={formData.userId}
          onChange={(e) => handleInputChange('userId', e.target.value.toUpperCase())}
        />
      </div>

      <Button 
        onClick={handleForgotPassword}
        disabled={loading}
        className="w-full cyber-gradient text-white"
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </Button>

      <Button 
        variant="ghost" 
        onClick={() => setAuthMode('login')}
        className="w-full"
      >
        Back to Login
      </Button>
    </div>
  );

  const renderOTPStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl">Enter OTP</h2>
        <p className="text-sm text-slate-600 mt-2">
          {authMode === 'register' 
            ? `Enter the 6-digit code sent to +91 ${formData.phoneNumber}`
            : 'Enter the 6-digit code sent to your registered phone number'
          }
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP value={formData.otp} onChange={(value) => handleInputChange('otp', value)} maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button 
        onClick={authMode === 'register' ? handleVerifyRegistrationOTP : 
                authMode === 'forgot' ? () => setStep('password') : handleVerifyRegistrationOTP}
        disabled={loading || formData.otp.length !== 6}
        className="w-full cyber-gradient text-white"
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </Button>

      <Button 
        variant="ghost" 
        onClick={() => {
          setStep('form');
          setFormData(prev => ({ ...prev, otp: '' }));
        }}
        className="w-full"
      >
        Change Details
      </Button>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl">
          {authMode === 'register' ? 'Set Your Password' : 'Reset Password'}
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          {authMode === 'register' 
            ? `Your User ID is: ${formData.generatedUserId}`
            : 'Enter your new password'
          }
        </p>
      </div>

      {authMode === 'forgot' && (
        <div>
          <Label htmlFor="otp">Enter OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="6-digit OTP"
            value={formData.otp}
            onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, ''))}
            maxLength={6}
          />
        </div>
      )}

      <div>
        <Label htmlFor="password">
          {authMode === 'register' ? 'Create Password' : 'New Password'}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <Button 
        onClick={authMode === 'register' ? handleSetPassword : handleResetPassword}
        disabled={loading}
        className="w-full cyber-gradient text-white"
      >
        {loading ? 'Setting Password...' : 
         authMode === 'register' ? 'Complete Registration' : 'Reset Password'}
      </Button>

      {authMode === 'register' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-800">
            <strong>Important:</strong> Save your User ID ({formData.generatedUserId}) safely. 
            You'll need it to login.
          </p>
        </div>
      )}
    </div>
  );

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
              Indore Cybercrime Reporting System
            </p>
          </div>
        </div>

        {/* User Type Selector */}
        {(authMode === 'register' || authMode === 'choice') && (
          <div className="flex gap-2 p-1 bg-white/10 rounded-lg">
            <Button
              variant={userType === 'user' ? 'default' : 'ghost'}
              onClick={() => setUserType('user')}
              className={`flex-1 text-sm ${userType === 'user' ? 'bg-white text-blue-900' : 'text-white hover:bg-white/20'}`}
            >
              <User className="w-4 h-4 mr-2" />
              Citizen
            </Button>
            <Button
              variant={userType === 'official' ? 'default' : 'ghost'}
              onClick={() => setUserType('official')}
              className={`flex-1 text-sm ${userType === 'official' ? 'bg-white text-blue-900' : 'text-white hover:bg-white/20'}`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Official
            </Button>
          </div>
        )}

        {/* Auth Card */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              {userType === 'official' ? (
                <Settings className="w-5 h-5 text-blue-600" />
              ) : (
                <User className="w-5 h-5 text-blue-600" />
              )}
              <h2 className="text-lg">
                {authMode === 'login' ? 'Login' :
                 authMode === 'register' ? 'Register' :
                 authMode === 'forgot' ? 'Reset Password' : 'Authentication'}
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              {userType === 'official' 
                ? 'Government officials and authorized personnel' 
                : 'Citizens reporting cybercrime incidents'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {authMode === 'choice' && renderChoiceStep()}
            {authMode === 'register' && step === 'form' && renderRegistrationForm()}
            {authMode === 'login' && step === 'form' && renderLoginForm()}
            {authMode === 'forgot' && step === 'form' && renderForgotPasswordForm()}
            {step === 'otp' && renderOTPStep()}
            {step === 'password' && renderPasswordStep()}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-blue-200 text-xs">
            Secure authentication with Aadhaar verification
          </p>
        </div>
      </div>
    </div>
  );
}