# NextPosts – Minimalist Content Sharing Platform

**NextPosts** is a clean, responsive content sharing platform that allows users to create image-rich blog posts, browse a centralized feed, and interact via a highly optimized, state-synchronized optimistic liking system. Built with Next.js App Router and an auto-seeded SQLite database, it features structured server-side validation, Cloudinary image optimization, and fully custom minimalist styling for an elegant, eye-friendly user experience.

---

## 🌐 Live Preview
**👀 Watch Live Demo:** [https://nextposts-content-sharing.vercel.app](https://nextposts-content-sharing.vercel.app)

---

## 👀 Website Preview:
<a href="https://nextposts-content-sharing.vercel.app" title="demo">
  <img src="/public/nextposts_mockup.png" alt="website preview - Demo - UI Mockup" width="400">
</a>

---

## 💻 Used Technologies

- **Next.js 14 (App Router)**: Orchestrates server components, layout structures, server actions, caching, and path revalidation dynamically.
- **React 18**: Powers client side state management, custom layouts, and optimistic updates via the `useOptimistic` hook.
- **SQLite (sql.js)**: WebAssembly-compiled SQLite database loaded directly in Node, allowing file-based database operations without requiring native compiled drivers.
- **Cloudinary API**: Provides automated image optimization, transformations, and global cloud hosting for user uploads.
- **Zod**: Performs schema-based data validation on form inputs to ensure secure and valid data before processing.
- **Vanilla CSS**: Supplies the custom theme system, typography scaling, element transitions, and responsive grid layouts.
- **Figma**: Used for rapid prototyping of the visual layout, card design, and color palettes.

*Hosting Architecture:*
- **Frontend / Backend**: [Vercel](https://vercel.com) (Serverless hosting with Next.js edge configuration)
- **Database File**: Persisted locally in SQLite `posts.db`
- **Media Assets**: Hosted globally on Cloudinary

---

## ✨ Key Features

- **Automated Database Seeding**: Instantly initializes database schemas and downloads high-quality default images from Unsplash to seed posts if the database is empty.
- **Server Actions**: Submits new posts and toggles likes using Next.js Server Actions, eliminating the need to write separate REST API endpoints.
- **Optimistic Liking System**: Instantly increments/decrements likes and colors the heart icon on click, reverting the changes if the server-side operation fails.
- **Server-Side Validation**: Sanitizes and validates form inputs via Zod, returning descriptive error messages rendered inline underneath inputs.
- **On-Demand Path Revalidation**: Uses `revalidatePath` to purge the rendering cache, displaying newly created posts and updated likes instantly.
- **Warm Eye-Friendly Aesthetics**: Styled with a minimal tan-cream color palette, fine lines, grayscale logo transitions, and custom Inter typography.

---

## 🛠️ Architecture and Program Flow

To maintain a clean and descriptive README, the system modeling details are split into separate files:

- 📊 **[UML Diagrams](uml_diagrams.md)**: Database ERD and component relationship charts.
- 🔄 **[Program Flow Charts](program_flow.md)**: Seeding flow, likes toggle flow, and post creation sequence.

---

## 📥 Installation Instructions for Local Setup

Follow these steps to run NextPosts on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ahmed-Maher77/NextPosts___Minimalist-Content-Sharing-Platform__using-Nextjs.git
   cd NextPosts___Minimalist-Content-Sharing-Platform__using-Nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the browser:**
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Project Structure

```
nextposts/
├── app/                      # Next.js App Router root
│   ├── actions/              # Server Actions for mutations
│   │   ├── createPost.js     # Validates & creates new posts
│   │   └── updatePostLike.js # Toggles likes on posts
│   ├── feed/                 # All posts page route
│   ├── new-post/             # New post creation page route
│   ├── globals.css           # Global custom CSS styling rules
│   ├── layout.js             # Root layout with HTML wrapper & SEO
│   ├── page.js               # Home page (shows latest 2 posts)
│   ├── robots.js             # Dynamic robots.txt generation
│   ├── sitemap.js            # Dynamic sitemap.xml generation
│   └── validation-schemas.js # Zod schemas for input validation
├── assets/                   # Shared image assets
├── components/               # Reusable React components
│   ├── create-post-submit-button/ # Pending state submit button
│   ├── footer.js             # Site-wide copyright block
│   ├── header.js             # Responsive top navigation bar
│   ├── like-icon.js          # Interactive heart icon & like count
│   └── posts.js              # List layout with optimistic liking
├── lib/                      # Business logic and database utils
│   ├── cloudinary.js         # Cloudinary SDK client setup
│   ├── format.js             # Date formatter helper function
│   └── posts.js              # SQLite connection, seeding, and queries
├── public/                   # Static public assets (images)
├── posts.db                  # Local SQLite database file
├── next.config.mjs           # Next.js configurations
└── package.json              # Project packages & metadata
```

---

## 🗄️ Database Structure

NextPosts uses SQLite database containing three relational tables:

### 1. `users` Table
Stores basic profile information of users.
- `id` (INTEGER, Primary Key): Unique identifier.
- `first_name` (TEXT): First name.
- `last_name` (TEXT): Last name.
- `email` (TEXT): Email address.

### 2. `posts` Table
Stores user blog posts.
- `id` (INTEGER, Primary Key): Unique identifier.
- `image_url` (TEXT, Not Null): Path to image.
- `title` (TEXT, Not Null): Heading.
- `content` (TEXT, Not Null): Post text body.
- `created_at` (TEXT, Default `CURRENT_TIMESTAMP`): Post creation timestamp.
- `user_id` (INTEGER, Foreign Key referencing `users(id)` ON DELETE CASCADE).

### 3. `likes` Table
Stores many-to-many relationship of liked posts.
- `user_id` (INTEGER, Primary Key, Foreign Key referencing `users(id)` ON DELETE CASCADE).
- `post_id` (INTEGER, Primary Key, Foreign Key referencing `posts(id)` ON DELETE CASCADE).

---

## 🔌 API & Server Actions Docs

NextPosts runs on a unified server action model, executing database changes without exposing explicit endpoint routes.

### 1. `createPost(prevData, formData)`
Creates a new post in the database.
- **Input Parameters:**
  - `prevData` (Object): The previous form state.
  - `formData` (FormData): The form inputs (title, content, image).
- **Process:**
  - Validates inputs via Zod.
  - Uploads the image file to Cloudinary.
  - Saves a local backup image in `public/images`.
  - Injects post details into SQLite `posts` table.
  - Calls `revalidatePath('/feed')`.
- **Response:**
  - Returns `success: true` and redirects, or a map of validation error messages.

### 2. `updatePostLike(postId)`
Toggles the like status of a post for the logged-in user.
- **Input Parameters:**
  - `postId` (Integer): The ID of the post.
- **Process:**
  - Checks if user liked the post.
  - Deletes like record if it exists, or inserts one if not.
  - Calls `revalidatePath("/", "layout")`.

---

## 🏆 Best Practices and Standards Followed

- **Single Responsibility Principle (SOLID)**: Form state handlers are decoupled into discrete actions, and SQLite logic is consolidated under `lib/posts.js`.
- **Optimistic Rendering**: UI likes increment immediately without wait times using `useOptimistic`, delivering instantaneous user feedback.
- **Zod Schema Validation**: Performs comprehensive server validation on title, content, and image sizes/types before processing uploads.
- **Accessibility (a11y)**: Built using semantic HTML5 tags (`<header>`, `<main>`, `<footer>`), custom focus visible rings, keyboard support, and a high-contrast eye-friendly contrast palette.
- **Optimized Caching**: Revalidates paths on-demand (`revalidatePath`) so the page stays statically cached until a modification occurs, saving bandwidth.
- **Search Engine Optimization (SEO)**: Leverages Next.js Metadata API to generate dynamic Open Graph tags, robots rules, dynamic `sitemap.xml`, and Structured JSON-LD schemas.

---

## 📬 Contact
- 🧑‍💻 **Portfolio:** <a href="https://ahmedmaher-portfolio.vercel.app/" title="See My Portfolio">https://ahmedmaher-portfolio.vercel.app/</a>
- 🔗 **LinkedIn:** <a href="https://www.linkedin.com/in/ahmed-maher-algohary" title="Contact via LinkedIn">https://www.linkedin.com/in/ahmed-maher-algohary</a>
- 📧 **Email:** <a href="mailto:ahmedmaher.dev1@gmail.com" title="Contact via Email">ahmedmaher.dev1@gmail.com</a>

---

## ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub!
