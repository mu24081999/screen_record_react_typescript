import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecording } from '../contexts/RecordingContext';
import { voiceCommandManager } from '../lib/voice-commands';

export function useVoiceCommands() {
  const navigate = useNavigate();
  const { startRecording, stopRecording, pauseRecording, resumeRecording, isRecording, isPaused } = useRecording();

  useEffect(() => {
    // Navigation commands
    voiceCommandManager.registerCommand({
      keywords: ['go to home', 'open home', 'show home'],
      handler: () => navigate('/dashboard'),
      description: 'Navigate to home page'
    });

    voiceCommandManager.registerCommand({
      keywords: ['go to library', 'open library', 'show library'],
      handler: () => navigate('/library'),
      description: 'Navigate to library page'
    });

    voiceCommandManager.registerCommand({
      keywords: ['go to settings', 'open settings', 'show settings'],
      handler: () => navigate('/settings'),
      description: 'Navigate to settings page'
    });

    // Recording commands
    voiceCommandManager.registerCommand({
      keywords: ['start recording', 'begin recording', 'record screen'],
      handler: () => {
        if (!isRecording) {
          startRecording({ useWebcam: false, audioSource: 'both' });
        }
      },
      description: 'Start screen recording'
    });

    voiceCommandManager.registerCommand({
      keywords: ['stop recording', 'end recording', 'finish recording'],
      handler: () => {
        if (isRecording) {
          stopRecording();
        }
      },
      description: 'Stop current recording'
    });

    voiceCommandManager.registerCommand({
      keywords: ['pause recording', 'pause'],
      handler: () => {
        if (isRecording && !isPaused) {
          pauseRecording();
        }
      },
      description: 'Pause current recording'
    });

    voiceCommandManager.registerCommand({
      keywords: ['resume recording', 'continue recording'],
      handler: () => {
        if (isRecording && isPaused) {
          resumeRecording();
        }
      },
      description: 'Resume paused recording'
    });
  }, [navigate, startRecording, stopRecording, pauseRecording, resumeRecording, isRecording, isPaused]);
}