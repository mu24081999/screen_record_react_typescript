import { useState } from 'react';
import { X, Users, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMembers: (emails: string[], quantity: number) => Promise<void>;
}

export function AddMembersModal({ isOpen, onClose, onAddMembers }: AddMembersModalProps) {
  const [step, setStep] = useState<'quantity' | 'payment' | 'emails'>('quantity');
  const [quantity, setQuantity] = useState(1);
  const [emails, setEmails] = useState<string[]>(['']);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCost = quantity * 2; // $2 per member

  const handleQuantitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < 1) {
      toast.error('Please enter a valid quantity');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      // TODO: Integrate with real payment processor
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate payment
      toast.success('Payment successful');
      setStep('emails');
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    if (emails.length < quantity) {
      setEmails([...emails, '']);
    }
  };

  const removeEmailField = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate emails
    const validEmails = emails.filter(email => email.trim() !== '');
    if (validEmails.length === 0) {
      toast.error('Please enter at least one email');
      return;
    }

    if (validEmails.length > quantity) {
      toast.error(`You can only invite ${quantity} members`);
      return;
    }

    try {
      setIsProcessing(true);
      await onAddMembers(validEmails, quantity);
      onClose();
      setStep('quantity');
      setQuantity(1);
      setEmails(['']);
    } catch (error) {
      toast.error('Failed to add members');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Team Members
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {step === 'quantity' && (
          <form onSubmit={handleQuantitySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How many members do you want to add?
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="text-lg"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Cost: ${totalCost} (${2} per member)
              </p>
            </div>
            <Button type="submit" className="w-full">
              Continue to Payment
            </Button>
          </form>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Team Members</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Cost</span>
                <span className="text-lg font-bold">${totalCost}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handlePayment}
              isLoading={isProcessing}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ${totalCost}
            </Button>
          </div>
        )}

        {step === 'emails' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                  {emails.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeEmailField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {emails.length < quantity && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addEmailField}
              >
                Add Another Email
              </Button>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isProcessing}
            >
              <Users className="mr-2 h-4 w-4" />
              Send Invitations
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}