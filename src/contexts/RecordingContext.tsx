import { createContext, useContext, useState, useEffect } from 'react';
import { screenRecorder, RecordingState } from '../lib/recording';
import { saveRecording } from '../lib/recordings-store';
import { RecordingControls } from '../components/recording/RecordingControls';
import toast from 'react-hot-toast';

interface RecordingContextType {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  startRecording: (options: { useWebcam: boolean; audioSource: 'system' | 'microphone' | 'both' | 'none' }) => Promise<void>;
  stopRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
}

const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

export function RecordingProvider({ children }: { children: React.ReactNode }) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0
  });

  useEffect(() => {
    const updateState = () => {
      setRecordingState(screenRecorder.getState());
    };

    screenRecorder.setOnStateChange(updateState);
    updateState();

    return () => {
      screenRecorder.setOnStateChange(null);
    };
  }, []);

  const startRecording = async (options: { useWebcam: boolean; audioSource: 'system' | 'microphone' | 'both' | 'none' }) => {
    try {
      await screenRecorder.startRecording(options);
      toast.success('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to start recording');
      throw error;
    }
  };

  const stopRecording = async () => {
    try {
      const blob = await screenRecorder.stopRecording();
      const timestamp = new Date().toLocaleString();
      await saveRecording({
        title: `Recording - ${timestamp}`,
        blob,
        duration: recordingState.duration,
        createdAt: new Date(),
        views: 0
      });
      toast.success('Recording saved successfully!');
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast.error('Failed to stop recording');
      throw error;
    }
  };

  const pauseRecording = () => {
    screenRecorder.pauseRecording();
  };

  const resumeRecording = () => {
    screenRecorder.resumeRecording();
  };

  return (
    <RecordingContext.Provider
      value={{
        ...recordingState,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording
      }}
    >
      {children}
      {recordingState.isRecording && (
        <RecordingControls onStopRecording={stopRecording} />
      )}
    </RecordingContext.Provider>
  );
}

export function useRecording() {
  const context = useContext(RecordingContext);
  if (context === undefined) {
    throw new Error('useRecording must be used within a RecordingProvider');
  }
  return context;
}