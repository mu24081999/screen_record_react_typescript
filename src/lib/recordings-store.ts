export interface Recording {
  id?: string;
  title: string;
  blob: Blob;
  duration: number;
  createdAt: Date;
  url?: string;
  shareId?: string;
  views: number;
}

const STORAGE_KEY = 'screencast_recordings';

export async function saveRecording(recording: Recording): Promise<void> {
  try {
    const recordings = await getRecordings();
    const newRecording = {
      ...recording,
      id: crypto.randomUUID(),
      shareId: crypto.randomUUID(),
      views: 0,
    };
    
    const url = URL.createObjectURL(newRecording.blob);
    newRecording.url = url;
    
    recordings.unshift(newRecording);
    
    const metadata = recordings.map(({ blob, ...meta }) => meta);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error saving recording:', error);
    throw new Error('Failed to save recording');
  }
}

export async function updateRecording(id: string, updates: Partial<Recording>): Promise<void> {
  try {
    const recordings = await getRecordings();
    const index = recordings.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Recording not found');
    }
    
    recordings[index] = { ...recordings[index], ...updates };
    
    const metadata = recordings.map(({ blob, ...meta }) => meta);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error updating recording:', error);
    throw new Error('Failed to update recording');
  }
}

export async function incrementViews(id: string): Promise<void> {
  try {
    const recordings = await getRecordings();
    const index = recordings.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Recording not found');
    }
    
    recordings[index].views = (recordings[index].views || 0) + 1;
    
    const metadata = recordings.map(({ blob, ...meta }) => meta);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw new Error('Failed to increment views');
  }
}

export async function getRecordings(): Promise<Recording[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored).map((recording: any) => ({
      ...recording,
      views: recording.views || 0,
      createdAt: new Date(recording.createdAt)
    }));
  } catch (error) {
    console.error('Error getting recordings:', error);
    return [];
  }
}

export async function getRecordingByShareId(shareId: string): Promise<Recording | null> {
  try {
    const recordings = await getRecordings();
    return recordings.find(recording => recording.shareId === shareId) || null;
  } catch (error) {
    console.error('Error getting shared recording:', error);
    return null;
  }
}

export async function deleteRecording(id: string): Promise<void> {
  try {
    const recordings = await getRecordings();
    const recording = recordings.find(r => r.id === id);
    
    if (recording?.url) {
      URL.revokeObjectURL(recording.url);
    }
    
    const filtered = recordings.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting recording:', error);
    throw new Error('Failed to delete recording');
  }
}