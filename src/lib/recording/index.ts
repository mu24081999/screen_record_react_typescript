import { Recorder } from './recorder';
import { StreamManager } from './stream-manager';
import type { RecordingOptions, RecordingState, StreamConfig } from './types';

// Create and export the singleton instance
export const screenRecorder = new Recorder();

// Export types and classes
export type { RecordingOptions, RecordingState, StreamConfig };
export { Recorder, StreamManager };