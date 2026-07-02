import Header from '@/components/header';
import Footer from '@/components/footer';
import './globals.css';

export const metadata = {
  title: 'NextPosts – Minimalist Content Sharing Platform',
  description: 'NextPosts is a clean, responsive content sharing platform. Create image-rich blog posts, browse a curated feed, and interact via an optimistic liking system.',
  keywords: ['NextPosts', 'Blogging', 'Next.js', 'SQLite', 'Web Development', 'Minimalist Design'],
  authors: [{ name: 'Ahmed Maher' }],
  metadataBase: new URL('https://nextposts-content-sharing.vercel.app'),
  openGraph: {
    title: 'NextPosts – Minimalist Content Sharing Platform',
    description: 'Create image-rich blog posts, browse a curated feed, and interact via an optimistic liking system.',
    url: 'https://nextposts-content-sharing.vercel.app',
    siteName: 'NextPosts',
    images: [
      {
        url: '/images/nextposts_mockup.png',
        width: 1200,
        height: 630,
        alt: 'NextPosts Mockup Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NextPosts',
    url: 'https://nextposts-content-sharing.vercel.app',
    description: 'A clean, responsive content sharing platform.',
    author: {
      '@type': 'Person',
      name: 'Ahmed Maher',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
