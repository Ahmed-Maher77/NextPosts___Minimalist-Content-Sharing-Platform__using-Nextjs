export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://nextposts-demo.vercel.app/sitemap.xml',
  };
}
