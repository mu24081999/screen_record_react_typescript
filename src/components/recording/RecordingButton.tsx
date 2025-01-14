import { useState } from 'react';
import { Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { RecordingModal } from './RecordingModal';

export function RecordingButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Start Recording</h1>
          <p className="text-gray-600">Record your screen, camera, and audio with just one click</p>
        </div>
        
        <Button
          className="h-16 w-16 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          <Video className="h-8 w-8" />
        </Button>
        
        <p className="text-sm text-gray-500">Click to start recording</p>
      </div>

      <RecordingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}