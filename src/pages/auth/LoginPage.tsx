import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const success = await login(email);
    setLoading(false);

    if (success) {
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
    setLoading(true);
    const success = await login(demoEmail);
    setLoading(false);
    if (success) {
      if (demoEmail.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Sign in to your Swigi account to order your favorites.
        </p>
      </div>

      {/* Quick Demo Pre-fills */}
      <div className="p-3 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-800/40 space-y-2">
        <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> SRM AP Demo 1-Click Sign-In
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('rohan_varma@srmap.edu.in')}
            className="text-xs py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:border-orange-500 transition-colors text-left"
          >
            Rohan (Student)
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('dining_admin@srmap.edu.in')}
            className="text-xs py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:border-orange-500 transition-colors text-left"
          >
            Dining Admin
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Campus Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. rohan_varma@srmap.edu.in"
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <div>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-orange-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full shadow-lg shadow-orange-500/25"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        Don't have an account yet?{' '}
        <Link to="/signup" className="font-bold text-orange-500 hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};

