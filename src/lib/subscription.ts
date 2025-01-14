import { getRecordings } from './recordings-store';

export type PlanType = 'free' | 'pro';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  videoLimit: number;
  downloadLimit: number;
}

export const PLANS: Record<PlanType, Plan> = {
  free: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    features: [
      'Up to 30 videos',
      '5 downloads per month',
      'Basic recording features',
      'Standard quality'
    ],
    videoLimit: 30,
    downloadLimit: 5
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    price: 14,
    features: [
      'Unlimited videos',
      'Unlimited downloads',
      'Advanced recording features',
      'HD quality',
      'Priority support'
    ],
    videoLimit: Infinity,
    downloadLimit: Infinity
  }
};

// Get current plan from localStorage
export function getCurrentPlan(): PlanType {
  return (localStorage.getItem('current_plan') as PlanType) || 'free';
}

// Check if user has reached video limit
export async function hasReachedVideoLimit(): Promise<boolean> {
  const currentPlan = getCurrentPlan();
  const recordings = await getRecordings();
  return recordings.length >= PLANS[currentPlan].videoLimit;
}

// Track downloads
const DOWNLOADS_KEY = 'monthly_downloads';

interface DownloadTracker {
  count: number;
  resetDate: string; // ISO string
}

export function getDownloadsRemaining(): number {
  const currentPlan = getCurrentPlan();
  const tracker = getDownloadTracker();
  return Math.max(0, PLANS[currentPlan].downloadLimit - tracker.count);
}

export function canDownload(): boolean {
  const currentPlan = getCurrentPlan();
  if (currentPlan === 'pro') return true;
  return getDownloadsRemaining() > 0;
}

function getDownloadTracker(): DownloadTracker {
  const stored = localStorage.getItem(DOWNLOADS_KEY);
  if (!stored) {
    const tracker = {
      count: 0,
      resetDate: new Date().toISOString()
    };
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(tracker));
    return tracker;
  }

  const tracker = JSON.parse(stored);
  const resetDate = new Date(tracker.resetDate);
  const now = new Date();

  // Reset counter if it's a new month
  if (resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
    const newTracker = {
      count: 0,
      resetDate: now.toISOString()
    };
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(newTracker));
    return newTracker;
  }

  return tracker;
}

export function trackDownload(): void {
  const tracker = getDownloadTracker();
  tracker.count++;
  localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(tracker));
}