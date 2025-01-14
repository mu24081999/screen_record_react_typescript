import toast from 'react-hot-toast';

interface WorkspaceSettings {
  name: string;
  logoUrl?: string;
}

const STORAGE_KEY = 'workspace_settings';

export async function saveWorkspaceSettings(settings: WorkspaceSettings): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving workspace settings:', error);
    throw new Error('Failed to save workspace settings');
  }
}

export async function getWorkspaceSettings(): Promise<WorkspaceSettings> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { name: 'My Workspace' };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error getting workspace settings:', error);
    return { name: 'My Workspace' };
  }
}

export async function uploadWorkspaceLogo(file: File): Promise<string> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Create object URL for the file
    const url = URL.createObjectURL(file);
    
    // Get current settings and update logo
    const settings = await getWorkspaceSettings();
    
    // Revoke old URL if exists
    if (settings.logoUrl && settings.logoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(settings.logoUrl);
    }
    
    // Save new settings
    await saveWorkspaceSettings({
      ...settings,
      logoUrl: url
    });

    return url;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}