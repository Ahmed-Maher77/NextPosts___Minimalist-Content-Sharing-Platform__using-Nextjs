# UML Diagrams - NextPosts

This document contains the UML architecture diagrams of the **NextPosts** content-sharing platform, representing both the database structure and the system component relationships.

---

## 1. Database Entity-Relationship Diagram (ERD)

The database consists of three entities: `users`, `posts`, and `likes`. The relationship between `users` and `posts` is 1-to-many. The relationship between `users` and `posts` via `likes` is many-to-many.

```mermaid
erDiagram
    users {
        int id PK
        string first_name
        string last_name
        string email
    }
    
    posts {
        int id PK
        string image_url
        string title
        string content
        datetime created_at
        int user_id FK
    }
    
    likes {
        int user_id PK, FK
        int post_id PK, FK
    }

    users ||--o{ posts : "creates"
    users ||--o{ likes : "likes"
    posts ||--o{ likes : "is_liked_by"
```

---

## 2. Component Relationship Diagram

NextPosts utilizes Next.js App Router architecture. Below is the relationship between Server Components, Client Components, Actions, and Database modules.

```mermaid
graph TD
    %% Server Components
    subgraph Server [Server Components]
        Home[Home Page /page.js]
        Feed[Feed Page /feed/page.js]
        Layout[Root Layout /layout.js]
    end

    %% Client Components
    subgraph Client [Client Components]
        Posts[Posts Component /components/posts.js]
        Post[Post Card]
        LikeButton[Like Button /components/like-icon.js]
        NewPost[New Post Page /new-post/page.js]
    end

    %% Database and Actions
    subgraph Services [Database & Server Actions]
        updatePostLike[updatePostLike Action]
        createPost[createPost Action]
        DB[Database Access /lib/posts.js]
        Cloudinary[Cloudinary API]
    end

    %% Relationships
    Layout --> Home
    Layout --> Feed
    Home --> Posts
    Feed --> Posts
    Posts --> Post
    Post --> LikeButton

    LikeButton -- triggers --> updatePostLike
    NewPost -- submits to --> createPost
    
    createPost -- uploads image --> Cloudinary
    createPost -- stores post --> DB
    updatePostLike -- updates likes --> DB
    DB -- fetches posts --> Home
    DB -- fetches posts --> Feed
```
