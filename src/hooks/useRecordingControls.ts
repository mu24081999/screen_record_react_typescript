import { useState, useEffect, useCallback } from 'react';
import { screenRecorder } from '../lib/recording';
import { saveRecording } from '../lib/recordings-store';
import toast from 'react-hot-toast';

export function useRecordingControls(onStopRecording: () => void) {
  const [recordingState, setRecordingState] = useState({
    isRecording: false,
    isPaused: false,
    duration: 0,
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

  const handlePauseResume = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (recordingState.isPaused) {
      screenRecorder.resumeRecording();
    } else {
      screenRecorder.pauseRecording();
    }
  }, [recordingState.isPaused]);

  const handleStop = useCallback(async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

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
      onStopRecording();
      toast.success('Recording saved successfully!');
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast.error('Failed to stop recording');
      onStopRecording();
    }
  }, [recordingState.duration, onStopRecording]);

  return {
    recordingState,
    handlePauseResume,
    handleStop,
  };
}