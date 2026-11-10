import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

export const OtpVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'alex@swigi.com';
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      error('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success('Verification successful! Account session active.', 'Verified');
      navigate('/profile');
    }, 600);
  };

  const handleResend = () => {
    setTimer(45);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    success('A new 6-digit code was sent to your phone/email.');
  };

  return (
    <div className="space-y-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mx-auto shadow-inner">
        <ShieldCheck className="w-7 h-7" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verify Account Code</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          We sent a verification code to <b className="text-slate-800 dark:text-slate-200">{email}</b>.
        </p>
        <span className="text-[11px] text-orange-500 font-mono mt-1 block">
          Demo Code: Any 6 digits (e.g. 1 2 3 4 5 6)
        </span>
      </div>

      {/* 6 Digit Inputs */}
      <div className="flex justify-center gap-2 sm:gap-3 py-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
          />
        ))}
      </div>

      <Button
        onClick={handleVerify}
        isLoading={loading}
        variant="primary"
        size="lg"
        className="w-full shadow-lg shadow-orange-500/25"
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Confirm & Continue
      </Button>

      {/* Resend countdown */}
      <div className="text-xs text-slate-500 pt-2">
        {timer > 0 ? (
          <span>Resend code in {timer}s</span>
        ) : (
          <button
            onClick={handleResend}
            className="text-orange-500 hover:underline font-bold inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resend Code</span>
          </button>
        )}
      </div>
    </div>
  );
};

