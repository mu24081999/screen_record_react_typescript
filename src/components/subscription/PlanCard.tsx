import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { PlanType, PLANS, getCurrentPlan } from '../../lib/subscription';
import { clsx } from 'clsx';

interface PlanCardProps {
  type: PlanType;
  onSelect: () => void;
}

export function PlanCard({ type, onSelect }: PlanCardProps) {
  const plan = PLANS[type];
  const currentPlan = getCurrentPlan();
  const isCurrentPlan = currentPlan === type;

  return (
    <div className={clsx(
      'rounded-lg border p-6 transition-all duration-200',
      isCurrentPlan 
        ? 'border-black dark:border-white ring-1 ring-black dark:ring-white'
        : 'border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white'
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${plan.price}
            </span>
            {plan.price > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
            )}
          </div>
        </div>
        {isCurrentPlan && (
          <span className="rounded-full bg-black dark:bg-white px-3 py-1 text-xs font-medium text-white dark:text-black">
            Current Plan
          </span>
        )}
      </div>

      <ul className="mt-6 space-y-4">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="h-5 w-5 flex-shrink-0 text-black dark:text-white" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className="mt-8 w-full"
        variant={isCurrentPlan ? 'outline' : 'primary'}
        onClick={onSelect}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
      </Button>
    </div>
  );
}