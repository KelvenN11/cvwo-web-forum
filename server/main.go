package main

import (
	"database/sql"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

// Data Structures
type User struct {
	Username string `json:"username"`
}
type Post struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Username string `json:"username"`
}
type Comment struct {
	ID       int    `json:"id"`
	PostID   int    `json:"post_id"`
	Username string `json:"username"`
	Body     string `json:"body"`
}

var db *sql.DB

func main() {
	var err error
	// Database connection
	connStr := "user=postgres password=Kelven dbname=forum_db sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}

	r := gin.Default()
	r.Use(cors.Default())

	// --- LOGIN / USER SYSTEM ---
	r.POST("/api/login", func(c *gin.Context) {
		var u User
		if err := c.ShouldBindJSON(&u); err != nil {
			return
		}
		_, err := db.Exec("INSERT INTO users (username) VALUES ($1) ON CONFLICT (username) DO NOTHING", u.Username)
		if err != nil {
			c.JSON(500, gin.H{"error": "Login failed"})
			return
		}
		c.JSON(200, gin.H{"message": "Logged in", "username": u.Username})
	})

	// --- POST CRUD ---
	r.GET("/api/posts", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, title, content, username FROM posts ORDER BY id DESC")
		if err != nil {
			c.JSON(500, gin.H{"error": "DB error"})
			return
		}
		defer rows.Close()

		posts := []Post{}
		for rows.Next() {
			var p Post
			rows.Scan(&p.ID, &p.Title, &p.Content, &p.Username)
			posts = append(posts, p)
		}
		c.JSON(200, posts)
	})

	r.POST("/api/posts", func(c *gin.Context) {
		var p Post
		if err := c.ShouldBindJSON(&p); err != nil {
			return
		}
		// Using QueryRow to get the ID back
		err := db.QueryRow("INSERT INTO posts (title, content, username) VALUES ($1, $2, $3) RETURNING id",
			p.Title, p.Content, p.Username).Scan(&p.ID)
		if err != nil {
			c.JSON(500, gin.H{"error": "Insert failed"})
			return
		}
		c.JSON(201, p)
	})

	r.PUT("/api/posts/:id", func(c *gin.Context) {
		id := c.Param("id")
		var p Post
		c.ShouldBindJSON(&p)
		// FIXED: added "=" between username and $4
		db.Exec("UPDATE posts SET title=$1, content=$2 WHERE id=$3 AND username=$4",
			p.Title, p.Content, id, p.Username)
		c.JSON(200, gin.H{"message": "Updated"})
	})

	r.DELETE("/api/posts/:id", func(c *gin.Context) {
		id := c.Param("id")
		user := c.Query("username")
		db.Exec("DELETE FROM posts WHERE id=$1 AND username=$2", id, user)
		c.JSON(200, gin.H{"message": "Deleted"})
	})

	// --- COMMENTS ---
	r.GET("/api/posts/:id/comments", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, post_id, username, body FROM comments WHERE post_id=$1", c.Param("id"))
		if err != nil {
			c.JSON(500, gin.H{"error": "DB error"})
			return
		}
		defer rows.Close()

		comments := []Comment{}
		for rows.Next() {
			var cm Comment
			rows.Scan(&cm.ID, &cm.PostID, &cm.Username, &cm.Body)
			comments = append(comments, cm)
		}
		c.JSON(200, comments)
	})

	r.POST("/api/comments", func(c *gin.Context) {
		var cm Comment
		if err := c.ShouldBindJSON(&cm); err != nil {
			return
		}
		// FIXED: Changed db.Exec to db.QueryRow to support .Scan()
		err := db.QueryRow("INSERT INTO comments (post_id, username, body) VALUES ($1, $2, $3) RETURNING id",
			cm.PostID, cm.Username, cm.Body).Scan(&cm.ID)
		if err != nil {
			c.JSON(500, gin.H{"error": "Insert failed"})
			return
		}
		c.JSON(201, cm)
	})

	r.PUT("/api/comments/:id", func(c *gin.Context) {
		id := c.Param("id")
		var cm Comment
		if err := c.ShouldBindJSON(&cm); err != nil {
			c.JSON(400, gin.H{"error": "Invalid data"})
			return
		}

		result, err := db.Exec("UPDATE comments SET body=$1 WHERE id=$2 AND username=$3",
			cm.Body, id, cm.Username)

		if err != nil {
			c.JSON(500, gin.H{"error": "Update failed"})
			return
		}

		rows, _ := result.RowsAffected()
		if rows == 0 {
			c.JSON(403, gin.H{"error": "Unauthorized or comment not found"})
			return
		}

		c.JSON(200, gin.H{"message": "Comment updated"})
	})

	r.DELETE("/api/comments/:id", func(c *gin.Context) {
		id := c.Param("id")
		username := c.Query("username")

		result, err := db.Exec("DELETE FROM comments WHERE id=$1 AND username=$2", id, username)
		if err != nil {
			c.JSON(500, gin.H{"error": "Deletion failed"})
			return
		}

		rows, _ := result.RowsAffected()
		if rows == 0 {
			c.JSON(403, gin.H{"error": "Unauthorized or comment not found"})
			return
		}

		c.JSON(200, gin.H{"message": "Comment deleted"})
	})

	r.Run(":5000")
}
