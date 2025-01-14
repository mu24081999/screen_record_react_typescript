import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      // TODO: Integrate with Stripe
      toast.error('Stripe integration coming soon!');
    } catch (error) {
      toast.error('Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upgrade to Pro
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Upgrade to Pro to unlock unlimited videos and downloads.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Pro Plan</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">$14/month</span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Save 10% with annual billing
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleUpgrade}
              isLoading={isLoading}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}