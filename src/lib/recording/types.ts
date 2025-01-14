export interface RecordingOptions {
  audioSource?: 'system' | 'microphone' | 'both' | 'none';
  useWebcam?: boolean;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
}

export interface StreamConfig {
  displayStream?: MediaStream;
  microphoneStream?: MediaStream;
  webcamStream?: MediaStream;
}