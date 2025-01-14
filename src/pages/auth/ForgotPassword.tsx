import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AuthCard } from '../../components/auth/AuthCard';
import toast from 'react-hot-toast';

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard title="Reset your password">
      {isEmailSent ? (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check your email for a reset link. The link will expire in 1 hour.
          </p>
          <Link
            to="/signin"
            className="mt-4 inline-block font-semibold text-black hover:text-black/80 dark:text-white dark:hover:text-white/80"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Send reset link
          </Button>

          <div className="text-center">
            <Link
              to="/signin"
              className="text-sm font-semibold text-black hover:text-black/80 dark:text-white dark:hover:text-white/80"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
}