import React, { useState } from 'react';
import { Ship, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl material-shadow-3 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-4">
              <Ship className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
            <p className="text-muted-foreground text-sm mt-1">We'll send you a reset link</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-success mx-auto" />
              <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
              <p className="text-muted-foreground text-sm">We've sent a password reset link to <strong>{email}</strong></p>
              <a href="/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-4">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  className={error ? 'border-destructive' : ''}
                />
                {error && <p className="text-destructive text-xs">{error}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <div className="text-center">
                <a href="/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <ArrowLeft className="w-4 h-4" /> Back to login
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
