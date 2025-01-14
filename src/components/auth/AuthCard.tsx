import { ReactNode } from 'react';
import { Camera } from 'lucide-react';

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Camera className="h-10 w-10 text-black dark:text-white" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 px-6 py-8 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700 sm:rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}