import toast from 'react-hot-toast';

export interface RecordingOptions {
  audioSource?: 'system' | 'microphone' | 'both' | 'none';
  useWebcam?: boolean;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
}

class ScreenRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private streams: MediaStream[] = [];
  private webcamElement: HTMLVideoElement | null = null;
  private startTime: number = 0;
  private duration: number = 0;
  private pauseStartTime: number | null = null;
  private totalPauseDuration: number = 0;
  private durationInterval: NodeJS.Timer | null = null;
  private onStateChange: (() => void) | null = null;

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
      // Get screen capture stream with system audio
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: options.audioSource !== 'none' && options.audioSource !== 'microphone'
      });

      this.streams.push(displayStream);

      // Add microphone if selected
      if (options.audioSource === 'microphone' || options.audioSource === 'both') {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
          this.streams.push(micStream);
        } catch (error) {
          console.error('Microphone access denied:', error);
          toast.error('Failed to access microphone');
        }
      }

      // Add webcam if selected
      if (options.useWebcam) {
        try {
          const webcamStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 320 },
              height: { ideal: 180 },
              facingMode: 'user'
            }
          });
          this.streams.push(webcamStream);
          this.createWebcamOverlay(webcamStream);
        } catch (error) {
          console.error('Webcam access denied:', error);
          toast.error('Failed to access webcam');
        }
      }

      // Combine all tracks from all streams
      const tracks = this.streams.flatMap(stream => stream.getTracks());
      const combinedStream = new MediaStream(tracks);

      // Set up MediaRecorder with preferred codec
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';

      this.mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 2500000
      });

      this.recordedChunks = [];
      this.startTime = Date.now();
      this.duration = 0;
      this.totalPauseDuration = 0;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(1000);

      // Update duration
      this.durationInterval = setInterval(() => {
        if (!this.pauseStartTime) {
          this.duration = Math.floor((Date.now() - this.startTime - this.totalPauseDuration) / 1000);
          this.notifyStateChange();
        }
      }, 1000);

      // Handle stream stop
      displayStream.getVideoTracks()[0].addEventListener('ended', () => {
        this.stopRecording().catch(console.error);
      });

      this.notifyStateChange();
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      this.cleanup();
      throw error;
    }
  }

  private createWebcamOverlay(stream: MediaStream) {
    // Create container for webcam
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 180px;
      height: 120px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.8);
      background: black;
      z-index: 2147483646;
      cursor: move;
    `;

    // Create video element
    this.webcamElement = document.createElement('video');
    this.webcamElement.srcObject = stream;
    this.webcamElement.autoplay = true;
    this.webcamElement.muted = true;
    this.webcamElement.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;

    container.appendChild(this.webcamElement);
    document.body.appendChild(container);

    // Make webcam draggable
    let isDragging = false;
    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;

    const dragStart = (e: MouseEvent) => {
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      isDragging = true;
    };

    const dragEnd = () => {
      isDragging = false;
    };

    const drag = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        // Keep within window bounds
        const maxX = window.innerWidth - container.offsetWidth;
        const maxY = window.innerHeight - container.offsetHeight;
        currentX = Math.min(Math.max(0, currentX), maxX);
        currentY = Math.min(Math.max(0, currentY), maxY);

        container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    };

    container.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
  }

  private cleanup(): void {
    // Stop all streams
    this.streams.forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
    this.streams = [];

    // Remove webcam element
    if (this.webcamElement?.parentElement) {
      document.body.removeChild(this.webcamElement.parentElement);
    }
    this.webcamElement = null;

    // Clear interval
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }

    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.notifyStateChange();
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
    });
  }

  getState(): RecordingState {
    return {
      isRecording: this.mediaRecorder?.state === 'recording',
      isPaused: this.mediaRecorder?.state === 'paused',
      duration: this.duration
    };
  }
}

export const screenRecorder = new ScreenRecorder();