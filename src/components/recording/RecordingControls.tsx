import { useEffect, useRef, useState } from 'react';
import { useRecording } from '../../contexts/RecordingContext';
import { formatDuration } from '../../utils/format';
import { clsx } from 'clsx';
import Draggable from 'react-draggable';

interface RecordingControlsProps {
  onStopRecording: () => void;
}

export function RecordingControls({ onStopRecording }: RecordingControlsProps) {
  const { isPaused, duration, pauseRecording, resumeRecording } = useRecording();
  const [isExpanded, setIsExpanded] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a container that will be appended to the body
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2147483647;
    `;
    document.body.appendChild(container);

    // Animate in after mount
    const timer = setTimeout(() => setIsExpanded(true), 100);

    return () => {
      clearTimeout(timer);
      document.body.removeChild(container);
    };
  }, []);

  return (
    <Draggable
      nodeRef={controlsRef}
      bounds="parent"
      handle=".drag-handle"
      defaultPosition={{ x: 0, y: 0 }}
    >
      <div 
        ref={controlsRef}
        className="fixed z-[2147483647]"
        style={{
          left: '50%',
          bottom: '24px',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto'
        }}
      >
        <div
          className={clsx(
            'flex items-center gap-4 rounded-full bg-black/90 backdrop-blur transition-all duration-300 ease-out',
            isExpanded ? 'px-6 py-3 opacity-100' : 'w-14 h-14 opacity-0'
          )}
        >
          <div className="flex items-center gap-2 text-white drag-handle cursor-move">
            <div
              className={clsx(
                'h-2.5 w-2.5 rounded-full transition-colors',
                isPaused ? 'bg-yellow-400' : 'animate-pulse bg-red-500'
              )}
            />
            <span className="font-medium whitespace-nowrap">
              {formatDuration(duration)}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              {isPaused ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={onStopRecording}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/80 text-white transition-colors hover:bg-red-500"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
}