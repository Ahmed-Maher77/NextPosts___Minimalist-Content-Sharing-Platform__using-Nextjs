# Program Flow - NextPosts

This document outlines the operational flow of key operations in **NextPosts**, illustrating the communication between the client, server, and SQLite database.

---

## 1. Initial Load & Database Seeding Flow

When the NextPosts application boots up or handles its first request, the database automatically seeds itself if no data is present.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Server as Next.js Server Component
    participant DB as SQLite (lib/posts.js)
    participant Disk as File System (public/images)
    participant API as Unsplash API

    User->>Server: Access Home or Feed page
    Server->>DB: getPosts()
    Note over DB: Check if users & posts tables exist
    DB-->>DB: Run CREATE TABLE statements
    DB->>DB: Check user count
    alt User count is 0
        DB->>DB: Insert default seed users
    end
    DB->>DB: Check post count
    alt Post count is 0
        loop For each seed post
            DB->>Disk: Check if local file exists
            alt Image file not found on disk
                DB->>API: Fetch Unsplash image
                API-->>DB: Return image binary buffer
                DB->>Disk: Write image file to public/images
            end
            DB->>DB: INSERT post record with local image URL
        end
    end
    DB->>DB: saveDb() (export database state to posts.db)
    DB-->>Server: Return posts array
    Server-->>User: Render HTML layout with posts
```

---

## 2. Like Status Update Flow (Optimistic UI)

Liking or unliking a post happens instantly on the UI first, and then synchronizes in the background with the database.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Client Component (Posts)
    participant Action as updatePostLike Server Action
    participant DB as SQLite Database (lib/posts.js)

    User->>Client: Click "Like" / "Unlike" button
    Client->>Client: useOptimistic updates UI immediately
    Note over Client: Toggle isLiked status<br/>Likes count increments/decrements by 1
    Client->>Action: Trigger updatePostLike(postId)
    Action->>DB: updatePostLikeStatus(postId, userId)
    DB->>DB: Check if user already liked the post
    alt Not liked
        DB->>DB: INSERT into likes
    else Already liked
        DB->>DB: DELETE from likes
    end
    DB->>DB: saveDb() (write changes to posts.db)
    Action->>Action: revalidatePath("/", "layout") (Purges server render cache)
    Action-->>Client: Send revalidated page state
    alt Server state received
        Client->>Client: Resolve optimistic state with actual database values
    else Server Action failed
        Client->>Client: Roll back UI to original like state
    end
```

---

## 3. Creating a New Post Flow

This flow illustrates form validation, image uploading to Cloudinary, and database storage.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as NewPostPage Form
    participant Action as createPost Server Action
    participant Cloudinary as Cloudinary API
    participant Disk as Local public/images Directory
    participant DB as SQLite Database (lib/posts.js)

    User->>Client: Fill Form and Click "Create Post"
    Client->>Action: Submit formData
    Note over Action: Validate formData via Zod schema
    alt Validation fails
        Action-->>Client: Return validation errors map
        Client->>User: Display error messages under inputs
    else Validation succeeds
        Action->>Cloudinary: uploadImage(imageFile)
        Cloudinary-->>Action: Return Cloudinary hosted image URL
        Action->>Disk: Save backup image to public/images/[filename]
        Action->>DB: storePost(newPostObj)
        DB->>DB: INSERT INTO posts
        DB->>DB: saveDb() (write to posts.db)
        Action->>Action: revalidatePath("/feed")
        Action->>Client: Redirect to /feed
        Client->>User: Display updated posts feed
    end
```
