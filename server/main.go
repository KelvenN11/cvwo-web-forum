package main

import (
	"database/sql"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // Postgres driver
)

// The "Template" for our data (Struct)
type Post struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Username string `json:"username"`
}

var db *sql.DB

func main() {
	// 1. Database Connection (db.js equivalent)
	var err error
	connStr := "user=postgres password=Kelven dbname=forum_db sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// 2. Initialize Router (app = express() equivalent)
	r := gin.Default()

	// 3. Middleware (app.use(cors()) equivalent)
	r.Use(cors.Default())

	// --- ROUTES ---

	// GET ALL POSTS
	r.GET("/posts", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, title, content, username FROM posts ORDER BY id DESC")
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var posts []Post
		for rows.Next() {
			var p Post
			rows.Scan(&p.ID, &p.Title, &p.Content, &p.Username)
			posts = append(posts, p)
		}
		c.JSON(200, posts)
	})

	// CREATE POST
	r.POST("/posts", func(c *gin.Context) {
		var newPost Post
		if err := c.ShouldBindJSON(&newPost); err != nil {
			c.JSON(400, gin.H{"error": "Invalid data"})
			return
		}

		err := db.QueryRow("INSERT INTO posts (title, content, username) VALUES ($1, $2, $3) RETURNING id",
			newPost.Title, newPost.Content, newPost.Username).Scan(&newPost.ID)

		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, newPost)
	})

	// DELETE POST (With Ownership Check)
	r.DELETE("/posts/:id", func(c *gin.Context) {
		id := c.Param("id")
		username := c.Query("username")
		result, err := db.Exec("DELETE FROM posts WHERE id = $1 AND username = $2", id, username)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		rows, _ := result.RowsAffected()
		if rows == 0 {
			c.JSON(403, gin.H{"error": "Not the owner or post not found"})
			return
		}
		c.JSON(200, gin.H{"message": "Post deleted"})
	})

	// UPDATE POST (With Ownership Check)
	r.PUT("/posts/:id", func(c *gin.Context) {
		id := c.Param("id")

		var newPost Post
		if err := c.ShouldBindJSON(&newPost); err != nil {
			c.JSON(400, gin.H{"error": "invalid data"})
			return
		}

		query := `
    		UPDATE posts 
    		SET title = $1, content = $2 
    		WHERE id = $3 AND username = $4
		`
		results, err := db.Exec(query, newPost.Title,
			newPost.Content, id, newPost.Username)

		if err != nil {
			c.JSON(400, gin.H{"error": "not your post"})
			return
		}

		rows, _ := results.RowsAffected()

		if rows == 0 {
			c.JSON(404, gin.H{"error": "no posts"})
			return
		}

		c.JSON(200, gin.H{"message": "update succesful"})
	})

	// 4. Start Server (app.listen equivalent)
	r.Run(":5000")
}
