import { auth } from './firebase';
import toast from 'react-hot-toast';

export interface TeamMember {
  id: string;
  email: string;
  role: 'owner' | 'member';
  status: 'active' | 'pending';
  invitedAt: Date;
  joinedAt?: Date;
}

const STORAGE_KEY = 'team_members';

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const members = JSON.parse(stored);
    return members.map((member: any) => ({
      ...member,
      invitedAt: new Date(member.invitedAt),
      joinedAt: member.joinedAt ? new Date(member.joinedAt) : undefined
    }));
  } catch (error) {
    console.error('Error getting team members:', error);
    return [];
  }
}

export async function inviteTeamMember(email: string): Promise<void> {
  try {
    const members = await getTeamMembers();
    
    // Check if member already exists
    if (members.some(m => m.email === email)) {
      throw new Error('Member already exists');
    }
    
    // Check if current plan allows more members
    if (members.length >= 5 && getCurrentPlan() === 'free') {
      throw new Error('Free plan limited to 5 team members');
    }

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      email,
      role: 'member',
      status: 'pending',
      invitedAt: new Date()
    };

    members.push(newMember);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));

    // TODO: Integrate with a real email service
    console.log(`Invitation email sent to ${email}`);
    
  } catch (error) {
    console.error('Error inviting team member:', error);
    throw error;
  }
}

export async function removeTeamMember(id: string): Promise<void> {
  try {
    const members = await getTeamMembers();
    const filtered = members.filter(member => member.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing team member:', error);
    throw error;
  }
}

export function getCurrentPlan(): 'free' | 'pro' {
  return localStorage.getItem('current_plan') as 'free' | 'pro' || 'free';
}

export function calculateTeamCost(memberCount: number): number {
  return memberCount * 2; // $2 per member
}