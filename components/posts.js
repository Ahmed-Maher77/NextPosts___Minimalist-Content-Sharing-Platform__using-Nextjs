"use client";
import { formatDate } from '@/lib/format';
import LikeButton from './like-icon';
import updatePostLike from '@/app/actions/updatePostLike';
import { useOptimistic } from 'react';

// Single post card with image, content, and like button
function Post({ post, likeAction }) {

  return (
    <article className="post">
      <div className="post-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <LikeButton isLiked={post.isLiked} likes={post.likes} likeAction={likeAction} postId={post.id} />
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

// Posts list with optimistic like updates
export default function Posts({ posts }) {
  // Optimistically toggle like state before server confirms
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(posts, (prevPosts, postId) => {
    const postIndex = prevPosts.findIndex(post => post.id === postId);
    if (postIndex === -1) return prevPosts;
    const updatedPosts = [...prevPosts];
    const post = updatedPosts[postIndex];
    updatedPosts[postIndex] = {
      ...post,
      isLiked: !post.isLiked,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1
    };
    return updatedPosts;
  });

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  // Update UI immediately, then sync with server
  const handleLike = async (postId) => {
    updateOptimisticPosts(postId);
    await updatePostLike(postId);
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} likeAction={handleLike} />
        </li>
      ))}
    </ul>
  );
}
