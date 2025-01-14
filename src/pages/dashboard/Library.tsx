import { useEffect, useState, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { VideoCard } from '../../components/ui/VideoCard';
import { getRecordings, deleteRecording, updateRecording, incrementViews } from '../../lib/recordings-store';
import { FloatingRecordButton } from '../../components/recording/FloatingRecordButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

interface Recording {
  id: string;
  title: string;
  duration: number;
  createdAt: Date;
  url?: string;
  shareId?: string;
  views: number;
}

export function Library() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadRecordings = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      const data = await getRecordings();
      setRecordings(data);
    } catch (error) {
      toast.error('Failed to load recordings');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadRecordings();
  }, [loadRecordings]);

  // Auto refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadRecordings(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [loadRecordings]);

  async function handleDelete(id: string) {
    if (window.confirm('Are you sure you want to delete this recording?')) {
      try {
        await deleteRecording(id);
        await loadRecordings();
        toast.success('Recording deleted');
      } catch (error) {
        toast.error('Failed to delete recording');
      }
    }
  }

  async function handleRename(id: string, newTitle: string) {
    try {
      await updateRecording(id, { title: newTitle });
      await loadRecordings();
    } catch (error) {
      throw error;
    }
  }

  async function handlePlay(id: string, url?: string) {
    if (url) {
      try {
        await incrementViews(id);
        await loadRecordings();
        window.open(url, '_blank');
      } catch (error) {
        console.error('Failed to increment views:', error);
      }
    }
  }

  function handleDownload(url?: string, title?: string) {
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'recording'}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  const filteredRecordings = recordings.filter(recording =>
    recording.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Library</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => loadRecordings(false)}
              className="flex items-center gap-2"
              isLoading={isRefreshing}
            >
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="ml-2">Auto-refreshing</span>
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-black dark:text-white">{recordings.length}</span>
              <span className="text-gray-600 dark:text-gray-400">recordings</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search recordings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:border-white dark:focus:ring-white"
          />
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : filteredRecordings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No recordings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecordings.map((recording) => (
              <VideoCard
                key={recording.id}
                id={recording.id}
                title={recording.title}
                duration={recording.duration}
                createdAt={recording.createdAt}
                views={recording.views}
                videoUrl={recording.url}
                shareId={recording.shareId}
                onPlay={() => handlePlay(recording.id, recording.url)}
                onDownload={() => handleDownload(recording.url, recording.title)}
                onDelete={() => handleDelete(recording.id)}
                onRename={(newTitle) => handleRename(recording.id, newTitle)}
              />
            ))}
          </div>
        )}
      </div>
      <FloatingRecordButton />
    </>
  );
}