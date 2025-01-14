import { useEffect, useState } from 'react';
import { Shield, Globe, Monitor, Clock } from 'lucide-react';
import { getLoginHistory, LoginSession } from '../../lib/auth-history';
import { formatDistanceToNow } from 'date-fns';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function LoginHistory() {
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      setIsLoading(true);
      const history = await getLoginHistory();
      setSessions(history);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Login History
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your recent login activity
        </p>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {session.device} • {session.browser}
                </span>
                {session.current && (
                  <span className="ml-2 rounded-full bg-green-100 dark:bg-green-900 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-100">
                    Current Session
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{formatDistanceToNow(session.timestamp)} ago</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>IP: {session.ip}</span>
              </div>
              {session.location && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{session.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {sessions.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No login history available
          </p>
        )}
      </div>
    </div>
  );
}