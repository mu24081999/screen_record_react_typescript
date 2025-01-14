import { useState } from 'react';
import { Video } from 'lucide-react';
import { useRecording } from '../../contexts/RecordingContext';
import { RecordingOptions } from '../../components/recording/RecordingOptions';
import { AnimatedBackground } from '../../components/background/AnimatedBackground';

export function Dashboard() {
  const { isRecording, startRecording } = useRecording();
  const [showOptions, setShowOptions] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleStartClick = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setIsExpanding(false);
      setShowOptions(true);
    }, 300);
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] items-center justify-center">
      <AnimatedBackground />
      
      {!isRecording && !showOptions && (
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleStartClick}
            className="group relative flex flex-col items-center gap-4 transition-transform hover:scale-105"
          >
            <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-black dark:bg-white shadow-lg transition-all duration-300 group-hover:shadow-xl ${
              isExpanding ? 'scale-[100] opacity-0' : 'scale-100 opacity-100'
            }`}>
              <Video className="h-12 w-12 text-white dark:text-black" />
            </div>
            <div className={`text-center transition-opacity duration-300 ${
              isExpanding ? 'opacity-0' : 'opacity-100'
            }`}>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Start Recording</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click to record your screen and audio</p>
            </div>
          </button>
        </div>
      )}

      {showOptions && (
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <RecordingOptions
            onStart={startRecording}
            onCancel={() => setShowOptions(false)}
          />
        </div>
      )}
    </div>
  );
}