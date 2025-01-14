import { auth } from './firebase';
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';

export async function setRememberMe(remember: boolean): Promise<void> {
  try {
    const persistence = remember ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    
    if (remember) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
  } catch (error) {
    console.error('Error setting auth persistence:', error);
    throw error;
  }
}

export function getRememberMe(): boolean {
  return localStorage.getItem('rememberMe') === 'true';
}