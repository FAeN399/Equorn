import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="flex space-x-8">
      <Link href="/" className="nav-link">🏠 Home</Link>
      <Link href="/generate" className="nav-link">⚡ Generate</Link>
      <Link href="/forge" className="nav-link">🔥 Forge</Link>
      <Link href="/cards" className="nav-link">🃏 Cards</Link>
      <Link href="/character-forge" className="nav-link">🔮 Characters</Link>
    </nav>
  );
} 