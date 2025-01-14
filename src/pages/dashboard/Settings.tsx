import { useState } from 'react';
import { FloatingRecordButton } from '../../components/recording/FloatingRecordButton';
import { PlanCard } from '../../components/subscription/PlanCard';
import { UpgradeModal } from '../../components/subscription/UpgradeModal';
import { TeamMembersList } from '../../components/team/TeamMembersList';
import { TwoFactorAuth } from '../../components/settings/TwoFactorAuth';
import { LoginHistory } from '../../components/settings/LoginHistory';
import { getTeamMembers } from '../../lib/team-store';
import { getWorkspaceSettings, saveWorkspaceSettings, uploadWorkspaceLogo } from '../../lib/workspace-store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'plan' | 'team'>('general');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    loadWorkspaceSettings();
    loadTeamMembers();
  }, []);

  async function loadWorkspaceSettings() {
    try {
      const settings = await getWorkspaceSettings();
      setWorkspaceName(settings.name);
    } catch (error) {
      toast.error('Failed to load workspace settings');
    }
  }

  async function loadTeamMembers() {
    try {
      const members = await getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      toast.error('Failed to load team members');
    }
  }

  async function handleSaveWorkspace(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      await saveWorkspaceSettings({ name: workspaceName });
      toast.success('Workspace settings saved');
    } catch (error) {
      toast.error('Failed to save workspace settings');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      await uploadWorkspaceLogo(file);
      toast.success('Logo uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload logo');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your workspace settings and preferences
        </p>
      </div>

      <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', label: 'General' },
            { id: 'security', label: 'Security' },
            { id: 'plan', label: 'Plan & Billing' },
            { id: 'team', label: 'Team' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                border-b-2 py-4 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'border-black text-black dark:border-white dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'general' && (
          <div className="space-y-8">
            <form onSubmit={handleSaveWorkspace} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Workspace Name
                </h3>
                <div className="mt-4">
                  <Input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Enter workspace name"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Workspace Logo
                </h3>
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={isLoading}
                  >
                    Upload Logo
                  </Button>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Maximum size: 5MB. Supported formats: PNG, JPG
                  </p>
                </div>
              </div>

              <Button type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <TwoFactorAuth />
            <LoginHistory />
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="grid gap-6 md:grid-cols-2">
            <PlanCard type="free" onSelect={() => {}} />
            <PlanCard type="pro" onSelect={() => setShowUpgradeModal(true)} />
          </div>
        )}

        {activeTab === 'team' && (
          <TeamMembersList members={teamMembers} onUpdate={loadTeamMembers} />
        )}
      </div>

      <FloatingRecordButton />
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}