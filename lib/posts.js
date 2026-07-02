import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'posts.db');

let SQL;
let db;
let initPromise = null;

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

async function initDb() {
  SQL = await initSqlJs();

  let buffer;
  try {
    buffer = fs.readFileSync(dbPath);
  } catch {
    buffer = null;
  }

  db = new SQL.Database(buffer);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, 
      first_name TEXT, 
      last_name TEXT,
      email TEXT
    )`);
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY, 
      image_url TEXT NOT NULL,
      title TEXT NOT NULL, 
      content TEXT NOT NULL, 
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER, 
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER, 
      post_id INTEGER, 
      PRIMARY KEY(user_id, post_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
      FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
    )`);

  const userCount = queryOne('SELECT COUNT(*) AS count FROM users');

  if (userCount.count === 0) {
    db.run(`
      INSERT INTO users (first_name, last_name, email)
      VALUES ('John', 'Doe', 'john@example.com')
    `);
    db.run(`
      INSERT INTO users (first_name, last_name, email)
      VALUES ('Ahmed', 'Maher', 'ahmed@example.com')
    `);
  }

  const postCount = queryOne('SELECT COUNT(*) AS count FROM posts');

  if (postCount.count === 0) {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const seedPosts = [
      {
        title: 'Mountain Sunrise',
        content: 'Woke up early to catch the sunrise over the mountains. Absolutely breathtaking view that reminds us how small we are in this vast world. Nature at its finest!',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        file: 'mountain.jpg',
        userId: 1,
      },
      {
        title: 'City Lights',
        content: 'The city never sleeps, and neither do I. There is something magical about the way the lights reflect off the buildings at night. Every window tells a different story.',
        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
        file: 'city.jpg',
        userId: 2,
      },
      {
        title: 'Tech Workspace',
        content: 'Finally set up my dream workspace. Clean desk, dual monitors, and plenty of natural light. Productivity is about to go through the roof!',
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        file: 'workspace.jpg',
        userId: 1,
      },
      {
        title: 'Delicious Feast',
        content: 'Tried out a new recipe today and it turned out amazing! Good food brings people together and creates memories that last a lifetime.',
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        file: 'feast.jpg',
        userId: 2,
      },
      {
        title: 'Tropical Paradise',
        content: 'Paradise found! Crystal clear waters, soft white sand, and the gentle sound of waves. This is what vacation dreams are made of.',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        file: 'beach.jpg',
        userId: 1,
      },
    ];

    for (const post of seedPosts) {
      const filePath = path.join(imagesDir, post.file);
      if (!fs.existsSync(filePath)) {
        const response = await fetch(post.url);
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
      }
      db.run(
        `INSERT INTO posts (image_url, title, content, user_id) VALUES (?, ?, ?, ?)`,
        [`/images/${post.file}`, post.title, post.content, post.userId]
      );
    }
  }

  saveDb();
}

initPromise = initDb();

export async function getPosts(maxNumber) {
  await initPromise;
  let limitClause = '';

  if (maxNumber) {
    limitClause = 'LIMIT ?';
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return maxNumber
    ? queryAll(
        `
      SELECT posts.id, image_url AS image, title, content, created_at AS createdAt, first_name AS userFirstName, last_name AS userLastName, COUNT(likes.post_id) AS likes, EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id and likes.user_id = 2) AS isLiked
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      GROUP BY posts.id
      ORDER BY createdAt DESC
      ${limitClause}`,
        [maxNumber]
      )
    : queryAll(`
      SELECT posts.id, image_url AS image, title, content, created_at AS createdAt, first_name AS userFirstName, last_name AS userLastName, COUNT(likes.post_id) AS likes, EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id and likes.user_id = 2) AS isLiked
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      GROUP BY posts.id
      ORDER BY createdAt DESC
      ${limitClause}`);
}

export async function storePost(post) {
  await initPromise;
  db.run(
    `INSERT INTO posts (image_url, title, content, user_id) VALUES (?, ?, ?, ?)`,
    [post.imageUrl, post.title, post.content, post.userId]
  );
  saveDb();
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

export async function updatePostLikeStatus(postId, userId) {
  await initPromise;
  const row = queryOne(
    `SELECT COUNT(*) AS count FROM likes WHERE user_id = ? AND post_id = ?`,
    [userId, postId]
  );

  if (row.count === 0) {
    db.run(
      `INSERT INTO likes (user_id, post_id) VALUES (?, ?)`,
      [userId, postId]
    );
  } else {
    db.run(
      `DELETE FROM likes WHERE user_id = ? AND post_id = ?`,
      [userId, postId]
    );
  }

  saveDb();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(queryOne(
    `SELECT * FROM likes WHERE post_id = ?`,
    [postId]
  ));
}
