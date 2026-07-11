import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Check } from 'lucide-react';
import axios from 'axios';
import useStore, { API_URL } from '../store/useStore';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { user, login, register, authLoading, authError } = useStore();

  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === 'login') {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      try {
        await login(email, password);
      } catch (err) {
        // Handled by store
      }
    } else if (mode === 'register') {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        await register(name, email, password);
      } catch (err) {
        // Handled by store
      }
    } else if (mode === 'forgot') {
      if (!email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setLoading(true);
      try {
        await axios.post(`${API_URL}/users/forgot-password`, { email, newPassword: password });
        setSuccess('Password updated successfully! You can now login.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="border border-gray-100 bg-white rounded-lg p-8 shadow-md space-y-6">
        
        {/* Toggle Title Headers */}
        <div className="flex border-b border-gray-100 pb-3 justify-center gap-8">
          <button
            onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
            className={`text-lg font-bold pb-2 border-b-2 transition-all ${
              mode === 'login' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
            className={`text-lg font-bold pb-2 border-b-2 transition-all ${
              mode === 'register' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* Success notifications */}
        {success && (
          <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-3 rounded border border-emerald-100 flex items-center gap-1.5 animate-fadeIn">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Error notifications */}
        {(error || authError) && (
          <div className="bg-red-50 text-red-800 text-xs font-semibold p-3 rounded border border-red-100 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error || authError}</span>
          </div>
        )}

        {/* Input Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'forgot' && (
            <p className="text-xs text-gray-500 font-light pb-2">
              Enter your account email and specify your desired new password.
            </p>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              {mode === 'forgot' ? 'New Password' : 'Password'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple"
            />
          </div>

          {['register', 'forgot'].includes(mode) && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple"
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
                className="text-xs text-brand-purple hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading || loading}
            className="w-full bg-brand-purple hover:bg-brand-purpleHover text-white font-semibold py-3 rounded transition-colors text-sm shadow-md flex items-center justify-center gap-1.5"
          >
            {authLoading || loading 
              ? 'Please wait...' 
              : mode === 'login' 
                ? 'Sign In' 
                : mode === 'register' 
                  ? 'Create Account' 
                  : 'Update Password'}
            {!(authLoading || loading) && <ArrowRight className="h-4 w-4" />}
          </button>

          {mode === 'forgot' && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className="text-xs text-gray-400 hover:text-brand-purple font-medium"
              >
                Back to Sign In
              </button>
            </div>
          )}

        </form>



      </div>
    </div>
  );
}
