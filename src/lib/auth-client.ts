import { createAuthClient } from 'better-auth/react';

// Better Auth Client configuration
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
});
