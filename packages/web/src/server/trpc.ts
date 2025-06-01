import { initTRPC } from '@trpc/server';
import { transformer } from './transformer';

// Create a new tRPC instance
const t = initTRPC.create({
  transformer,
});

// Export the router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
