// import dotenv from "dotenv";
// dotenv.config();
// const { Pool } = require("pg");

// const pool = new Pool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// });
// const express = require("express");
// const bodyParser = require("body-parser");
// const fs = require("fs");

// const app = express();
// const PORT = 3001;

// const FILE_PATH = "posts.json";

// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// // Function to load posts from JSON file
// function loadPosts() {
//     try {
//         const data = fs.readFileSync(FILE_PATH, "utf8");
//         return JSON.parse(data);
//     } catch (error) {
//         return []; // Return empty array if file doesn't exist
//     }
// }

// // Function to save posts to JSON file
// function savePosts(posts) {
//     fs.writeFileSync(FILE_PATH, JSON.stringify(posts, null, 2));
// }

// // Load posts from file when server starts
// let posts = loadPosts();

// // Home Page - Show all posts
// app.get("/", (req, res) => {
//     res.render("index", { posts });
// });

// // New Post Page
// app.get("/new", (req, res) => {
//     res.render("new");
// });

// // Create Post
// app.post("/add", (req, res) => {
//     const { title, content } = req.body;
//     const newPost = { id: posts.length + 1, title, content };
    
//     posts.push(newPost);
//     savePosts(posts); // Save to JSON file

//     res.redirect("/");
// });

// // Edit Post Page
// // app.get("/edit/:id", (req, res) => {
// //     const post = posts.find(p => p.id == req.params.id);
// //     res.render("edit", { post });
// // });
// // Edit Post Page - Show edit form
// app.get("/edit/:id", (req, res) => {
//     const postId = req.params.id;
//     const post = posts.find(p => p.id == postId);

//     if (post) {
//         console.log("Editing Post:", post);  // Debugging log
//         res.render("edit", { post });
//     } else {
//         console.log("Post not found:", postId);
//         res.status(404).send("Post not found");
//     }
// });


// // Update Post
// app.post("/update/:id", (req, res) => {
//     const postId = req.params.id;
//     const { title, content } = req.body;

//     let post = posts.find(p => p.id == postId);

//     if (post) {
//         post.title = title;
//         post.content = content;
//         console.log("Updated Post:", post);  // Debugging log
//     } else {
//         console.log("Post not found for updating:", postId);
//     }
    
//     res.redirect("/");
// });


// // Delete Post
// app.post("/delete/:id", (req, res) => {
//     posts = posts.filter(p => p.id != req.params.id);
//     savePosts(posts); // Save updated posts to JSON file
//     res.redirect("/");
// });

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const express = require("express");
const bodyParser = require("body-parser");
const pool = require("../blogproject/db"); // Import PostgreSQL connection
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home Page - Show all posts
// app.get("/", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM posts ORDER BY id DESC");
//         res.render("index", { posts: result.rows });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Database error.");
//     }
// });
app.get("/", async (req, res) => {
    try {
        res.render("index", { posts: [] }); // Initially empty
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});
app.get("/get-posts", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posts ORDER BY id DESC");
        res.json(result.rows); // Send posts as JSON
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error.");
    }
});



// New Post Page
app.get("/new", (req, res) => {
    res.render("new");
});

// Create Post
app.post("/add", async (req, res) => {
    const { title, content } = req.body;
    try {
        await pool.query("INSERT INTO posts (title, content) VALUES ($1, $2)", [title, content]);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving post.");
    }
});

// Edit Post Page
app.get("/edit/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);
        if (result.rows.length > 0) {
            res.render("edit", { post: result.rows[0] });
        } else {
            res.status(404).send("Post not found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching post.");
    }
});

// Update Post
app.post("/update/:id", async (req, res) => {
    const { title, content } = req.body;
    try {
        await pool.query("UPDATE posts SET title = $1, content = $2 WHERE id = $3", [title, content, req.params.id]);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating post.");
    }
});

// Delete Post
app.post("/delete/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting post.");
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
