import { useState } from 'react';
import { Download, Play, Clock, Trash2, Share2, Pencil, Check, X, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './Button';
import { Input } from './Input';
import toast from 'react-hot-toast';

interface VideoCardProps {
  id: string;
  title: string;
  duration: number;
  createdAt: Date;
  views: number;
  onPlay: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => Promise<void>;
  videoUrl?: string;
  shareId?: string;
}

export function VideoCard({
  id,
  title,
  duration,
  createdAt,
  views,
  onPlay,
  onDownload,
  onDelete,
  onRename,
  videoUrl,
  shareId
}: VideoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isRenaming, setIsRenaming] = useState(false);

  const handleShare = () => {
    if (shareId) {
      const shareUrl = `${window.location.origin}/share/${shareId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    }
  };

  const handleRename = async () => {
    if (newTitle.trim() === '') {
      toast.error('Title cannot be empty');
      return;
    }

    try {
      setIsRenaming(true);
      await onRename(newTitle);
      setIsEditing(false);
      toast.success('Recording renamed');
    } catch (error) {
      toast.error('Failed to rename recording');
    } finally {
      setIsRenaming(false);
    }
  };

  const handleCancelRename = () => {
    setNewTitle(title);
    setIsEditing(false);
  };

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
        {videoUrl && (
          <video
            src={videoUrl}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={onPlay}
            className="rounded-full h-12 w-12 p-0 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
          >
            <Play className="h-6 w-6 text-black dark:text-white" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
          {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="outline"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 text-black dark:text-white" />
          </Button>
          <Button
            variant="outline"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
            onClick={onDownload}
          >
            <Download className="h-4 w-4 text-black dark:text-white" />
          </Button>
          <Button
            variant="outline"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1"
                disabled={isRenaming}
              />
              <Button
                variant="outline"
                className="p-2"
                onClick={handleRename}
                disabled={isRenaming}
              >
                <Check className="h-4 w-4 text-black dark:text-white" />
              </Button>
              <Button
                variant="outline"
                className="p-2"
                onClick={handleCancelRename}
                disabled={isRenaming}
              >
                <X className="h-4 w-4 text-black dark:text-white" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 flex-1">
                {title}
              </h3>
              <Button
                variant="outline"
                className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 text-black dark:text-white" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(createdAt)} ago</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{views} {views === 1 ? 'view' : 'views'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}