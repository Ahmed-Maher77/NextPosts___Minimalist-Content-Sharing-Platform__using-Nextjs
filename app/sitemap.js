import { getPosts } from '@/lib/posts';

export default async function sitemap() {
  const posts = await getPosts();
  
  const postEntries = posts.map((post) => ({
    url: `https://nextposts-demo.vercel.app/posts/${post.id}`,
    lastModified: new Date(post.createdAt || new Date()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    {
      url: 'https://nextposts-demo.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://nextposts-demo.vercel.app/feed',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://nextposts-demo.vercel.app/new-post',
      lastModified: new Date(),
      changeFrequency: 'never',
      priority: 0.5,
    },
    ...postEntries,
  ];
}
