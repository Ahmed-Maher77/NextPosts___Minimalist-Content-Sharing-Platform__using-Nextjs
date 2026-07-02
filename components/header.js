"use client";
import logo from '@/assets/logo.png';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header id="main-header" role="banner">
      <div className="header-container">
        <Link href="/" aria-label="Home page">
          <img src={logo.src} alt="Mobile phone with posts feed on it" />
        </Link>
        <nav aria-label="Main navigation">
          <ul>
            <li>
              <Link href="/feed" className={pathname === '/feed' ? 'active' : ''}>Feed</Link>
            </li>
            <li>
              <Link className={`cta-link ${pathname === '/new-post' ? 'active' : ''}`} href="/new-post">New Post</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
