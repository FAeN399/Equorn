import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '@/server/routers/_app';
import { transformer } from '@/server/transformer';

// Export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC error on ${path}: ${error.message}`);
        }
      : undefined
});
