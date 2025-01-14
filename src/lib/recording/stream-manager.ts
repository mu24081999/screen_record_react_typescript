import { RecordingOptions } from './types';

export class StreamManager {
  private streams: MediaStream[] = [];
  private webcamElement: HTMLVideoElement | null = null;
  private webcamContainer: HTMLDivElement | null = null;

  async setupRecording(options: RecordingOptions): Promise<MediaStream> {
    try {
      // Request display media with specific constraints
      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: {
          displaySurface: 'monitor',
          logicalSurface: true,
          cursor: 'always',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: options.audioSource !== 'none' && options.audioSource !== 'microphone'
          ? {
              echoCancellation: false,
              noiseSuppression: false,
              sampleRate: 44100,
              channelCount: 2
            }
          : false
      };

      const displayStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      this.streams.push(displayStream);

      const tracks: MediaStreamTrack[] = [...displayStream.getTracks()];

      // Add microphone if selected
      if (options.audioSource === 'microphone' || options.audioSource === 'both') {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              sampleRate: 44100
            }
          });
          this.streams.push(micStream);
          tracks.push(...micStream.getTracks());
        } catch (error) {
          console.warn('Microphone access denied:', error);
        }
      }

      // Add webcam if selected
      if (options.useWebcam) {
        try {
          const webcamStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 320 },
              height: { ideal: 180 },
              facingMode: 'user',
              frameRate: { ideal: 30 }
            }
          });
          this.streams.push(webcamStream);
          this.createWebcamOverlay(webcamStream);
        } catch (error) {
          console.warn('Webcam access denied:', error);
        }
      }

      return new MediaStream(tracks);
    } catch (error) {
      this.cleanup();
      throw error;
    }
  }

  private createWebcamOverlay(stream: MediaStream) {
    this.webcamContainer = document.createElement('div');
    this.webcamContainer.style.cssText = `
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
      transform: translate3d(0, 0, 0);
    `;

    this.webcamElement = document.createElement('video');
    this.webcamElement.srcObject = stream;
    this.webcamElement.autoplay = true;
    this.webcamElement.muted = true;
    this.webcamElement.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;

    this.webcamContainer.appendChild(this.webcamElement);
    document.body.appendChild(this.webcamContainer);

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX - initialX;
      startY = e.clientY - initialY;
      this.webcamContainer!.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      const x = e.clientX - startX;
      const y = e.clientY - startY;

      const maxX = window.innerWidth - this.webcamContainer!.offsetWidth;
      const maxY = window.innerHeight - this.webcamContainer!.offsetHeight;

      initialX = Math.min(Math.max(0, x), maxX);
      initialY = Math.min(Math.max(0, y), maxY);

      this.webcamContainer!.style.transform = `translate3d(${initialX}px, ${initialY}px, 0)`;
    };

    const onMouseUp = () => {
      isDragging = false;
      this.webcamContainer!.style.cursor = 'grab';
    };

    this.webcamContainer.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  stopRecording() {
    this.streams.forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
  }

  cleanup() {
    this.stopRecording();
    this.streams = [];

    if (this.webcamContainer && document.body.contains(this.webcamContainer)) {
      document.body.removeChild(this.webcamContainer);
    }
    this.webcamContainer = null;
    this.webcamElement = null;
  }
}