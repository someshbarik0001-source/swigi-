import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setLoading(true);
    // Move to simulated OTP screen with query state or register
    const success = await signup(name, email, phone);
    setLoading(false);

    if (success) {
      navigate('/otp?email=' + encodeURIComponent(email));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create an Account</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Join Swigi for fast deliveries and exclusive culinary discounts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Karthik Raju"
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Campus Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. karthik_raju@srmap.edu.in"
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98480 00000"
          leftIcon={<Phone className="w-4 h-4" />}
          required
        />

        <Input
          label="Create Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full shadow-lg shadow-orange-500/25 mt-2"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Verify Phone & Register
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-orange-500 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

