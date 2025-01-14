import { useState } from 'react';
import { Camera, Mic, Video } from 'lucide-react';
import { Button } from '../ui/Button';

interface RecordingOptionsProps {
  onStart: (options: {
    useWebcam: boolean;
    audioSource: 'system' | 'microphone' | 'both' | 'none';
  }) => void;
  onCancel: () => void;
}

export function RecordingOptions({ onStart, onCancel }: RecordingOptionsProps) {
  const [useWebcam, setUseWebcam] = useState(false);
  const [audioSource, setAudioSource] = useState<'system' | 'microphone' | 'both' | 'none'>('both');

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recording Options</h2>
      
      <div className="mt-6 space-y-6">
        {/* Webcam Option */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={useWebcam}
              onChange={(e) => setUseWebcam(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <Camera className="h-5 w-5" />
            <span>Include webcam</span>
          </label>
        </div>

        {/* Audio Options */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Mic className="h-5 w-5" />
            <span className="font-medium">Audio Source</span>
          </div>
          
          <div className="ml-7 space-y-2">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="audio"
                value="system"
                checked={audioSource === 'system'}
                onChange={(e) => setAudioSource(e.target.value as any)}
                className="h-4 w-4 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>System Audio Only</span>
            </label>
            
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="audio"
                value="microphone"
                checked={audioSource === 'microphone'}
                onChange={(e) => setAudioSource(e.target.value as any)}
                className="h-4 w-4 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Microphone Only</span>
            </label>
            
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="audio"
                value="both"
                checked={audioSource === 'both'}
                onChange={(e) => setAudioSource(e.target.value as any)}
                className="h-4 w-4 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Both System and Microphone</span>
            </label>
            
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="audio"
                value="none"
                checked={audioSource === 'none'}
                onChange={(e) => setAudioSource(e.target.value as any)}
                className="h-4 w-4 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>No Audio</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onStart({ useWebcam, audioSource })}>
          Start Recording
        </Button>
      </div>
    </div>
  );
}