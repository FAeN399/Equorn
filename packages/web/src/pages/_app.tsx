import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { trpc } from '@/utils/trpc';

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}

export default trpc.withTRPC(App);
