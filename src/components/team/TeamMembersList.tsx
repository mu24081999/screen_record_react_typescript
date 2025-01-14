import { useState } from 'react';
import { UserPlus, Mail, X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { TeamMember, inviteTeamMember, removeTeamMember, calculateTeamCost } from '../../lib/team-store';
import { formatDistanceToNow } from 'date-fns';
import { AddMembersModal } from './AddMembersModal';
import toast from 'react-hot-toast';

interface TeamMembersListProps {
  members: TeamMember[];
  onUpdate: () => void;
}

export function TeamMembersList({ members, onUpdate }: TeamMembersListProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddMembers = async (emails: string[], quantity: number) => {
    try {
      // Invite each member
      for (const email of emails) {
        await inviteTeamMember(email);
      }
      onUpdate();
      toast.success(`Successfully invited ${emails.length} member${emails.length === 1 ? '' : 's'}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to invite members');
      throw error;
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      await removeTeamMember(id);
      onUpdate();
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const activeMembers = members.filter(m => m.status === 'active').length;
  const pendingMembers = members.filter(m => m.status === 'pending').length;
  const monthlyCost = calculateTeamCost(members.length);

  return (
    <div className="space-y-6">
      {/* Team Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Members</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{activeMembers}</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Invites</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{pendingMembers}</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Cost</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">${monthlyCost}</p>
        </div>
      </div>

      {/* Add Members Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Members
        </Button>
      </div>

      {/* Members List */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{member.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member.status === 'pending' ? (
                    <>
                      <AlertCircle className="inline-block h-4 w-4 mr-1 text-yellow-500" />
                      Invited {formatDistanceToNow(member.invitedAt)} ago
                    </>
                  ) : (
                    <>Joined {formatDistanceToNow(member.joinedAt!)} ago</>
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => handleRemove(member.id)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {members.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No team members yet</p>
          </div>
        )}
      </div>

      <AddMembersModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddMembers={handleAddMembers}
      />
    </div>
  );
}