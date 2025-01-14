import { useState } from 'react';
import { Video } from 'lucide-react';
import { useRecording } from '../../contexts/RecordingContext';
import { RecordingOptions } from './RecordingOptions';
import { clsx } from 'clsx';

export function FloatingRecordButton() {
  const { isRecording, startRecording } = useRecording();
  const [showOptions, setShowOptions] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  if (isRecording) {
    return null;
  }

  const handleClick = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setIsExpanding(false);
      setShowOptions(true);
    }, 300);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={clsx(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center",
          "rounded-full bg-black text-white shadow-lg transition-all duration-300",
          "dark:bg-white dark:text-black hover:scale-105",
          isExpanding ? "h-screen w-screen bottom-0 right-0 rounded-none" : "h-14 w-14"
        )}
      >
        <Video className={clsx(
          "h-6 w-6 transition-all duration-300",
          isExpanding && "scale-150 opacity-0"
        )} />
      </button>

      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-200">
            <RecordingOptions
              onStart={startRecording}
              onCancel={() => setShowOptions(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}