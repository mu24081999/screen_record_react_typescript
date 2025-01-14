import { useState } from 'react';
import { Monitor, Video as VideoIcon, Mic, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { screenRecorder, RecordingOptions } from '../../lib/recording';
import { RecordingControls } from './RecordingControls';
import toast from 'react-hot-toast';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecordingModal({ isOpen, onClose }: RecordingModalProps) {
  const [selectedScreen, setSelectedScreen] = useState<string>('');
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);

  if (!isOpen) return null;

  async function handleStartRecording() {
    try {
      const options: RecordingOptions = {
        screenId: selectedScreen || undefined,
        cameraId: selectedCamera || undefined,
        audioSource: selectedAudio as 'system' | 'microphone' | 'both' || undefined,
      };

      await screenRecorder.startRecording(options);
      setIsRecording(true);
      onClose();
      toast.success('Recording started!');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  }

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  if (isRecording) {
    return <RecordingControls onStopRecording={handleStopRecording} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recording Settings</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Screen Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Monitor className="h-5 w-5" />
              Select Screen
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              value={selectedScreen}
              onChange={(e) => setSelectedScreen(e.target.value)}
            >
              <option value="">Choose screen to record</option>
              <option value="entire-screen">Entire Screen</option>
              <option value="window">Application Window</option>
              <option value="browser-tab">Browser Tab</option>
            </select>
          </div>

          {/* Camera Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <VideoIcon className="h-5 w-5" />
              Select Camera
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
            >
              <option value="">Choose camera</option>
              <option value="webcam">Webcam</option>
            </select>
          </div>

          {/* Audio Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mic className="h-5 w-5" />
              Select Audio
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              value={selectedAudio}
              onChange={(e) => setSelectedAudio(e.target.value)}
            >
              <option value="">Choose audio source</option>
              <option value="system">System Audio</option>
              <option value="microphone">Microphone</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleStartRecording}>
              Start Recording
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}