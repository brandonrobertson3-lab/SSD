import { User } from '@shared/types';

// Test function using the shared type
function createUser(name: string): User {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name
  };
}