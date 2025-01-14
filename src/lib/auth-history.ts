import { auth } from './firebase';

export interface LoginSession {
  id: string;
  timestamp: Date;
  ip: string;
  device: string;
  browser: string;
  location?: string;
  current: boolean;
}

const STORAGE_KEY = 'login_history';

export async function trackLogin(): Promise<void> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const { ip } = await response.json();
    
    const userAgent = window.navigator.userAgent;
    const browser = getBrowserInfo(userAgent);
    const device = getDeviceInfo(userAgent);
    
    const session: LoginSession = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ip,
      device,
      browser,
      current: true
    };

    // Get location info
    try {
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoResponse.json();
      session.location = `${geoData.city}, ${geoData.country_name}`;
    } catch (error) {
      console.error('Error getting location:', error);
    }

    const history = await getLoginHistory();
    
    // Mark all other sessions as not current
    history.forEach(s => s.current = false);
    
    // Add new session
    history.unshift(session);
    
    // Keep only last 10 sessions
    const trimmedHistory = history.slice(0, 10);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error tracking login:', error);
  }
}

export async function getLoginHistory(): Promise<LoginSession[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored).map((session: any) => ({
      ...session,
      timestamp: new Date(session.timestamp)
    }));
  } catch (error) {
    console.error('Error getting login history:', error);
    return [];
  }
}

function getBrowserInfo(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown Browser';
}

function getDeviceInfo(userAgent: string): string {
  if (userAgent.includes('Mobile')) return 'Mobile';
  if (userAgent.includes('Tablet')) return 'Tablet';
  return 'Desktop';
}