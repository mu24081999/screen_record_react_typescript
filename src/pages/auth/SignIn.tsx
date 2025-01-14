import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AuthCard } from '../../components/auth/AuthCard';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { setRememberMe, getRememberMe } from '../../lib/auth-store';
import { trackLogin } from '../../lib/auth-history';
import toast from 'react-hot-toast';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMeState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setRememberMeState(getRememberMe());
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      setIsLoading(true);
      await setRememberMe(rememberMe);
      await signInWithEmailAndPassword(auth, email, password);
      await trackLogin();
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard title="Sign in to your account">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMeState(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Remember me for 30 days
            </span>
          </label>
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-semibold text-black hover:text-black/80 dark:text-white dark:hover:text-white/80"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Sign in
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleSignInButton />

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="font-semibold text-black hover:text-black/80 dark:text-white dark:hover:text-white/80"
        >
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}