import logo from '@/assets/logo.png';
import Link from 'next/link';

export default function Header() {
  return (
    <header id="main-header" role="banner">
      <Link href="/" aria-label="Home page">
        <img src={logo.src} alt="Mobile phone with posts feed on it" />
      </Link>
      <nav aria-label="Main navigation">
        <ul>
          <li>
            <Link href="/feed">Feed</Link>
          </li>
          <li>
            <Link className='cta-link' href="/new-post">New Post</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
