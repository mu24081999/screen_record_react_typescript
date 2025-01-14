import toast from 'react-hot-toast';
import { StreamManager } from './stream-manager';
import { RecordingOptions, RecordingState } from './types';

class Recorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private streamManager: StreamManager;
  private startTime: number = 0;
  private duration: number = 0;
  private pauseStartTime: number | null = null;
  private totalPauseDuration: number = 0;
  private durationInterval: NodeJS.Timer | null = null;
  private onStateChange: (() => void) | null = null;

  constructor() {
    this.streamManager = new StreamManager();
  }

  setOnStateChange(callback: (() => void) | null) {
    this.onStateChange = callback;
  }

  private notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange();
    }
  }

  async startRecording(options: RecordingOptions): Promise<void> {
    try {
      const stream = await this.streamManager.setupRecording(options);

      // Find supported mime type
      const mimeTypes = [
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=h264,opus',
        'video/webm',
      ];

      const supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));
      
      if (!supportedMimeType) {
        throw new Error('No supported recording format found');
      }

      // Configure MediaRecorder with lower bitrate for better compatibility
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
        videoBitsPerSecond: 1000000, // 1 Mbps
        audioBitsPerSecond: 128000   // 128 kbps
      });

      this.recordedChunks = [];
      this.startTime = Date.now();
      this.duration = 0;
      this.totalPauseDuration = 0;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      // Start recording with smaller chunks for better memory management
      this.mediaRecorder.start(500);

      this.durationInterval = setInterval(() => {
        if (!this.pauseStartTime) {
          this.duration = Math.floor((Date.now() - this.startTime - this.totalPauseDuration) / 1000);
          this.notifyStateChange();
        }
      }, 1000);

      this.notifyStateChange();
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      this.cleanup();
      throw error;
    }
  }

  pauseRecording(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.pause();
      this.pauseStartTime = Date.now();
      this.notifyStateChange();
      toast.success('Recording paused');
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder?.state === 'paused') {
      this.mediaRecorder.resume();
      if (this.pauseStartTime) {
        this.totalPauseDuration += Date.now() - this.pauseStartTime;
        this.pauseStartTime = null;
      }
      this.notifyStateChange();
      toast.success('Recording resumed');
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.cleanup();
        reject(new Error('No active recording'));
        return;
      }

      const handleStop = () => {
        try {
          const finalBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
          this.cleanup();
          resolve(finalBlob);
        } catch (error) {
          this.cleanup();
          reject(error);
        }
      };

      this.mediaRecorder.onstop = handleStop;
      this.mediaRecorder.stop();
      this.streamManager.stopRecording();
    });
  }

  private cleanup(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }

    this.streamManager.cleanup();
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.notifyStateChange();
  }

  getState(): RecordingState {
    return {
      isRecording: this.mediaRecorder?.state === 'recording',
      isPaused: this.mediaRecorder?.state === 'paused',
      duration: this.duration
    };
  }
}

export const recorder = new Recorder();