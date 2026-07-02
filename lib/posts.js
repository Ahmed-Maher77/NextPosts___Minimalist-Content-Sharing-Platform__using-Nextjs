import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'posts.db');

let SQL;
let db;

async function getDb() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  let buffer;
  try {
    buffer = fs.readFileSync(dbPath);
  } catch {
    buffer = null;
  }
  db = new SQL.Database(buffer);
  return db;
}

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
  const SQL = await initSqlJs();

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

  const row = queryOne('SELECT COUNT(*) AS count FROM users');

  if (row.count === 0) {
    db.run(`
      INSERT INTO users (first_name, last_name, email)
      VALUES ('John', 'Doe', 'john@example.com')
    `);
    db.run(`
      INSERT INTO users (first_name, last_name, email)
      VALUES ('Ahmed', 'Maher', 'ahmed@example.com')
    `);
  }

  saveDb();
}

(async () => {
  await initDb();
})();

export async function getPosts(maxNumber) {
  await getDb();
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
  await getDb();
  db.run(
    `INSERT INTO posts (image_url, title, content, user_id) VALUES (?, ?, ?, ?)`,
    [post.imageUrl, post.title, post.content, post.userId]
  );
  saveDb();
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

export async function updatePostLikeStatus(postId, userId) {
  await getDb();
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
