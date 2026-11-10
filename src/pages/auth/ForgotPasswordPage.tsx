import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { success } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    success(`Reset code sent to ${email}`, 'OTP Sent');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your registered email and we'll send a 6-digit verification code.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. alex@swigi.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full shadow-lg shadow-orange-500/25"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Send Verification Code
          </Button>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-xs text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
            We dispatched a 6-digit code to <b>{email}</b>. Use code <b>123456</b> in our demo!
          </div>

          <Button
            onClick={() => navigate('/otp?email=' + encodeURIComponent(email))}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Enter Verification Code
          </Button>
        </div>
      )}

      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <Link to="/login" className="font-bold text-orange-500 hover:underline flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

